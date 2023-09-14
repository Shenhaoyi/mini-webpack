import jsonLoader  from './loader/jsonLoader.js';
import jsonLog from './loader/jsonLog.js';

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
};
