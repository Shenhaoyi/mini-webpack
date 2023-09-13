import fs from 'fs';
import parser from '@babel/parser';
import traverser from '@babel/traverse';

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
    source,
    deps,
  };
}

const asset = createAsset('./example/main.js');
