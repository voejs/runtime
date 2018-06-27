const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { properties, defineValue, unlinkValue } = require('../util');

module.exports = class FileCompiler {
  constructor(loader, name, file) {
    this.namespace = loader.namespace;
    this.name = name;
    this.loader = loader;
    this.watchingFile = file;
    this.data = [];
    this.loader.createResult(name, () => this.data);
  }
  
  watch(dirs) {
    dirs.forEach(({ type, pathname }, index) => {
      const file = path.resolve(pathname, this.watchingFile).replace('[env]', this.loader.env);
      const watcher = chokidar.watch(file);
      watcher.on('add', file => this.watchAdding(file, index));
      watcher.on('unlink', file => this.watchUnLinking(file, index));
      this.loader.addWatcher(watcher);
    });
  }
  
  build(dirs) {
    dirs.forEach(({ type, pathname }, index) => {
      const file = path.resolve(pathname, this.watchingFile).replace('[env]', this.loader.env);
      if (fs.existsSync(file)) {
        this.add(file, index);
      }
    });
  }
  
  add(file, index) {
    const varName = [this.namespace, this.name, index].join('_');
    this.loader.insertImport(varName, file);
    const i = this.data.indexOf(varName);
    if (i === -1) {
      this.data.push(varName);
    }
  }
  
  watchAdding(file, index) {
    this.add(file, index);
    this.loader.make();
  }
  
  unlink(file, index) {
    const varName = [this.namespace, this.name, index].join('_');
    this.loader.deleteImport(varName);
    const i = this.data.indexOf(varName);
    if (i > -1) {
      this.data.splice(i, 1);
    }
  }
  
  watchUnLinking(file, index) {
    this.unlink(file, index);
    this.loader.make();
  }
};