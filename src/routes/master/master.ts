import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant, RoundState } from 'model'
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

    get enablePrepare() {
        return this.session.CurrentRound.State != RoundState.Pending
    }

    get enableStart() {
        return this.session.CurrentRound.State == RoundState.Pending
    }

    prepareRound(){
        var roundId = this.session.prepareRound(this.session.Id);
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