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
    End: Date
}

export interface IVote { 
    Participant: IParticipant
    Value: number
}

export interface IVoteBallot { 
    ParticipantName: string
    Value: number
}
