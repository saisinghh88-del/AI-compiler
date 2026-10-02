import { Language, MistakePattern, MistakeRecord, MistakeLevel, RealtimeWarning } from '../types';

export const COMMON_PATTERNS: MistakePattern[] = [
  // --- PYTHON PATTERNS ---
  {
    id: 'py-missing-colon',
    patternKey: 'py:missing_colon',
    category: 'syntax',
    language: 'python',
    title: 'Missing Colon (:) in Block Statement',
    shortDesc: 'Control statements and function definitions in Python require a colon at the end.',
    level1Hint: 'Check line {line}. Something is missing at the end of this statement before starting the block.',
    level2Reminder: 'You made a similar mistake before with block headers. In Python, statements like if, for, while, def require a colon at the end.',
    level2Example: 'def greet(name):\n    if name == "Alex":\n        print("Hi!")',
    level3Explanation: 'Every compound statement header in Python (such as def, if, elif, else, for, while, try, except, with, class) must end with a colon (:). This colon signals to Python\'s parser that an indented suite of code follows.',
    level3Tip: 'Rule of thumb: Whenever you write a line that will have indented code beneath it, finish the line with a colon (:).',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip comments
        if (line.startsWith('#')) continue;
        const match = /^(def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(.*?\)|if\b.*|elif\b.*|else\s*|for\s+.*|while\b.*|class\s+[a-zA-Z_][a-zA-Z0-9_]*(\(.*?\))?)$/.test(line);
        if (match && !line.endsWith(':')) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },
  {
    id: 'py-assignment-in-if',
    patternKey: 'py:assignment_in_if',
    category: 'logic',
    language: 'python',
    title: 'Assignment Operator (=) in Comparison',
    shortDesc: 'Used single equals (=) instead of double equals (==) inside a condition.',
    level1Hint: 'Check line {line}. Review how you are testing equality in this conditional expression.',
    level2Reminder: 'You made a similar mistake before. Remember: = is for assigning a value, whereas == is for comparing two values.',
    level2Example: '# Correct:\nif score == 100:\n    print("Perfect!")',
    level3Explanation: 'In Python (and most programming languages), a single equals sign (=) assigns a value to a variable. To test if two expressions are equal, you must use the comparison operator (==) or other relational operators (<, >, !=, <=, >=).',
    level3Tip: 'Mnemonic: "One = changes a variable, two == tests the truth."',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) continue;
        if (/^(if|elif|while)\s+[a-zA-Z0-9_.]+\s*=\s*[^=]/.test(line) && !line.includes('==') && !line.includes('!=')) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },
  {
    id: 'py-boolean-lowercase',
    patternKey: 'py:boolean_lowercase',
    category: 'syntax',
    language: 'python',
    title: 'Lowercase Boolean / None Value',
    shortDesc: 'Python booleans must be capitalized: True, False, and None.',
    level1Hint: 'Check line {line}. Review the capitalization of the boolean or null value you typed.',
    level2Reminder: 'You made this capitalization mistake before. Python requires True, False, and None to have a capital first letter.',
    level2Example: 'is_active = True\nis_finished = False\ncurrent_user = None',
    level3Explanation: 'Unlike JavaScript, C++, or Java which use lowercase true/false/null, Python treats booleans as built-in constants named True and False, and the null value is named None. Typing true or false results in a NameError because Python searches for a variable with that name.',
    level3Tip: 'Remember: Python keywords for states are proper nouns: True, False, None.',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) continue;
        if (/\b(=|\(|,)\s*(true|false|null)\b/.test(line)) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },

  // --- C / C++ PATTERNS ---
  {
    id: 'c-missing-semicolon',
    patternKey: 'c:missing_semicolon',
    category: 'syntax',
    language: 'c',
    title: 'Missing Semicolon (;)',
    shortDesc: 'Statements in C and C++ must terminate with a semicolon.',
    level1Hint: 'Check line {line}. Something is missing at the end of this statement to finish the instruction.',
    level2Reminder: 'You made a similar mistake before. In C and C++, every statement or declaration must end with a semicolon (;).',
    level2Example: 'int score = 95;\nprintf("Score: %d\\n", score);',
    level3Explanation: 'C and C++ are free-format languages; the compiler does not use newlines to separate instructions. The semicolon tells the compiler where an instruction ends. Without it, the compiler merges adjacent lines and throws an unexpected token or syntax error on the subsequent line.',
    level3Tip: 'Whenever you declare a variable, assign a value, or call a function, ask yourself: "Did I put a semicolon at the end?"',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line.startsWith('#') || line.startsWith('/*')) continue;
        if (line.endsWith('{') || line.endsWith('}') || line.endsWith(':')) continue;
        // Check statements like variable declaration, assignments, or printf/cout
        if (/^(int|float|double|char|long|bool|auto|string)\s+[a-zA-Z0-9_]+\s*=?[^;{}]*$/.test(line) ||
            /^(printf|scanf|puts|gets|cout|cin)\s*\(?[^;{}]*$/.test(line) ||
            /^[a-zA-Z0-9_]+\s*=\s*[^;{}]*$/.test(line)) {
          if (!line.endsWith(';')) {
            return { match: true, line: i + 1, detail: line };
          }
        }
      }
      return { match: false };
    }
  },
  {
    id: 'c-assignment-in-if',
    patternKey: 'c:assignment_in_if',
    category: 'logic',
    language: 'c',
    title: 'Accidental Assignment in if Condition',
    shortDesc: 'Single = in if(x = y) overwrites x instead of testing equality.',
    level1Hint: 'Check line {line}. Review the operator you used inside the condition parentheses.',
    level2Reminder: 'You made a similar mistake before. In C, if (x = 5) will assign 5 to x and evaluate to true! Use == for comparison.',
    level2Example: 'if (x == 5) {\n    printf("x is five\\n");\n}',
    level3Explanation: 'In C and C++, the assignment expression (x = y) has a value equal to the assigned value. When written inside an if (...), C treats non-zero values as true, so the if-branch always executes and unintentionally alters variable values.',
    level3Tip: 'Yoda notation trick: writing if (5 == x) prevents bugs because if (5 = x) triggers an immediate compiler error!',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//')) continue;
        if (/if\s*\(\s*[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+\s*\)/.test(line) && !line.includes('==') && !line.includes('!=')) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },

  // --- JAVA PATTERNS ---
  {
    id: 'java-system-case',
    patternKey: 'java:system_case',
    category: 'syntax',
    language: 'java',
    title: 'Case-Sensitivity Error: System vs system',
    shortDesc: 'Java is strictly case-sensitive. Built-in classes like System and String begin with uppercase.',
    level1Hint: 'Check line {line}. Pay close attention to the letter casing of standard Java classes.',
    level2Reminder: 'You made this case-sensitivity mistake before. Java is case-sensitive: write System.out.println(), not system.out.println().',
    level2Example: 'System.out.println("Hello World!");\nString name = "Alex";',
    level3Explanation: 'In Java, naming conventions align with class and object types. System is a class defined in java.lang, and class identifiers in Java by convention (and language definition) begin with an uppercase letter. Writing lowercase system causes the compiler to look for a package or variable named "system", which does not exist.',
    level3Tip: 'Java Rule: All standard class names (System, String, Math, Scanner) always start with a Capital letter.',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//')) continue;
        if (/\bsystem\.out\./.test(line) || /\bstring\s+[a-zA-Z0-9_]+\s*=/.test(line)) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },
  {
    id: 'java-missing-semicolon',
    patternKey: 'java:missing_semicolon',
    category: 'syntax',
    language: 'java',
    title: 'Missing Semicolon (;) in Java Statement',
    shortDesc: 'Java statements require a closing semicolon.',
    level1Hint: 'Check line {line}. Something is missing at the end of this statement.',
    level2Reminder: 'You made a similar mistake before. In Java, every statement like System.out.println() must end with a semicolon.',
    level2Example: 'System.out.println("Result: " + total);',
    level3Explanation: 'Every expression statement in Java must end with a semicolon. If omitted, the Java compiler will report "; expected".',
    level3Tip: 'Every line that performs an action or declaration in Java needs a semicolon.',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line.endsWith('{') || line.endsWith('}')) continue;
        if (/System\.out\.(println|print|printf)\s*\(.*?\)$/.test(line)) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },

  // --- JAVASCRIPT / TYPESCRIPT PATTERNS ---
  {
    id: 'js-console-log-typo',
    patternKey: 'js:console_typo',
    category: 'name',
    language: 'javascript',
    title: 'Typo in console.log',
    shortDesc: 'Incorrect method name or casing on console object.',
    level1Hint: 'Check line {line}. Review the exact spelling and casing of your console print call.',
    level2Reminder: 'You made a similar mistake before. The standard method is console.log(...), lowercase.',
    level2Example: 'console.log("Value:", value);',
    level3Explanation: 'JavaScript is case-sensitive. Methods such as console.print or Console.log do not exist on the global window/Node console object and will throw a TypeError: console.print is not a function.',
    level3Tip: 'In JavaScript, always use console.log(), console.warn(), or console.error().',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//')) continue;
        if (/\b(Console\.log|console\.print|console\.write)\b/.test(line)) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },

  // --- RUST PATTERNS ---
  {
    id: 'rust-missing-macro-bang',
    patternKey: 'rust:missing_macro_bang',
    category: 'syntax',
    language: 'rust',
    title: 'Missing Exclamation Mark (!) on Rust Macro',
    shortDesc: 'Rust macros like println! require an exclamation mark.',
    level1Hint: 'Check line {line}. Something is missing between the print keyword and the parenthesis.',
    level2Reminder: 'You made a similar mistake before. In Rust, println! is a macro, not a regular function, and requires the ! character.',
    level2Example: 'println!("Hello, {}!", name);',
    level3Explanation: 'In Rust, println! is a declarative macro that handles variable formatting and compile-time format string validation. Calling println(...) without the exclamation mark causes the Rust compiler to search for a function named println, which does not exist in standard library scope.',
    level3Tip: 'Any output or formatting helper in Rust (println!, format!, print!, panic!) always ends with !',
    detectFn: (code: string) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//')) continue;
        if (/\bprintln\s*\(/.test(line) && !/\bprintln!\s*\(/.test(line)) {
          return { match: true, line: i + 1, detail: line };
        }
      }
      return { match: false };
    }
  },

  // --- GENERAL UNMATCHED BRACKETS ---
  {
    id: 'gen-unmatched-brackets',
    patternKey: 'gen:unmatched_brackets',
    category: 'syntax',
    language: 'c', // applies universally
    title: 'Unmatched Parentheses, Brackets, or Braces',
    shortDesc: 'An opening bracket, parenthesis, or curly brace is not closed.',
    level1Hint: 'Check your code structure. There is an unmatched bracket, brace, or parenthesis.',
    level2Reminder: 'You made this nesting mistake before. Count opening and closing symbols: ( ), { }, [ ].',
    level2Example: 'if (condition) {\n    doSomething();\n}',
    level3Explanation: 'Every opening delimiter (, {, [ must have an identical closing partner in reverse order. An unmatched delimiter prevents the compiler from determining where scopes and expressions begin and end.',
    level3Tip: 'Look at the Monaco editor breadcrumb or bracket pair colorization to trace matching pairs.',
    detectFn: (code: string) => {
      let parens = 0, curly = 0, square = 0;
      for (const char of code) {
        if (char === '(') parens++;
        else if (char === ')') parens--;
        else if (char === '{') curly++;
        else if (char === '}') curly--;
        else if (char === '[') square++;
        else if (char === ']') square--;
        if (parens < 0 || curly < 0 || square < 0) {
          return { match: true, line: 1, detail: 'Closing bracket before opening' };
        }
      }
      if (parens !== 0 || curly !== 0 || square !== 0) {
        return { match: true, line: 1, detail: `Unclosed: parens=${parens}, curly=${curly}, square=${square}` };
      }
      return { match: false };
    }
  }
];

