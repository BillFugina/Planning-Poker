import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant, RoundState, ICard } from 'model'
import { ISessionService, IApiService, IStateService, INotificationService, IBrowserFeatureDetectionService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import * as toastr from 'toastr'

@inject(DI.ISessionService, DI.IStateService, DI.IBrowserFeatureDetectionService)
export class Participant {

    private _hasHover: boolean

    constructor(
        private sessionService: ISessionService,
        private state: IStateService,
        private browserFeatureDetectionService: IBrowserFeatureDetectionService
    ) {
        this._hasHover = browserFeatureDetectionService.hasHover();
    }

    attached() {
        this.state.resetCards()
    }

    get hasHover() {
        return this._hasHover
    }

    get chosen() {
        return this.state.chosen
    }

    set chosen(value: ICard) {
        this.state.chosen = value
    }

    get round() {
        return this.state.session.CurrentRound
    }
    get inRound() {
        return this.state.session.CurrentRound.State == RoundState.Pending || this.state.session.CurrentRound.State == RoundState.Started
    }

    get showTimer() {
        return this.state.session.CurrentRound.State == RoundState.Started
    }

    cardClick(card: ICard) {
        if (this.chosen === card) {
            card.Chosen = false;
            this.chosen = null;
            this.sessionService.vote(this.state.session.Name, this.state.session.CurrentRound.Id, this.state.participant, -1)
        }
        else {
            if (this.chosen) {
                this.chosen.Chosen = false;
            }
            card.Chosen = true;
            this.chosen = card;
            this.sessionService.vote(this.state.session.Name, this.state.session.CurrentRound.Id, this.state.participant, card.Value)
        }
    }

}