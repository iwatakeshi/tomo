'use strict';

module Tokenization {
  export enum TokenType {
    /** Identifiers */
    Identifier = 1,
    Reserved = 2,
    /** Literals */
    Literal = 3,
    /** Operator */
    Operator = 4,
    /** Punctuation */
    Punctuation = 5,
    /**
     * Other types
     */
    Comment = 100,
    WhiteSpace = 50,
    End = 0,
    Invalid = -1
  }

  export class Token {
    public type: TokenType;
    public value: string;
    public key: string ;
    private location;
    constructor (type?: TokenType, value?:string, location?) {
      this.type = type;
      this.value = value;
      this.location = location;
    }
    public static typeToString(type, key) : string {
      const normalize = (str:string) : string => {
        if(str.match(/[ -_]/g)) {
          return str.replace(/[-_]/g, ' ')
          .split(' ')
          .map(s => s[0].toUpperCase() + s.substring(1, s.length).toLowerCase())
          .join('');
        } else return str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
      };
      switch(type) {
        case TokenType.Identifier:
          return 'Indentifier';
        case TokenType.Reserved:
          return 'Reserved';
        case TokenType.Literal:
          return normalize(key) + 'Literal';
        case TokenType.Operator:
          return normalize(key) + 'Operator';
        case TokenType.Punctuation:
          return normalize(key) + 'Punctuation';
        case TokenType.Comment:
          return normalize(key) + 'Comment';
        case TokenType.WhiteSpace:
          return 'WhiteSpace';
        case TokenType.Invalid:
          return 'Invalid';
        case TokenType.End:
          return 'End';
      }
    }
    /**
     * Appends a detailed description to the specified type when
     * converting the type to string.
     */
    public prepend(key = '') {
      this.key = key;
      return this;
    }
    public setType (type:TokenType) {
      this.type = type;
      return this;
    }
    public setLocation (location) {
      this.location = location;
      return this;
    }
    public setValue (value) {
      this.value = value;
      return this;
    }
    /**
     * Converts type to string.
     */
    public typeToString() : string {
      return Token.typeToString(this.type, this.key);
    }
    /**
     * Returns a string representation of the Token class.
     */
    public toString () : string {
      return `token type: ${ this.type } - ${ this.typeToString() }, value: ${ this.value }`;
    }
    public toJSON () : {} {
      let { start, end } = this.location;
      start = start.toJSON();
      end = end.toJSON();
      return  {
        token: {
          type: { key: this.type, value: this.typeToString() },
          value: this.value,
          location: {
            start: start,
            end: end,
            range: {
              line: [start.line, end.line],
              column: [start.column, end.column]
            }
          }
        }
      };
    }
  }
}

export default Tokenization;
