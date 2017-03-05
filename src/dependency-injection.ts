export interface IDependency {}
export type IDependencyContainer = IDependency[]

export const DI = {
    ISessionService : {name: 'ISessionService'}
}

import {SessionService} from 'services/SessionService'

export const Singletons = [
    {interface: DI.ISessionService, implementation: SessionService}
]