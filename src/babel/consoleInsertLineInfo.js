const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
});

// version 1
// traverse(ast, {
//   CallExpression(path, state) {
//     if (
//       types.isMemberExpression(path.node.callee) &&
//       path.node.callee.object.name === 'console' &&
//       ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
//     ) {
//       const { line, column } = path.node.loc.start;
//       path.node.arguments.unshift(
//         types.stringLiteral(`filename: (${line}, ${column})`)
//       );
//     }
//   },
// });

// version 2
// const targetCalleeName = ['log', 'info', 'error', 'debug'].map(
//   (item) => `console.${item}`
// );
// traverse(ast, {
//   CallExpression(path, state) {
//     const calleeName = generate(path.node.callee).code;
//     if (targetCalleeName.includes(calleeName)) {
//       const { line, column } = path.node.loc.start;
//       path.node.arguments.unshift(
//         types.stringLiteral(`filename: (${line}, ${column})`)
//       );
//     }
//   },
// });

// version 3
const targetCalleeName = ['log', 'info', 'error', 'debug'].map(
  (item) => `console.${item}`
);
traverse(ast, {
  CallExpression(path, state) {
    if (path.node.isNew) {
      return;
    }
    const calleeName = path.get('callee').toString();
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      const newNode = template.expression(
        `console.log("filename: (${line},${column})")`
      )();
      newNode.isNew = true;
      if (path.findParent((path) => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]));
        path.skip();
      } else {
        path.insertBefore(newNode);
      }
    }
  },
});

const { code, map } = generate(ast);
console.log(code);
