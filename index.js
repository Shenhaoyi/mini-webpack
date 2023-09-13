import fs from 'fs';
import parser from '@babel/parser';
import traverser from '@babel/traverse';
import path from 'path';

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
      const source = node.source.value;
      deps.push(source);
    },
  });

  return {
    filePath,
    source,
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
console.log('shen log: ', { graph });
