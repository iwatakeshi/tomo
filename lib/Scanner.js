var Source_1 = require('./Source');
var Utils_1 = require('./Utils');
var Location_1 = require('./Location');
var Stream_1 = require('./Stream');
var Options_1 = require('./Options');
var Scanner = (function () {
    function Scanner(source, options) {
        if (options === void 0) { options = Options_1["default"].Scanner; }
        this.source = new Source_1["default"](source, options);
        this.options = options;
        this.tokens = [];
        this.stack = [];
        this.line = 1;
        this.column = 0;
        this.range = { start: undefined, end: undefined };
        this.info = { time: { elapsed: 0 } };
    }
    Scanner.prototype.scan = function (tokenizer) {
        var start = Date.now();
        this.ignoreWhiteSpace();
        while (this.peekChar() !== this.source.EOF) {
            var token = tokenizer.call(this, this.peekChar());
            if (token)
                this.tokens.push(token);
            this.ignoreWhiteSpace();
        }
        if (this.peekChar() === this.source.EOF) {
            var token = tokenizer.call(this, this.peekChar());
            if (token)
                this.tokens.push(token);
        }
        this.info.time.elapsed = (Date.now() - start);
        return new Stream_1["default"](this.tokens);
    };
    Scanner.prototype.location = function () {
        var _this = this;
        var _a = this, line = _a.line, column = _a.column;
        return {
            start: function () {
                _this.range = { start: undefined, end: undefined };
                _this.range.start = new Location_1["default"](Number(line), Number(column));
                return _this.range;
            },
            end: function () {
                _this.range.end = new Location_1["default"](Number(line), Number(column));
                return _this.range;
            },
            eof: function () {
                _this.location().start();
                return _this.location().end();
            }
        };
    };
    Scanner.prototype.prevChar = function () {
        if (this.stack.length === 0)
            return;
        this.pop();
        var _a = this.stack[this.stack.length - 1], line = _a.line, column = _a.column;
        this.line = line;
        this.column = column;
        return this.source.charAt(this.source.position--);
    };
    Scanner.prototype.nextChar = function () {
        // If we are at the end or over the length
        // of the source then return EOF
        if (this.source.position >= this.source.length) {
            return this.source.EOF;
        }
        // If we reach a new line then
        // increment the line and reset the column
        // else increment the column
        if (this.source.charAt(this.source.position) === '\n' ||
            this.source.charAt(this.source.position) === '\n'.charCodeAt(0)) {
            this.line++;
            this.column = 0;
            this.push();
        }
        else {
            // console.log(this.location().column, this.source.position);
            this.column++;
            this.push();
        }
        return this.source.charAt(this.source.position++);
    };
    Scanner.prototype.lookBackChar = function (peek) {
        if (peek === void 0) { peek = 0; }
        return this.source.charAt(this.source.position - peek);
    };
    Scanner.prototype.peekChar = function (peek) {
        if (peek === void 0) { peek = 0; }
        // If we peek and the we reach the end or over
        // the length then return EOF
        if (this.source.position + peek >= this.source.length) {
            return this.source.EOF;
        }
        return this.source.charAt(this.source.position + peek);
    };
    Scanner.prototype.ignoreWhiteSpace = function () {
        if (!this.options.ignore.whitespace) {
            if (this.options.override.whitespace &&
                typeof this.options.override.whitespace === 'function') {
                var isWhiteSpace = this.options.override.whitespace;
                while (isWhiteSpace(this.peekChar())) {
                    this.nextChar();
                }
            }
            else
                while (Utils_1["default"].Code.isWhiteSpace(this.peekChar())) {
                    this.nextChar();
                }
        }
        return;
    };
    Scanner.prototype.push = function () {
        this.stack.push({
            char: this.source.charAt(this.source.position),
            location: {
                range: this.range
            }
        });
    };
    Scanner.prototype.pop = function () {
        this.stack.pop();
    };
    return Scanner;
})();
exports["default"] = Scanner;
