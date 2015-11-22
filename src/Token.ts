import Location from './Location';

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
    /** The enum value of the token type. */
    public type: TokenType;
    /** The enum string value of the token type. */
    public stype: string;
    /** The string value of the token/char. */
    public value: string;
    /** The prepend value. */
    private pvalue: string;
    /** The location. */
    private loc;
    constructor (type?: TokenType, value?:string, location?: { start: Location, end: Location }) {
      this.type = type;
      this.stype = this.typeToString();
      this.value = value;
      this.pvalue = '';
      this.loc = location;
    }
    public static stringToType(str: string) {
      let type: TokenType;
      [
        'Identifier',
        'Reserved',
        'Literal',
        'Operator',
        'Punctuation',
        'Comment',
        'WhiteSpace',
        'End',
        'Invalid'
      ].forEach(function(t){
        if(str.indexOf(t) > -1) type = TokenType[t];
      });
      return type;
    }
    public static typeToString(type, prepend?) : string {
      const normalize = (str:string) : string => {
        if(!str) {
          return '';
        }
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
          return normalize(prepend) + 'Literal';
        case TokenType.Operator:
          return normalize(prepend) + 'Operator';
        case TokenType.Punctuation:
          return normalize(prepend) + 'Punctuation';
        case TokenType.Comment:
          return normalize(prepend) + 'Comment';
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
    public prepend(value = '') {
      this.pvalue = value;
      this.stype = this.typeToString();
      return this;
    }
    public setType (type:TokenType) {
      this.type = type;
      return this;
    }
    public setLocation (location) {
      this.loc = location;
      return this;
    }
    public setValue (value) {
      this.value = value;
      return this;
    }
    public location () : { start: Location, end: Location } {
      return this.loc;
    }
    /**
     * Converts type to string.
     */
    public typeToString() : string {
      return Token.typeToString(this.type, this.pvalue);
    }
    /**
     * Returns a string representation of the Token class.
     */
    public toString () : string {
      return `token type: ${ this.type }, value: ${ this.value }`;
    }
    public toJSON () : {} {
      let { start, end } = this.loc;
      start = start.toJSON();
      end = end.toJSON();
      return  {
        token: {
          type: { key: this.type, value: this.stype},
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
