import { SetStateAction, useState } from "react";

export function usePersistedState<S>(defaultValue: S, key: string) {
  const [state, setState] = useState<S>(() => {
    const persistedValue = localStorage.getItem(key);
    return persistedValue ? JSON.parse(persistedValue) : defaultValue;
  });

  const setPersistedState = (value: SetStateAction<S>) => {
    if (typeof value === "function") {
      const newState = (value as (prevState: S) => S)(state);
      localStorage.setItem(key, JSON.stringify(newState));
      setState(newState);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    }
  };

  return [state, setPersistedState] as const;
}
