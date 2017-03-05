export class App {
  router: any;
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Planning Poker';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'routes/home/index' }
    ]);
  }

}
