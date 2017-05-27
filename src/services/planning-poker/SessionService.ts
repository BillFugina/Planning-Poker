import { IApiService, INotificationService, IStateService } from 'services/planning-poker';
import { DI } from 'dependency-injection'
import { ISessionService, ISimpleService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { Round, IParticipant, ISession, ISessionId, RoundState, IGuid, ICard } from 'model'
import { ISessionStorageService } from "services/storage"
import * as toastr from 'toastr'
import * as moment from 'moment'

@inject(DI.ISessionStorageService, DI.IApiService, DI.INotificationService, DI.IStateService)
export class SessionService implements ISessionService {
    constructor(
        private SessionStorageService: ISessionStorageService,
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
            this.updateRound()
        }
    }

    private roundStarted = () => {
        toastr.warning(`Countdown Started`, 'Round Ending', { closeButton: true, progressBar: true, timeOut: 8500 })
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
        if (this.stateService.session == null || this.stateService.session.Id === '') {
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
        return this.SessionStorageService.get<IGuid>('SessionID')
    }

    private putSessionIdIntoStorage(sessionId: IGuid) {
        this.SessionStorageService.set('SessionID', this.stateService.session.Id)
    }

    private removeSessionIdFromStorage() {
        this.SessionStorageService.remove('SessionID');
    }

    private getParticipantFromStorage(): IParticipant {
        return this.SessionStorageService.get<IParticipant>('Participant')
    }

    private putParticipantIntoStorage(sessionId: IParticipant) {
        this.SessionStorageService.set('Participant', this.stateService.participant)
    }

    private removeParticipantFromStorage() {
        this.SessionStorageService.remove('Participant');
    }

    async joinSession(sessionName: string, participantName: string): Promise<ISession> {
        try {
            var result = await this.apiService.JoinSession(sessionName, participantName)
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
            this.stateService.isInActiveRound = false
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

    async endSession(sessionId: IGuid): Promise<void>{
        try {
            var result = await this.apiService.EndSession(sessionId)
        }
        catch (error) {
            toastr.error(`Error ending session: ${error}`)
        }
    }

}