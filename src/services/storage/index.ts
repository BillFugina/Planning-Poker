export interface IStorageService<TKey extends string> {
  clear(): void
  get<TValue>(key: TKey): TValue | undefined
  remove(key: TKey): void
  set<TValue>(key: TKey, value: TValue): void
}

// Enumerate Local Storage Keys
export type ISessionStorageKey = 'SessionID' | 'Participant'

export interface ISessionStorageService extends IStorageService<ISessionStorageKey> {}

// Enumerate Session Storage Keys
export type ILocalStorageKey = 'SessionID' | 'Participant'

export interface ILocalStorageService extends IStorageService<ISessionStorageKey> {}
