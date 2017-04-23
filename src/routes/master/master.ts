import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant, RoundState } from 'model'
import { ISessionService, IApiService, IStateService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import * as toastr from 'toastr'

@inject(DI.ISessionService, DI.IStateService)
export class Master {
    master: string

    constructor(
        private session: ISessionService,
        private state: IStateService
    ) {
    }

    get roundAverage() {
        return this.state.roundAverage
    }

    get enablePrepare() {
        return this.session.CurrentRound.State != RoundState.Pending
    }

    get enableStart() {
        return this.session.CurrentRound.State == RoundState.Pending
    }

    get enableEnd() {
        return this.session.CurrentRound.State == RoundState.Pending || this.session.CurrentRound.State == RoundState.Started
    }

    get inRound() {
        return this.session.CurrentRound.State == RoundState.Pending || this.session.CurrentRound.State == RoundState.Started
    }

    get showAverage(): boolean {
        return this.session.CurrentRound.State == RoundState.Complete
    }

    get showVotes(): boolean {
        return this.session.CurrentRound.State == RoundState.Complete
    }

    get showCards(): boolean {
        return this.session.CurrentRound.State == RoundState.Pending 
        || this.session.CurrentRound.State == RoundState.Started 
        || this.session.CurrentRound.State == RoundState.Complete
    }

    prepareRound(){
        var roundId = this.session.prepareRound(this.session.Id)
    }

    startCountdown(){
        this.session.startCountdown(this.session.Id, this.session.CurrentRound.Id)
    }

    endRound(){
        this.session.endRound(this.session.Id, this.session.CurrentRound.Id)
    }

    participantVote(participant: IParticipant){
        var vote = this.session.CurrentRound.Votes.find(v => v.Participant.Id == participant.Id)
        var result = vote ? vote.Value : '-'
        return result
    }
}