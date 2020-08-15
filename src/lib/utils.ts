import { IJsonObject, TFunc } from "../@interface/common.i";

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

export function deepClone<T extends IJsonObject>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function nextTick(func: TFunc) {
  setTimeout(func, 0)
}