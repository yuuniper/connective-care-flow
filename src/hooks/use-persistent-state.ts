import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const PREFIX = "thyma:";

/**
 * `useState` that survives a reload by mirroring itself into localStorage.
 *
 * The first render always uses `initial` so server and client markup match;
 * the stored value is read after mount. Writes wait until that read has been
 * committed (`ready`), so the default value can never overwrite saved data,
 * including under StrictMode's double-run of effects. Storage failures
 * (private mode, quota, bad JSON) fall back silently to in-memory state.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const storageKey = PREFIX + key;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore unreadable storage */
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore quota / private mode */
    }
  }, [ready, storageKey, value]);

  const reset = () => setValue(initial);

  return [value, setValue, reset];
}
