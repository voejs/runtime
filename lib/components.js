const path = require('path');
const chokidar = require('chokidar');
const globby = require('globby');
const { properties } = require('../util');

module.exports = class ComponentCompiler {
  constructor(loader, name, dir) {
    this.namespace = loader.namespace;
    this.name = name;
    this.loader = loader;
    this.watchingDirectory = dir;
    this.data = [];
    this.rules = [/\.js$/i, /\.jsx$/i, /\.vue$/i];
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
      const files = globby.sync(dir, { match: ['**/*.js', '**/*.jsx', '**/*.vue'] });
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
    const index = this.data.indexOf(varName);
    if (index === -1) {
      this.data.push(varName);
    }
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
    const index = this.data.indexOf(varName);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }
  
  watchUnLinking(file, dir) {
    if (!this.checkFileExt(file)) return;
    this.unlink(file, dir);
    this.loader.make();
  }
};