const STORAGE_KEY_MISTAKES = 'smartlearn_mistake_history';

/**
 * Get all stored mistakes from localStorage
 */
export function getStoredMistakes(): MistakeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISTAKES);
    if (!raw) return getInitialDemoMistakes();
    return JSON.parse(raw);
  } catch {
    return getInitialDemoMistakes();
  }
}

/**
 * Save mistakes to localStorage
 */
export function saveMistakes(mistakes: MistakeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MISTAKES, JSON.stringify(mistakes));
  } catch (e) {
    console.error('Failed to save mistake history:', e);
  }
}

/**
 * Pre-seed realistic mistake history for learner Alex Rivera
 */
function getInitialDemoMistakes(): MistakeRecord[] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const initial: MistakeRecord[] = [
    {
      id: 'demo-1',
      patternKey: 'py:missing_colon',
      category: 'syntax',
      language: 'python',
      title: 'Missing Colon (:) in Block Statement',
      codeSnippet: 'def calculate_total(prices)\n    return sum(prices)',
      line: 1,
      occurrenceCount: 2, // Already made once before, so next time is level 2/3!
      firstSeen: threeDaysAgo.toISOString(),
      lastSeen: yesterday.toISOString(),
      resolved: false,
      notes: 'Happened while writing if statements and def functions.'
    },
    {
      id: 'demo-2',
      patternKey: 'c:missing_semicolon',
      category: 'syntax',
      language: 'c',
      title: 'Missing Semicolon (;)',
      codeSnippet: 'int counter = 0\nprintf("%d", counter)',
      line: 1,
      occurrenceCount: 1,
      firstSeen: yesterday.toISOString(),
      lastSeen: yesterday.toISOString(),
      resolved: true,
      notes: 'Resolved after learning C statement syntax.'
    },
    {
      id: 'demo-3',
      patternKey: 'java:system_case',
      category: 'syntax',
      language: 'java',
      title: 'Case-Sensitivity Error: System vs system',
      codeSnippet: 'system.out.println("Hello World");',
      line: 1,
      occurrenceCount: 3,
      firstSeen: threeDaysAgo.toISOString(),
      lastSeen: yesterday.toISOString(),
      resolved: false,
      notes: 'Frequently typed lowercase "system" out of habit from Python.'
    }
  ];

  return initial;
}

