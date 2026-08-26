export type BrowserStorageKind = 'local' | 'session';

export type StorageEntry = {
  key: string;
  value: string;
};

const STORAGE_EVENT = 'newround:browser-storage';

const EMPTY_ENTRIES: StorageEntry[] = [];

type SnapshotCache = {
  raw: string;
  entries: StorageEntry[];
};

const snapshots: Record<BrowserStorageKind, SnapshotCache> = {
  local: { raw: '', entries: EMPTY_ENTRIES },
  session: { raw: '', entries: EMPTY_ENTRIES },
};

export const getBrowserStorage = (kind: BrowserStorageKind): Storage =>
  kind === 'local' ? localStorage : sessionStorage;

export const listStorageEntries = (store: Storage): StorageEntry[] => {
  const keys = Array.from({ length: store.length }, (_, index) =>
    store.key(index),
  )
    .filter((key): key is string => key !== null)
    .toSorted((left, right) => left.localeCompare(right, 'ru'));

  return keys.map((key) => ({ key, value: store.getItem(key) ?? '' }));
};

const emitBrowserStorage = () => {
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const writeStorageEntry = (
  store: Storage,
  key: string,
  value: string,
) => {
  store.setItem(key, value);
  emitBrowserStorage();
};

export const removeStorageEntry = (store: Storage, key: string) => {
  store.removeItem(key);
  emitBrowserStorage();
};

export const clearStorage = (store: Storage) => {
  store.clear();
  emitBrowserStorage();
};

export const formatStorageValue = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

export const subscribeBrowserStorage = (onStoreChange: () => void) => {
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
};

export const getStorageSnapshot = (kind: BrowserStorageKind): StorageEntry[] => {
  const entries = listStorageEntries(getBrowserStorage(kind));
  const raw = JSON.stringify(entries);

  if (snapshots[kind].raw === raw) {
    return snapshots[kind].entries;
  }

  snapshots[kind] = { raw, entries };
  return entries;
};

export const getEmptyStorageSnapshot = (): StorageEntry[] => EMPTY_ENTRIES;
