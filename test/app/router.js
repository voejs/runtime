export default app => {
  const router = app.router;
  
  router.get('/', 'index.hello');
  router.get('/404', 'index.notFound');
  router.get('/500', 'index.error');
  
  router.get('/animate/list', 'animate.list');
  
  router.webview('/douban', 'douban');
  router.get('/douban', 'douban.index');
  router.get('/douban/play/:id(\\d+)', 'douban.play');
}