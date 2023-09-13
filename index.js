import fs from 'fs';

function createAsset() {
  // 1.获取文件内容
  const source = fs.readFileSync('./example/main.js', {
    encoding: 'utf-8',
  });
  // 2.获取依赖关系


  return {};
}

createAsset();
