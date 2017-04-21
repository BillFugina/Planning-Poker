import { ISession, ISessionId, IRound } from 'model';
export interface IApiService {
    StartSession(sessionName: string, masterName: string): Promise<ISession>
    GetSession(sessionId: IGuid): Promise<ISession>
    CheckSession(sessionId: IGuid): Promise<ISession>
    JoinSession(sessionName: string, participantName: string): Promise<ISession>
    StartRound(sessionId: IGuid): Promise<IRound>
}


export interface ISessionService extends ISession {
    refresh(): Promise<boolean>
    updateSession(newSession: ISession)
    startSession(session: string, master: string): Promise<ISession>
    getSession(sessionId: IGuid): Promise<ISession>
    joinSession(sessionName: string, participantName: string): Promise<ISession>
    startRound(sessionId: IGuid): Promise<IRound>
    isInActiveRound : boolean
    timeRemaining : number
}

export interface ISimpleService {
    HelloWorld(): string
}

export interface INotificationService {
    joinSession(sessionName: string)
    registerVote (data)
    registerParticipant (data)
}

export interface IStateService {
    session : ISession
    setSession(session: ISession)
}