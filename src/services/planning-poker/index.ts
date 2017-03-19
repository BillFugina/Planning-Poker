import {ISession, ISessionId} from 'model/domain';
export interface IApiService {
    StartSession(sessionName: string, masterName: string) : Promise<ISessionId> 
}


export interface ISessionService extends ISession {
    update(newSession: ISessionId)
}
