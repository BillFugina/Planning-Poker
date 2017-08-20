import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import * as toastr from 'toastr';
import * as pusher from 'pusher-js'
import { INotificationService, IStateService, ISanitizerService } from "services/planning-poker";
import { ISessionStorageService } from 'services/storage'
import { IParticipant, IVote, IRound, Round, RoundState, IGuid, ParticipantRole } from 'model'
import { Observable, EventHandler, Subscription, SubscriptionToken } from 'services/util/observable'
import { DI } from 'dependency-injection'

@inject(Router, DI.IStateService, DI.ISessionStorageService, DI.ISanitizerService)
export class NotificationService implements INotificationService {

    private _pusher: pusher.Pusher
    private _channel: pusher.Channel

    private _observableRound = new Observable<Round>();

    constructor(
        private router: Router,
        private stateService: IStateService,
        private sessionStorage: ISessionStorageService,
        private sanitizerService: ISanitizerService
    ) {
        this._pusher = new pusher('dbb03672c21dbc11baf5')
    }

    subscribeRoundChange(handler: EventHandler<Round>): Subscription<Round> {
        return this._observableRound.subscribe(handler);
    }

    unsubscribeRoundChange(token: SubscriptionToken<Round>) {
        this._observableRound.unsubscribe(token);
    }
    private onRoundChange(round: Round) {
        this._observableRound.notify(round, null);
    }

    joinSession(sessionName: string) {
        const self = this;
        this._channel = this._pusher.subscribe(this.sanitizerService.LettersAndDigits(sessionName))
        this._channel.bind('RegisterVote', this.registerVote)
        this._channel.bind('RegisterParticipant', this.registerParticipant)
        this._channel.bind('RemoveParticipant', this.removeParticipant)
        this._channel.bind('PrepareRound', this.prepareRound)
        this._channel.bind('StartCountdown', this.startCountdown)
        this._channel.bind('EndRound', this.endRound)
        this._channel.bind('EndSession', this.endSession)
        this.resetParticipantVotes();
    }

    leaveSession() {
        this._channel.unbind_all();
        this._pusher.unsubscribe(this._channel.name)
    }

    registerVote = (data: IVote) => {
        let card = this.stateService.session.Cards.find(c => c.Value == data.Value)
        if (card) {
            data.Display = card.Display
        }
        this.stateService.session.CurrentRound.addVote(data)
        this.participantVoted(data.Participant.Id, this.stateService.session.CurrentRound.Votes.some(v => v.Participant.Id === data.Participant.Id));
    }

    registerParticipant = (data: IParticipant) => {
        this.stateService.addParticipant(data);
    }

    removeParticipant = (participantId: IGuid) => {
        this.stateService.removeParticipant(participantId)
        if (this.stateService.participant.Id == participantId) {
            this.endSession(participantId);
        }
    }

    prepareRound = (data: IRound) => {
        toastr.success('Round Ready')
        const round = new Round(data)
        this.stateService.session.CurrentRound = round
        this.stateService.chosen = null;
        this.resetParticipantVotes();
        this.stateService.resetCards();
    }
    endRound = (roundId: number) => {
        if (this.stateService.session.CurrentRound.Id == roundId) {
            this.stateService.session.CurrentRound.State = RoundState.Complete
            this.stateService.showVotes()
            this.onRoundChange(this.stateService.session.CurrentRound)
        }
    }

    startCountdown = (data: IRound) => {
        const round = new Round(data)

        if (this.stateService.session.CurrentRound.Id != round.Id) {
            throw "Round mismatch."
        }

        round.State = RoundState.Started
        this.stateService.session.CurrentRound = round
        this.onRoundChange(this.stateService.session.CurrentRound)
    }

    endSession = (data: string) => {
        this.leaveSession()
        this.stateService.clear()
        this.sessionStorage.remove("SessionID")
        this.sessionStorage.remove("Participant")
        this.router.navigateToRoute('home')
    }

    participantVoted(participantId: IGuid, value: boolean) {
        const participant = this.stateService.session.Participants.find(p => p.Id == participantId);
        if (participant) {
            participant.Voted = value;
        }
        if (this.stateService.session.AutoReveal) {
            const voters = this.stateService.session.Participants.filter(x => x.Role === ParticipantRole.Voter);
            if (voters.every(x => x.Role === ParticipantRole.Voter && x.Voted)) {
                this.endRound(this.stateService.session.CurrentRound.Id)
            }
        }
    }

    resetParticipantVotes() {
        this.stateService.session.Participants.map(p => {
            this.participantVoted(p.Id, this.stateService.session.CurrentRound.Votes.some(v => v.Participant.Id === p.Id));
        })
    }

}