import {IGuid} from 'model'

export interface ISession extends ISessionId {
    
}

export interface ISessionId {
    Id : IGuid;
    Name: string;
}