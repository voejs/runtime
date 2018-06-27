const Loader = require('../voe');
const loader = new Loader({
  cwd: __dirname,
  env: 'development'
});

loader.watch();

process.on('SIGINT', () => loader.stop());