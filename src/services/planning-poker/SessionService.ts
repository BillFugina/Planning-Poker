import { DI } from 'dependency-injection'
import { ISessionService, ISimpleService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { IRound, IParticipant } from 'model/domain'
import { ISession, ISessionId } from 'model'
import { ILocalStorageService } from "services/storage"

@inject(DI.ISimpleService)
export class SessionService implements ISessionService {
    private _session: ISession

    constructor(
        private simpleService: ISimpleService
    ) {
        
    }

    get Id(): string { return this._session.Id }
    get Name(): string { return  this._session.Name }

    get Master(): IParticipant { return this._session.Master }
    get Participants(): IParticipant[] { return this._session.Participants }
    get CurrentRound(): IRound {return this._session.CurrentRound }

    update(newSession: ISession){
        this._session = newSession;
    }
}