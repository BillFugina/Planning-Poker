import { ISessionService, IApiService } from 'services/planning-poker';
import { DI } from 'dependency-injection'
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework'
import * as toastr from 'toastr'

@inject(DI.ISessionService, Router)
export class Home {
    session: string
    master: string

    constructor(
        private sessionService: ISessionService,
        private router: Router
    ) {
    }

    async startSession() {
        await this.sessionService.startSession(this.session, this.master)
        this.router.navigateToRoute('master')
    }
}