// 加载json文件内容
export default function (source) {
  console.log('jsonLoader');
  console.log('loader options: ', this.options);
  return `export default ${JSON.stringify(JSON.parse(source))}`;
}
