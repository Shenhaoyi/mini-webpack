// 处理不同模块的代码在同一个文件中运行的问题：
// 1、每个模块都用函数包裹，防止命名冲突
// 2、import 语法是需要顶层使用的，所以转换成cjs规范，需要自己实现require

(function (modules) {
  function require(filePath) {
    const fn = modules[filePath];
    const module = {
      exports: {},
    };
    // require供模块引用外部文件，module存放该模块导出内容
    fn(require, module);
    return module;
  }

  require('./main.js');
})({
  './src/foo.js': function (require, module) {
    function foo() {
      console.log('foo.js');
    }
    module.exports = {
      foo,
    };
  },
  './main.js': function (require, module) {
    const {
      exports: { foo },
    } = require('./src/foo.js');
    foo();
    console.log('main.js');
  },
});
