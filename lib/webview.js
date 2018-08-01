const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const globby = require('globby');
const { properties, defineValue, unlinkValue } = require('../util');
const WebViewRegExp = /([^\/]+)\/index.vue/;

module.exports = class CommonCompiler {
  constructor(loader, name, dir, options = {}) {
    this.namespace = loader.namespace;
    this.name = name;
    this.loader = loader;
    this.watchingDirectory = dir;
    this.data = {};
    this.loader.createResult(name, () => this.data);
  }
  
  watch(dirs) {
    dirs.forEach(({ type, pathname }) => {
      const dir = path.resolve(pathname, this.watchingDirectory);
      const watcher = chokidar.watch(dir);
      watcher.on('add', file => this.watchAdding(file, dir));
      watcher.on('unlink', file => this.watchUnLinking(file, dir));
      this.loader.addWatcher(watcher);
    });
  }
  
  build(dirs) {
    dirs.forEach(({ type, pathname }) => {
      const dir = path.resolve(pathname, this.watchingDirectory);
      const names = fs.readdirSync(dir);
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const mainFilePath = path.resolve(dir, name, 'index.vue');
        if (fs.existsSync(mainFilePath)) {
          this.data[name] = `<async () => (await import("${mainFilePath}")).default>`;
        }
      }
    });
  }
  
  watchAdding(file, dir) {
    const relative = path.relative(dir, file);
    const exec = WebViewRegExp.exec(relative);
    if (exec) {
      this.data[exec[1]] = `<async () => (await import("${file}")).default>`;
      this.loader.make();
    }
  }
  
  watchUnLinking(file, dir) {
    const relative = path.relative(dir, file);
    const exec = WebViewRegExp.exec(relative);
    if (exec && this.data[exec[1]]) {
      delete this.data[exec[1]];
      this.loader.make();
    }
  }
};