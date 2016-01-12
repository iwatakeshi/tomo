'use strict';
const Parser = Cherry.Parser;
const Tokenize = Cherry.Tokenize;
const Token = Tokenize.Token, TokenType = Tokenize.TokenType;
const Source = Cherry.Source;
const Scanner = Cherry.Scanner;

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

const source = new Source('f b   i a   a = 5   b = a + 3.2  p b', { isCharCode: false });
// Quick and dirty scanner
const scanner = new Scanner(source);

const stream = scanner.scan(function ACScanner(ch) {
  this.location().start();
  if (this.isEOF()) return scan.eof(ch);
  else {
    switch (ch.toLowerCase()) {
      /* Identifiers */
      case 'a': case 'b': case 'c': case 'd': case 'e':
      case 'e': case 'g': case 'h': case 'j': case 'k':
      case 'l': case 'm': case 'n': case 'o': case 'r':
      case 's': case 't': case 'u': case 'v': case 'w':
      case 'x': case 'y': case 'z':
        return scan.identifier(ch);
      /* Reserved */
      case 'i': return scan.reserved(ch, 'Int');
      case 'f': return scan.reserved(ch, 'Float');
      case 'p': return scan.reserved(ch, 'Print');
      case '=': return scan.operator(ch, 'Assign');
      case '+': return scan.operator(ch, 'Plus');
      case '-': return scan.operator(ch, 'Minus')
      /* Numbers */
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        return scan.number(ch);
      default:
        this.raise(`ACScanner [error]: Unexpected character "${this.peek()}"`);
        this.next();
        return new Token(TokenType.Invalid, ch, this.location().end());
        break;
    }
  }
}, scan);

stream.forEach(i => console.log(i.toJSON()));
console.log();
console.log(`ACScanner [info]: time elapsed - ${scanner.info.time.elapsed} ms - with ${scanner.info.errors.length} errors.`);
console.log();
if(scanner.info.errors.length > 0) scanner.info.errors.forEach(error => {
  console.log(error.message);
  console.log(error.source);
})

const parser = new Parser(stream);
let parse = {
  /*
    Dcls -> Dcl Dcls
          | λ
   */
  declarations: function () {
    console.log('procedure: declarations');
    const tokens = [
      [TokenType.Reserved, 'f'], 
      [TokenType.Reserved, 'i']
    ];
    if(this.matchAny(tokens)) {
      parse.declaration();
      parse.declarations();
    } else if(this.matchAny([
        [TokenType.Identifier],
        [TokenType.Reserved, 'p'],
        [TokenType.End]
      ])) { /* NOOP */ }
    else this.raise('AC [error]: Expected "f (Reserved)", "i (Reserved)", "Identifier", "p (Reserved)", or "End"');
  },
  /*
    Dcl -> floatdcl id
         | intdcl id
   */
  declaration: function () {
    console.log('procedure: declaration');
    if(this.match(TokenType.Reserved, 'f')) {
      this.expect(TokenType.Reserved, 'f');
      this.expect(TokenType.Identifier);
    } else if(this.match(TokenType.Reserved, 'i')) {
      this.expect(TokenType.Reserved, 'i');
      this.expect(TokenType.Identifier);
    } else this.raise('AC [error]: Expected float or int declaration');
  },
  /*
    Stmts -> Stmt Stmts
           | λ
   */
  statements: function  () {
    console.log('procedure: statements');
    const tokens = [
      [TokenType.Identifier],
      [TokenType.Reserved, 'p']
    ];
    if(this.matchAny(tokens)) {
      parse.statement();
      parse.statements();
    } else if (this.match(TokenType.End)) {
      /* NOOP */
    } else this.raise(`AC [error]: Expected "Identifier", "p (Operator)", or "End"`);
  },
  /*
    Stmt -> id assign (operator) Val Expr
          | print id
   */
  statement: function () {
    console.log('procedure: statement');
    if(this.match(TokenType.Identifier)) {
      this.expect(TokenType.Identifier);
      this.expect(TokenType.Operator, '=');
      parse.val();
      parse.expression();
    } else if(this.match(TokenType.Reserved, 'p')) {
      this.expect(TokenType.Reserved, 'p');
      this.expect(TokenType.Identifier);
    } else this.raise('AC [error]: Expected "Identifier" or "p (Operator)"');
    
  },
  /*  
    Expr -> plus (operator) Val Expr
          | minus (operator) Val Expr
          | λ
   */
  expression: function  () {
    console.log('procedure: expression');
    if(this.match(TokenType.Operator, '+')) {
      this.expect(TokenType.Operator, '+');
      parse.val();
      parse.expression()
    } else if(this.match(TokenType.Operator, '-')) {
      this.expect(TokenType.Operator, '-');
      parse.val();
      parse.expression();
    } else if(this.matchAny([
      [TokenType.Identifier],
      [TokenType.Reserved, 'p'],
      [TokenType.End]
    ])) { /* NOOP */}
    else this.raise('AC [error]: Expected "+ (Operator)" , "- (Operator)", "Identifier", "p (Reserved)", or "End"')
  },
  /*
    Val -> id
         | inum (integer literal)
         | fnum (float literal)
   */
  val: function  () {
    console.log('procedure: val');
    if(this.match(TokenType.Identifier)) 
      this.expect(TokenType.Identifier);
    else if(this.match(Token.typeToString(TokenType.Literal, 'Int')))
      this.expect(Token.typeToString(TokenType.Literal, 'Int'));
    else if(this.match(Token.typeToString(TokenType.Literal, 'Float')))
      this.expect(Token.typeToString(TokenType.Literal, 'Float'));
    else this.raise('AC [error]: Expected "Identifier", "Int Literal", or "Float Literal"');
  }
};

console.log('source to parse: ', scanner.info.file.source);
console.log();
const tree = parser.parse(function(token){
  console.log('procedure: program');
  /* Begin program */
  const tokens = [
      [TokenType.Reserved, 'f'], 
      [TokenType.Reserved, 'i'],
      [TokenType.Identifier],
      [TokenType.Reserved, 'p'],
      [TokenType.End]
    ];
  if(this.matchAny(tokens)) {
    parse.declarations();
    parse.statements();
    this.expect(TokenType.End);
  } else this.raise('AC [error]: Expected "f (Reserved)", "i (Reserved)", "Identifier", "p (Reserved)", or "End"');
  return;
}, parse);
console.log();
console.log(`ACParser [info]: elapsed time - ${parser.info.time.elapsed} ms with ${parser.info.errors.length} errors.`);
console.log(parser.info.errors.length > 0 ? parser.info.errors : '');