import { Language, LanguageInfo, DetectionResult } from '../types';

export const LANGUAGES: Record<Language, LanguageInfo> = {
  python: {
    id: 'python',
    name: 'Python',
    emoji: '🐍',
    badgeColor: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    extension: 'py',
    monacoLang: 'python',
    defaultTemplate: `# SmartLearn Python Playground
# Type your code below. Language is detected automatically!

def calculate_average(scores):
    total = sum(scores)
    count = len(scores)
    if count == 0:
        return 0
    return total / count

student_scores = [85, 92, 78, 95, 88]
avg = calculate_average(student_scores)
print(f"Average score is: {avg:.2f}")
`,
    sampleBuggyCode: `# Try fixing this Python error to see the Smart Learning hints!
def check_passing_grade(score)
    if score >= 60
        print("Congratulations! You passed.")
    else:
        print("Keep practicing!")

check_passing_grade(85)
`,
    description: 'High-level, readable language beloved by beginners and data scientists.'
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    emoji: '⚡',
    badgeColor: '#facc15',
    badgeBg: 'rgba(250, 204, 21, 0.15)',
    extension: 'js',
    monacoLang: 'javascript',
    defaultTemplate: `// SmartLearn JavaScript Playground
// Write your code and watch SmartLearn guide you.

function greetLearner(name) {
    const greeting = \`Welcome to SmartLearn, \${name}!\`;
    console.log(greeting);
    return greeting;
}

greetLearner("Developer");
`,
    sampleBuggyCode: `// Click Run or type to test SmartLearn hints
function calculateDiscount(price, discountPercent) {
    if (discountPercent > 100) {
        console.log("Discount cannot exceed 100%");
        return price
    }
    const finalPrice = price - (price * (discountPercent / 100));
    console.log("Final price: " + finalPrice);
}

calculateDiscount(200, 15);
`,
    description: 'The ubiquitous language of the web and modern browser applications.'
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    emoji: '🔷',
    badgeColor: '#60a5fa',
    badgeBg: 'rgba(96, 165, 250, 0.15)',
    extension: 'ts',
    monacoLang: 'typescript',
    defaultTemplate: `// SmartLearn TypeScript Playground
interface Student {
    id: number;
    name: string;
    isEnrolled: boolean;
}

function displayStudent(student: Student): void {
    console.log(\`Student #\${student.id}: \${student.name}\`);
}

const alex: Student = { id: 101, name: "Alex Rivera", isEnrolled: true };
displayStudent(alex);
`,
    sampleBuggyCode: `interface Book {
    title: string;
    pages: number;
}

function describeBook(b: Book): void {
    console.log(b.title + " has " + b.pages + " pages.");
}

// Notice the type mismatch below!
const myBook = { title: "Clean Code", pages: "four hundred" };
describeBook(myBook);
`,
    description: 'Typed superset of JavaScript that compiles to clean JavaScript.'
  },
  c: {
    id: 'c',
    name: 'C',
    emoji: '🔵',
    badgeColor: '#60a5fa',
    badgeBg: 'rgba(96, 165, 250, 0.15)',
    extension: 'c',
    monacoLang: 'c',
    defaultTemplate: `#include <stdio.h>

int main() {
    int numbers[] = {10, 20, 30, 40, 50};
    int sum = 0;
    int length = sizeof(numbers) / sizeof(numbers[0]);

    for (int i = 0; i < length; i++) {
        sum += numbers[i];
    }

    printf("Sum of array elements: %d\\n", sum);
    return 0;
}
`,
    sampleBuggyCode: `#include <stdio.h>

int main() {
    int x = 10
    int y = 20;
    if (x = y) {
        printf("x equals y\\n")
    }
    return 0;
}
`,
    description: 'The legendary foundational systems language that powers modern computing.'
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    emoji: '💠',
    badgeColor: '#818cf8',
    badgeBg: 'rgba(129, 140, 248, 0.15)',
    extension: 'cpp',
    monacoLang: 'cpp',
    defaultTemplate: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    vector<string> subjects = {"Algorithms", "Data Structures", "Compilers"};

    cout << "SmartLearn C++ Lab:\\n";
    for (const auto& subject : subjects) {
        cout << "- Practicing " << subject << endl;
    }

    return 0;
}
`,
    sampleBuggyCode: `#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int b = 15;
    cout << "Result is: " << (a + b) << endl
    return 0;
}
`,
    description: 'High-performance object-oriented and generic systems programming language.'
  },
  java: {
    id: 'java',
    name: 'Java',
    emoji: '☕',
    badgeColor: '#fb923c',
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    extension: 'java',
    monacoLang: 'java',
    defaultTemplate: `public class Main {
    public static void main(String[] args) {
        String studentName = "Jordan";
        int currentStreak = 5;
        
        System.out.println("Hello, " + studentName + "!");
        System.out.println("You are on a " + currentStreak + "-day coding streak.");
    }
}
`,
    sampleBuggyCode: `public class Main {
    public static void main(String[] args) {
        system.out.println("Welcome to Java!")
        int count = 10;
        if (count == 10) {
            String message = "All good";
        }
        System.out.println(message);
    }
}
`,
    description: 'Robust, cross-platform enterprise language running on the JVM.'
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    emoji: '🟣',
    badgeColor: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    extension: 'cs',
    monacoLang: 'csharp',
    defaultTemplate: `using System;

