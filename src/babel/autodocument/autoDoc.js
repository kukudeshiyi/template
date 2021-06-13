const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const doctrine = require('doctrine');
const path = require('path');

const tableHead = '| Prop | Explanation |\n| :--: | :--: |\n';

// 解析注释
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

// 分析路径补全路径
const parsePath = (filePath) => {
  const parseResult = path.parse(filePath);
  if (parseResult) {
    if (parse.base) {
    }
  }
};

const getComment = async (filePath, rootPath) => {
  const code = await readFile({
    filePath: path.resolve(rootPath, filePath),
    encode: 'utf8',
  });

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });

  const comments = [];

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
            comments.push([
              interfacePropertyNode?.key?.name,
              handleLeadingComments,
            ]);
          });
        path.stop();
      }
    },
  });
  return comments;
};

// 解析入口文件获取组件路径
const parseEntryFile = async (entryFilePath, rootPath) => {
  const code = await readFile({
    filePath: path.resolve(rootPath, entryFilePath),
    encode: 'utf8',
  }).catch((e) => {
    console.log('read entry file error', e);
  });

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript'],
  });

  const componentNames = [];
  const componentPaths = [];

  traverse(ast, {
    ExportNamedDeclaration(path, state) {
      // TODO:优化判断路径
      let componentPath = path?.node?.source.value;
      if (!componentPath.includes('index')) {
        componentPath = `${componentPath}/index`;
      }
      if (!componentPath.includes('tsx')) {
        componentPath = `${componentPath}.tsx`;
      }
      componentNames.push(path?.node?.specifiers?.[0]?.exported.name);
      componentPaths.push(componentPath);
    },
  });

  const documents = await Promise.all(
    componentPaths.map((componentPath) => {
      return getComment(componentPath, rootPath);
    })
  );

  return {
    componentNames,
    documents,
  };
};

const writeDocument = async (componentNames, documents, markdown, rootPath) => {
  let docText = '';
  if (markdown.headerFile) {
    const headerContent = await readFile({
      filePath: Path.resolve(rootPath, markdown.headerFile),
      encode: 'utf8',
    }).catch((e) => {
      console.log('read markdown header file error', e);
    });
    docText = `${headerContent || ''}\n`;
  }
  docText += '# Components\n';

  // 生成目录
  componentNames.forEach((componentName, index) => {
    if (componentName) {
      docText += `<a href="#doc${index}"><font size=2 color=#00f>${
        index + 1
      }.${componentName}</font></a>\n\n`;
    }
  });

  componentNames.forEach((componentName, index) => {
    const document = documents[index];
    if (componentName) {
      docText += `## <a id="doc${index}">${index + 1}.${componentName}</a>\n`;
      docText += tableHead;
      document.forEach((item) => {
        docText += `| ${item[0]} | ${item[1]} |\n`;
      });
    }
  });

  // 尾部
  if (markdown.footerFile) {
    const footerContent = await readFile({
      filePath: Path.resolve(rootPath, markdown.footerFile),
      encode: 'utf8',
    }).catch((e) => {
      console.log('read markdown footer file error', e);
    });
    docText += `${footerContent || ''}\n`;
  }

  fs.writeFile(path.resolve(rootPath, './Readme.md'), docText, (err) => {
    if (err) {
      console.log('write readme file error', err);
    }
  });
};

const main = async () => {
  // 获取当前路径,寻找配置文件
  const currentExecPath = process.cwd();
  const configObjectJson = await readFile({
    filePath: path.resolve(currentExecPath, './autoDoc.config.json'),
    encode: 'utf8',
  }).catch((e) => {
    console.log('read autoDoc.config.json file error', e);
  });
  if (!configObjectJson) {
    return;
  }
  const configObject = JSON.parse(configObjectJson);
  const { componentNames, documents } = await parseEntryFile(
    configObject.entryFile,
    currentExecPath
  );
  writeDocument(
    componentNames,
    documents,
    configObject.markdown,
    currentExecPath
  );
};

main();
