// 处理不同模块的代码在同一个文件中运行的问题：
// 1、每个模块都用函数包裹，防止命名冲突
// 2、import 语法是需要顶层使用的，所以转换成cjs规范，需要自己实现require

const map = {
  './src/foo.js': foojs,
  './main.js': mainjs,
};

function require(filePath) {
  const fn = map[filePath];
  const module = {
    exports: {},
  };
  // require供模块引用外部文件，module存放该模块导出内容
  fn(require, module);
  return module;
}

function mainjs(require, module) {
  const {
    exports: { foo },
  } = require('./src/foo.js');
  foo();
  console.log('main.js');
}

function foojs(require, module) {
  function foo() {
    console.log('foo.js');
  }
  module.exports = {
    foo,
  };
}

require('./main.js');
