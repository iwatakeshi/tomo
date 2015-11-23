'use strict';
const Stream = require('../').Stream;
const Tokenize = require('../').Tokenize;
const Token = Tokenize.Token, TokenType = Tokenize.TokenType;
const assert = require('chai').assert;

describe('Stream', function () {
  const tokens = [
    ['Reserved', 'var', ''],
    ['Identifier', 'x', ''],
    ['Operator', '=', ''],
    ['Literal', '12', 'number'],
    ['Punctuation', ';', 'semi colon']
  ].map(type => new Token(TokenType[type[0]], type[1]).prepend(type[2]));
  const stream = new Stream(tokens);
  describe('next()', function () {
    it('should return the next token', function () {
      tokens.forEach(token => assert.deepEqual(stream.next(), token));
    });
  });
  
  describe('previous()', function () {
    it('should return the previous token', function () {
      const copy = tokens.slice();
      copy.reverse().forEach(token => assert.deepEqual(stream.previous(), token));
    });
  });
  
  describe('peek()', function() {
    it('should return the next token by (1)', function() {
      assert.deepEqual(stream.peek(1), tokens[1]);
      stream.next();
    });
  });
  
  describe('peekBack()', function() {
    it('should return the previous token by (1)', function() {
      assert.deepEqual(stream.peekBack(1), tokens[0]);
    });
  });
  
  describe('current()', function(){
    it('should return the current token', function() {
      assert.deepEqual(stream.current(), tokens[1]);
    });
  });
  
  describe('length()', function() {
    it('should return the length of the stream', function(){
      assert.strictEqual(stream.length(), tokens.length);
    });
  });
});
