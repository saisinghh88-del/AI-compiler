import { Language, AIMessage, MistakeLevel } from '../types';

export interface MentorContext {
  code: string;
  language: Language;
  recentMistake?: string;
  mistakeLevel?: MistakeLevel;
  mentorStyle: 'socratic' | 'explanatory';
  apiKey?: string;
}

/**
 * Ask AI Mentor for guidance. Uses Google Gemini API if key is present,
 * otherwise leverages the built-in pedagogical Socratic engine.
 */
export async function getAIMentorResponse(
  userQuery: string,
  context: MentorContext
): Promise<AIMessage> {
  const { code, language, recentMistake, mistakeLevel = 1, mentorStyle, apiKey } = context;

  // If a valid Google AI Studio Gemini API Key is available, invoke Gemini
  if (apiKey && apiKey.startsWith('AIzaSy')) {
    try {
      const geminiReply = await queryGeminiAPI(userQuery, context);
      if (geminiReply) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: geminiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hintLevel: mistakeLevel
        };
      }
    } catch {
      // Fallback cleanly to embedded pedagogical engine
    }
  }

  // Built-in intelligent pedagogical engine:
  const reply = generatePedagogicalResponse(userQuery, code, language, recentMistake, mistakeLevel, mentorStyle);

  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: reply.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hintLevel: mistakeLevel,
    codeExample: reply.codeExample,
    isSocraticQuestion: reply.isQuestion
  };
}

async function queryGeminiAPI(query: string, context: MentorContext): Promise<string | null> {
  const { code, language, recentMistake, mentorStyle, apiKey } = context;

  const systemPrompt = `You are the SmartLearn AI Mentor for student programmers.
Tagline: "Code. Learn. Improve."
Role: Guide the student to learn from their mistakes rather than just dumping answers.
${mentorStyle === 'socratic' ? 'Use the Socratic method: ask guiding questions and give nudges.' : 'Explain clearly with conceptual breakdown and practical code patterns.'}
Current programming language: ${language.toUpperCase()}.
Recent mistake context: ${recentMistake || 'None'}.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nStudent's Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nStudent's Question:\n${query}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || null;
}

/**
 * Intelligent embedded pedagogical engine
 */
function generatePedagogicalResponse(
  query: string,
  code: string,
  lang: Language,
  recentMistake?: string,
  level: MistakeLevel = 1,
  style: 'socratic' | 'explanatory' = 'socratic'
): { text: string; codeExample?: string; isQuestion?: boolean } {
  const q = query.toLowerCase();

  // 1. Student asking for a hint or what is wrong
  if (q.includes('hint') || q.includes('wrong') || q.includes('help') || q.includes('why')) {
    if (level === 1) {
      return {
        text: `Let's look at this together! Before I point it out directly, take a look at the statement headers in your ${lang.toUpperCase()} code. Notice where blocks begin. Does every line follow the language's punctuation rules?`,
        isQuestion: true
      };
    } else if (level === 2) {
      return {
        text: `You have encountered something similar recently. In ${lang.toUpperCase()}, syntax errors often happen when a closing symbol, semicolon, or colon is left out. Look at line by line from top to bottom. Does each line have its proper ending?`,
        isQuestion: true
      };
    } else {
      return {
        text: `Here is a deep dive into the pattern: Your code is triggering a known syntax requirement. Here is how standard ${lang.toUpperCase()} structures this:`,
        codeExample: lang === 'python' ? 'if condition:\n    do_something()' : 'if (condition) {\n    doSomething();\n}'
      };
    }
  }

  // 2. Socratic Quiz request
  if (q.includes('quiz') || q.includes('test me')) {
    return {
      text: `Quick check! In ${lang.toUpperCase()}, what is the difference between a single equals sign (=) and double equals (==)? How does the compiler treat them inside a conditional statement?`,
      isQuestion: true
    };
  }

  // 3. Plain English / Analogy
  if (q.includes('analogy') || q.includes('plain english') || q.includes('explain')) {
    return {
      text: `Think of a compiler like a recipe reader. If a recipe says "Bake at 350 degrees" but leaves out the oven step, you get stuck. In ${lang.toUpperCase()}, symbols like semicolons and colons are the punctuation marks of your code—they tell the compiler when one instruction stops and the next begins!`
    };
  }

  // 4. Default encouraging guidance
  return {
    text: `Great question! You're making progress. Remember: making mistakes is the fastest way to build muscle memory in ${lang.toUpperCase()}. Review the highlighted lines in the editor and try fixing the punctuation first. Would you like a subtle hint or the full explanation?`,
    isQuestion: true
  };
}
