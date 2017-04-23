import { inject } from 'aurelia-framework'
import * as toastr from 'toastr';
import * as pusher from 'pusher-js'
import { INotificationService, IStateService } from "services/planning-poker";
import { IParticipant, IVote, IRound, Round, RoundState } from "model"
import { Observable, EventHandler, Subscription, SubscriptionToken } from 'services/util/observable'

@inject( 'IStateService' )
export class NotificationService implements INotificationService {

    private _pusher: pusher.Pusher
    private _channel: pusher.Channel

    private _observableRound = new Observable<Round>();

    constructor(private stateService : IStateService) {
        this._pusher = new pusher('dbb03672c21dbc11baf5')
    }

    subscribeRoundChange(handler: EventHandler<Round>) : Subscription<Round>{
        return this._observableRound.subscribe(handler);
    }

    unsubscribeRoundChange(token : SubscriptionToken<Round>){
        this._observableRound.unsubscribe(token);
    }
    private onRoundChange(round : Round){
        this._observableRound.notify(round, null);
    }

    joinSession(sessionName: string) {
        const self = this;
        this._channel = this._pusher.subscribe(sessionName)
        this._channel.bind('RegisterVote', this.registerVote)
        this._channel.bind('RegisterParticipant', this.registerParticipant)
        this._channel.bind('PrepareRound', this.prepareRound)
        this._channel.bind('StartCountdown', this.startCountdown)
        this._channel.bind('EndRound', this.endRound)
    }

    leaveSession() {
        this._channel.unbind_all();
        this._pusher.unsubscribe(this._channel.name)
    }

    registerVote = (data: IVote) => {
        toastr.success(`Vote`)
        this.stateService.session.CurrentRound.addVote(data)
    }

    registerParticipant =  (data : IParticipant) => {
        this.stateService.addParticipant(data);
    }

    prepareRound = (data: IRound) => {
        toastr.success('Round Ready')
        const round = new Round(data)
        this.stateService.session.CurrentRound = round
    }
    endRound = (roundId: number) => {
        if (this.stateService.session.CurrentRound.Id == roundId){
            this.stateService.session.CurrentRound.State = RoundState.Complete
            this.onRoundChange(this.stateService.session.CurrentRound)
        }
    }

    startCountdown = (data: IRound) => {
        const round = new Round(data)

        if (this.stateService.session.CurrentRound.Id != round.Id){
            throw "Round mismatch."
        }
        
        round.State = RoundState.Started
        this.stateService.session.CurrentRound = round
        this.onRoundChange(this.stateService.session.CurrentRound)
    }
}