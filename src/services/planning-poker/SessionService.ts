import { IApiService, INotificationService, IStateService } from 'services/planning-poker';
import { DI } from 'dependency-injection'
import { ISessionService, ISimpleService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { Round, IParticipant, ISession, ISessionId, RoundState, IGuid, ICard } from 'model'
import { ILocalStorageService } from "services/storage"
import * as toastr from 'toastr'
import * as moment from 'moment'

@inject('ILocalStorageService', 'IApiService', 'INotificationService', 'IStateService')
export class SessionService implements ISessionService {

    constructor(
        private localStorageService: ILocalStorageService,
        private apiService: IApiService,
        private notificationService: INotificationService,
        private stateService: IStateService
    ) {
        notificationService.subscribeRoundChange(this.roundChanged)
    }
    get Id(): IGuid { return this.stateService.session.Id }
    get Name(): string { return this.stateService.session.Name }
    get Master(): IParticipant { return this.stateService.session.Master }
    get Participants(): IParticipant[] { return this.stateService.session.Participants }
    get CurrentRound(): Round { return this.stateService.session.CurrentRound }

    get CurrentAverage(): number {
        return this.stateService.session.CurrentRound.Average
    }

    Rounds: Round[] = [];
    Cards: ICard[];
    isInActiveRound: boolean
    timeRemaining: number

    roundChanged = (round: Round) => {
        if (round.Id == this.stateService.session.CurrentRound.Id) {
            const round = this.stateService.session.CurrentRound;
            switch (round.State) {
                case RoundState.Complete:
                    this.roundClosed()
                    break;
                case RoundState.Started:
                    this.roundStarted()
                    break;
            }
        }
    }

    private roundClosed = () => {
        const round = this.stateService.session.CurrentRound

        if (!this.Rounds.some(x => x.Id == round.Id)) {
            toastr.error(`Round Over`, 'Round Closed', { closeButton: true, progressBar: true })
            this.stateService.session.CurrentRound.State = RoundState.Complete
            this.Rounds.push(this.CurrentRound)
            this.Rounds.sort((a, b) => {
                return b.Id - a.Id
            })
            this.updateRound()
        }
    }

    private roundStarted = () => {
        toastr.warning(`Countdown Started`, 'Round Ending', { closeButton: true, progressBar: true })
        this.updateRound()
    }

    updateRound = () => {
        if (this.CurrentRound.State == RoundState.Started) {
            const now = new Date().getTime()
            const end = moment(this.CurrentRound.End).toDate().getTime()
            const diff = end - now

            this.timeRemaining = Math.floor(diff / 1000);

            if (diff < 1000) {
                this.CurrentRound.State = RoundState.Complete
                this.endRound(this.stateService.session.Id, this.CurrentRound.Id);
                this.isInActiveRound = false;
            }

            if (this.CurrentRound.State == RoundState.Started) {
                this.isInActiveRound = true;
                setTimeout(this.updateRound, 500);
            }
        }
    }

    public async refresh(): Promise<boolean> {
        if (this.stateService.session.Id === '') {
            var id = this.getSessionIdFromStorage();
            if (id) {
                try {
                    var session = await this.apiService.CheckSession(id)
                    if (session) {
                        this.updateSession(session)
                        this.notificationService.joinSession(session.Name)
                    }
                    else {
                        toastr.info(`Previous session has ended.`)
                        this.removeSessionIdFromStorage();
                    }
                }
                catch (error) {
                    toastr.warning(`Could not continue last session.`)
                    this.removeSessionIdFromStorage();
                }
            }
        }
        var result = !!(this.stateService.session && this.stateService.session.Id != '')

        return result;
    }

    updateSession(newSession: ISession) {
        this.stateService.setSession(newSession)
        this.putSessionIdIntoStorage(this.stateService.session.Id)
        this.updateRound();
    }
    async startSession(session: string, master: string): Promise<ISession> {
        try {
            var result = await this.apiService.StartSession(session, master)
            toastr.info(`Session: ${result.Name}`, 'Session Started', { closeButton: true, progressBar: true })
            this.updateSession(result)
            this.notificationService.joinSession(session)
            return result
        }
        catch (error) {
            toastr.error(`Error starting session.`)
            this.removeSessionIdFromStorage();
        }
    }

    async getSession(sessionId: IGuid): Promise<ISession> {
        try {
            var result = await this.apiService.GetSession(sessionId);
            this.updateSession(result)
            return result
        }
        catch (error) {
            toastr.error(`Error getting session.`)
        }
    }

    private getSessionIdFromStorage(): IGuid {
        return this.localStorageService.get<IGuid>('SessionID')
    }

    private putSessionIdIntoStorage(sessionId: IGuid) {
        this.localStorageService.set('SessionID', this.Id)
    }

    private removeSessionIdFromStorage() {
        this.localStorageService.remove('SessionID');
    }

    async joinSession(sessionName: string, participantName: string): Promise<ISession> {
        try {
            var result = await this.apiService.JoinSession(sessionName, participantName)
            toastr.info(`Session: ${result.Name}`, 'Joined Session', { closeButton: true, progressBar: true })
            this.updateSession(result)
            return result
        }
        catch (error) {
            toastr.error(`Error getting session.`)
        }
    }
    async prepareRound(sessionId: IGuid): Promise<Round> {
        try {
            var result = await this.apiService.PrepareRound(sessionId)
            toastr.info(`Preparing round: ${result}`, 'Round Ready', { closeButton: true, progressBar: true })
            this.stateService.session.CurrentRound = result
            this.updateRound()
            return result
        }
        catch (error) {
            toastr.error(`Error preparing round.`)
        }
    }

    async startCountdown(sessionId: string, roundId: number): Promise<Round> {
        try {
            var result = await this.apiService.StartCountdown(sessionId, roundId)
            return result
        }
        catch (error) {
            toastr.error(`Error ending round.`)
        }
    }


    async endRound(sessionId: IGuid, roundId: number): Promise<void> {
        try {
            var result = await this.apiService.EndRound(sessionId, roundId)
        }
        catch (error) {
            toastr.error(`Error ending round.`)
        }
    }

}