import { Observable, EventHandler, Subscription, SubscriptionToken } from 'services/util/observable'
import { ISession, ISessionId, ICard, Round, IGuid, IParticipant } from 'model';
export interface IApiService {
    StartSession(sessionName: string, masterName: string): Promise<ISession>
    GetSession(sessionId: IGuid): Promise<ISession>
    CheckSession(sessionId: IGuid): Promise<ISession>
    JoinSession(sessionName: string, participantName: string): Promise<ISession>
    PrepareRound(sessionId: IGuid): Promise<Round>
    EndRound(sessionId: IGuid, roundId : number): Promise<void>
    StartCountdown(sessionId: IGuid, roundId : number): Promise<Round>
    Vote(sessionName: string, roundId: number,  participant: IParticipant, value: number ): Promise<void>
    EndSession(sessionId: IGuid);
}


export interface ISessionService {
    refresh(): Promise<boolean>
    updateSession(newSession: ISession)
    startSession(session: string, master: string): Promise<ISession>
    getSession(sessionId: IGuid): Promise<ISession>
    joinSession(sessionName: string, participantName: string): Promise<ISession>
    prepareRound(sessionId: IGuid): Promise<Round>
    startCountdown(sessionId: IGuid, roundId : number) : Promise<Round>
    endRound(sessionId: IGuid, roundId : number): Promise<void>
    endSession(sessionId: IGuid): Promise<void>
    vote(sessionName: IGuid, roundId: number,  participant: IParticipant, value: number ): Promise<void>
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
    participant: IParticipant
    chosen: ICard
    roundAverage: number
    roundAverageDisplay: string
    timeRemaining: number
    isInActiveRound: boolean

    resetCards()
    showVotes()
    clear()
    cardChosen(value: number): boolean
    setSession(session: ISession)
    setParticipant(partipant: IParticipant)
    addParticipant(participant: IParticipant)
    getCardDisplay(value: number)
}

export interface IBrowserFeatureDetectionService {
    is_touch_device(): boolean
    hasHover(): boolean
}