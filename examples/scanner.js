// 'use strict';
// const { Scanner, Tokenization, Collections } = require('../');
// const { Token, TokenType } = Tokenization;

// const isOperator = function (c) { return /[+\-*\/\^%=(),]/.test(c); },
//   isEOF = function(c) { return c === '\0' || c === '\0'.charAt(0)},
//   isLetter = function (c) { return /[a-zA-Z]/.test(c); },
//   isDigit = function (c) { return /[0-9]/.test(c); },
//   isWhiteSpace = function (c) { return /\s/.test(c); },
//   isIdentifier = function (c) { return typeof c === "string" &&
// 		!isOperator(c) &&
// 		!isDigit(c) &&
//     !isWhiteSpace(c) &&
// 		!isEOF(c); 
// 	};

// const scan = {
//   'identifier': function (ch) {
//     if(isEOF(ch)) {
//       return undefined;
//     }
//     const reserved = {
//     'var': true, 'let': true,
//     'const':true, 'if':true, 
//     'then':true, 'begin':true,
//     'do': true, 'while':true,
//     'odd':true, 'procedure': true,
//     'call':true };
//     let buffer = [];
//     do {
//       buffer.push(this.nextChar());
//       ch = this.peekChar();
//     } while (isLetter(ch) || isDigit(ch) || ch == '_' || ch == '$');
//     const location = this.location().end();
//     if(buffer.length > 0){
//       if(reserved[buffer.join('')])
//         return new Token(TokenType.Reserved, buffer.join(''), location);
//       else
//        return new Token(TokenType.Identifier, buffer.join(''), location);
//     } else return undefined;
//   },
//   'number': function (ch) {
//     let buffer = [];
//     do {
//       if (ch == '.')
//         do buffer.push((ch = this.peekChar())); while (isDigit(this.nextChar()));
//       else buffer.push(this.nextChar());
//       ch = this.peekChar();
//     } while (isDigit(ch) || ch === '.');
//     const location = this.location().end();
//     return new Token(TokenType.Literal)
//       .prepend('number')
//       .setValue(buffer.join(''))
//       .setLocation(location);
//   },
//   'operator': function (ch) {
//     let two = ch + this.peekChar(1);
//     let name, count = 0;
//         switch(two) {
//         case '==': name = 'equal'; count = 1; break;
//         case '<=': name = 'less than'; count = 1; break;
//         case '>=': name = 'greater than'; count = 1; break;
//         case '!=': name = 'not equal'; count = 1; break;
//         case '++': name = 'increment plus'; count = 1; break;
//         case '**': name = 'increment multiply'; count = 1; break;
//         case '--': name = 'increment minus'; count = 1; break;
//         case '+=': name = 'increment add assign'; count = 1; break;
//         case '-=': name = 'increment subtract assign'; count = 1; break;
//         case '||': name = 'or'; break;
//       }
//     let one = ch;
//       switch(one) {
//         case '+': name = 'plus'; count = 2; break;
//         case '-': name = 'minus'; count = 2; break;
//         case '*': name = 'multiply'; count = 2; break;
//         case '/': name = 'divide'; count = 2; break;
//         case '=': name = 'assign'; count = 2; break;
//         case '&': name = 'and'; count = 2; break;
//       }

//       if(count === 1) this.nextChar(); else { this.nextChar(); this.nextChar(); }
//       return new Token(TokenType.Operator, count === 1 ?  one : two)
//       .setLocation(this.location().end())
//       .prepend(name);
//   },
//   'punctuation': function(ch) {
//     this.nextChar();
//     return new Token(TokenType.Punctuation, ch)
//     .setLocation(this.location().end())
//     .prepend((() => {
//       switch(ch) {
//         case '(': return 'left paren';
//         case ')': return 'right paren';
//         case ';': return 'semi colon';
//         case '.': return 'period';
//         case ',': return 'comma';
        
//       }
//     })())
//   },
//   'end': function(ch) {
//     return new Token(TokenType.End, ch, this.location().eof());
//   }
// };

// const scanner = new Scanner('alpha = 16;');
// // const scanner = new Scanner(require('fs').)
// const stream = scanner.scan(function (ch) {
//   this.location().start();
//   switch (ch) {
//     case '0': case '1':
//     case '2': case '3':
//     case '4': case '5':
//     case '6': case '7':
//     case '8': case '9':
//       return scan.number.call(this, ch);
//     case '=': case '+':
//     case '-': case '*':
//     case '/': case '%':
//       return scan.operator.call(this, ch);
//     case '(': case ')':
//     case ';':
//       return scan.punctuation.call(this, ch);
//     default:
//       return scan.identifier.call(this, ch) || 
//       (isEOF(ch) ? scan.end.call(this, ch) : new Token(TokenType.Invalid));
//   }
// });
// const elapsed = scanner.info.time.elapsed;
// console.log('time elapsed:', elapsed, elapsed > 1 ? 'milliseconds' : 'millisecond');

// stream.forEach(s => console.log(s));
 
// module.exports = stream;