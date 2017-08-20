import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant, RoundState, IGuid } from 'model'
import { ISessionService, IApiService, IStateService, ISanitizerService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import { Settings } from 'environment'
import * as toastr from 'toastr'

@inject(DI.ISessionService, DI.IStateService, DI.ISanitizerService)
export class Master {
    master: string

    constructor(
        private session: ISessionService,
        private state: IStateService,
        private sanitizerService: ISanitizerService
    ) {
    }

    get autoReveal() {
        return this.state.session.AutoReveal;
    }

    set autoReveal(newValue: boolean) {
        this.state.session.AutoReveal = newValue;
    }
    
    get qrCode(){
        return `${Settings.serverUrl}${Settings.apiPath}/sessions/${this.state.session.Name}/qrcode`
    }

    get sessionUrl() : string {
        return `${Settings.clientUrl}/#/join/${this.sanitizerService.LettersAndDigits(this.state.session.Name)}`
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

    endSession(){
        this.session.endSession(this.state.session.Id)
    }

    removeParticipant(participantId: IGuid){
        this.session.removeParticipant(this.state.session.Id, participantId)
    }
}