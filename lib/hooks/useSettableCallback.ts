import { useState } from 'react';

function setCB<T>(setter: (setterCb?: () => T) => void) {
  return (cb?: T) => {
    setter(() => cb);
  };
}

export function useSettableCallback<T extends Function | undefined>(callback: T): [T, (cb: T) => void] {
  const [cb, setCallback] = useState<T>(callback);
  const settableCb = setCB<T>(setCallback);
  return [cb, settableCb];
}