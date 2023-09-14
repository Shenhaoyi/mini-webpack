import jsonLoader  from './loader/jsonLoader.js';
import jsonLog from './loader/jsonLog.js';
import HtmlPlugin from './plugin/htmlPlugin.js';
import path from 'path';
import process from 'process';

export default {
  // entry: {
  //   main: './example/main.js',
  // },
  // output: {
  //   filename: 'bundle.js',
  //   path: __dirname + '/dist',
  // },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [jsonLog, jsonLoader],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: path.resolve(process.cwd(), './example/index.html'),
    }),
  ],
};
