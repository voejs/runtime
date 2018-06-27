const path = require('path');
const chokidar = require('chokidar');
const globby = require('globby');
const { properties, defineValue, unlinkValue } = require('../util');

module.exports = class CommonCompiler {
  constructor(loader, name, dir, options = {}) {
    this.namespace = loader.namespace;
    this.name = name;
    this.loader = loader;
    this.watchingDirectory = dir;
    this.data = {};
    this.rules = options.rules || [/\.js$/i];
    this.matches = options.match || ['**/*.js'];
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
      const files = globby.sync(dir, { match: this.matches });
      files.forEach(file => this.add(file, dir));
    });
  }
  
  checkFileExt(file) {
    let result = false;
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      if (rule.test(file)) {
        result = true;
        break;
      }
    }
    return result;
  }
  
  add(file, dir) {
    const relative = properties(file, dir);
    const varName = [this.namespace, this.name].concat(relative).join('_');
    this.loader.insertImport(varName, file);
    defineValue(relative.join('.'), this.data, varName);
  }
  
  watchAdding(file, dir) {
    if (!this.checkFileExt(file)) return;
    this.add(file, dir);
    this.loader.make();
  }
  
  unlink(file, dir) {
    const relative = properties(file, dir);
    const varName = [this.namespace, this.name].concat(relative).join('_');
    this.loader.deleteImport(varName);
    unlinkValue(relative.join('.'), this.data);
  }
  
  watchUnLinking(file, dir) {
    if (!this.checkFileExt(file)) return;
    this.unlink(file, dir);
    this.loader.make();
  }
};