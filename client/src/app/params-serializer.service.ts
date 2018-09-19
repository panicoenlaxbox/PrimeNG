import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsSerializerService {

  constructor() { }

  public serialize(obj: Object) {
    let s = this._serialize(obj);
    if (s !== '') {
      s = s.substring(1, s.length);
    }
    return s;
  }

  private _serialize(obj: Object, prefix?: string) {
    prefix = prefix || '';
    let s = '';
    if (typeof obj !== 'object') {
      return `&${encodeURIComponent(prefix)}=${encodeURIComponent(obj)}`;
    }
    for (const prop in obj) {
      if (obj[prop] === null || obj[prop] === undefined) {
        continue;
      }
      if (Array.isArray(obj[prop])) {
        for (let index = 0; index < obj[prop].length; index++) {
          s += this._serialize(obj[prop][index], prefix + (prefix ? '.' : '') + prop + '[' + index + ']');
        }
      } else if (typeof obj[prop] === 'object') {
        s += this._serialize(obj[prop], prefix + (prefix ? '.' : '') + prop);
      } else {
        s += `&${encodeURIComponent((prefix ? prefix + '.' : '') + prop)}=${encodeURIComponent(obj[prop])}`;
      }
    }
    return s;
  }
}
