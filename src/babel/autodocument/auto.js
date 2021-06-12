const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const fs = require('fs');
const doctrine = require('doctrine');

const parseComment = (commentStr) => {
  if (!commentStr) {
    return '';
  }
  return doctrine.parse(commentStr, {
    unwrap: true,
  });
};

// 读取文件
const readFile = (options) => {
  const { filePath, encode = null } = options;
  return new Promise((res, rej) => {
    fs.readFile(filePath, encode, (err, data) => {
      if (err) {
        rej(err);
      }
      return res(data);
    });
  });
};

const main = async () => {
  console.log('---------------------------------');
  const code = await readFile({
    filePath: path.resolve(__dirname, './Test.tsx'),
    encode: 'utf8',
  });

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });

  // const comments = ast.comments || [];

  // comments.forEach((comment) => {
  //   if (comment.type === 'CommentBlock' && comment.value.match('@document')) {
  //     const commentText = comment.value;
  //     const handleCommentText = commentText
  //       .replace('@document', '')
  //       .replace(/[*\s]/g, '')
  //       .split(';');
  //     console.log(handleCommentText);
  //     fs.writeFile(
  //       './readme.md',
  //       `${handleCommentText.reduce((result, text) => {
  //         return text ? `${result}\n#${text}` : `${result}\n`;
  //       }, '')}`,
  //       'utf8',
  //       () => {}
  //     );
  //   }
  // });

  const temp = [];

  traverse(ast, {
    TSInterfaceDeclaration(path, state) {
      console.log(path.node.id.name);
      // console.log(path.get('id').get('id').name);
      if (path?.node?.id?.name === 'PropsType') {
        const interfacePropertyNodePaths = path.get('body').get('body');
        Array.isArray(interfacePropertyNodePaths) &&
          interfacePropertyNodePaths.forEach((interfacePropertyNodePaths) => {
            const interfacePropertyNode = interfacePropertyNodePaths?.node;
            const leadingComments =
              interfacePropertyNode?.leadingComments || [];
            console.log('comment', leadingComments);
            const handleLeadingComments = leadingComments
              .map((leadingComment) => parseComment(leadingComment?.value))
              .reduce((result, comment) => {
                const handleComment = comment?.description || '';
                if (handleComment === '') return result;
                return result !== ''
                  ? `${result}\n${handleComment}`
                  : handleComment;
              }, '');
            // console.log(handleLeadingComments);
            // console.log('node', interfacePropertyNode.key.name);
            // console.log('comment', leadingComments);
            temp.push(interfacePropertyNode?.key?.name, handleLeadingComments);
          });
      }
    },
  });
  console.log('main', temp);
  return temp;
};

main();

// console.log('interface', path, state);
// console.log(path.get('body').get('body')[0].node.leadingComments);
// console.log(
//   parseComment(
//     path.get('body').get('body')[0].node.leadingComments[0].value
//   )
// );
// path
//   .get('body')
//   .get('body')
//   .forEach((item, index) => {
//     index === 0 && console.log(item);
//   });
// console.log(path.get('body').get('body'));

// if (path.get('id').name === 'PropsType') {
//   // console.log(path.get('body').get('body'));
// }
