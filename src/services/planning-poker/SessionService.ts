import { IApiService, INotificationService, IStateService } from 'services/planning-poker';
import { DI } from 'dependency-injection'
import { ISessionService, ISimpleService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { Round, IParticipant, ISession, ISessionId, RoundState, IGuid, ICard } from 'model'
import { ILocalStorageService, ISessionStorageService } from "services/storage"
import * as toastr from 'toastr'
import * as moment from 'moment'

@inject('ISessionStorageService', 'IApiService', 'INotificationService', 'IStateService')
export class SessionService implements ISessionService {
    constructor(
        private localStorageService: ISessionStorageService,
        private apiService: IApiService,
        private notificationService: INotificationService,
        private stateService: IStateService
    ) {
        notificationService.subscribeRoundChange(this.roundChanged)
    }
    roundChanged = (round: Round) => {
        if (round.Id == this.stateService.session.CurrentRound.Id) {
            const currentRound = this.stateService.session.CurrentRound;
            switch (currentRound.State) {
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

        if (!this.stateService.session.Rounds.some(x => x.Id == round.Id)) {
            toastr.error(`Round Over`, 'Round Closed', { closeButton: true, progressBar: true })
            this.updateRound()
        }
    }

    private roundStarted = () => {
        toastr.warning(`Countdown Started`, 'Round Ending', { closeButton: true, progressBar: true })
        this.updateRound()
    }

    updateRound = () => {
        if (this.stateService.session.CurrentRound.State == RoundState.Started) {
            const now = new Date().getTime()
            const end = moment(this.stateService.session.CurrentRound.End).toDate().getTime()
            const diff = end - now

            this.stateService.timeRemaining = Math.floor(diff / 1000);

            if (diff < 1000) {
                this.stateService.session.CurrentRound.State = RoundState.Complete
                this.endRound(this.stateService.session.Id, this.stateService.session.CurrentRound.Id);
                this.stateService.isInActiveRound = false;
            }

            if (this.stateService.session.CurrentRound.State == RoundState.Started) {
                this.stateService.isInActiveRound = true;
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

                try {
                    var participant = this.getParticipantFromStorage()
                    if (!participant) {
                        throw 'Participant not in local storage.'
                    }
                    this.stateService.setParticipant(participant)
                }
                catch (error) {
                    toastr.warning(`Could not restore participant.`)
                    this.removeParticipantFromStorage();
                }

            }
        }

        var result = !!(
            this.stateService.session
            && this.stateService.session.Id != ''
            && this.stateService.participant
            && this.stateService.participant.Id
        )

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
            this.stateService.setParticipant(result.Master)
            this.putParticipantIntoStorage(result.Master)
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
        this.localStorageService.set('SessionID', this.stateService.session.Id)
    }

    private removeSessionIdFromStorage() {
        this.localStorageService.remove('SessionID');
    }

    private getParticipantFromStorage(): IParticipant {
        return this.localStorageService.get<IParticipant>('Participant')
    }

    private putParticipantIntoStorage(sessionId: IParticipant) {
        this.localStorageService.set('Participant', this.stateService.participant)
    }

    private removeParticipantFromStorage() {
        this.localStorageService.remove('Participant');
    }

    async joinSession(sessionName: string, participantName: string): Promise<ISession> {
        try {
            var result = await this.apiService.JoinSession(sessionName, participantName)
            toastr.info(`Session: ${result.Name}`, 'Joined Session', { closeButton: true, progressBar: true })
            let participant = result.Participants.find(p => p.Name == participantName)
            this.stateService.setParticipant(participant)
            this.putParticipantIntoStorage(participant)
            this.updateSession(result)
            this.notificationService.joinSession(result.Name)
            return result
        }
        catch (error) {
            toastr.error(`Error getting session: ${error}`)
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
            toastr.error(`Error preparing round: ${error}`)
        }
    }

    async startCountdown(sessionId: string, roundId: number): Promise<Round> {
        try {
            var result = await this.apiService.StartCountdown(sessionId, roundId)
            return result
        }
        catch (error) {
            toastr.error(`Error ending round: ${error}`)
        }
    }
    async endRound(sessionId: IGuid, roundId: number): Promise<void> {
        try {
            var result = await this.apiService.EndRound(sessionId, roundId)
        }
        catch (error) {
            toastr.error(`Error ending round: ${error}`)
        }
    }
    async vote(sessionName: IGuid, roundId: number, participant: IParticipant, value: number): Promise<void> {
        try {
            var result = await this.apiService.Vote(sessionName, roundId, participant, value)
        }
        catch (error) {
            toastr.error(`Error submitting vote: ${error}`)
        }
    }

}