'use strict';

const Tokenize = require('../../').Tokenize;
const Token = Tokenize.Token, TokenType = Tokenize.TokenType;
const Parser = require('../../').Parser;
const Stream = require('../../').Stream;

// let source = 'var x = 2 + 34'
const stream = new Stream([
  [TokenType.Reserved, 'var', ''],
  [TokenType.Identifier, 'x', ''],
  [TokenType.Operator, '=', 'assign'],
  [TokenType.Literal, '2', 'number'],
  [TokenType.Operator, '+', 'add'],
  [TokenType.Literal, '34', 'number']
].map(token => new Token(token[0], token[1], token[2])));


class Bantam extends Parser {
  constructor(stream) {
    super(stream);
    this.prefixParselets = new Map();
    this.InfixParselets = new Map();
    this.read = [];
  }
  registerInfixParselet(token, parselet) {
    this.InfixParselets.put(token, parselet);
  }
  registerPrefixParselet(token, parselet) {
    this.prefixParselets.put(token, parselet);
  }

  parseExpression(precedence) {
    if (!precedence) return this.parseExpression(0);
    let token = this.consume();
    const prefix = this.prefixParselets.get(token.type);
    if (!prefix) throw new Error('Couldn\'t parse "' + token.value + '".');
    let left = prefix.parse(this, token);
    while (precedence < this.getPrecedence()) {
      token = this.consume();
      const infix = this.InfixParselets.get(token.type);
      left = infix.parse(this, left, token);
    }
    return left;
  }

  getPrecedence() {
    const parser = this.InfixParselets.get(this.lookahead(0).type);
    if (parser) return parser.getPrecedence();

    return 0;
  }

  match(expected) {
    const token = this.lookAhead(0);
    if (token.type != expected) {
      return false;
    }

    this.consume();
    return true;
  }
  consume(expected) {
    if (!expected) {
      this.lookAhead(0);
      return this.read.splice(this.read.indexOf(0), 1);
    }
    const token = this.lookAhead(0);
    if (token.type != expected) {
      throw new Error("Expected token " + expected + " and found " + Token.typeToString(token.type, token.pvalue));
    }
    return this.consume();
  }
  
  lookahead(distance) {
    while(distance >= this.read.length) {
      this.read.push(this.next());
    }
    return this.read[this.read.indexOf(distance)];
  }
}

