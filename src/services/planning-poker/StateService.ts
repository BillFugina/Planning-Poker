import { IParticipant, Round, ISession, ICard, IVote, Session } from 'model'
import { IStateService } from "services/planning-poker";

export class StateService implements IStateService {
    session: ISession
    participant: IParticipant
    chosen: ICard
    timeRemaining: number
    isInActiveRound: boolean

    constructor() {
        this.session = new Session();
    }

    get roundAverage(): number {
        let result = 0
        if (this.session.CurrentRound) {
            let average = this.session.CurrentRound.Average
            let smallestDiff = 1000
            this.session.Cards.map(c => {
                let diff = Math.abs(c.Value - average)
                if (diff < smallestDiff) {
                    result = c.Value
                    smallestDiff = diff
                }
            })
        }
        return result
    }

    get roundAverageDisplay(): string {
        let avg = this.roundAverage
        let card = this.session.Cards.find(c => c.Value == avg)
        let result = card ? card.Display : avg.toString()
        return result
    }

    setSession(newSession: ISession) {
        this.session = new Session(newSession)
        this.setVotesDisplay()
    }

    setParticipant(participant: IParticipant) {
        this.participant = participant
    }

    addParticipant(participant: IParticipant) {
        var existingParticipant = this.session.Participants.some(p => p.Id == participant.Id || p.Name == participant.Name);
        if (!existingParticipant) {
            this.session.Participants.push(participant);
        }
    }
    resetCards() {
        this.session.Cards.map(c => {
            c.Chosen = this.cardChosen(c.Value)
        });
    }

    cardChosen(value: number): boolean {
        const participantVote = this.session.CurrentRound.Votes.find(v => v.Participant.Id == this.participant.Id);
        const result = participantVote && value === participantVote.Value
        return result;
    }

    showVotes() {
        this.session.CurrentRound.Votes.map(v => {
            this.setVoteDisplay(v);
            v.Show = true
        })
    }

    setVotesDisplay() {
        if (this.session.CurrentRound) {
            this.session.CurrentRound.Votes.map(v => {
                this.setVoteDisplay(v);
            });
        }
    }

    setVoteDisplay(vote: IVote) {
        let card = this.session.Cards.find(c => c.Value == vote.Value)
        if (card) {
            vote.Display = card.Display
        }

    }

}