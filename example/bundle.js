// 处理不同模块的代码在同一个文件中运行的问题：
// 1、每个模块都用函数包裹，防止命名冲突
// 2、import 语法是需要顶层使用的，所以转换成cjs规范，需要自己实现require
// 3、文件路径有相对有绝对，相对的可能有重复，所以用文件id来取代路径

(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];
    const module = {
      exports: {},
    };
    // 基于路径require
    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }

    // require供模块引用外部文件，module存放该模块导出内容
    fn(localRequire, module, module.exports);
    return module;
  }

  require(1);
})({
  1: [
    function (require, module, exports) {
      const {
        exports: { foo },
      } = require('./src/foo.js');
      foo();
      console.log('main.js');
    },
    {
      './src/foo.js': 2,
    },
  ],
  2: [
    function (require, module, exports) {
      function foo() {
        console.log('foo.js');
      }
      module.exports = {
        foo,
      };
    },
  ],
});
