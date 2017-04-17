import { IParticipant, IRound, ISession } from 'model'
import { IStateService } from "services/planning-poker";

const blankSession: ISession = {
    CurrentRound: {
        Id: 0,
        State: 0,
        Votes: [],
    },
    Id: '',
    Master: {
        Id: '',
        Name: '',
        Role: 0
    },
    Participants: [],
    Name: ''
}

export class StateService implements IStateService {
    session: ISession

    constructor(){
        this.session = blankSession;
    }

    setSession(newSession: ISession) {
        this.session = { ...blankSession, ...newSession }
    }
}