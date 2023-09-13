import fs from 'fs';
import parser from '@babel/parser';


function createAsset() {
  // 1.获取文件内容
  const source = fs.readFileSync('./example/main.js', {
    encoding: 'utf-8',
  });

  // 2.获取依赖关系

  // 生成ast树
  const ast = parser.parse(source, {
    sourceType: 'module' // 需要指定代码的模块规范
  });

  return {};
}

createAsset();