namespace SmartLearn {
    class Program {
        static void Main(string[] args) {
            string message = "C# on SmartLearn Compiler";
            Console.WriteLine(message);
            
            int[] scores = { 90, 85, 95 };
            Console.WriteLine($"Top score: {scores[2]}");
        }
    }
}
`,
    sampleBuggyCode: `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Testing C#")
        int x = 50;
        if (x = 50) {
            Console.WriteLine("Matched");
        }
    }
}
`,
    description: 'Modern, object-oriented language developed by Microsoft for .NET.'
  },
  go: {
    id: 'go',
    name: 'Go',
    emoji: '🐹',
    badgeColor: '#22d3ee',
    badgeBg: 'rgba(34, 211, 238, 0.15)',
    extension: 'go',
    monacoLang: 'go',
    defaultTemplate: `package main

import "fmt"

func main() {
    greeting := "Hello, Gopher!"
    fmt.Println(greeting)

    items := []string{"Concurreny", "Goroutines", "Channels"}
    for idx, item := range items {
        fmt.Printf("%d: %s\\n", idx+1, item)
    }
}
`,
    sampleBuggyCode: `package main

import (
    "fmt"
    "math"
)

func main() {
    var unusedVariable = 100
    fmt.Println("SmartLearn Go test")
}
`,
    description: 'Simple, fast, concurrent programming language developed by Google.'
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    emoji: '🦀',
    badgeColor: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    extension: 'rust',
    monacoLang: 'rust',
    defaultTemplate: `fn main() {
    let language = "Rust";
    println!("Welcome to {}, the memory-safe speedster!", language);

    let mut score = 0;
    for _ in 0..5 {
        score += 10;
    }
    println!("Final learning score: {}", score);
}
`,
    sampleBuggyCode: `fn main() {
    let count = 5;
    count += 1;
    println!("Count is: {}", count)
}
`,
    description: 'Blazingly fast, memory-efficient language with guaranteed memory safety.'
  },
  php: {
    id: 'php',
    name: 'PHP',
    emoji: '🐘',
    badgeColor: '#818cf8',
    badgeBg: 'rgba(129, 140, 248, 0.15)',
    extension: 'php',
    monacoLang: 'php',
    defaultTemplate: `<?php
$title = "SmartLearn PHP Environment";
$languages = ["PHP", "JavaScript", "Python"];

echo $title . "\\n";
foreach ($languages as $lang) {
    echo "- Practicing " . $lang . "\\n";
}
?>
`,
    sampleBuggyCode: `<?php
