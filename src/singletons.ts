import {DI} from 'dependency-injection'
import { SessionService } from 'services/planning-poker/SessionService'
import { ApiService } from 'services/planning-poker/ApiService'
import { LocalStorageService } from 'services/storage/local-storage'
import { SessionStorageService } from 'services/storage/session-storage'
import { SimpleService } from 'services/planning-poker/SimpleService'
import { NotificationService } from 'services/planning-poker/NotificationService'
import { StateService } from 'services/planning-poker/StateService'
import { BrowserFeatureDetectionService } from 'services/planning-poker/BrowserFeatureDetectionService'

export const Singletons = [
    {interface: DI.ILocalStorageService, implementation: LocalStorageService},
    {interface: DI.ISessionStorageService, implementation: SessionStorageService},
    {interface: DI.IApiService, implementation: ApiService},
    {interface: DI.ISessionService, implementation: SessionService},
    {interface: DI.ISimpleService, implementation: SimpleService},
    {interface: DI.INotificationService, implementation: NotificationService},
    {interface: DI.IStateService, implementation: StateService},
    {interface: DI.IBrowserFeatureDetectionService, implementation: BrowserFeatureDetectionService }
]