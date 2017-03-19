import {SessionService} from 'services/planning-poker/SessionService';
import {ApiService} from 'services/planning-poker/ApiService'
import {LocalStorageService} from 'services/storage/local-storage'

export const DI = {
    IApiService : {name: 'IApiService'},
    ISessionService: {name: 'ISessionService'},
    ILocalStorageService: {name: 'ILocalStorageService'}
}

export const Singletons = [
    {interface: DI.ILocalStorageService, implementation: LocalStorageService},
    {interface: DI.IApiService, implementation: ApiService},
    {interface: DI.ISessionService, implementation: SessionService}
]