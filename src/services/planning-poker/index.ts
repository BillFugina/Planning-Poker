import {IGuid, ISession, ISessionId} from 'model';
export interface IApiService {
    StartSession(sessionName: string, masterName: string) : Promise<ISession> 
    GetSession(sessionId: IGuid) : Promise<ISession>
    CheckSession(sessionId: IGuid) : Promise<ISession>
}


export interface ISessionService extends ISession {
    refresh(): Promise<boolean>
    update(newSession: ISession)
    startSession(session: string, master: string): Promise<ISession> 
    getSession(sessionId: IGuid) : Promise<ISession>
}

export interface ISimpleService {
    HelloWorld() : string
}