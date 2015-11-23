import Tokenize from './Token';
/* @class {Stream} - Creates a stream object. */
class Stream {
  public position: number;
  public length: number;
  private stream: Array<any>;
  /* 
    @param {tokens: Array<class Token>} - The scanned tokens.
  */
  constructor(tokens: Array<Tokenize.Token> = []) {
    this.stream = tokens;
    this.length = tokens.length;
    this.position = 0;
  }
  /*
   @method {add} - Adds the token to the stream.
   @param {token: class Token} - The token.
  */
  public add(token: Tokenize.Token) {
    this.stream.push(token);
  }
  /*
    @method {previous} - Moves to the previous token.
    @return {class Token} - The previous token.
  */
  public previous(): Tokenize.Token {
    return this.stream[--this.position];
  }
  /*
    @method {next} - Moves to the next token.
    @return {class Token} - The next token.
  */
  public next(): Tokenize.Token {
    if (this.position >= this.stream.length)
      return new Tokenize.Token(Tokenize.TokenType.End);
    return this.stream[this.position++];
  }
  /*
   @method {peek} - Looks ahead by n tokens.
   @return {class Token} - The look-ahead token.
  */
  public peek(n: number): Tokenize.Token {
    return this.stream[this.position + n];
  }
  /*
    @method {peekBack} - Looks behind by n tokens.
    @return {class Token} - The look-behind token.
  */
  public peekBack(n: number): Tokenize.Token {
    return this.stream[this.position - n];
  }
  /*
    @method {current}
    @return {class Token} - The current token.
  */
  public current(): Tokenize.Token {
    return this.stream[this.position];
  }
  /*
    @method {forEach} - Loops through the tokens in the stream.
  */
  public forEach(callback, thisArg) {
    let T, k, O = this.stream, len = O.length;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) T = thisArg;
    k = 0;
    while (k < len) {
      let kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  }
}

export default Stream;
