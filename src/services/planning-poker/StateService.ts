import { IParticipant, Round, ISession, ICard } from 'model'
import { IStateService } from "services/planning-poker";

const blankSession: ISession = {
    CurrentRound: new Round(),
    Id: '',
    Master: {
        Id: '',
        Name: '',
        Role: 0,
        Voted: false
    },
    Participants: [],
    Cards: [],
    Name: ''
}

export class StateService implements IStateService {
    session: ISession
    participant: IParticipant
    chosen: ICard

    constructor() {
        this.session = blankSession;
    }

    get roundAverage() : number {
        let result = 0
        if (this.session.CurrentRound){
            let average = this.session.CurrentRound.Average
            let smallestDiff = 1000
            this.session.Cards.map(c => {
                let diff = Math.abs(c.Value - average)
                if (diff < smallestDiff){
                    result = c.Value
                    smallestDiff = diff
                }
            })
        }
        return result
    }

    setSession(newSession: ISession) {
        newSession.CurrentRound = new Round(newSession.CurrentRound)
        this.session = newSession
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
}