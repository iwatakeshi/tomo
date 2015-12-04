'use strict';
/**
 * The AC (Adding Calculator) language from Crafting a Compiler
 * by Charles N. Fischer
 */
const Tokenize = require('../').Tokenize;
const Token = Tokenize.Token, TokenType = Tokenize.TokenType;
const Source = require('../').Source;
const Scanner = require('../').Scanner;
const Parser = require('../').Parser;
const Stream = require('../').Stream;
const _ = require('lodash');

const isOperator = function (c) { return /[+\-*\/\^%=(),]/.test(c); },
  isDigit = function (c) { return /[0-9]/.test(c); },
  isIdentifier = function (c) { return typeof c === 'string' && !isOperator(c) && !isDigit(c) };

const scan = {
  identifier: function (ch, type) {
    this.next();
    return new Token(TokenType.Identifier, ch, this.location().end());
  },
  reserved: function (ch, type) {
    this.next();
    return new Token(TokenType.Reserved, ch, this.location().end()).prepend(type);
  },
  operator: function (ch, type) {
    this.next();
    return new Token(TokenType.Operator, ch, this.location().end()).prepend(type);
  },
  number: function (ch) {
    let num = [];
    while (isDigit(ch = this.peek())) {
      num.push(this.next());
    }
    if (this.peek() === '.') {
      this.next();
      do num.push(ch); while (isDigit(ch = this.next()));
    }
    return new Token(TokenType.Literal)
      .prepend(num.indexOf('.') > -1 ? 'Float' : 'Int')
      .setValue(num.join(''))
      .setLocation(this.location().end());
  },
  eof: function (ch) {
    this.next();
    return new Token(TokenType.End, ch, this.location().eof());
  }
};

const source = new Source('f x = 23.3', { isCharCode: false });
// Quick and dirty scanner
const scanner = new Scanner(source);

const stream = scanner.scan(function (ch) {
  this.location().start();
  if (ch === '\0') return scan.eof.call(this, ch);
  else {
    switch (ch.toLowerCase()) {
      /* Identifiers */
      case 'a': case 'b': case 'c': case 'd': case 'e':
      case 'e': case 'g': case 'h': case 'j': case 'k':
      case 'l': case 'm': case 'n': case 'o': case 'r':
      case 's': case 't': case 'u': case 'v': case 'w':
      case 'x': case 'y': case 'z':
        return scan.identifier.call(this, ch);
      /* Reserved */
      case 'i': return scan.reserved.call(this, ch, 'Int');
      case 'f': return scan.reserved.call(this, ch, 'Float');
      case 'p': return scan.reserved.call(this, ch, 'Print');
      case '=': return scan.operator.call(this, ch, 'Assign');
      case '+': return scan.operator.call(this, ch, 'Plus');
      case '-': return scan.operator.call(this, ch, 'Minus')
      /* Numbers */
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        return scan.number.call(this, ch);
      default:
        const message = `AC [error]: Encountered an invalid character "${ this.peek() }"`;
        throw new SyntaxError(message, this.info.file.name, this.location().line);
        break;
    }
  }
});

// stream.forEach(i => console.log(i.toJSON()));
console.log(`Time elapsed: ${scanner.info.time.elapsed} ms`);

const parser = new Parser(stream);
let parse = {
  /*
    Dcls -> Dcl Dcls
          | λ
   */
  declarations: function () {
    console.log('procedure: declarations')
    if(this.match(TokenType.Reserved, 'f') || this.match(TokenType.Reserved, 'i')) {
      parse.declaration();
      parse.declarations();
    } else return;
  },
  /*
    Dcl -> floatdcl
         | intdcl
   */
  declaration: function () {
    console.log('procedure: declaration')
    if(this.match(TokenType.Reserved, 'f')) {
      this.accept(TokenType.Reserved, 'f');
      // this.expect(TokenType.Identifier);
    } else if(this.match(TokenType.Reserved, 'i')) {
      this.accept(TokenType.Reserved, 'i');
      // this.expect(TokenType.Identifier);
    } else return;
  },
  /*
    Stmts -> Stmt Stmts
           | λ
   */
  statements: function  () {
    console.log('procedure: statements')
    if(this.match(TokenType.Identifier) || this.match(TokenType.Reserved, 'p')) {
      parse.statement();
      parse.statements();
    }
    else if(this.match(TokenType.End)) {
      return;
    } else throw new Error(`AC [error]: Encountered an invalid token "${this.peek().stype}"`);
  },
  /*
    Stmt -> id assign (operator) Val Expr
          | print id
   */
  statement: function () {
    console.log('procedure: statement')
    // console.log(this.peek());
    if(this.match(TokenType.Identifier)) {
      this.accept(TokenType.Identifier);
      this.expect(TokenType.Operator, '=');
      parse.val();
      parse.expression();
    } else {
      if(this.match(TokenType.Reserved, 'p')) {
        this.accept(TokenType.Reserved, 'p');
        this.expect(TokenType.Identifier);
      } else throw new Error(`AC [error]: Encountered an invalid token "${this.peek().stype}" and expected "p"`);
    }
  },
  /*
    Expr -> plus (operator) Val Expr
          | minus (operator) Val Expr
          | λ
   */
  expression: function  () {
    console.log('procedure: expression')
    if(this.match(TokenType.Operator, '+')) {
      parse.val();
      parse.expression()
    } else if(this.match(TokenType.Operator, '-')) {
      parse.val();
      parse.expression();
    } else return;
  },
  /*
    Val -> id
         | inum (integer literal)
         | fnum (float literal)
   */
  val: function  () {
    console.log('procedure: val')
    if(this.match(TokenType.Identifier)) 
      this.accept(TokenType.Identifier);
    else if(this.match(Token.typeToString(TokenType.Literal, 'Int')))
      this.accept(Token.typeToString(TokenType.Literal, 'Int'));
    else if(this.match(Token.typeToString(TokenType.Literal, 'Float')))
      this.accept(Token.typeToString(TokenType.Literal, 'Float'));
    else return;
  }
};

parse = _.mapValues(parse, value => value.bind(parser));

const tree = parser.parse(function(token, ast){
  /* Begin program */
  if(ast.root) ast.root = { name: 'Program' };
  parse.declarations(ast);
  parse.statements(ast);
  return ast;
});