import Tokenize from './Token';
/* @class {Stream} - Creates a stream object. */
class Stream {
    /*
      @param {tokens: Array<class Token>} - The scanned tokens.
    */
    constructor(tokens = []) {
        this.stream = tokens;
        this.length = tokens.length;
        this.position = 0;
    }
    /*
      @method {previous} - Moves to the previous token.
      @return {class Token} - The previous token.
    */
    previous() {
        return this.stream[--this.position];
    }
    /*
      @method {next} - Moves to the next token.
      @return {class Token} - The next token.
    */
    next() {
        if (this.position >= this.stream.length)
            return new Tokenize.Token(Tokenize.TokenType.End);
        return this.stream[this.position++];
    }
    /*
     @method {peek} - Looks ahead by n tokens.
     @param {n = 0} - The number of peek.
     @return {class Token} - The look-ahead token.
    */
    peek(n = 0) {
        return this.stream[this.position + n];
    }
    /*
      @method {peekBack} - Looks behind by n tokens.
      @param {n = 0} - The number of peek-back.
      @return {class Token} - The look-behind token.
    */
    peekBack(n = 0) {
        return this.stream[this.position - n];
    }
    /*
      @method {current}
      @return {class Token} - The current token.
    */
    current() {
        return this.stream[this.position];
    }
    /*
      @method {forEach} - Loops through the tokens in the stream.
    */
    forEach(callback, thisArg) {
        let T, k, O = this.stream.slice(), len = O.length;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1)
            T = thisArg;
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
