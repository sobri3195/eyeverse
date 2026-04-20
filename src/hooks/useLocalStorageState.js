import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => storage.get(key, initialValue));
  useEffect(() => {
    storage.set(key, state);
  }, [key, state]);
  return [state, setState];
}
