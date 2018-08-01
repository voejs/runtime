const fs = require('fs');
const path = require('path');
const Emitter = require('events');
const { format } = require('./util');
const hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = class VoeRuntime extends Emitter {
  constructor(cwd, name, env) {
    super();
    this.namespace = 'ESM';
    this.cwd = cwd;
    this.env = env;
    this.compilers = [];
    this.directories = [];
    this.watchers = [];
    this.imports = {};
    this.values = {} ;
    this.voecache = path.resolve(this.cwd, name);
    this.addProgram('__project__:' + this.cwd);
    this.plugin = { imports: {}, values: {} }
  }
  
  /**
   * add a new program for compiling
   * @param dir
   * @returns {module.VoeRuntime}
   */
  addProgram(dir) {
    if (this.directories.indexOf(dir) === -1) this.directories.push(dir);
    return this;
  }
  
  /**
   * add a new compiler
   * @param compiler
   * @returns {module.VoeRuntime}
   */
  addCompiler(compiler) {
    this.compilers.push(compiler);
    return this;
  }
  
  /**
   * add a new watcher
   * @param watcher
   * @returns {module.VoeRuntime}
   */
  addWatcher(watcher) {
    this.watchers.push(watcher);
    return this;
  }
  
  /**
   * add a new importing file
   * @param name
   * @param file
   * @returns {module.VoeRuntime}
   */
  insertImport(name, file) {
    this.imports[name] = file;
    return this;
  }
  
  /**
   * delete an exists importing file
   * @param name
   * @returns {module.VoeRuntime}
   */
  deleteImport(name) {
    if (this.imports[name] !== undefined) {
      delete this.imports[name];
    }
    return this;
  }
  
  /**
   * add a new Value resolver
   * @param name
   * @param callback
   * @returns {module.VoeRuntime}
   */
  createResult(name, callback) {
    this.values[name] = callback;
    return this;
  }
  
  /**
   * write file content for sync
   * @returns {module.VoeRuntime}
   */
  makeSync() {
    const imports = [], maps = {}, vars = {};
    for (let item in this.imports) {
      if (hasOwnProperty.call(this.imports, item)) {
        imports.push(`import ${item} from '${this.imports[item]}';`);
        maps[item] = `<${item}>`;
      }
    }
    for (let i in this.plugin.imports) {
      if (hasOwnProperty.call(this.plugin.imports, i)) {
        imports.push(`import ${i} from '${this.plugin.imports[i]}';`);
        maps[item] = `<${i}>`;
      }
    }
    for (const j in this.values) {
      if (hasOwnProperty.call(this.values, j)) {
        if (typeof this.values[j] === 'function') {
          vars[j] = this.values[j]();
        }
      }
    }
    vars.plugin = this.plugin.values;
    
    const content = [
      imports.join('\n'),
      `export const map = ${JSON.stringify(maps, null, 2).replace(/\"\</g, '').replace(/\>\"/g, '')};`,
      `export const vars = ${JSON.stringify(vars, null, 2).replace(/\"\</g, '').replace(/\>\"/g, '').replace(/\\"/g, '"')};`,
      `export default { map, vars };`
    ].join('\n');
    
    fs.writeFileSync(this.voecache, content, 'utf8');
    return this;
  }
  
  /**
   * write file content for async
   * @param time
   * @param callback
   * @returns {*}
   */
  make(time, callback) {
    if (typeof time === 'function') {
      callback = time;
      time = 1000;
    }
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.makeSync();
      delete this.timer;
      callback && callback();
    }, time || 1000);
    return this;
  }
  
  /**
   * start all compilers
   * @returns {module.VoeRuntime}
   */
  compile() {
    const result = this.directories.map(dir => {
      const { type, pathname } = format(dir);
      return {
        type, pathname
      }
    });
    for (let i = 0; i < this.compilers.length; i++) {
      const compiler = this.compilers[i];
      compiler(result.slice());
    }
    return this;
  }
  
  /**
   * close all watchers
   */
  stop() {
    clearTimeout(this.timer);
    this.watchers.forEach(watcher => watcher.close());
  }
};