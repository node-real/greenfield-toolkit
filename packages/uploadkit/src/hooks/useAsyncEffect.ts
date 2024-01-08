import { isFunction } from '@/utils/common';
import type { DependencyList } from 'react';
import { useEffect } from 'react';

function isAsyncGenerator(
  val: AsyncGenerator<void, void, void> | Promise<void>,
): val is AsyncGenerator<void, void, void> {
  return isFunction((val as AsyncGenerator<void, void, void>)[Symbol.asyncIterator]);
}

function useAsyncEffect(
  effect: () => AsyncGenerator<void, void, void> | Promise<void>,
  deps?: DependencyList,
) {
  useEffect(() => {
    const e = effect();
    let cancelled = false;
    async function execute() {
      if (isAsyncGenerator(e)) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const result = await e.next();
          if (result.done || cancelled) {
            break;
          }
        }
      } else {
        await e;
      }
    }
    execute();
    return () => {
      cancelled = true;
    };
  }, deps);
}

export default useAsyncEffect;
