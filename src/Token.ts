import Location from './Location';

/* @module {Token} - Contains the necessary data structures to define a Token */
module Token {
  /* @export {enum TokenType} - Identifies the token type. */
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
    /** Other types */
    Comment = 100,
    Whitespace = 50,
    End = 0,
    Invalid = -1
  }
  /* @export {class Token} - Creates a token object. */
  export class Token {
    /** The enum value of the token type. */
    public type: TokenType;
    /** The enum string value of the token type. */
    public stype: string;
    /** The string value of the token character. */
    public value: string;
    /** The prepend value. */
    private pvalue: string;
    /** The location. */
    private loc;
    /*
      @param {type?: enum TokenType} - The token's type.
      @param {value?: string} - The token's character value.
      @param {location?: class Location} - The token's location.
      @example: javascript {
        let location = { start: new Location(), end: new Location() };
        let token = new Token(TokenType.Identifier, 'hello', location);
      }
      @notes: markdown {
        * Use `type` and not `stype` for token comparisons.
        * Token `stype` are camel cased when normalized.
      }
     */
    constructor(type?: TokenType, value?: string, location?: { start: Location, end: Location }) {
      this.type = type;
      this.stype = this.typeToString();
      this.value = value;
      this.pvalue = '';
      this.loc = location;
    }
    /*
      @param {str: string} - The string to transform.
      @returns {enum TokenType} - Returns the token type by string.
      @example: javascript {
        let type = Token.stringToType('Identifier');
      }
     */
    public static stringToType(str: string): TokenType {
      let type: TokenType;
      [
        'Identifier',
        'Reserved',
        'Literal',
        'Operator',
        'Punctuation',
        'Comment',
        'Whitespace',
        'End',
        'Invalid'
      ].forEach(function(t) {
        if (str.indexOf(t) > -1) type = TokenType[t];
      });
      return type;
    }
    /*
      @param {type: enum TokenType} - The token type to transform.
      @param {prepend?: string} - The additional info to prepend to the token type.
      @return {string} - The string representation by token type.
      @example: javascript {
        let type = Token.typeToString(TokenType.Identifier);
      }
      @notes: markdown {
        * Using `typeToString()` normalizes 'semi colon', 'semi-colon' => 'SemiColon' but fails
          when 'SemiColon' which => 'Semicolon'.
      }
     */
    public static typeToString(type: TokenType, prepend?: string): string {
      const normalize = (str: string): string => {
        if (!str) {
          return '';
        }
        if (str.match(/[ -_]/g)) {
          return str.replace(/[-_]/g, ' ')
            .split(' ')
            .map(s => s[0].toUpperCase() + s.substring(1, s.length).toLowerCase())
            .join('');
        } else return str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
      };
      switch (type) {
        case TokenType.Identifier:
          return 'Identifier';
        case TokenType.Reserved:
          return 'Reserved';
        case TokenType.Literal:
          return normalize(prepend) + 'Literal';
        case TokenType.Operator:
          return normalize(prepend) + 'Operator';
        case TokenType.Punctuation:
          return normalize(prepend) + 'Punctuation';
        case TokenType.Comment:
          return normalize(prepend) + 'Comment';
        case TokenType.Whitespace:
          return 'Whitespace';
        case TokenType.Invalid:
          return 'Invalid';
        case TokenType.End:
          return 'End';
      }
    }
    /*
      @param {value = '': string} - The value to prepend to the token type.
      @return {class Token}
      @notes: {
        * Use `prepend()` to add additional info to the token type. e.g. 'Operator' => 'AddOperator'
      }
    */
    public prepend(value = '') {
      this.pvalue = value;
      this.stype = this.typeToString();
      return this;
    }
    /*
      @param {type: enum TokenType} - The token type.
      @return {class Token}
    */
    public setType(type: TokenType) {
      this.type = type;
      return this;
    }
    /*
     @param {location: class Location} - The token's location.
     @return {class Token}
   */
    public setLocation(location) {
      this.loc = location;
      return this;
    }
    /*
      @param {location: class Location} - The token's character value.
      @return {class Token}
    */
    public setValue(value) {
      this.value = value;
      return this;
    }
    /* @return {object: { start: class Location, end: class Location }} - The token's location. */
    public location(): { start: Location, end: Location } {
      return this.loc;
    }
    /* @see {static Token.typeToString()} */
    public typeToString(): string {
      return Token.typeToString(this.type, this.pvalue);
    }
    /*
      @param {t: TokenType | string | Token} - The type or token to compare.
      @return {boolean} - Determines whether the token is equal to the type.
    */
    public isEqual(t: TokenType | string | Token, value?: string): boolean {
      const isEqual = () : boolean => {
        if (typeof t === 'string') {
          return t === (this.stype || Token.stringToType(t) === this.type);
        } else if(t instanceof Token) {
          return t.type === this.type || t.stype === this.stype;
        } else return t === this.type;
      };
      if(value) return this.value === value && isEqual();
      else return isEqual();
    }
    /* @return {string} - The string representation of the Token class. */
    public toString(): string {
      return `token type: ${ this.type }, value: ${ this.value }`;
    }
    /* @return {object} - The JSON representation of the Token class. */
    public toJSON(): {} {
      let { start, end } = this.loc;
      start = start.toJSON();
      end = end.toJSON();
      return {
        token: {
          type: { key: this.type, value: this.stype },
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

export default Token;
