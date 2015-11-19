'use strict';

module Tokenization {
  export enum TokenType {
    /** Identifiers */
    Identifier = 1,
    Reserved = 2,
    /** Literals */
    NumberLiteral = 3,
    IntLiteral = 4,
    FloatLiteral = 5,
    StringLiteral = 6,
    CharacterLiteral = 7,
    /** Operator */
    Operator = 8,
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
    private range;
    constructor (type: TokenType, value:string, range) {
      this.type = type;
      this.value = value;
      this.range = range;
    }
    public static typeToString(type, key) : string {
      switch(type) {
        case TokenType.Identifier:
          return 'Indentifier';
        case TokenType.Reserved:
          return 'Reserved';
        case TokenType.NumberLiteral:
          return 'NumberLiteral';
        case TokenType.IntLiteral:
          return 'IntLiteral';
        case TokenType.FloatLiteral:
          return 'FloatLiteral';
        case TokenType.StringLiteral:
          return 'StringLiteral';
        case TokenType.CharacterLiteral:
          return 'CharacterLiteral';
        case TokenType.Operator:
          return key + 'Operator';
        case TokenType.Comment:
          return key + 'Comment';
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
    public append(key = '') {
      this.key = key;
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
      return  {
        token: {
          type: { key: this.type, value: this.typeToString() },
          value: this.value,
          location: {
            start: this.range.start.toJSON(),
            end: this.range.end.toJSON()
          }
        }
      };
    }
  }
}

export default Tokenization;
