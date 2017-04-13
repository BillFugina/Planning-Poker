import * as pusher from 'pusher-js'
import { INotificationService } from "services/planning-poker";

export class NotificationService implements INotificationService {

    private _pusher : pusher.Pusher
    private _channel : pusher.Channel

    constructor() {
        this._pusher = new pusher('dbb03672c21dbc11baf5');
    }

    joinSession(sessionName: string){
        this._channel = this._pusher.subscribe(sessionName);
        this._channel.bind('RegisterVote', data => {
            console.log('Register Vote')
        })
    }

    leaveSession(){
        this._channel.unbind_all();
        this._pusher.unsubscribe(this._channel.name);
    }
}