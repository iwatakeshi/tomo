'use strict';

const Scanner = require('./lib/Scanner').default;
const Token = require('./lib/Token').default;
const File = require('fs');
const Path = require('path');

class Node {
  constructor (token = undefined) {
    this._token = token;
    this._level = 0;
    this._children = [];
  }

  get level () {
    return this._level;
  }

  set level (level) {
    return this._level = level;
  }

  add (token) {
    this.addNode(new Node(token));
  }

  addNode (node) {
    node.level = this._level + 1
    this._children.push(node);
  }

  toString() {
    return this._token.toString() + this._token.source.toString(); 
  }

  toJSON() {
    return Object.assign(this._token.toJSON(), {
      "node" : {
        "level" : this._level,
        "children": this._children
      }
    }); 
  }
}

class Parser {
  constructor(stream) {
    this._stream = stream;
  }

  get stream () {
    return this._stream;
  }

  parse(callback) {
    if(typeof callback === 'function') {
      return callback.call(this);
    }
  }
}


// const scanner = new Scanner(File.readFileSync(Path.join(__dirname, 'src/Token.js'), 'utf8'));
const scanner = new Scanner(' 1.35 + 2');

const scan = {
  number: function  () {
    let buffer = '';
    let char = this.peekChar();
    while(this.isDigit(char) || char === '.') {
      if(char === '.') {
        buffer += char;
        this.nextChar();
      }
      buffer += this.nextChar();
      char = this.peekChar();
    }
    return new Token('number', buffer, this.source);
  },
  operator: function () {
    const char = this.peekChar();
    this.nextChar();
    return new Token('operator', char, this.source);
  },
  whitespace: function () {
    let char = this.peekChar();
    this.nextChar();
    return new Token('whitespace', char, this.source);
  }
};

const parse =  {

/**
 * http://stackoverflow.com/a/9786085/1251031
 * http://www.nongnu.org/bnf/#infix
 * 
 * expression = term ('+' term | '-' term)*
 * term = factor ('*' factor | '/' factor)*
 * factor = ['-'] (number | '(' expression ')')
 * 
 * number = {digit} ['.' {digit}]
 * digit = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'
 */
  program: function (stream) {
    let root = new Node();
    this.expression(node);
    while(!stream.isEOS){
      root.add(this.expression(stream, root));
    }
    return root;
  },
  expression: function  (stream, root) {
    this.term(stream, root);
    while(stream.match('operator', '+') || stream.match('operator','-')) {
      root.add(this.term(stream, root));
    }
  },
  assignment: function (stream) {
    
  },
  term: function (stream) {
    this.factor(stream);
    while(stream.match('operator', '*') || stream.match('operator', '/')) {
      this.factor(stream);
    }
  },

  factor: function (stream) {
    /**
     * factor = NUMBER | '(' expression ')'
     */

  }
}

function tokenizer (char) {
  if(this.isDigit(char)) {
    return scan.number.call(this);
  } else {
    switch(char) {
      case '+': case '-': 
      case '*': case '/':
        return scan.operator.call(this);
        break;
      case ' ': case '\n': 
      case '\r': case '\t':
        return scan.operator.call(this);
        break;
      break;
    }
  }
}

function parser () {
  return parse.program(this.stream);
}


const stream = scanner.scan(tokenizer);
const ast = (new Parser(stream)).parse(parser);
console.log(JSON.stringify(stream.toJSON(), null, 2));