const RuntimeLoader = require('./index');
const Common = require('./lib/common');
const Components = require('./lib/components');
const File = require('./lib/file');
const WebStore = require('./lib/webstore');
const Plugin = require('./lib/plugin');
const WebView = require('./lib/webview');

module.exports = class VoeRuntime extends RuntimeLoader {
  constructor(options = {}) {
    super(
      options.cwd || process.env.VOE_CWD || process.cwd(),
      options.filename || '.voecache.js',
      options.env || process.env.NODE_ENV
    );
    this.namespace = 'VOE';
  }
  
  watchController() { this.addCompiler(dirs => new Common(this, 'controller', 'app/controller').watch(dirs)); }
  buildController() { this.addCompiler(dirs => new Common(this, 'controller', 'app/controller').build(dirs)); }
  
  watchMiddleware() { this.addCompiler(dirs => new Common(this, 'middleware', 'app/middleware').watch(dirs)); }
  buildMiddleware() { this.addCompiler(dirs => new Common(this, 'middleware', 'app/middleware').build(dirs)); }
  
  watchService() { this.addCompiler(dirs => new Common(this, 'service', 'app/service').watch(dirs)); }
  buildService() { this.addCompiler(dirs => new Common(this, 'service', 'app/service').build(dirs)); }
  
  watchComponents() { this.addCompiler(dirs => new Components(this, 'components', 'app/components').watch(dirs)); }
  buildComponents() { this.addCompiler(dirs => new Components(this, 'components', 'app/components').build(dirs)); }
  
  watchConfig() { this.addCompiler(dirs => new File(this, 'config', 'config/config.[env].js').watch(dirs)); }
  buildConfig() { this.addCompiler(dirs => new File(this, 'config', 'config/config.[env].js').build(dirs)); }
  
  watchError() { this.addCompiler(dirs => new File(this, 'error', 'app/error.js').watch(dirs)); }
  buildError() { this.addCompiler(dirs => new File(this, 'error', 'app/error.js').build(dirs)); }
  
  watchRouter() { this.addCompiler(dirs => new File(this, 'router', 'app/router.js').watch(dirs)); }
  buildRouter() { this.addCompiler(dirs => new File(this, 'router', 'app/router.js').build(dirs)); }
  
  watchPluginConfig() { this.addCompiler(dirs => new File(this, 'plugin_config', 'config/plugin.[env].js').watch(dirs)); }
  buildPluginConfig() { this.addCompiler(dirs => new File(this, 'plugin_config', 'config/plugin.[env].js').build(dirs)); }
  
  watchExtendApplication() { this.addCompiler(dirs => new File(this, 'extend_application', 'app/extend/application.js').watch(dirs)); }
  buildExtendApplication() { this.addCompiler(dirs => new File(this, 'extend_application', 'app/extend/application.js').build(dirs)); }
  
  watchExtendContext() { this.addCompiler(dirs => new File(this, 'extend_context', 'app/extend/context.js').watch(dirs)); }
  buildExtendContext() { this.addCompiler(dirs => new File(this, 'extend_context', 'app/extend/context.js').build(dirs)); }
  
  watchExtendRequest() { this.addCompiler(dirs => new File(this, 'extend_request', 'app/extend/request.js').watch(dirs)); }
  buildExtendRequest() { this.addCompiler(dirs => new File(this, 'extend_request', 'app/extend/request.js').build(dirs)); }
  
  watchExtendResponse() { this.addCompiler(dirs => new File(this, 'extend_response', 'app/extend/response.js').watch(dirs)); }
  buildExtendResponse() { this.addCompiler(dirs => new File(this, 'extend_response', 'app/extend/response.js').build(dirs)); }
  
  watchWebStore() { this.addCompiler(dirs => new WebStore(this, 'webstore', 'app/webstore').watch(dirs)); }
  buildWebStore() { this.addCompiler(dirs => new WebStore(this, 'webstore', 'app/webstore').build(dirs)); }
  
  // watchWebView() { this.addCompiler(dirs => new Common(this, 'webview', 'app/webview', { rules: [/\.vue$/i] }).watch(dirs)); }
  // buildWebView() { this.addCompiler(dirs => new Common(this, 'webview', 'app/webview', { match: ['**/*.vue'] }).build(dirs)); }
  watchWebView() { this.addCompiler(dirs => new WebView(this, 'webview', 'app/webview', { rules: [/\.vue$/i] }).watch(dirs)); }
  buildWebView() { this.addCompiler(dirs => new WebView(this, 'webview', 'app/webview', { match: ['**/*.vue'] }).build(dirs)); }
  
  loadPlugins() {
    const plugin = new Plugin(this, 'config/plugin.json');
    plugin.parse();
  }
  
  watch() {
    this.watchWebView();
    this.watchComponents();
    this.watchController();
    this.watchMiddleware();
    this.watchService();
    this.watchWebStore();
    this.watchExtendApplication();
    this.watchExtendContext();
    this.watchExtendRequest();
    this.watchExtendResponse();
    this.watchRouter();
    this.watchError();
    this.watchConfig();
    this.watchPluginConfig();
    this.loadPlugins();
    this.compile();
    this.make();
  }
  
  build() {
    this.buildWebView();
    this.buildComponents();
    this.buildController();
    this.buildMiddleware();
    this.buildService();
    this.buildWebStore();
    this.buildExtendApplication();
    this.buildExtendContext();
    this.buildExtendRequest();
    this.buildExtendResponse();
    this.buildRouter();
    this.buildError();
    this.buildConfig();
    this.buildPluginConfig();
    this.loadPlugins();
    this.compile();
    this.makeSync();
  }
  
  apply(compiler) {
    this.env = compiler.options.mode;
    if (compiler.options.mode === 'development') {
      compiler.plugin('afterPlugins', () => this.watch());
      compiler.plugin('watchClose', () => this.stop());
    } else {
      compiler.plugin('afterPlugins', () => this.build());
    }
  }
};