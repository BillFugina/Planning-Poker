import { inject } from 'aurelia-framework'
import * as toastr from 'toastr';
import * as pusher from 'pusher-js'
import { INotificationService, IStateService } from "services/planning-poker";
import { IParticipant, IVote, IRound } from "model"

@inject( 'IStateService' )
export class NotificationService implements INotificationService {

    private _pusher: pusher.Pusher
    private _channel: pusher.Channel

    constructor(private stateService : IStateService) {
        this._pusher = new pusher('dbb03672c21dbc11baf5')
    }

    joinSession(sessionName: string) {
        const self = this;
        this._channel = this._pusher.subscribe(sessionName)
        this._channel.bind('RegisterVote', this.registerVote)
        this._channel.bind('RegisterParticipant', this.registerParticipant)
        this._channel.bind('StartRound', this.startRound)
    }

    leaveSession() {
        this._channel.unbind_all();
        this._pusher.unsubscribe(this._channel.name)
    }

    registerVote = (data: IVote) => {
        toastr.success(`Vote`)
        this.stateService.session.CurrentRound.Votes.push(data)
    }

    registerParticipant =  (data : IParticipant) => {
        toastr.success(`Participant`)
        this.stateService.session.Participants.push(data)
    }

    startRound = (data: IRound) => {
        toastr.success('Round Started');
        this.stateService.session.CurrentRound = data
    }
}