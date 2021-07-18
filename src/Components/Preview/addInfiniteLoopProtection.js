// reference:
// https://gist.github.com/chriscoyier/b805fe91cc832fc97a3af671051e501f
// https://github.com/chinchang/web-maker/blob/master/src/utils.js

var esprima = require("esprima");

/**
 * Adds timed limit on the loops found in the passed code.
 * Contributed by Ariya Hidayat!
 * @param code {string}	Code to be protected from infinite loops.
 */
export function addInfiniteLoopProtection(code, { count }) {
  var loopId = 1;
  var patches = [];
  var varPrefix = "__jsLoopProtect";
  var varStr = "var %d = 0;\n";
  var checkStr = `\nif (++%d > ${count}) { throw new Error("Infinite loop (max. ${count})"); break; }\n`;

  esprima.parse(
    code,
    {
      tolerant: true,
      range: true,
      jsx: true,
    },
    function (node) {
      switch (node.type) {
        case "DoWhileStatement":
        case "ForStatement":
        case "ForInStatement":
        case "ForOfStatement":
        case "WhileStatement":
          var start = 1 + node.body.range[0];
          var end = node.body.range[1];
          var prolog = checkStr.replace("%d", varPrefix + loopId);
          var epilog = "";

          if (node.body.type !== "BlockStatement") {
            // `while(1) doThat()` becomes `while(1) {doThat()}`
            prolog = "{" + prolog;
            epilog = "}";
            --start;
          }

          patches.push({
            pos: start,
            str: prolog,
          });
          patches.push({
            pos: end,
            str: epilog,
          });
          patches.push({
            pos: node.range[0],
            str: varStr.replace("%d", varPrefix + loopId),
          });
          ++loopId;
          break;

        default:
          break;
      }
    }
  );

  /* eslint-disable no-param-reassign */
  patches
    .sort(function (a, b) {
      return b.pos - a.pos;
    })
    .forEach(function (patch) {
      code = code.slice(0, patch.pos) + patch.str + code.slice(patch.pos);
    });

  /* eslint-disable no-param-reassign */
  return code;
}
