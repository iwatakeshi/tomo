'use strict';

import Source from './Source';
import TokenStream from './TokenStream';

export default class Scanner {
  constructor(source, options){
    this._source = new Source(source);
    this._stringBuffer = '';
    this._isEOF = false;
    this._options = {
      whitespace : options.whitespace ? options.whitespace : false
    };
  }

  set isEOF (truth) {
    this._isEOF = truth;
  }

  get isEOF () {
    return this._isEOF;
  }

  get source () {
    return this._source;
  }

  get options () {
    return this._options;
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
    while(this.peekChar() !== this.source.EOF) {
      const token = this.nextToken(tokenizer);
      if(token) stream.addToken(token);
      this.ignoreWhiteSpace();
    }
    return stream;
  }

  nextChar () {
    // If we are at the end or over the length
    // of the source then return EOF
    if(this.source.position >= this.file.length) {
      this.isEOF = true;
      return this.source.EOF;
    }
    // If we reach a new line then
    // increment the line and reset the column
    // else increment the column
    if(this.source.file[this.source.position] === '\n') {
      this.source.line++;
      this.source.column = 1;
    } else this.source.column++;
    return this.source.file[this.source.position++];
  }

  peekChar (peek) {
    // If we peek and the we reach the end or over
    // the length then return EOF
    if (this.source.position + peek >= this.source.file.length){
      this.isEOF = true;
      return this.source.EOF;
    }
    return this.source.file[this.source.position + (peek ? peek : 0)];
  }

  nextToken (tokenizer) {
    if(typeof tokenizer === 'function'){
      const character = this.peekChar();
      return tokenizer.apply(this, [character]);
    }
  }

  ignoreWhiteSpace () {
    if(!this.options.whitespace) 
      while(this.isWhiteSpace(this.peekChar())) {
        this.nextChar();
      }
  }
}