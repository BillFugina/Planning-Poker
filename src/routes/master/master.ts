import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant } from 'model'
import { ISessionService, IApiService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import * as toastr from 'toastr'

@inject(DI.ISessionService)
export class Master {
    master: string

    constructor(
        private session: ISessionService
    ) {
    }
    activate(params?: any, config?: RouteConfig, nav?: NavigationInstruction){
    }

    startRound(){
        var roundId = this.session.startRound(this.session.Id);
    }

    endRound(){
        this.session.endRound(this.session.Id, this.session.CurrentRound.Id);
    }

    participantVote(participant: IParticipant){
        var vote = this.session.CurrentRound.Votes.find(v => v.Participant.Id == participant.Id);
        var result = vote ? vote.Value : '-'
        return result
    }
}