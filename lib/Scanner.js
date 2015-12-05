var Utils_1 = require('./Utils');
var Location_1 = require('./Location');
var Stream_1 = require('./Stream');
var Options_1 = require('./Options');
/* @class {Scanner} - Creates a scanner object. */
var Scanner = (function () {
    /*
      @param {source: Source} - The source object.
      @param {options = Options.Scanner} - The options.
      @example: javascript {
        const scanner = new Scanner(new Source('var x = 12;'));
      }
     */
    function Scanner(source, options) {
        if (options === void 0) { options = Options_1["default"].Scanner; }
        this.source = source;
        this.options = options;
        this.tokens = [];
        this.stack = [];
        this.line = 1;
        this.column = 0;
        this.range = new Location_1.Range();
        this.info = {
            time: { elapsed: 0 },
            file: {
                name: source.name,
                length: source.length,
                source: source.source,
                position: source.position
            }
        };
    }
    /*
      @method {scan} - Calls the tokenizer as it scans through the source.
      @param {tokenizer: (char: string | number) => Token} - The tokenizer function which returns a token.
      @return {class Stream} - The token stream.
      @example: javascript {
        let scanner = new Scanner(new Source('...'));
        scanner.scan(function(ch) {
          //...
        });
      }
    */
    Scanner.prototype.scan = function (tokenizer) {
        var start = Date.now();
        this.ignoreWhiteSpace();
        while (this.peek() !== this.source.EOF) {
            var token = tokenizer.call(this, this.peek());
            if (token)
                this.tokens.push(token);
            this.ignoreWhiteSpace();
        }
        if (this.peek() === this.source.EOF) {
            var token = tokenizer.call(this, this.peek());
            if (token)
                this.tokens.push(token);
        }
        this.info.time.elapsed = (Date.now() - start);
        return new Stream_1["default"](this.tokens.slice());
    };
    /*
      @method {location} - Marks the locations.
      @return {
        {
          start: () => void,
          end: () => Range,
          eof: () => Range
        }
      } - The location helpers.
      @example: javascript {
        //...
        scanner.scan(ch => {
          this.location().start();
          //...
          this.location().end();
        });
      }
    */
    Scanner.prototype.location = function () {
        var _this = this;
        var _a = this, line = _a.line, column = _a.column;
        return {
            start: function () {
                _this.range = new Location_1.Range();
                _this.range.start = new Location_1.Location(Number(line), Number(column));
            },
            end: function () {
                _this.range.end = new Location_1.Location(Number(line), Number(column));
                return _this.range;
            },
            eof: function () {
                _this.location().start();
                return _this.location().end();
            }, line: line, column: column
        };
    };
    /*
      @return {string | number} - The previous character.
     */
    Scanner.prototype.previous = function () {
        if (this.stack.length === 0)
            return;
        this.pop();
        var _a = this.stack[this.stack.length - 1], line = _a.line, column = _a.column;
        this.line = line;
        this.column = column;
        return this.source.charAt(--this.source.position);
    };
    /*
      @return {string | number} - The next character.
     */
    Scanner.prototype.next = function () {
        // If we are at the end or over the length
        // of the source then return EOF
        if (this.source.position >= this.source.length) {
            return this.source.EOF;
        }
        // If we reach a new line then
        // increment the line and reset the column
        // else increment the column
        if (Utils_1["default"].Code.isLineTermintor(this.source.charAt(this.source.position))) {
            this.line++;
            this.column = 0;
            this.push();
        }
        else {
            this.column++;
            this.push();
        }
        return this.source.charAt(this.source.position++);
    };
    /*
      @param {peek = 0} - The number of steps to peek backward.
      @return {string | number} - The previous character(s) to peek.
     */
    Scanner.prototype.peekBack = function (peek) {
        if (peek === void 0) { peek = 0; }
        return this.source.charAt(this.source.position - peek);
    };
    /*
      @param {peek = 0} - The number of steps to peek forward.
      @return {string | number} - The next character(s) to peek.
     */
    Scanner.prototype.peek = function (peek) {
        if (peek === void 0) { peek = 0; }
        // If we peek and the we reach the end or over
        // the length then return EOF
        if (this.source.position + peek >= this.source.length) {
            return this.source.EOF;
        }
        return this.source.charAt(this.source.position + peek);
    };
    /*
      @method {ignoreWhiteSpace} - Ignores the whitespaces in the source.
     */
    Scanner.prototype.ignoreWhiteSpace = function () {
        if (!this.options.ignore.whitespace) {
            if (this.options.override.whitespace &&
                typeof this.options.override.whitespace === 'function') {
                var isWhiteSpace = this.options.override.whitespace;
                while (isWhiteSpace(this.peek())) {
                    this.next();
                }
            }
        }
        else
            while (Utils_1["default"].Code.isWhiteSpace(this.peek())) {
                this.next();
            }
        return;
    };
    /*
      @method {push} - Pushes the current charater and location into the history stack.
     */
    Scanner.prototype.push = function () {
        this.stack.push({
            char: this.source.charAt(this.source.position),
            location: {
                range: this.range
            }
        });
    };
    /*
      @method {pop} - Pops the previous charater and location from the history stack.
     */
    Scanner.prototype.pop = function () {
        this.stack.pop();
    };
    return Scanner;
})();
exports["default"] = Scanner;
