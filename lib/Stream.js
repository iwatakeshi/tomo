var Token_1 = require('./Token');
/* @class {Stream} - Creates a stream object. */
var Stream = (function () {
    /*
      @param {tokens: Array<class Token>} - The scanned tokens.
    */
    function Stream(tokens) {
        if (tokens === void 0) { tokens = []; }
        this.stream = tokens;
        this.length = tokens.length;
        this.position = 0;
    }
    /*
     @method {add} - Adds the token to the stream.
     @param {token: class Token} - The token.
    */
    Stream.prototype.add = function (token) {
        this.stream.push(token);
    };
    /*
      @method {previous} - Moves to the previous token.
      @return {class Token} - The previous token.
    */
    Stream.prototype.previous = function () {
        return this.stream[--this.position];
    };
    /*
      @method {next} - Moves to the next token.
      @return {class Token} - The next token.
    */
    Stream.prototype.next = function () {
        if (this.position >= this.stream.length)
            return new Token_1["default"].Token(Token_1["default"].TokenType.End);
        return this.stream[++this.position];
    };
    /*
     @method {peek} - Looks ahead by n tokens.
     @return {class Token} - The look-ahead token.
    */
    Stream.prototype.peek = function (n) {
        return this.stream[this.position + n];
    };
    /*
      @method {peekBack} - Looks behind by n tokens.
      @return {class Token} - The look-behind token.
    */
    Stream.prototype.peekBack = function (n) {
        return this.stream[this.position - n];
    };
    /*
      @method {current}
      @return {class Token} - The current token.
    */
    Stream.prototype.current = function () {
        return this.stream[this.position];
    };
    /*
      @method {forEach} - Loops through the tokens in the stream.
    */
    Stream.prototype.forEach = function (callback, thisArg) {
        var T, k, O = this.stream, len = O.length;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1)
            T = thisArg;
        k = 0;
        while (k < len) {
            var kValue = void 0;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
    return Stream;
})();
exports["default"] = Stream;
