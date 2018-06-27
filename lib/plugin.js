const fs = require('fs');
const path = require('path');
const unq = require('array-uniq');
const { readJson } = require('../util');

module.exports = class PluginCompiler {
  constructor(loader, file) {
    this.loader = loader;
    this.pluginFilePath = path.resolve(loader.cwd, file);
  }
  
  parse() {
    const file = this.pluginFilePath;
    if (!fs.existsSync(file)) return;
    const env = this.loader.env;
    const cwd = this.loader.cwd;
    const data = readJson(file);
    const imports = {};
    const vars = {};
    for (const i in data) {
      const item = data[i];
      const name = `plugin_${i}`;
      const pathName = item.path;
      const packageName = item.package;
      let dir, exportPath;
      if (pathName) {
        dir = path.resolve(cwd, pathName);
      } else {
        dir = path.resolve(cwd, 'node_modules', packageName);
      }
      if (!item.enable) continue;
      if (item.env) {
        if (!Array.isArray(item.env)) item.env = [item.env];
        if (item.env.indexOf(env) === -1) continue;
      }
      const pkg = require(dir + '/package.json');
      exportPath = path.resolve(dir, 'app.js');
      if (!pkg.plugin || pkg.plugin.name !== i) {
        throw new Error(`插件名不合法: ${dir + '/package.json'}`);
      }
      if (!item.dependencies) item.dependencies = [];
      if (!Array.isArray(item.dependencies)) item.dependencies = [item.dependencies];
      if (!pkg.plugin.dependencies) pkg.plugin.dependencies = [];
      if (!Array.isArray(pkg.plugin.dependencies)) pkg.plugin.dependencies = [pkg.plugin.dependencies];
      const dependencies = unq(item.dependencies.concat(pkg.plugin.dependencies));
      vars[i] = {
        dependencies: dependencies
      };
      if (fs.existsSync(exportPath)) {
        imports[name] = exportPath;
        vars[i].module = name;
      }
      this.loader.addProgram(i + ':' + dir);
    }
    this.loader.plugin.values = vars;
    this.loader.plugin.imports = imports;
  }
};