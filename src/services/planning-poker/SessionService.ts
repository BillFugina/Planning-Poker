import { IApiService } from 'services/planning-poker';
import { DI } from 'dependency-injection'
import { ISessionService, ISimpleService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { IGuid, IRound, IParticipant, ISession, ISessionId } from 'model'
import { ILocalStorageService } from "services/storage"
import * as toastr from 'toastr'

@inject('ILocalStorageService', 'IApiService')
export class SessionService implements ISessionService {
    private _session: ISession

    constructor(
        private localStorageService: ILocalStorageService,
        private apiService: IApiService
    ) {
        toastr.info('SessionService created')
    }
    get Id(): IGuid { return this._session.Id }
    get Name(): string { return this._session.Name }
    get Master(): IParticipant { return this._session.Master }
    get Participants(): IParticipant[] { return this._session.Participants }
    get CurrentRound(): IRound { return this._session.CurrentRound }

    public async refresh(): Promise<boolean> {
        if (!this._session){
            var id = this.getSessionIdFromStorage();
            if (id){
                var session = await this.apiService.CheckSession(id)
                if (session){
                    this.update(session)
                }
            }
        }
        var result = !!this._session
        return result;
    }

    update(newSession: ISession) {
        this._session = newSession;
        this.putSessionIdIntoStorage(this._session.Id)
    }
    async startSession(session: string, master: string): Promise<ISession> {
        try {
            var result = await this.apiService.StartSession(session, master);
            toastr.info(`Session: ${result.Name}`, 'Session Started', { closeButton: true, progressBar: true })
            this.update(result)
            return result
        }
        catch (error) {
            toastr.error(`Error starting session.`)
        }
    }

    async getSession(sessionId: IGuid): Promise<ISession>{
        try {
            var result = await this.apiService.GetSession(sessionId);
            this.update(result)
            return result
        }
        catch (error) {
            toastr.error(`Error getting session.`)
        }
    }

    private getSessionIdFromStorage(): IGuid {
        return this.localStorageService.get<IGuid>('SessionID')
    }

    private putSessionIdIntoStorage(sessionId: IGuid){
        this.localStorageService.set('SessionID', this.Id)
    }
}