const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const doctrine = require('doctrine');
const path = require('path');

const tableHead = '| Prop | Explanation |\n| :--: | :--: |\n';

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

const getComment = async (filePath) => {
  const code = await readFile({
    filePath: path.resolve(__dirname, filePath),
    encode: 'utf8',
  });

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });

  const temp = [];

  traverse(ast, {
    TSInterfaceDeclaration(path, state) {
      if (path?.node?.id?.name === 'PropsType') {
        const interfacePropertyNodePaths = path.get('body').get('body');
        Array.isArray(interfacePropertyNodePaths) &&
          interfacePropertyNodePaths.forEach((interfacePropertyNodePaths) => {
            const interfacePropertyNode = interfacePropertyNodePaths?.node;
            const leadingComments =
              interfacePropertyNode?.leadingComments || [];
            const handleLeadingComments = leadingComments
              .map((leadingComment) => parseComment(leadingComment?.value))
              .reduce((result, comment) => {
                const handleComment = comment?.description || '';
                if (handleComment === '') return result;
                return result !== ''
                  ? `${result}\n${handleComment}`
                  : handleComment;
              }, '');
            temp.push([
              interfacePropertyNode?.key?.name,
              handleLeadingComments,
            ]);
          });
        path.stop();
      }
    },
  });
  return temp;
};

// getComment('./Test.tsx');

const entryFile = './index.ts';

// 解析入口文件获取组件路径
const parseEntryFile = async (entryFilePath) => {
  const code = await readFile({
    filePath: path.resolve(__dirname, entryFilePath),
    encode: 'utf8',
  });

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript'],
  });

  const componentNames = [];
  const componentPaths = [];

  traverse(ast, {
    ExportNamedDeclaration(path, state) {
      componentNames.push(path?.node?.specifiers?.[0]?.exported.name);
      componentPaths.push(path?.node?.source.value);

      // console.log('export', path.node.specifiers?.[0].exported.name);
      // console.log('export', path.node.source.value);
    },
  });

  const documents = await Promise.all(
    componentPaths.map((componentPath) => {
      return getComment(`${componentPath}.tsx`);
    })
  );

  console.log('c', componentNames);
  console.log('d', documents);

  return {
    componentNames,
    documents,
  };
};

// parseEntryFile(entryFile);

const writeDocument = (componentNames, documents) => {
  let docText = '# Components\n';
  // 生成目录
  componentNames.forEach((componentName, index) => {
    if (componentName) {
      docText += `<a href="#doc${index}"><font size=2 color=#00f>${
        index + 1
      }、${componentName}</font></a>\n\n`;
    }
  });

  componentNames.forEach((componentName, index) => {
    const document = documents[index];
    if (componentName) {
      docText += `## <a id="doc${index}">${index + 1}、${componentName}</a>\n`;
      docText += tableHead;
      document.forEach((item) => {
        docText += `| ${item[0]} | ${item[1]} |\n`;
      });
    }
  });
  fs.writeFile('./readme.md', docText, () => {});
};
// 生成文档

const main = async () => {
  const { componentNames, documents } = await parseEntryFile(entryFile);
  writeDocument(componentNames, documents);
};

main();
