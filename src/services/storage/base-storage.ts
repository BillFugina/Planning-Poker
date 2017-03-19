import { IStorageService } from 'services/storage'

export abstract class BaseStorageService<TKey extends string> implements IStorageService<TKey> {

  constructor(private storage: Storage) {
  }

  clear() {
    this.storage.clear()
  }

  get<TValue>(key: TKey): TValue | undefined {
    const item = this.storage.getItem(key)
    if (item) {
      return JSON.parse(item) as TValue
    }
    return undefined
  }

  remove(key: TKey): void {
    this.storage.removeItem(key)
  }

  set<TValue>(key: TKey, value: TValue): void {
    if (value === undefined) {
      this.remove(key)
    } else {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

}
