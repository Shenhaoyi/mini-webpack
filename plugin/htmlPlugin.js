import fs from 'fs';
import path from 'path';
import process from 'process';

// 在dist中生成html文件
export default class {
  constructor({ filename, template }) {
    this.filename = filename;
    this.template = template;
  }

  apply(hooks) {
    hooks.afterBuild.tap('html plugin', ({ outputDir }) => {
      console.log('html plugin');
      const data = fs.readFileSync(this.template);
      fs.writeFileSync(path.resolve(outputDir, this.filename), data);
    });
  }
}
