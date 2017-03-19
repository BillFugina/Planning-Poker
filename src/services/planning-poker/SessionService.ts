import { DI } from 'dependency-injection'
import { ISessionService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { IRound, IParticipant } from 'model/domain'
import { ISession, ISessionId } from 'model'
import { ILocalStorageService } from "services/storage"

@inject(DI.ILocalStorageService)
export class SessionService implements ISessionService {
    private _session: ISession

    constructor(
        private localStorageService: ILocalStorageService
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