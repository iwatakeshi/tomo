'use strict';
const { Scanner, Tokenization } = require('../');
const { Token, TokenType } = Tokenization;

const isOperator = function (c) { return /[+\-*\/\^%=(),]/.test(c); },
  isEOF = function(c) { return c === '\0' || c === '\0'.charAt(0)},
  isLetter = function (c) { return /[a-zA-Z]/.test(c); },
  isDigit = function (c) { return /[0-9]/.test(c); },
  isWhiteSpace = function (c) { return /\s/.test(c); },
  isIdentifier = function (c) { return typeof c === "string" &&
		!isOperator(c) &&
		!isDigit(c) &&
    !isWhiteSpace(c) &&
		!isEOF(c); 
	};

const scan = {
  'identifier': function (ch) {
    if(isEOF(ch)) {
      return undefined;
    }
    const reserved = {'var': true, 'let': true };
    let buffer = [];
    do {
      buffer.push(this.nextChar());
      ch = this.peekChar();
    } while (isLetter(ch) || isDigit(ch) || ch == '_' || ch == '$');
    const location = this.location().end();
    if(buffer.length > 0){
      if(reserved[buffer.join('')])
        return new Token(TokenType.Reserved, buffer.join(''), location);
      else
       return new Token(TokenType.Identifier, buffer.join(''), location);
    } else return undefined;
  },
  'number': function (ch) {
    let buffer = [];
    do {
      if (ch == '.')
        do buffer.push((ch = this.peekChar())); while (isDigit(this.nextChar()));
      else buffer.push(this.nextChar());
      ch = this.peekChar();
    } while (isDigit(ch) || ch === '.');
    const location = this.location().end();
    if (!isFinite(parseFloat(buffer.join('')))) throw "Number is too large or too small for a 64-bit double.";
    return new Token(TokenType.Literal)
      .prepend('number')
      .setValue(buffer.join(''))
      .setLocation(location);
  },
  'operator': function (ch) {
    this.nextChar();
    return new Token(TokenType.Operator, ch)
    .setLocation(this.location().end())
    .prepend((()=>{
      switch(ch) {
        case '+': return 'plus'; 
        case '-': return 'minus';
        case '*': return 'multiply'; 
        case '/': return 'divide';
        case '=': return 'assign';
      }
    })());
  },
  'punctuation': function(ch) {
    this.nextChar();
    return new Token(TokenType.Punctuation, ch)
    .setLocation(this.location().end())
    .prepend((()=>{
      switch(ch) {
        case '(': return 'left paren';
        case ')': return 'right paren';
        case ';': return 'semi colon';
      }
    })())
  },
  'end': function(ch) {
    return new Token(TokenType.End, ch, this.location().eof());
  }
};
console.time('Scanner');
const scanner = new Scanner('var x = 1.35 + 2;');
// const scanner = new Scanner(require('fs').)
const stream = scanner.scan(function (ch) {
  this.location().start();
  switch (ch) {
    case '0': case '1':
    case '2': case '3':
    case '4': case '5':
    case '6': case '7':
    case '8': case '9':
      return scan.number.call(this, ch);
    case '=': case '+':
    case '-': case '*':
    case '/': case '%':
      return scan.operator.call(this, ch);
    case '(': case ')':
    case ';':
      return scan.punctuation.call(this, ch);
    default:
      return scan.identifier.call(this, ch) || 
      (isEOF(ch) ? scan.end.call(this, ch) : new Token(TokenType.Invalid));
      
  }
});

console.timeEnd('Scanner');

const should = function(actual, expected) {
  if(actual === expected) console.log('OK, test passed.')
  else throw new Error(`Failed! Expected ${expected} but encountered ${actual}`);
};

stream.forEach(i => console.log(JSON.stringify(i.toJSON(), null, 2)));

const expected = [
  Token.typeToString(TokenType.Reserved), 
  Token.typeToString(TokenType.Identifier),
  Token.typeToString(TokenType.Operator, 'assign'),
  Token.typeToString(TokenType.Literal, 'number'),
  Token.typeToString(TokenType.Operator, 'plus'),
  Token.typeToString(TokenType.Literal, 'number'),
  Token.typeToString(TokenType.Punctuation, 'semi colon'),
  Token.typeToString(TokenType.End)
 ];
 
 stream.forEach((s, i) => should(s.toJSON().token.type.value, expected[i]))