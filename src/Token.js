/* @module {Token} - Contains the necessary data structures to define a Token */

/* eslint-disable dot-notation */
const TokenType = (() => {
  const Type = {};
  /* Identifiers */
  Type[Type['Identifier'] = 1] = 'Identifier';
  /* Keywords */
  Type[Type['Keyword'] = 2] = 'Keyword';
  /* Reserved */
  Type[Type['Reserved'] = 3] = 'Reserved';
  /* Literals */
  Type[Type['Literal'] = 4] = 'Literal';
  /* Operator */
  Type[Type['Operator'] = 5] = 'Operator';
  /* Punctuation */
  Type[Type['Punctuation'] = 6] = 'Punctuation';
  /* Other types */
  Type[Type['Comment'] = 100] = 'Comment';
  Type[Type['Whitespace'] = 50] = 'Whitespace';
  Type[Type['End'] = 0] = 'End';
  Type[Type['Invalid'] = -1] = 'Invalid';
  return Type;
})();
/* eslint-enable dot-notation */

class Token {
  /*
    @param {type?: TokenType} - The token's type.
    @param {value?: string} - The token's character value.
    @param {location?: Location} - The token's location.
    @example: javascript {
      let location = { start: new Location(), end: new Location() };
      let token = new Token(TokenType.Identifier, 'hello', location);
    }
    @notes: markdown {
      * Use `type` and not `stype` for token comparisons.
      * Token `stype` are camel cased when normalized.
    }
   */
  constructor(type, value, location) {
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
  static stringToType(str) {
    let type;
    [
      'Identifier',
      'Keyword',
      'Reserved',
      'Literal',
      'Operator',
      'Punctuation',
      'Comment',
      'Whitespace',
      'End',
      'Invalid',
    ].forEach(t => {
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
  static typeToString(type, prepend) {
    const normalize = (str) => {
      if (!str) {
        return '';
      }
      if (str.match(/[ -_]/g)) {
        return str.replace(/[-_]/g, ' ')
          .split(' ')
          .map(s => s[0].toUpperCase() + s.substring(1, s.length).toLowerCase())
          .join('');
      }
      return str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
    };
    switch (type) {
      case TokenType.Identifier:
        return 'Identifier';
      case TokenType.Keyword:
        return 'Keyword';
      case TokenType.Reserved:
        return 'Reserved';
      case TokenType.Literal:
        return `${normalize(prepend)} Literal`;
      case TokenType.Operator:
        return `${normalize(prepend)} Operator`;
      case TokenType.Punctuation:
        return `${normalize(prepend)} Punctuation`;
      case TokenType.Comment:
        return `${normalize(prepend)} Comment`;
      case TokenType.Whitespace:
        return 'Whitespace';
      case TokenType.Invalid:
        return 'Invalid';
      case TokenType.End:
        return 'End';
      default: break;
    }
    return '';
  }
  /*
    @param {value = '': string} - The value to prepend to the token type.
    @return {class Token}
    @notes: {
      * Use `prepend()` to add additional info to the token type. e.g. 'Operator' => 'AddOperator'
    }
  */
  prepend(value = '') {
    this.pvalue = value;
    this.stype = this.typeToString();
    return this;
  }
        /*
          @param {type: enum TokenType} - The token type.
          @return {class Token}
        */
  setType(type) {
    this.type = type;
    return this;
  }
 /*
   @param {location: Location} - The token's location.
   @return {class Token}
 */
  setLocation(location) {
    this.loc = location;
    return this;
  }
  /*
    @param {location: Location} - The token's character value.
    @return {class Token}
  */
  setValue(value) {
    this.value = value;
    return this;
  }
  /* @return {object: { start: class Location, end: class Location }} - The token's location. */
  location() {
    return this.loc;
  }
  /* @see {static Token.typeToString()} */
  typeToString() {
    return Token.typeToString(this.type, this.pvalue);
  }
  /*
    @param {t: TokenType | string | Token} - The type or token to compare.
    @return {boolean} - Determines whether the token is equal to the type.
  */
  isEqual(t, value) {
    const isEqual = () => {
      if (typeof t === 'string') {
        return t === (this.stype || Token.stringToType(t) === this.type);
      }
      if (t instanceof Token) {
        return t.type === this.type || t.stype === this.stype;
      }
      return t === this.type;
    };
    if (value) {
      return this.value === value && isEqual();
    }
    return isEqual();
  }
  /* @return {string} - The string representation of the Token class. */
  toString() {
    return `token type: ${this.type}, value: ${this.value}`;
  }
  /* @return {object} - The JSON representation of the Token class. */
  toJSON() {
    let { start, end } = this.loc;
    start = start.toJSON();
    end = end.toJSON();
    return {
      token: {
        type: { key: this.type, value: this.stype },
        value: this.value,
        location: {
          start,
          end,
          range: {
            line: [start.line, end.line],
            column: [start.column, end.column],
          },
        },
      },
    };
  }
}

export default {
  TokenType,
  Token,
};
