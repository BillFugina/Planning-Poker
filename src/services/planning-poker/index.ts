import { Observable, EventHandler, Subscription, SubscriptionToken } from 'services/util/observable'
import { ISession, ISessionId, Round, IGuid } from 'model';
export interface IApiService {
    StartSession(sessionName: string, masterName: string): Promise<ISession>
    GetSession(sessionId: IGuid): Promise<ISession>
    CheckSession(sessionId: IGuid): Promise<ISession>
    JoinSession(sessionName: string, participantName: string): Promise<ISession>
    PrepareRound(sessionId: IGuid): Promise<Round>
    EndRound(sessionId: IGuid, roundId : number): Promise<void>
    StartCountdown(sessionId: IGuid, roundId : number): Promise<Round>
}


export interface ISessionService extends ISession {
    refresh(): Promise<boolean>
    updateSession(newSession: ISession)
    startSession(session: string, master: string): Promise<ISession>
    getSession(sessionId: IGuid): Promise<ISession>
    joinSession(sessionName: string, participantName: string): Promise<ISession>
    prepareRound(sessionId: IGuid): Promise<Round>
    startCountdown(sessionId: IGuid, roundId : number) : Promise<Round>
    endRound(sessionId: IGuid, roundId : number): Promise<void>
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
    subscribeRoundChange(handler: EventHandler<Round>)
    unsubscribeRoundChange(token : SubscriptionToken<Round>)
}

export interface IStateService {
    session : ISession
    setSession(session: ISession)
}