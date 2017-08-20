export type IEntityId = number
export type IGuid = string
export type IJson = string
export type IHash<TValue> = { [key: string]: TValue }
export type IDateTime = string

export interface ISettings {
    name: string;
    clientUrl: string;
    serverUrl: string;
    apiPath: string;
}
export enum ParticipantRole {
    Observer = 0,
    Voter = 1,
    Master = 2,
}
export enum RoundState {
    Null = 0,
    Pending = 1,
    Started = 2,
    Complete = 3,
}
export interface IParticipant {
    Id: string
    Name: string
    Role: ParticipantRole
    Voted: boolean
}

export interface IParticipantApplication {
    Name: string
    Role: ParticipantRole
}

export class Session implements ISession {
    Id: IGuid
    Name: string
    Master: IParticipant
    AutoReveal: boolean
    Participants: IParticipant[]
    Cards: ICard[]
    Rounds: Round[]

    constructor(input?: ISession) {
        if (input) {
            this.Id = input.Id
            this.Name = input.Name
            this.Master = input.Master
            this.Participants = [...input.Participants]
            this.Cards = [...input.Cards]
            this.Rounds = [];
            input.Rounds.map(r => {
                let round = new Round(r);
                this.Rounds.push(round);
            })
        }
        else {
            this.Id = ''
            this.Name = ''
            this.Master = {
                Id: '',
                Name: '',
                Role: 0,
                Voted: false
            }

        }
    }

    get CurrentRound(): Round {
        let result = null
        if (this.Rounds && this.Rounds.length > 0) {
            result = this.Rounds[0]
        }
        else {
            result = new Round()
        }
        return result;
    }

    set CurrentRound(round: Round) {
        let existingRoundNdx = this.Rounds.findIndex(r => r.Id == round.Id)
        if (existingRoundNdx >= 0) {
            this.Rounds.splice(existingRoundNdx, 1)
        }
        this.Rounds.unshift(round);
    }
}

export interface ISession {
    Id: IGuid
    Name: string
    Master: IParticipant
    AutoReveal: boolean
    Participants: IParticipant[]
    Cards: ICard[]
    CurrentRound: Round
    Rounds: Round[]
}

export interface ISessionId {
    Id: string
    Name: string
}

export interface ISessionApplication {
    SessionName: string
    MasterName: string
}

export interface IRound {
    Id: number
    State: RoundState
    Votes: IVote[]
    End: Date
    Average: number
}

export class Round implements IRound {
    Id: number = 0;
    State: RoundState = RoundState.Null;
    Votes: IVote[] = [];
    End: Date = new Date();

    get Average(): number {
        var result = 0;
        if (this.Votes && this.Votes.length > 0) {
            let sum = this.Votes.reduce<number>((total, current) => { return total + current.Value }, 0)
            result = Math.round(sum / this.Votes.length)
        }
        return result
    }

    constructor(round?: IRound) {
        if (round) {
            Object.assign(this, round);
        }
    }

    addVote(vote: IVote) {
        const existingVoteIndex = this.Votes.findIndex(v => v.Participant.Id == vote.Participant.Id);
        if (existingVoteIndex >= 0) {
            this.Votes.splice(existingVoteIndex, 1)
        }
        if (vote.Value > 0) {
            this.Votes.push(vote)
        }
    }
}

export interface IVote {
    Participant: IParticipant
    Value: number
    Show: boolean
    Display: string
}

export interface IVoteBallot {
    ParticipantName: string
    Value: number
}


export interface ICard {
    Display: string
    Value: number
    Chosen: boolean
}