/**
 * Check code continuously in real-time as the student types.
 * Returns any warnings and flags if it matches a previous mistake!
 */
export function analyzeCodeRealtime(code: string, activeLang: Language): RealtimeWarning[] {
  if (!code.trim()) return [];

  const storedMistakes = getStoredMistakes();
  const warnings: RealtimeWarning[] = [];

  for (const pattern of COMMON_PATTERNS) {
    // Check if pattern applies to active language or universal
    if (pattern.language !== activeLang && pattern.id !== 'gen-unmatched-brackets') {
      // Also apply C rules to C++ or C# if relevant
      if (!(activeLang === 'cpp' && pattern.language === 'c')) {
        continue;
      }
    }

    if (pattern.detectFn) {
      const res = pattern.detectFn(code);
      if (res.match) {
        const line = res.line || 1;
        // Check historical occurrences
        const existingRecord = storedMistakes.find((m) => m.patternKey === pattern.patternKey);
        const occurrenceCount = existingRecord ? existingRecord.occurrenceCount : 0;

        // Determine Level:
        // 0 past occurrences => next run is 1st time (Level 1)
        // 1 past occurrence => next run is 2nd time (Level 2)
        // 2+ past occurrences => next run is 3rd time (Level 3)
        let level: MistakeLevel = 1;
        if (occurrenceCount === 1) level = 2;
        else if (occurrenceCount >= 2) level = 3;

        // Build message based on level
        let message = '';
        if (level === 1) {
          message = pattern.level1Hint.replace('{line}', String(line));
        } else if (level === 2) {
          message = `Similar to a mistake you made before: ${pattern.level2Reminder}`;
        } else {
          message = `Frequent mistake pattern detected: ${pattern.level3Explanation}`;
        }

        warnings.push({
          id: `${pattern.id}-${line}`,
          line,
          title: pattern.title,
          message,
          level,
          patternKey: pattern.patternKey,
          previousOccurrences: occurrenceCount,
          correctSnippet: pattern.level2Example,
          tip: pattern.level3Tip
        });
      }
    }
  }

  return warnings;
}

