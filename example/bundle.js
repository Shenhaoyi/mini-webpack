// 不同模块的代码在一个文件中是如何运行的
// 每个模块都用函数包裹，防止命名冲突
// import 语法是需要顶层使用的，所以转换成cjs规范，需要自己实现require

const map = {
  './foo.js': foojs,
  './main.js': mainjs,
};

function mainjs() {
  const foo = require('./src/foo.js');
  foo();
  console.log('main.js');
}

function foojs() {
  function foo() {
    console.log('foo.js');
  }
  module.exports = {
    foo,
  };
}
