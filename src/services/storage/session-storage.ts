import { BaseStorageService } from 'services/storage/base-storage'
import { ISessionStorageService, ISessionStorageKey} from 'services/storage'

export class SessionStorageService extends BaseStorageService<ISessionStorageKey> implements ISessionStorageService {
  constructor() {
    super(sessionStorage)
  }
}
