const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const doctrine = require('doctrine');
const path = require('path');

const tableHead = '| Prop | Explanation |\n| :--: | :--: |\n';

const allowFileExtensions = ['ts', 'tsx', 'js', 'jsx'];

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
// 判断当前路径是不是有效路径
const getIsValidPath = (filePath) => {
  return new Promise((res, rej) => {
    fs.access(filePath, (err) => {
      if (err) {
        res(false);
      }
      return res(true);
    });
  });
};
// 判断当前路径指向的是文件还是文件夹
const getIsDirectory = (filePath) => {
  return new Promise((res, rej) => {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        rej(err);
      }
      res(stat.isDirectory());
    });
  });
};

// 补全路径
const filePathAddExtension = async (options) => {
  const { allowExtensions = [], filePath } = options;
  let flag = false,
    result = filePath;
  for (const extension of allowExtensions) {
    const isValidPath = await getIsValidPath(`${filePath}.${extension}`);
    if (isValidPath) {
      flag = true;
      result = `${filePath}.${extension}`;
      break;
    }
  }
  return flag ? result : Promise.reject('error');
};

// 分析路径补全路径
const handlePath = async (options) => {
  const { currentExecPath, filePath } = options;
  // 分析是不是绝对路径
  let absoluteFilePath = filePath;
  const parseResult = path.parse(filePath);
  if (parseResult.root !== '/') {
    absoluteFilePath = path.resolve(currentExecPath, absoluteFilePath);
  }

  // 补全路径
  const isValidPath = await getIsValidPath(absoluteFilePath);

  // 判定用户只写了文件名未写后缀
  if (!isValidPath) {
    try {
      absoluteFilePath = await filePathAddExtension({
        allowExtensions: allowFileExtensions,
        filePath: absoluteFilePath,
      });
      return absoluteFilePath;
    } catch (e) {
      console.warn('1');
      return Promise.reject(e);
    }
  }

  // 如果是文件夹默认补全index文件
  try {
    const isDirectory = await getIsDirectory(absoluteFilePath);
    if (isDirectory) {
      absoluteFilePath = await filePathAddExtension({
        allowExtensions: allowFileExtensions,
        filePath: `${absoluteFilePath}/index`,
      });
      return absoluteFilePath;
    }
  } catch (e) {
    console.warn('2');
    return Promise.reject('error');
  }
  return absoluteFilePath;
};

const getComment = async (filePath) => {
  const code = await readFile({
    filePath,
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
const parseEntryFile = async (entryFilePath, currentExecPath) => {
  // 处理 entry file path ，增加容错性
  const handleEntryFilePath = await handlePath({
    currentExecPath,
    filePath: entryFilePath,
  }).catch((e) => {
    return console.warn('can not find entry file');
  });

  const code = await readFile({
    filePath: handleEntryFilePath,
    encode: 'utf8',
  }).catch((e) => {
    return console.warn('read entry file error', e);
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
    },
  });

  // 校正组件路径
  for (let i = 0; i < componentPaths.length; i++) {
    componentPaths[i] = await handlePath({
      currentExecPath: path.resolve(handleEntryFilePath, '../'),
      filePath: componentPaths[i],
    }).catch((e) => {
      console.warn('can not resolve conponents path');
    });
  }

  const documents = await Promise.all(
    componentPaths.map((componentPath) => {
      return getComment(componentPath);
    })
  );

  return {
    componentNames,
    documents,
  };
};

const writeDocument = async (componentNames, documents, markdown, rootPath) => {
  let docText = '';
  // TODO: 配置文件写错怎么办
  // TODO: 校验 markdown 文件是否存在
  if (markdown.headerFile) {
    const headerContent = await readFile({
      filePath: path.resolve(rootPath, markdown.headerFile),
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
      filePath: path.resolve(rootPath, markdown.footerFile),
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