$name = "Sarah"
if ($name == "Sarah") {
    echo "Welcome back, " . $name
}
?>
`,
    description: 'Popular general-purpose scripting language suited for web development.'
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    emoji: '🚀',
    badgeColor: '#c084fc',
    badgeBg: 'rgba(192, 132, 252, 0.15)',
    extension: 'kt',
    monacoLang: 'kotlin',
    defaultTemplate: `fun main() {
    val learner = "Alex"
    println("Hello $learner, welcome to Kotlin!")

    val milestones = listOf("Basics", "Null Safety", "Coroutines")
    milestones.forEach { println("Target: $it") }
}
`,
    sampleBuggyCode: `fun main() {
    val score = 100
    score = 105
    println("Score: " + score)
}
`,
    description: 'Concise, expressive multiplatform language with first-class Android support.'
  }
};

interface RuleScore {
  lang: Language;
  score: number;
  matched: string[];
}

/**
 * Detect language automatically from code content
 * Evaluates signatures, keywords, idioms, and detects mixed-language anomalies.
 */
export function detectLanguage(code: string, fallbackLang: Language = 'python'): DetectionResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      language: fallbackLang,
      confidence: 1.0,
      isMixed: false,
      indicators: ['Default empty editor']
    };
  }

  const scores: Record<Language, { score: number; matched: string[] }> = {
    c: { score: 0, matched: [] },
    cpp: { score: 0, matched: [] },
    java: { score: 0, matched: [] },
    python: { score: 0, matched: [] },
    javascript: { score: 0, matched: [] },
    typescript: { score: 0, matched: [] },
    csharp: { score: 0, matched: [] },
    go: { score: 0, matched: [] },
    rust: { score: 0, matched: [] },
    php: { score: 0, matched: [] },
    kotlin: { score: 0, matched: [] }
  };

  // Helper to add score
  const add = (lang: Language, points: number, label: string) => {
    scores[lang].score += points;
    scores[lang].matched.push(label);
  };

  // 1. PHP distinct tag
  if (trimmed.startsWith('<?php') || /<\?php/i.test(code)) {
    add('php', 20, '<?php tag');
  }
  if (/\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/.test(code)) {
    add('php', 6, 'PHP variable prefix ($)');
  }
  if (/echo\s+["']/.test(code)) {
    add('php', 5, 'echo statement');
  }

  // 2. Python distinct patterns
  if (/\bdef\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(code)) {
    add('python', 8, 'def function definition');
  }
  if (/\belif\b/.test(code)) {
    add('python', 10, 'elif keyword');
  }
  if (/\bprint\s*\(/.test(code) && !/System\.out\.print/.test(code) && !/fmt\.Print/.test(code)) {
    add('python', 4, 'print() function');
  }
  if (/:\s*(\n|$)/.test(code) && !/[{};]\s*$/.test(code)) {
    add('python', 3, 'colon-terminated block');
  }
  if (/\b(True|False|None)\b/.test(code)) {
    add('python', 5, 'Python capitalized boolean/None');
  }
  if (/__name__\s*==\s*['"]__main__['"]/.test(code)) {
    add('python', 12, 'if __name__ == "__main__"');
  }
  if (/\bimport\s+[a-zA-Z_][a-zA-Z0-9_]*(\s+as\s+[a-zA-Z_]+)?$/.test(code) || /\bfrom\s+[a-zA-Z_]+\s+import\b/.test(code)) {
    add('python', 7, 'Python import statement');
  }

  // 3. Rust distinct patterns
  if (/\bfn\s+main\s*\(\s*\)/.test(code)) {
    add('rust', 10, 'fn main()');
  }
  if (/println!\s*\(/.test(code)) {
    add('rust', 12, 'println! macro');
  }
  if (/\blet\s+mut\s+/.test(code)) {
    add('rust', 10, 'let mut statement');
  }
  if (/\bimpl\s+[a-zA-Z0-9_]+\s+for\b|\bimpl\s+[a-zA-Z0-9_]+/.test(code)) {
    add('rust', 8, 'Rust impl block');
  }
  if (/->\s*(Result|Option|i32|u32|String|bool)\b/.test(code)) {
    add('rust', 6, 'Rust return type arrow');
  }

  // 4. Go distinct patterns
  if (/package\s+main\b/.test(code)) {
    add('go', 14, 'package main declaration');
  }
  if (/import\s+("fmt"|\(\s*"fmt")/.test(code)) {
    add('go', 10, 'import "fmt"');
  }
  if (/fmt\.(Println|Printf|Print)\s*\(/.test(code)) {
    add('go', 10, 'fmt.Println call');
  }
  if (/:=/.test(code)) {
    add('go', 6, 'Go short variable declaration (:=)');
  }
  if (/\bfunc\s+[a-zA-Z0-9_]+\s*\(/.test(code)) {
    add('go', 7, 'func declaration');
  }

  // 5. Java distinct patterns
  if (/public\s+class\s+[a-zA-Z0-9_]+/.test(code)) {
    add('java', 12, 'public class declaration');
  }
  if (/public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]/.test(code) || /public\s+static\s+void\s+main\s*\(\s*String\.\.\./.test(code)) {
    add('java', 15, 'public static void main(String[] args)');
  }
  if (/System\.out\.(println|print|printf)\s*\(/.test(code)) {
    add('java', 12, 'System.out.println()');
  }
  if (/import\s+java\./.test(code)) {
    add('java', 10, 'import java.*');
  }
  if (/\b(ArrayList|HashMap|Scanner)\b/.test(code)) {
    add('java', 5, 'Java standard collection/utility');
  }

  // 6. C# distinct patterns
  if (/using\s+System(\.[a-zA-Z0-9_]+)?\s*;/.test(code)) {
    add('csharp', 12, 'using System;');
  }
  if (/Console\.(WriteLine|Write|ReadLine)\s*\(/.test(code)) {
    add('csharp', 12, 'Console.WriteLine()');
  }
  if (/static\s+void\s+Main\s*\(\s*(string\s*\[\s*\]\s*args)?\s*\)/.test(code)) {
    add('csharp', 14, 'static void Main() with capital M');
  }
  if (/namespace\s+[a-zA-Z0-9_.]+/.test(code)) {
    add('csharp', 8, 'namespace declaration');
  }

  // 7. C & C++ patterns
  if (/#include\s*<stdio\.h>/.test(code)) {
    add('c', 15, '#include <stdio.h>');
  }
  if (/printf\s*\(/.test(code) && !scores.go.score) {
    add('c', 6, 'printf() call');
    add('cpp', 4, 'printf() in C/C++');
  }
  if (/#include\s*<iostream>/.test(code)) {
    add('cpp', 18, '#include <iostream>');
  }
  if (/std::(cout|cin|endl|vector|string)/.test(code)) {
    add('cpp', 14, 'std:: namespace resolution');
  }
  if (/using\s+namespace\s+std\s*;/.test(code)) {
    add('cpp', 15, 'using namespace std;');
  }
  if (/cout\s*<</.test(code)) {
    add('cpp', 12, 'cout << stream');
  }
  if (/int\s+main\s*\(\s*(void)?\s*\)\s*\{/.test(code)) {
    add('c', 7, 'int main() signature');
    add('cpp', 6, 'int main() signature');
  }

  // 8. Kotlin distinct patterns
  if (/fun\s+main\s*\(/.test(code)) {
    add('kotlin', 12, 'fun main() function');
  }
  if (/\bval\s+[a-zA-Z0-9_]+(\s*:\s*[a-zA-Z0-9_<>]+)?\s*=/.test(code)) {
    add('kotlin', 6, 'val immutable declaration');
  }
  if (/println\s*\(/.test(code) && !scores.rust.score && !scores.python.score && !scores.java.score) {
    add('kotlin', 4, 'Kotlin println()');
  }
  if (/\bdata\s+class\b/.test(code)) {
    add('kotlin', 10, 'data class keyword');
  }

  // 9. JavaScript & TypeScript patterns
  if (/console\.log\s*\(/.test(code)) {
    add('javascript', 8, 'console.log()');
    add('typescript', 7, 'console.log()');
  }
  if (/\b(const|let|var)\s+[a-zA-Z0-9_]+\s*=/.test(code)) {
    add('javascript', 5, 'const/let declaration');
    add('typescript', 5, 'const/let declaration');
  }
  if (/=>\s*\{|=>\s*[a-zA-Z0-9_(]/.test(code)) {
    add('javascript', 4, 'arrow function');
    add('typescript', 4, 'arrow function');
  }
  if (/\bfunction\s+[a-zA-Z0-9_]*\s*\(/.test(code) && !scores.php.score) {
    add('javascript', 5, 'function keyword');
    add('typescript', 5, 'function keyword');
  }

  // TypeScript specific
  if (/\binterface\s+[a-zA-Z0-9_]+\s*\{/.test(code)) {
    add('typescript', 12, 'TypeScript interface');
  }
  if (/\btype\s+[a-zA-Z0-9_]+\s*=/.test(code)) {
    add('typescript', 10, 'TypeScript type alias');
  }
  if (/:\s*(string|number|boolean|any|void|unknown|never)\b/.test(code)) {
    add('typescript', 9, 'TypeScript primitive type annotation');
  }
  if (/as\s+const\b/.test(code)) {
    add('typescript', 8, 'as const assertion');
  }

  // Sort score entries descending
  const sorted: RuleScore[] = Object.keys(scores)
    .map((k) => ({
      lang: k as Language,
      score: scores[k as Language].score,
      matched: scores[k as Language].matched
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return {
      language: fallbackLang,
      confidence: 0.5,
      isMixed: false,
      indicators: ['Generic syntax, default retained']
    };
  }

  const primary = sorted[0];

  // Check for Mixed Language Anomalies:
  // e.g. Python def mixed with Java / C / C++ or Go package main mixed with Python
  let isMixed = false;
  let mixedWarning: string | undefined;

  if (sorted.length >= 2) {
    const second = sorted[1];
    // Exclude natural pairs (C vs C++, JS vs TS)
    const isPair = (l1: Language, l2: Language) => 
      (l1 === 'c' && l2 === 'cpp') || (l1 === 'cpp' && l2 === 'c') ||
      (l1 === 'javascript' && l2 === 'typescript') || (l1 === 'typescript' && l2 === 'javascript');

    if (!isPair(primary.lang, second.lang)) {
      // If second language has a significant distinctive score (>= 6) and primary is close or both have strong distinctive tokens
      if (second.score >= 7 && (primary.score - second.score < 8 || second.score >= 10)) {
        isMixed = true;
        mixedWarning = `Mixed language detected (${LANGUAGES[primary.lang].name} + ${LANGUAGES[second.lang].name}). Please use one language per file.`;
      }
    }
  }

  const totalPoints = sorted.reduce((acc, curr) => acc + curr.score, 0);
  const confidence = Math.min(1.0, Number((primary.score / (totalPoints || 1)).toFixed(2)));

  return {
    language: primary.lang,
    confidence: Math.max(0.65, confidence),
    isMixed,
    mixedWarning,
    indicators: primary.matched,
    secondaryLanguages: sorted.slice(1).map((s) => ({ lang: s.lang, score: s.score }))
  };
}
