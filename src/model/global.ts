// These are global type aliases ... Do NOT add any import/export statements to this file

type IEntityId = number
type IGuid = string
type IJson = string
type IHash<TValue> = { [key: string]: TValue }
type IDateTime = string

enum ParticipantRole { 
    Observer= 0,
    Voter= 1,
    Master= 2,
}

enum RoundState { 
    Null= 0,
    Pending= 1,
    Started= 2,
    Complete= 3,
}