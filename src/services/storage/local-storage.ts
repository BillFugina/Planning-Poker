import { BaseStorageService } from 'services/storage/base-storage'
import { ILocalStorageService, ILocalStorageKey } from 'services/storage'

export class LocalStorageService extends BaseStorageService<ILocalStorageKey> implements ILocalStorageService {
  constructor() {
    super(localStorage)
  }
}
