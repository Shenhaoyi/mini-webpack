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
