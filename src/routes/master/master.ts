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
        return this.state.roundAverageDisplay
    }

    get enablePrepare() {
        return this.state.session.CurrentRound.State != RoundState.Pending
    }

    get enableStart() {
        return this.state.session.CurrentRound.State == RoundState.Pending
    }

    get enableEnd() {
        return this.state.session.CurrentRound.State == RoundState.Pending || this.state.session.CurrentRound.State == RoundState.Started
    }

    get inRound() {
        return this.state.session.CurrentRound.State == RoundState.Pending || this.state.session.CurrentRound.State == RoundState.Started
    }

    get showTimer() {
        return this.state.session.CurrentRound.State == RoundState.Started
    }

    get roundState() {
        return RoundState[this.state.session.CurrentRound.State]
    }

    get showAverage(): boolean {
        return this.state.session.CurrentRound.State == RoundState.Complete
    }

    get showVotes(): boolean {
        return this.state.session.CurrentRound.State == RoundState.Complete
    }

    get showCards(): boolean {
        return this.state.session.CurrentRound.State == RoundState.Pending 
        || this.state.session.CurrentRound.State == RoundState.Started 
        || this.state.session.CurrentRound.State == RoundState.Complete
    }

    prepareRound(){
        var roundId = this.session.prepareRound(this.state.session.Id)
    }

    startCountdown(){
        this.session.startCountdown(this.state.session.Id, this.state.session.CurrentRound.Id)
    }

    endRound(){
        this.session.endRound(this.state.session.Id, this.state.session.CurrentRound.Id)
    }

    participantVote(participant: IParticipant){
        var vote = this.state.session.CurrentRound.Votes.find(v => v.Participant.Id == participant.Id)
        var result = vote ? vote.Value : '-'
        return result
    }
}