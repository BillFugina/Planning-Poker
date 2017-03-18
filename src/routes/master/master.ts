import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import { ISessionService } from 'services/SessionService'
import * as toastr from 'toastr'

@inject(DI.ISessionService)
export class Master {
    session: string
    master: string

    constructor(
        private sessionService: ISessionService
    ) {
    }

    async startSession() {
        try {
            var result = await this.sessionService.StartSession(this.session, this.master);
            toastr.info(`Session: ${result.Id}`, 'Session Started', { closeButton: true, progressBar: true })
        }
        catch (error) {
            toastr.error(`Error starting session.`)
        }
    }
}