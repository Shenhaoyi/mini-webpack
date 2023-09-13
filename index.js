import fs from 'fs';
import parser from '@babel/parser';
import traverser from '@babel/traverse';
import path from 'path';
import ejs from 'ejs';
import { transformFromAst } from '@babel/core';

// 获取文件内容及其依赖文件
function createAsset(filePath) {
  // 1.获取文件内容
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  // 2.获取依赖关系
  // 生成ast树
  const ast = parser.parse(source, {
    sourceType: 'module', // 需要指定代码的模块规范
  });
  const deps = [];
  traverser.default(ast, {
    // import节点的visitor
    ImportDeclaration({ node }) {
      const path = node.source.value;
      deps.push(path);
    },
  });

  // https://babel.dev/docs/babel-core#transformfromast
  const { code } = transformFromAst(ast, null, { presets: ['env'] }); // 这个预设需要安装babel-preset-env
  console.log('shen log: ', { code });

  return {
    filePath,
    source: code,
    deps,
  };
}

// 获取文件之间的依赖图关系（广度优先搜索）
function createGraph(entry) {
  const entryAsset = createAsset(entry);
  const queue = [entryAsset];

  for (let i = 0; i < queue.length; i++) {
    const asset = queue[i];
    const { filePath, deps } = asset;
    const dirPath = path.dirname(filePath);
    deps.forEach((item) => {
      const childAsset = createAsset(path.resolve(dirPath, item));
      queue.push(childAsset);
    });
  }

  return queue;
}

const graph = createGraph('./example/main.js');

function build(graph) {
  const template = fs.readFileSync('./example/bundle.js', {
    encoding: 'utf-8',
  });

  const code = ejs.render(template, {});

  const targetDir = './dist';
  if (fs.existsSync(targetDir))
    fs.rmdirSync(targetDir, {
      recursive: true, // 递归删除
    });
  fs.mkdirSync(targetDir);
  fs.writeFileSync(`${targetDir}/bundle.js`, code);
}
build(graph);
