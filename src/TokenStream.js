'use strict';

import TokenType from './TokenType';
import Token from './Token';

export default class TokenStream {
  constructor () {
    this._stack = [];
    this._position = 0;
  }

  set position (position) {
    return this._position = position;
  }

  get position () {
    return this._position;
  }

  addToken (token) {
    this._stack[this._stack.length] = token;
  }

  match (type, type2, value) {
    if(type && (type instanceof TokenType)) {

      if(!type2) 
        return this.peekToken () !== undefined && 
          this.peekToken ().type === type;

      if(!type && (type instanceof TokenType))
        return this.peekToken () !== undefined && 
          this.peekToken ().type === type && 
          this.peekToken (1) !== undefined &&
          this.peekToken (1).type === type2;

      if(!type2 && value && (typeof value === String))
        return this.peekToken () !== undefined &&
          this.peekToken ().type === type &&
          this.peekToken ().value === value;
    }
  }

  accept (type, token, value) {
    if(type && (type instanceof TokenType)) {

      if(!token && !value)
        if (this.peekToken () !== undefined && this.peekToken ().type === type) {
          this.scanToken ();
          return true;
        } else return false;
      if(token && (token instanceof Token))
        if (this.peekToken () !== undefined && this.peekToken ().type === type) {
        token = this.scanToken ();
        return true;
      } else return false;

      if(value && (typeof value === String))
        if (this.peekToken () !== undefined && this.peekToken ().type === type && this.peekToken ().value === val) {
        this.scanToken ();
        return true;
      } else return false;
    }
  }

  expect (type, value, source) {
    if((type instanceof TokenType) && (typeof value === String) && source) {
      var token = this.peekToken ();
      if (this.accept(type, value)) {
        return token;
      }
      var failed = this.scanToken ();
      if (failed !== undefined) {
        throw new Error(
          `cherry [error: Invalid Token]: ${ value } at line: ${ source.line }, position: ${ source.position }. Expected ${ type }`)
      } else {
        throw new Error (
          `cherry [error: EOF]: ${ value } at line: ${ source.line }, position: ${ source.position }. Expected ${ type }`);
      }
      return new Token (type, "", source);
    }
  }

  peekToken (peek) {
    peek = peek ? peek : 0;
    if (this.position + peek < this._stack.length) {
      return this._stack[this.position + peek];
    }
    return undefined;
  }

  scanToken () {
    if(this.position >= this._stack.length)
      return undefined;
    else this._stack[this.position++];
  }

  toBuffer () {
    return this._stack;
  }

  toJSON () {
    return JSON.parse(JSON.stringify(this._stack));
  }
}