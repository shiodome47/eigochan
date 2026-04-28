// 自作フレーズに紐づく音声メモを IndexedDB に保存する。
// 1 (phraseId, slot) = 最新1件のみ。同じ slot に再保存すれば上書き。
// localStorage は使わない(Blob は格納に向かないため)。

import { nowJstIso } from "./date";

const DB_NAME = "eigochan-phrase-audio";
const DB_VERSION = 1;
const STORE_NAME = "audio";

export type PhraseAudioSlot = "reference" | "practice";

export interface SavedPhraseAudio {
  id: string;             // composite: `${phraseId}:${slot}`
  phraseId: string;
  slot: PhraseAudioSlot;
  blob: Blob;
  mimeType: string;
  size: number;
  createdAt: string;      // JST ISO
  updatedAt: string;      // JST ISO
}

export function isPhraseAudioSupported(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function makeId(phraseId: string, slot: PhraseAudioSlot): string {
  return `${phraseId}:${slot}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isPhraseAudioSupported()) {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("indexedDB.open failed"));
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("phraseId", "phraseId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

function readById(db: IDBDatabase, id: string): Promise<SavedPhraseAudio | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () =>
      resolve((req.result as SavedPhraseAudio | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("read failed"));
  });
}

export async function loadPhraseAudio(
  phraseId: string,
  slot: PhraseAudioSlot,
): Promise<SavedPhraseAudio | null> {
  try {
    const db = await openDb();
    try {
      return await readById(db, makeId(phraseId, slot));
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

export async function savePhraseAudio(
  phraseId: string,
  slot: PhraseAudioSlot,
  blob: Blob,
  mimeType: string,
): Promise<SavedPhraseAudio> {
  const db = await openDb();
  try {
    const id = makeId(phraseId, slot);
    const existing = await readById(db, id);
    const now = nowJstIso();
    const record: SavedPhraseAudio = {
      id,
      phraseId,
      slot,
      blob,
      mimeType,
      size: blob.size,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("save failed"));
      tx.onabort = () => reject(tx.error ?? new Error("save aborted"));
    });
    return record;
  } finally {
    db.close();
  }
}

export async function deletePhraseAudio(
  phraseId: string,
  slot: PhraseAudioSlot,
): Promise<void> {
  try {
    const db = await openDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(makeId(phraseId, slot));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("delete failed"));
        tx.onabort = () => reject(tx.error ?? new Error("delete aborted"));
      });
    } finally {
      db.close();
    }
  } catch {
    // 失敗しても呼び出し側を落とさない
  }
}

export async function deleteAllPhraseAudioForPhrase(phraseId: string): Promise<void> {
  try {
    const db = await openDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const index = store.index("phraseId");
        const req = index.openCursor(IDBKeyRange.only(phraseId));
        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("delete-all failed"));
        tx.onabort = () => reject(tx.error ?? new Error("delete-all aborted"));
      });
    } finally {
      db.close();
    }
  } catch {
    // 無視
  }
}

export async function listPhraseAudioForPhrase(
  phraseId: string,
): Promise<SavedPhraseAudio[]> {
  try {
    const db = await openDb();
    try {
      return await new Promise<SavedPhraseAudio[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const index = tx.objectStore(STORE_NAME).index("phraseId");
        const req = index.getAll(IDBKeyRange.only(phraseId));
        req.onsuccess = () => resolve((req.result as SavedPhraseAudio[]) ?? []);
        req.onerror = () => reject(req.error ?? new Error("list failed"));
      });
    } finally {
      db.close();
    }
  } catch {
    return [];
  }
}

export async function listAllPhraseAudio(): Promise<SavedPhraseAudio[]> {
  try {
    const db = await openDb();
    try {
      return await new Promise<SavedPhraseAudio[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => resolve((req.result as SavedPhraseAudio[]) ?? []);
        req.onerror = () => reject(req.error ?? new Error("listAll failed"));
      });
    } finally {
      db.close();
    }
  } catch {
    return [];
  }
}

export async function clearAllPhraseAudio(): Promise<void> {
  try {
    const db = await openDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("clear failed"));
      });
    } finally {
      db.close();
    }
  } catch {
    // 無視
  }
}