/**
 * Record a mistake encounter when code execution fails or when confirmed.
 * Increments occurrenceCount and updates timestamps.
 */
export function recordMistakeEncounter(
  patternKey: string,
  language: Language,
  codeSnippet: string,
  line?: number
): { record: MistakeRecord; currentLevel: MistakeLevel } {
  const mistakes = getStoredMistakes();
  const pattern = COMMON_PATTERNS.find((p) => p.patternKey === patternKey);
  const title = pattern ? pattern.title : 'Syntax / Logic Issue';
  const category = pattern ? pattern.category : 'syntax';

  const existingIndex = mistakes.findIndex((m) => m.patternKey === patternKey);
  let record: MistakeRecord;
  let occurrenceCount = 1;

  if (existingIndex >= 0) {
    const existing = mistakes[existingIndex];
    occurrenceCount = existing.occurrenceCount + 1;
    record = {
      ...existing,
      occurrenceCount,
      lastSeen: new Date().toISOString(),
      codeSnippet: codeSnippet.slice(0, 180),
      line,
      resolved: false
    };
    mistakes[existingIndex] = record;
  } else {
    record = {
      id: `mistake-${Date.now()}`,
      patternKey,
      category,
      language,
      title,
      codeSnippet: codeSnippet.slice(0, 180),
      line,
      occurrenceCount: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      resolved: false
    };
    mistakes.unshift(record);
  }

  saveMistakes(mistakes);

  let currentLevel: MistakeLevel = 1;
  if (occurrenceCount === 2) currentLevel = 2;
  else if (occurrenceCount >= 3) currentLevel = 3;

  return { record, currentLevel };
}

/**
 * Mark a mistake as resolved by the student
 */
export function markMistakeResolved(id: string): MistakeRecord[] {
  const mistakes = getStoredMistakes();
  const updated = mistakes.map((m) => (m.id === id ? { ...m, resolved: true } : m));
  saveMistakes(updated);
  return updated;
}
