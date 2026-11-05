import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const PREFIX = "thyma:";

/**
 * `useState` that survives a reload by mirroring itself into localStorage.
 *
 * The first render always uses `initial` so server and client markup match;
 * the stored value is read after mount. Storage failures (private mode, quota,
 * bad JSON) fall back silently to in-memory state.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  const storageKey = PREFIX + key;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore unreadable storage */
    }
    loaded.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore quota / private mode */
    }
  }, [storageKey, value]);

  const reset = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setValue(initial);
  };

  return [value, setValue, reset];
}
