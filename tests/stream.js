'use strict';
const Stream    = require('../').Stream;
const Tokenize  = require('../').Tokenize;
const Token     = Tokenize.Token, TokenType = Tokenize.TokenType;
const assert    = require('chai').assert;

describe('Stream', () => {
  const tokens = [
    ['Reserved', 'var', ''],
    ['Identifier', 'x', ''],
    ['Operator', '=', ''],
    ['Literal', '12', 'number'],
    ['Punctuation', ';', 'semi colon']
  ].map(type => new Token(TokenType[type[0]], type[1]).prepend(type[2]));
  const stream = new Stream(tokens);
  describe('next()', () => {
    it('should return the next token', () => {
      tokens.forEach(token => assert.deepEqual(stream.next(), token));
    });
  });

  describe('previous()', () => {
    it('should return the previous token', () => {
      const copy = tokens.slice();
      copy.reverse().forEach(token => assert.deepEqual(stream.previous(), token));
    });
  });

  describe('peek()', () => {
    it('should return the next token by (1)', () => {
      assert.deepEqual(stream.peek(1), tokens[1]);
      stream.next();
    });
  });

  describe('peekBack()', () => {
    it('should return the previous token by (1)', () => {
      assert.deepEqual(stream.peekBack(1), tokens[0]);
    });
  });

  describe('current()', () => {
    it('should return the current token', () => {
      assert.deepEqual(stream.current(), tokens[1]);
    });
  });

  describe('length', () => {
    it('should return the length of the stream', () => {
      assert.strictEqual(stream.length, tokens.length);
    });
  });
});
