import {IGuid} from 'model'

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
    Id: string
    Name: string
    Master: IParticipant
    Participants: IParticipant[]
    CurrentRound: IRound
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
}

export interface IVote { 
    Participant: IParticipant
    Value: number
}

export interface IVoteBallot { 
    ParticipantName: string
    Value: number
}
