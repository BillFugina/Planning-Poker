import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import { Router, RouterConfiguration } from 'aurelia-router'
import { ILocalStorageService } from "services/storage";

@inject(DI.ILocalStorageService)
export class App {
  router: Router;

  constructor(private localStorageService: ILocalStorageService) {
    
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.title = 'Planning Poker';
    config.map([
      { 
        route: ['', 'home'], 
        name: 'home', 
        moduleId: 'routes/home/home' 
      },
      {
        route: ['master'],
        name: 'master',
        moduleId: 'routes/master/master'
      }
    ]);
  }

}
