export type IEntityId = number
export type IGuid = string
export type IJson = string
export type IHash<TValue> = { [key: string]: TValue }
export type IDateTime = string


export enum ParticipantRole { 
    Observer= 0,
    Voter= 1,
    Master= 2,
}
export enum RoundState { 
    Null= 0,
    Pending= 1,
    Started= 2,
    Complete= 3,
}
export interface IParticipant { 
    Id: string
    Name: string
    Role: ParticipantRole
}

export interface IParticipantApplication { 
    Name: string
    Role: ParticipantRole
}

export interface ISession { 
    Id: IGuid
    Name: string
    Master: IParticipant
    Participants: IParticipant[]
    CurrentRound: Round
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
    Average : number
}

export class Round implements IRound {
    Id: number = 0;
    State: RoundState = RoundState.Null;
    Votes: IVote[] = [];
    End: Date = new Date();

    get Average() : number {
        var result = 0;
        if (this.Votes && this.Votes.length > 0){
        let sum = this.Votes.reduce<number>((total, current) =>  {return total + current.Value }, 0 )
        result = Math.round(sum / this.Votes.length)
        }
        return result
    }

    constructor(round? : IRound){
        if (round){
            Object.assign(this, round);
        }
    }

    addVote(vote : IVote){
        const existingVoteIndex = this.Votes.findIndex(v => v.Participant.Id == vote.Participant.Id);
        if (existingVoteIndex >= 0) {
            this.Votes.splice(existingVoteIndex, 1)
        }
        this.Votes.push(vote)
    }
}

export interface IVote { 
    Participant: IParticipant
    Value: number
}

export interface IVoteBallot { 
    ParticipantName: string
    Value: number
}
