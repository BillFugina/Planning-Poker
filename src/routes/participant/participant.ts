import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant, RoundState } from 'model'
import { ISessionService, IApiService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import * as toastr from 'toastr'

@inject(DI.ISessionService)
export class Participant {

    constructor(
        private session: ISessionService
    ) {

    }


    get round(){
        return this.session.CurrentRound
    }
    get inRound() {
        return this.session.CurrentRound.State == RoundState.Pending || this.session.CurrentRound.State == RoundState.Started
    }

    get showTimer() {
        return this.session.CurrentRound.State == RoundState.Started
    }


}