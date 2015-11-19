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
      this.nextChar();
      return undefined;
    }
    const reserved = {'var': true, 'let': true };
    let buffer = [];
    do {
      buffer.push(this.nextChar());
      ch = this.peekChar();
    } while (isLetter(ch) || isDigit(ch) || ch == '_' || ch == '$');
    if(buffer.length > 0){
      if(reserved[buffer.join('')])
        return new Token(TokenType.Reserved, buffer.join(''), this.source);
      else
       return new Token(TokenType.Identifier, buffer.join(''), this.source);
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
    if (!isFinite(parseFloat(buffer.join('')))) throw "Number is too large or too small for a 64-bit double.";
    return new Token(TokenType.NumberLiteral, buffer.join(''), this.source);
  },
  'operator': function (ch) {
    this.nextChar();
    return new Token(TokenType.Operator, ch, this.source).appendToOperator((()=>{
      switch(ch) {
        case '+': return 'Plus'; 
        case '-': return 'Minus';
        case '*': return 'Multiply'; 
        case '/': return 'Divide';
        case '=': return 'Assign';
      }
    })());
  },
  'end': function(ch) {
    this.nextChar();
    return new Token(TokenType.End, ch, this.source);
  }
};

const scanner = new Scanner('var x = 1.35 + 2');
const stream = scanner.scan(function (ch) {
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
    case '(': case ')':
      return scan.operator.call(this, ch);
    default:
      return scan.identifier.call(this, ch) || scan.end.call(this, ch);
      
  }
});
const should = function(actual, expected) {
  if(actual === expected) console.log('OK, test passed.')
  else throw `Failed! Expected ${expected} but encountered ${actual}`;
};

stream.forEach(i => console.log(JSON.stringify(i.toJSON(), null, 2)));

const expected = [
  Token.typeToString(TokenType.Reserved), 
  Token.typeToString(TokenType.Identifier),
  Token.typeToString(TokenType.Operator, 'Assign'),
  Token.typeToString(TokenType.NumberLiteral),
  Token.typeToString(TokenType.Operator, 'Plus'),
  Token.typeToString(TokenType.NumberLiteral),
  Token.typeToString(TokenType.End)
 ];
 
 stream.forEach((s, i) => should(s.toJSON().token.type.value, expected[i]))