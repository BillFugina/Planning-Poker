import {ISessionId} from 'model'
import {HttpClient} from 'aurelia-fetch-client'

export interface ISessionService {
    StartSession(sessionName: string, masterName: string) : Promise<ISessionId> 
}

export class SessionService {

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
        
        var response = await this.client.fetch(`startup/sessions/${sessionName}/${masterName}`, {
            method: 'post'
        })

        var sessionId : ISessionId = await response.json()
        return sessionId
    }

}