import { IGuid } from 'model';
import { ISessionService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import { Router, RouteConfig, RoutableComponentActivate, NavigationInstruction, IObservable } from 'aurelia-router'

@inject(DI.ISessionService, Router)
export class Join implements RoutableComponentActivate {
    session: string
    participant: string


    constructor(
        private sessionService: ISessionService,
        private router: Router
    ) {
    }

    activate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction): void | Promise<void> | PromiseLike<void> | IObservable {
        this.session = params.session
    }

    async joinSession() {
        await this.sessionService.joinSession(this.session, this.participant)
        this.router.navigateToRoute('participant')
    }

    get joinDisabled(): boolean {
        const result =  !(
            this.session 
            && this.session.length > 0 
            && this.participant 
            && this.participant.length > 0
            )
        return result;
    }

}