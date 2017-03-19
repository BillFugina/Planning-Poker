export interface IStorageService<TKey extends string> {
  clear(): void
  get<TValue>(key: TKey): TValue | undefined
  remove(key: TKey): void
  set<TValue>(key: TKey, value: TValue): void
}

// Enumerate Local Storage Keys
export type ILocalStorageKey = 'AuthN' | 'AuthZ'

export interface ILocalStorageService extends IStorageService<ILocalStorageKey> {}

// Enumerate Session Storage Keys
export type ISessionStorageKey = undefined

export interface ISessionStorageService extends IStorageService<ISessionStorageKey> {}
