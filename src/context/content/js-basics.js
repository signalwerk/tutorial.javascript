
export const functions = {
  steps: [
    {
      id: "functions.intro",
      title: "Intro",
      intro: {
        editor: `editor`,
        video: "",
      },
      tasks: [
        {
          instruction: "Schreibe selber einen einzeiligen Kommentar (`//`)",
          match: /(\/\/)../g,
        },
      ],
    },
  ],
};

export const intro = {
  steps: [
    {
      type: "play",
      title: "Hallo & Kommentare",
      script: "",
      state: {
        editor: `
// Hallo. Ich heisse Stefan 👋
/*
 Mehrere Zeilen.
*/
// -----------
|
`,
      },
    },
    {
      type: "interact",
      tasks: [
        {
          instruction: "Schreibe selber einen einzeiligen Kommentar (`//`)",
          match: /(\/\/)../g,
        },
        {
          instruction: "Schreibe einen mehrzeiligen Kommentar (`/* */`)",
          match: /(\/\*)([^\/]{2,})(?=\*\/)/gm,
        },
      ],
      //   hightlights: [
      //     {
      //       pattern: "//",
      //       hint: "Komentarstart",
      //     },
      //     {
      //       pattern: "/*",
      //       hint: "Komentarstart",
      //     },
      //     {
      //       pattern: "/*",
      //       hint: "Komentarend",
      //     },
      //   ],
      // //       You should create a `//` style comment that contains at least five letters.

      // // ```js
      // // assert(code.match(/(\/\/)...../g));
      // // ```

      // // You should create a `/* */` style comment that contains at least five letters.

      // // ```js
      // // assert(code.match(/(\/\*)([^\/]{5,})(?=\*\/)/gm));
      // // ```
    },
  ],
};

// # --description--

// After a value is assigned to a variable using the <dfn>assignment</dfn> operator, you can assign the value of that variable to another variable using the <dfn>assignment</dfn> operator.

// ```js
// var myVar;
// myVar = 5;
// var myNum;
// myNum = myVar;
// ```

// The above declares a `myVar` variable with no value, then assigns it the value `5`. Next, a variable named `myNum` is declared with no value. Then, the contents of `myVar` (which is `5`) is assigned to the variable `myNum`. Now, `myNum` also has the value of `5`.

// # --instructions--

// Assign the contents of `a` to variable `b`.

// # --hints--

// You should not change code above the specified comment.

// ```js
// assert(/var a;/.test(code) && /a = 7;/.test(code) && /var b;/.test(code));
// ```

// `b` should have a value of 7.

// ```js
// assert(typeof b === 'number' && b === 7);
// ```

// `a` should be assigned to `b` with `=`.

// ```js
// assert(/b\s*=\s*a\s*/g.test(code));
// ```

// # --seed--

// ## --before-user-code--

// ```js
// if (typeof a != 'undefined') {
//   a = undefined;
// }
// if (typeof b != 'undefined') {
//   b = undefined;
// }
// ```

// ## --after-user-code--

// ```js
// (function(a, b) {
//   return 'a = ' + a + ', b = ' + b;
// })(a, b);
// ```

// ## --seed-contents--

// ```js
// // Setup
// var a;
// a = 7;
// var b;

// // Only change code below this line
// ```

// # --solutions--

// ```js
// var a;
// a = 7;
// var b;
// b = a;
// ```




export const data = {
  chapters: [
    {
      id: "intro",
      title: "Intro",
    },
    {
      id: "comments",
      title: "Kommentare",
    },
    {
      id: "variables",
      title: "Variablen",
    },
    {
      id: "types",
      title: "Datentypen",
    },
    {
      id: "operators",
      title: "Operatoren",
    },
    {
      id: "functions",
      title: "Funktionen",
      ...functions,
    },
    {
      id: "itterations",
      title: "Schleifen",
    },
    {
      id: "conditions",
      title: "if/else/case",
    },
    {
      id: "obj-array",
      title: "Datentypen Advanced",
    },
  ],
};
