export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export function deepMerge(target: any, source: any) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return target;
}

export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === 'function';

export const parseErrorXml = async (result: any) => {
  try {
    const xmlText = await result?.response?.data;
    const xml = await new window.DOMParser().parseFromString(xmlText, 'text/xml');
    const code = (xml as XMLDocument).getElementsByTagName('Code')[0].textContent;
    const message = (xml as XMLDocument).getElementsByTagName('Message')[0].textContent;
    return {
      code,
      message,
    };
  } catch {
    return {
      code: null,
      message: null,
    };
  }
};
