import { ISessionService, IApiService } from 'services/planning-poker';
import { DI } from 'dependency-injection'
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework'
import * as toastr from 'toastr'

@inject(DI.IApiService, Router)
export class Home {
    session: string
    master: string

    constructor(
        private apiService: IApiService,
        private router: Router
    ) {
    }

    async startSession() {
        try {
            var result = await this.apiService.StartSession(this.session, this.master);
            toastr.info(`Session: ${result.Name}`, 'Session Started', { closeButton: true, progressBar: true })
            //this.sessionService.update(result);
            this.router.navigateToRoute('master')
        }
        catch (error) {
            toastr.error(`Error starting session.`)
        }
    }
}