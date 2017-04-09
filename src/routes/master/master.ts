import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession } from 'model'
import { ISessionService, IApiService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import * as toastr from 'toastr'

@inject(DI.ISessionService)
export class Master {
    session: ISession
    master: string

    constructor(
        private sessionService: ISessionService
    ) {
    }

    activate(params?: any, config?: RouteConfig, nav?: NavigationInstruction){
        this.session = this.sessionService
    }

    startRound(){
        var roundId = this.sessionService.startRound(this.session.Id);
    }
}