'use strict';

interface ObjectCtor extends ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
declare const Object: ObjectCtor;
export let assign = Object.assign ? Object.assign : function(target: any, ...sources: any[]): any {
        return;
};

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      let to = Object(target);
      for (let i = 1; i < arguments.length; i++) {
        let nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        let keysArray = Object.keys(nextSource);
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          let nextKey = keysArray[nextIndex];
          let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

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
    public key = { operator: '', comment: ''} ;
    private source;
    constructor (type: TokenType, value:string, source) {
      this.type = type;
      this.value = value;
      this.source = source;
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
          return (key.operator || key) + 'Operator';
        case TokenType.Comment:
          return (key.comment || key) + 'Comment';
        case TokenType.WhiteSpace:
          return 'WhiteSpace';
        case TokenType.Invalid:
          return 'Invalid';
        case TokenType.End:
          return 'End';
      }
    }
    /**
     * Appends a detailed description to the operator type when
     * converting the type to string.
     */
    public appendToOperator(key = '') {
      this.key.operator = key;
      return this;
    }
    /**
     * Appends a detailed description to the comment type when
     * converting the type to string.
     */
    public appendToComment(key = '') {
      this.key.comment = key;
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
      return Object.assign(this.source.toJSON(), {
        token: {
          type: { key: this.type, value: this.typeToString() },
          value: this.value
        }
      });
    }
  }
}

export default Tokenization;
