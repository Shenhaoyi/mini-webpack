# 说明

1. 利用 babel 的 parser、transformer、traverse 等功能，并结合 ejs 的模板生成功能，实现一个 mini 的 webpack。
2. 简单实现了 loader 和 plugins （基于tapable） 功能。
3. 支持 webpack.config.js 文件配置。

# 打包体验
安装依赖
```
npm ci
```


以`./example/main.js`文件为入口文件，进行打包

```
node index.js
```
