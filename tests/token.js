'use strict';

const Tokenize  = require('../').Tokenize;
const Token     = Tokenize.Token, TokenType = Tokenize.TokenType;
const chai      = require('chai');
const assert    = chai.assert;

describe('TokenType', () => {
  const types = [
    ['Identifier', 1],
    ['Reserved', 2],
    ['Literal', 3],
    ['Operator', 4],
    ['Punctuation', 5],
    ['Comment', 100],
    ['Whitespace', 50],
    ['End', 0],
    ['Invalid', -1]
  ].map(type => ({ actual: TokenType[type[0]], expected: type[1] }));

  it('should export the token types', () => {
    types.forEach(type => assert.strictEqual(type.actual, type.expected));
  });
});

describe('Token', () => {

  const id = new Token(TokenType.Identifier, 'var');

  it('should create a token', () => {
    assert.strictEqual(id.type, 1);
    assert.strictEqual(id.stype, 'Identifier');
    assert.strictEqual(id.value, 'var');
  });

  describe('prepend()', () => {
    const token = new Token(TokenType.Punctuation, ';');
    it('should prepend the type', function () {
      assert.strictEqual(token.prepend('semi colon').stype, 'SemiColonPunctuation');
    });
  });
  
  describe('setType()', () => {
    const token = new Token();
    it('should set the type', function () {
      assert.strictEqual(token.setType(TokenType.Identifier).type, TokenType.Identifier);
    });
  });
  
  describe('static typeToString()', () => {
    const types = [
      'Identifier',
      'Reserved',
      'Literal',
      'Operator',
      'Punctuation',
      'Comment',
      'Whitespace',
      'End',
      'Invalid',
    ].map(type => ({ actual: Token.typeToString(TokenType[type]), expected: type }));
    it('should transform the string to token type', function () {
      types.forEach(type => assert.strictEqual(type.actual, type.expected));
    });
  });

  describe('static stringToType()', () => {
    let types = [
      ['Identifier', 1],
      ['Reserved', 2],
      ['Literal', 3],
      ['Operator', 4],
      ['Punctuation', 5],
      ['Comment', 100],
      ['Whitespace', 50],
      ['End', 0],
      ['Invalid', -1]
    ].map(type => ({ actual: Token.stringToType(type[0]), expected: type[1] }));

    it('should transform the token type to string', () => {
      types.forEach(type => assert.strictEqual(type.actual, type.expected));
    });
  });

});
