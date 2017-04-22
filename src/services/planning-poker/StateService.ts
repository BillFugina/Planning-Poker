import { IParticipant, Round, ISession } from 'model'
import { IStateService } from "services/planning-poker";

const blankSession: ISession = {
    CurrentRound: new Round(),
    Id: '',
    Master: {
        Id: '',
        Name: '',
        Role: 0
    },
    Participants: [],
    Cards: [],
    Name: ''
}

export class StateService implements IStateService {
    session: ISession

    constructor(){
        this.session = blankSession;
    }

    setSession(newSession: ISession) {
        newSession.CurrentRound = new Round(newSession.CurrentRound)
        this.session = newSession
    }
}