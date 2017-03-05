import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import { ISessionService } from 'services/SessionService'

@inject(DI.ISessionService)
export class Home {
    session : string
    master: string

    constructor(
        private sessionService: ISessionService
    ) {
    }

    startSession(){
        this.sessionService.StartSession(this.session, this.master);
    }
}