'use strict';

export default class TokenType {
  constructor (char, type) {
    this._char = char;
    this._type = type;
  }

  get character () {
    return this._char;
  }

  get type () {
    return this._type;
  }
}