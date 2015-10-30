'use strict';

const Scanner = require('./lib/Scanner').default;
const Token = require('./lib/Token').default;
const File = require('fs');
const Path = require('path');

const scanner = new Scanner(File.readFileSync(Path.join(__dirname, 'src/Token.js'), 'utf8'));


function isKeyword (string) {
  return /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/.test(string);
}

const scan = {
  identiferOrKeyword: function () {
    var buffer = '';
    var character = this.peekChar ();
      do {
        buffer += this.nextChar ();
        character = this.peekChar ();
      } while (this.isLetter(character) || character == '_' || character == '$');
      
      if (isKeyword (buffer)){
        return new Token ('keyword', buffer, this.toJSON());
      } 
      return new Token ('identifer', buffer, this.toJSON());
  },
  stringLiteral: function () {
    var buffer = '';

    var delimiter = this.nextChar ();
      var character = this.peekChar ();
      while (character != delimiter && character != this.EOF) {
        if (character == '\\') {
          this.nextChar ();
          buffer += (()=>{
            switch (this.nextChar ()) {
        case 'b': this.nextChar ();
          return "\\b";
        case 't': this.nextChar ();
          return "\\t";
        case 'n': this.nextChar ();
          return "\\n";
        case 'f': this.nextChar ();
          return "\\f";
        case 'r': this.nextChar ();
          return "\\r";
        case '"': this.nextChar ();
          return "\"";
        case '\'': this.nextChar ();
          return "\\'";
        case '\\': this.nextChar ();
          return "\\\\";
        default:
          this.nextChar ();
          return "";
        }
          })();
        } else {
          buffer += this.nextChar ();
        }
        character = this.peekChar ();
      }
      if (this.nextChar () == this.EOF) {
        /* Throw error here */
      }
      return new Token ('string literal', buffer, this.toJSON());
  }
};

function tokenizer (char) {
  if(this.isLetter(char) || char === '_' || char === '$')
    return scan.identiferOrKeyword.call(this);
  else if(char === '\n')
    this.nextChar();
  else if(char === '\'' || char === '"')
    return scan.stringLiteral.call(this);
  else {
    this.nextChar();
    return new Token('other', char, this.toJSON());
  }
}


const stream = scanner.scan(tokenizer);

stream.toBuffer().forEach(token => console.log(token.toJSON()))