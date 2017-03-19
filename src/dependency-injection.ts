export const DI = {
    IApiService : 'IApiService',
    ISessionService: 'ISessionService',
    ILocalStorageService: 'ILocalStorageService',
    ISimpleService: 'ISimpleService'
}

import { SessionService } from 'services/planning-poker/SessionService';
import { ApiService } from 'services/planning-poker/ApiService'
import { LocalStorageService } from 'services/storage/local-storage'
import { SimpleService } from "services/planning-poker/SimpleService";

export const Singletons = [
    {interface: DI.ILocalStorageService, implementation: LocalStorageService},
    {interface: DI.IApiService, implementation: ApiService},
    {interface: DI.ISessionService, implementation: SessionService},
    {interface: DI.ISimpleService, implementation: SimpleService}
]