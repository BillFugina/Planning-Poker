import { ISession, ISessionId } from 'model';
export interface IApiService {
    StartSession(sessionName: string, masterName: string): Promise<ISession>
    GetSession(sessionId: IGuid): Promise<ISession>
    CheckSession(sessionId: IGuid): Promise<ISession>
    JoinSession(sessionName: string, participantName: string): Promise<ISession>
    StartRound(sessionId: IGuid): Promise<number>
}


export interface ISessionService extends ISession {
    refresh(): Promise<boolean>
    update(newSession: ISession)
    startSession(session: string, master: string): Promise<ISession>
    getSession(sessionId: IGuid): Promise<ISession>
    joinSession(sessionName: string, participantName: string): Promise<ISession>
    startRound(sessionId: IGuid): Promise<number>
}

export interface ISimpleService {
    HelloWorld(): string
}

export interface INotificationService {
    
}