'use strict';

export default class Token {
  constructor (type, value, source) {
    this._type = type;
    this._value = value;
    this._source = source;
  }
  get type () {
    return this._type;
  }

  get value () {
    return this._value;
  }

  get source () {
    return this._source;
  }

  toJSON () {
    return Object.assign(this._source, {
      "token": {
        "type": this.type,
        "value": this.value 
      }
    });
  }
}