import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { revokeRecording, type Recording } from "../utils/recording";

export type RecorderSlotKey = "chunks" | "full" | "recite";

interface RecorderRegistryValue {
  /** 該当 (phraseId, slot) の録音を取得。なければ null。 */
  get: (phraseId: string, slot: RecorderSlotKey) => Recording | null;
  /** 録音をセット/差し替え/削除する。古い URL は自動で revoke する。 */
  set: (phraseId: string, slot: RecorderSlotKey, recording: Recording | null) => void;
  /** 指定 phraseId の全 slot を破棄する(URL も revoke)。 */
  clearForPhrase: (phraseId: string) => void;
}

type StoreKey = `${string}:${RecorderSlotKey}`;
type Store = Record<StoreKey, Recording>;

function makeKey(phraseId: string, slot: RecorderSlotKey): StoreKey {
  return `${phraseId}:${slot}` as StoreKey;
}

const RecorderRegistryContext = createContext<RecorderRegistryValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function RecorderRegistryProvider({ children }: ProviderProps) {
  const [store, setStore] = useState<Store>({});

  // 最新の store を cleanup から参照するための ref
  const latestStoreRef = useRef<Store>(store);
  latestStoreRef.current = store;

  // Provider のアンマウント(=ページリロード相当)で全録音を revoke
  useEffect(() => {
    return () => {
      for (const rec of Object.values(latestStoreRef.current)) {
        revokeRecording(rec);
      }
    };
  }, []);

  const set = useCallback(
    (phraseId: string, slot: RecorderSlotKey, recording: Recording | null) => {
      setStore((prev) => {
        const key = makeKey(phraseId, slot);
        const old = prev[key];
        // 同じ Recording オブジェクトを再セットすることは無いが念のため判定
        if (old && old !== recording) {
          revokeRecording(old);
        }
        const next: Store = { ...prev };
        if (recording) {
          next[key] = recording;
        } else {
          delete next[key];
        }
        return next;
      });
    },
    [],
  );

  const clearForPhrase = useCallback((phraseId: string) => {
    setStore((prev) => {
      const prefix = `${phraseId}:`;
      let changed = false;
      const next: Store = {};
      for (const k of Object.keys(prev) as StoreKey[]) {
        if (k.startsWith(prefix)) {
          revokeRecording(prev[k]);
          changed = true;
        } else {
          next[k] = prev[k];
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const value = useMemo<RecorderRegistryValue>(
    () => ({
      get: (phraseId, slot) => store[makeKey(phraseId, slot)] ?? null,
      set,
      clearForPhrase,
    }),
    [store, set, clearForPhrase],
  );

  return (
    <RecorderRegistryContext.Provider value={value}>
      {children}
    </RecorderRegistryContext.Provider>
  );
}

export function useRecorderRegistry(): RecorderRegistryValue | null {
  return useContext(RecorderRegistryContext);
}
