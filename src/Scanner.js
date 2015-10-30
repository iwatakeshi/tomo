'use strict';

import Source from './Source';
import TokenStream from './TokenStream';

export default class Scanner extends Source {
  constructor(source){
    super(source);
    this._stringBuffer = '';
    this._isEOF = false;
  }

  set isEOF (truth) {
    this._isEOF = truth;
  }

  get isEOF () {
    return this._isEOF;
  }

  isWhiteSpace (char) {
    return char === ' ';
  }

  isLetter (char) {
    return /[a-zA-Z]/.test(char);
  }

  isDigit (char) {
    return /[0-9]/.test(char);
  }

  scan (tokenizer) {
    const stream = new TokenStream();
    this.ignoreWhiteSpace();
    while(this.peekChar() !== this.EOF) {
      const token = this.nextToken(tokenizer);
      if(token) stream.addToken(token);
      this.ignoreWhiteSpace();
    }
    return stream;
  }

  nextChar () {
    // If we are at the end or over the length
    // of the source then return EOF
    if(this.position >= this.file.length) {
      this.isEOF = true;
      return this.EOF;
    }
    // If we reach a new line then
    // increment the line and reset the column
    // else increment the column
    if(this.file[this.position] === '\n') {
      this.line++;
      this.column = 1;
    } else this.column++;
    return this.file[this.position++];
  }

  peekChar (peek) {
    // If we peek and the we reach the end or over
    // the length then return EOF
    if (this.position + peek >= this.file.length){
      this.isEOF = true;
      return this.EOF;
    }
    return this.file[this.position + (peek ? peek : 0)];
  }

  nextToken (tokenizer) {
    if(typeof tokenizer === 'function'){
      const character = this.peekChar();
      return tokenizer.apply(this, [character]);
    }
  }

  ignoreWhiteSpace () {
    while(this.isWhiteSpace(this.peekChar())) {
      this.nextChar();
    }
  }
}