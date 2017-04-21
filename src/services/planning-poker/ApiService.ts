import { DI } from 'dependency-injection'
import { ISessionService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { IApiService } from 'services/planning-poker'
import { ISession, ISessionApplication, IParticipantApplication, Round, IGuid, IParticipant, ParticipantRole } from 'model'
import { HttpClient, json } from 'aurelia-fetch-client'

export class ApiService implements IApiService {
    private client: HttpClient

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

    async StartSession(sessionName: string, masterName: string): Promise<ISession> {
        var sessionApplication: ISessionApplication = {
            MasterName: masterName,
            SessionName: sessionName
        }

        var response = await this.client.fetch(`sessions`, {
            method: 'post',
            body: json(sessionApplication)
        })

        var session: ISession = await response.json()
        return session
    }

    async GetSession(sessionId: IGuid): Promise<ISession> {

        var response = await this.client.fetch(`sessions/${sessionId}`, {
            method: 'get'
        })

        var session: ISession = await response.json()
        return session
    }

    async CheckSession(sessionId: IGuid): Promise<ISession> {
        try {
            var response = await this.client.fetch(`sessions/${sessionId}`, {
                method: 'get'
            })
            var session: ISession = await response.json()
            return session
        }
        catch (error) {
            return undefined
        }
    }

    async JoinSession(sessionName: string, participantName: string): Promise<ISession> {
        var participantApplication: IParticipantApplication = {
            Name: participantName,
            Role: ParticipantRole.Voter
        }

        try {
            var response = await this.client.fetch(`sessions/${sessionName}/participants`, {
                method: 'post',
                body: json(participantApplication)
            })

            var session: ISession = await response.json()
            return session
        }
        catch (error) {
            return undefined
        }
    }

    async PrepareRound(sessionId: IGuid): Promise<Round>{
        try {
            var response = await this.client.fetch(`sessions/${sessionId}/rounds`, {
                method: 'get'
            })

            var round = await response.json()
            var result = new Round(round);
            return result
        }
        catch (error){
            return undefined
        }
    }

    async EndRound(sessionId: IGuid, roundId : number): Promise<void>{
        try {
            var response = await this.client.fetch(`sessions/${sessionId}/rounds/${roundId}`, {
                method: 'delete'
            })
        }
        catch (error){
            return undefined
        }
    }

}