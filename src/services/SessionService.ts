import {ISession, ISessionId, ISessionApplication} from 'model'
import {HttpClient, json} from 'aurelia-fetch-client'

export interface ISessionService {
    StartSession(sessionName: string, masterName: string) : Promise<ISessionId> 
}

export class SessionService {

    private session: Partial<ISession>

    private client : HttpClient

    constructor() {       
        this.client = new HttpClient()

        this.client.configure(config => {
            config
            .withBaseUrl('http://localhost:9002/api/')
            .withDefaults({
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'Fetch'
                }
            })
        })
    }

    async StartSession(sessionName: string, masterName: string) : Promise<ISessionId> {
        var sessionApplication: ISessionApplication = {
            MasterName: masterName,
            SessionName: sessionName
        }
        
        var response = await this.client.fetch(`sessions`, {
            method: 'post',
            body: json(sessionApplication)
        })

        var sessionId : ISessionId = await response.json()
        return sessionId
    }

}