import { NavigationInstruction, RouteConfig } from 'aurelia-router'
import { ISession, IParticipant, RoundState, ICard } from 'model'
import { ISessionService, IApiService, IStateService, INotificationService } from 'services/planning-poker'
import { inject } from 'aurelia-framework'
import { DI } from 'dependency-injection'
import * as toastr from 'toastr'

@inject(DI.ISessionService, DI.IStateService)
export class Participant {

    constructor(
        private session: ISessionService,
        private state: IStateService
    ) {

    }
    attached() {
        this.state.resetCards()
    }

    get chosen() {
        return this.state.chosen
    }

    set chosen(value: ICard) {
        this.state.chosen = value
    }

    get round() {
        return this.session.CurrentRound
    }
    get inRound() {
        return this.session.CurrentRound.State == RoundState.Pending || this.session.CurrentRound.State == RoundState.Started
    }

    get showTimer() {
        return this.session.CurrentRound.State == RoundState.Started
    }

    cardClick(card: ICard) {
        if (this.chosen === card) {
            card.Chosen = false;
            this.chosen = null;
            this.session.vote(this.session.Name, this.session.CurrentRound.Id, this.state.participant, -1)
        }
        else {
            if (this.chosen) {
                this.chosen.Chosen = false;
            }
            card.Chosen = true;
            this.chosen = card;
            this.session.vote(this.session.Name, this.session.CurrentRound.Id, this.state.participant, card.Value)
        }
    }

}