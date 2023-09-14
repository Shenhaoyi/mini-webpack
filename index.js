import fs from 'fs';
import parser from '@babel/parser';
import traverser from '@babel/traverse';
import path from 'path';
import ejs from 'ejs';
import { transformFromAst } from '@babel/core';
import config from './webpack.config.js';
import { SyncHook } from 'tapable';

// 标记文件的id
let id = 0;

// 事件hooks
const hooks = {
  afterBuild: new SyncHook(['context']),
};
// 初始化插件，进行事件注册
function initPlugins() {
  config.plugins.forEach((plugin) => {
    plugin.apply(hooks);
  });
}
initPlugins();

// 获取文件内容及其依赖文件
function createAsset(filePath) {
  // 1.获取文件内容
  let source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  // loader
  const loaders = config.module.rules;
  loaders.forEach(({ test, use }) => {
    const options = {};
    if (test.test(filePath)) {
      source = use.reverse().reduce((prev, curr) => {
        return curr.call({ options }, prev);
      }, source);
    }
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
      const path = node.source.value;
      deps.push(path);
    },
  });

  // ast转cjs代码
  // https://babel.dev/docs/babel-core#transformfromast
  const { code } = transformFromAst(ast, null, { presets: ['env'] }); // 这个预设需要安装babel-preset-env

  id++;
  return {
    filePath,
    code,
    deps,
    id,
    mapping: {},
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
      asset.mapping[item] = childAsset.id; // 注意childAsset.fileName是绝对路径
      queue.push(childAsset);
    });
  }

  return queue;
}

// 根据文件依赖图打包生成最终产物
function build(entry) {
  const graph = createGraph(entry);

  const template = fs.readFileSync('./bundle.ejs', {
    encoding: 'utf-8',
  });

  const code = ejs.render(template, { data: graph }); // 利用ejs进行模板填充

  const { path: targetDir, filename: targetFilename } = config.output;

  if (fs.existsSync(targetDir))
    fs.rmdirSync(targetDir, {
      recursive: true, // 递归删除
    });
  fs.mkdirSync(targetDir);
  fs.writeFileSync(`${targetDir}/${targetFilename}`, code);

  const context = {
    outputDir: targetDir,
  };

  // 触发事件
  hooks.afterBuild.call(context);
}

build(config.entry);
