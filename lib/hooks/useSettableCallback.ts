import { useState } from 'react';

function setCB<T>(setter: (setterCb?: () => T) => void) {
  return (cb?: T) => {
    if (cb) {
      setter(() => cb);
    } else {
      setter(undefined);
    }
  };
}

export function useSettableCallback<T extends Function>(callback: T | undefined): [T | undefined, (cb: T | undefined) => void] {
  const [cb, setCallback] = useState<T | undefined>(callback);
  const settableCb = setCB<T>(setCallback);
  return [cb, settableCb];
}