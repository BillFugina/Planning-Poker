import {ISessionService} from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import { Router, RouterConfiguration, PipelineStep, NavigationInstruction, Next, RedirectToRoute } from 'aurelia-router'
import * as model from 'model'

@inject(DI.ISimpleService)
export class App {
  router: Router;
  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.title = 'Planning Poker';
    config.addPreActivateStep(PreActivateStep)
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
      },
      {
        route: ['participant'],
        name: 'participant',
        moduleId: 'routes/participant/participant'
      },
      {
        route: ['join/:session'],
        name: 'join',
        moduleId: 'routes/join/join'
      }
    ]);
  }

}

@inject(DI.ISessionService)
class PreActivateStep implements PipelineStep {
  
  constructor(private sessionService: ISessionService){
  }
  async run(instruction: NavigationInstruction, next: Next): Promise<any> {
    var haveSession = await this.sessionService.refresh()
    if (instruction.config.name !== 'home' && instruction.config.name !== 'join' && !haveSession){
      return next.cancel(new RedirectToRoute('home'))
    }
    return next()
  }

}
