import { Language, ExecutionResult, MistakeLevel } from '../types';
import { COMMON_PATTERNS, recordMistakeEncounter } from './smartLearningEngine';

export interface RunOptions {
  code: string;
  language: Language;
  stdin?: string;
  judge0Url?: string;
  judge0Key?: string;
}

export interface RunOutcome {
  result: ExecutionResult;
  detectedMistakeKey?: string;
  mistakeLevel?: MistakeLevel;
  socraticHint?: string;
  reminderContext?: {
    count: number;
    example?: string;
    tip?: string;
  };
}

const JUDGE0_LANGUAGE_IDS: Record<Language, number> = {
  c: 50,          // C (GCC 9.2.0)
  cpp: 54,        // C++ (GCC 9.2.0)
  java: 62,       // Java (OpenJDK 13.0.1)
  python: 71,     // Python (3.8.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  typescript: 74, // TypeScript (3.7.4)
  csharp: 51,     // C# (Mono 6.6.0.161)
  go: 60,         // Go (1.13.5)
  rust: 73,       // Rust (1.40.0)
  php: 68,        // PHP (7.4.1)
  kotlin: 78      // Kotlin (1.3.70)
};

/**
 * Execute user code with high accuracy via Judge0 CE compiler service,
 * with resilient in-browser execution fallback for JavaScript/TypeScript.
 */
export async function executeCode(options: RunOptions): Promise<RunOutcome> {
  const { code, language, stdin = '', judge0Url, judge0Key } = options;
  const startTime = performance.now();

  // Clean and determine the active API endpoint
  let apiUrl = (judge0Url || 'https://ce.judge0.com').trim().replace(/\/+$/, '');
  if (!apiUrl || apiUrl.includes('rapidapi')) {
    apiUrl = 'https://ce.judge0.com';
  }

  // 1. Try real compiler execution via Judge0
  try {
    const judge0Result = await runViaJudge0(code, language, stdin, apiUrl, judge0Key || '');
    if (judge0Result) {
      return processExecutionOutput(judge0Result, code, language);
    }
  } catch (err: any) {
    console.warn('Remote compiler execution encountered error:', err?.message || err);
  }

  // 2. In-browser direct execution for JavaScript / TypeScript if remote service failed
  if (language === 'javascript' || language === 'typescript') {
    const localJsResult = runJavaScriptLocally(code);
    return { result: localJsResult };
  }

  // 3. Fallback error if compiler could not be reached
  const endTime = performance.now();
  return {
    result: {
      stdout: '',
      stderr: `[Network Error]: Unable to reach the compiler server at ${apiUrl}.\nPlease check your internet connection or try again in a few moments.`,
      compileOutput: `Connection to compiler gateway failed.`,
      exitCode: 1,
      executionTime: Math.round(endTime - startTime),
      memory: 0,
      status: 'error',
      timestamp: new Date().toLocaleTimeString()
    },
    socraticHint: 'Check your network connection to the compiler server.'
  };
}

/**
 * Call Judge0 API
 */
async function runViaJudge0(
  code: string,
  lang: Language,
  stdin: string,
  apiUrl: string,
  apiKey: string
): Promise<ExecutionResult | null> {
  const langId = JUDGE0_LANGUAGE_IDS[lang] || 71;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey;
    try {
      headers['X-RapidAPI-Host'] = new URL(apiUrl).host;
    } catch {}
  }

  const response = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: code,
      language_id: langId,
      stdin: stdin || undefined
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`Judge0 returned HTTP ${response.status}: ${errText}`);
    return null;
  }

  const data = await response.json();
  const stdout = data.stdout || '';
  const stderr = data.stderr || data.compile_output || (data.status?.id > 3 ? data.status?.description : '') || '';
  const compileOutput = data.compile_output || (data.status?.id === 3 ? 'Compilation finished with 0 errors.' : stderr);
  const exitCode = data.exit_code ?? (data.status?.id === 3 ? 0 : 1);
  const executionTime = Math.round((parseFloat(data.time) || 0.05) * 1000);
  const memory = data.memory || 1024;
  const isSuccess = data.status?.id === 3;

  return {
    stdout,
    stderr,
    compileOutput,
    exitCode,
    executionTime,
    memory,
    status: isSuccess ? 'success' : 'error',
    timestamp: new Date().toLocaleTimeString()
  };
}

/**
 * Direct safe in-browser JavaScript evaluation
 */
function runJavaScriptLocally(code: string): ExecutionResult {
  const startTime = performance.now();
  const logs: string[] = [];
  const errors: string[] = [];

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  try {
    console.log = (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
    };
    console.warn = (...args: any[]) => {
      logs.push('[warn] ' + args.map(a => String(a)).join(' '));
    };
    console.error = (...args: any[]) => {
      errors.push(args.map(a => String(a)).join(' '));
    };

    // Run user code
    const fn = new Function(code);
    const ret = fn();
    if (ret !== undefined) {
      logs.push(String(ret));
    }

    const endTime = performance.now();
    return {
      stdout: logs.join('\n'),
      stderr: errors.join('\n'),
      compileOutput: 'JavaScript execution complete.',
      exitCode: errors.length > 0 ? 1 : 0,
      executionTime: Math.round(endTime - startTime),
      memory: 1200,
      status: errors.length > 0 ? 'error' : 'success',
      timestamp: new Date().toLocaleTimeString()
    };
  } catch (e: any) {
    const endTime = performance.now();
    return {
      stdout: logs.join('\n'),
      stderr: e?.stack || e?.message || String(e),
      compileOutput: `Runtime error: ${e?.message || 'Error occurred'}`,
      exitCode: 1,
      executionTime: Math.round(endTime - startTime),
      memory: 1200,
      status: 'error',
      timestamp: new Date().toLocaleTimeString()
    };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}

/**
 * Process compiler outcome and connect with Socratic mistake detection
 */
function processExecutionOutput(raw: ExecutionResult, code: string, lang: Language): RunOutcome {
  if (raw.status === 'success') {
    return { result: raw };
  }

  // Check if error corresponds to known educational mistake patterns
  for (const pattern of COMMON_PATTERNS) {
    if (pattern.language === lang || pattern.id === 'gen-unmatched-brackets') {
      if (pattern.detectFn) {
        const check = pattern.detectFn(code);
        if (check.match) {
          const line = check.line || 1;
          const { record, currentLevel } = recordMistakeEncounter(pattern.patternKey, lang, code, line);

          let socraticHint = '';
          if (currentLevel === 1) {
            socraticHint = pattern.level1Hint.replace('{line}', String(line));
          } else if (currentLevel === 2) {
            socraticHint = pattern.level2Reminder;
          } else {
            socraticHint = pattern.level3Explanation;
          }

          return {
            result: raw,
            detectedMistakeKey: pattern.patternKey,
            mistakeLevel: currentLevel,
            socraticHint,
            reminderContext: {
              count: record.occurrenceCount,
              example: pattern.level2Example,
              tip: pattern.level3Tip
            }
          };
        }
      }
    }
  }

  return {
    result: raw,
    socraticHint: 'The compiler encountered an error. Read the compiler message above to pinpoint the line and syntax issue.'
  };
}
