import { useState } from 'react';

const useSingleton = <T>(singletonClass: { new (): T }): T => {
  const [instance, setInstance] = useState<T | null>(null);

  if (!instance) {
    const newSingleton = new singletonClass();
    setInstance(newSingleton);
    return newSingleton;
  }

  return instance;
};

export default useSingleton;
