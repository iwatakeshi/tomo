'use strict';
const Scanner = require('../').Scanner;
const Source = require('../').Source;
const Stream = require('../').Stream;
const Tokenize = require('../').Tokenize;
const Token = Tokenize.Token, TokenType = Tokenize.TokenType;
const assert = require('chai').assert;


describe('Scanner', function () {

  function tokenizer(ch) {
    this.location().start();
    switch (ch) {
      case '0':
        this.next();
        return new Token(TokenType.Literal, ch, this.location().end()).prepend('number');
      case '=':
        this.next();
        return new Token(TokenType.Operator, ch, this.location().end()).prepend('add');
      case ';':
        this.next();
        return new Token(TokenType.Punctuation, ch, this.location().end()).prepend('semi colon');
      case '\0':
        this.next();
        return new Token(TokenType.End, ch, this.location().end())
      default:
        let buffer = [];
        let reserved = { 'var': true };
        while (/[a-zA-Z]/.test(ch)) {
          buffer.push(this.next());
          ch = this.peek();
        }
        const location = this.location().end();
        if (reserved[buffer.join('')])
          return new Token(TokenType.Reserved, buffer.join(''), location);
        else
          return new Token(TokenType.Identifier, buffer.join(''), location);
    }
  }
  describe('scan(), next(), location()', function () {
    it('should return a stream', function () {
      const scanner = new Scanner(new Source('var x = 0;', { isCharCode: false }));
      let stream = scanner.scan(tokenizer);
      assert.instanceOf(stream, Stream);
      let tokens = [
        'Reserved',
        'Identifier',
        'Operator',
        'Literal',
        'Punctuation'
      ];
      stream.forEach((token, i) => assert.strictEqual(token.type, TokenType[tokens[i]]));
    });
  });
});
