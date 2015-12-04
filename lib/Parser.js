var Token_1 = require('./Token');
var Location_1 = require('./Location');
var TokenType = Token_1["default"].TokenType, Token = Token_1["default"].Token;
var Parser = (function () {
    function Parser(stream) {
        this.stream = stream;
        this.info = { time: { elapsed: 0 }, errors: [] };
    }
    Parser.prototype.parse = function (parser) {
        if (typeof parser === 'function') {
            var start = Date.now();
            var token;
            var ast = {};
            while (!((token = this.stream.peek(0)).isEqual(TokenType.End))) {
                ast = parser.call(this, token, ast);
            }
            this.info.time.elapsed = (Date.now() - start);
            return ast;
        }
    };
    Parser.prototype.lookBack = function (peek) {
        return this.stream.peekBack(peek);
    };
    Parser.prototype.peek = function (peek) {
        if (peek === void 0) { peek = 0; }
        return this.stream.peek(peek);
    };
    Parser.prototype.prev = function () {
        return this.stream.previous();
    };
    Parser.prototype.next = function () {
        return this.stream.next();
    };
    Parser.prototype.location = function () {
        if (this.peek()) {
            return this.peek().location();
        }
        else if (this.stream.length === 0) {
            return {
                start: new Location_1["default"](0, 0),
                end: new Location_1["default"](0, 0)
            };
        }
        else
            return this.lookBack(1).location();
    };
    Parser.prototype.match = function (type) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var current = this.peek();
        switch (arg.length) {
            case 0:
                return current && current.isEqual(type);
            case 1:
                if (typeof arg[0] === 'string') {
                    return current && current.isEqual(type, arg[0]);
                }
                else {
                    var ahead = this.peek(1);
                    return current && current.isEqual(type) &&
                        ahead && ahead.isEqual(arg[0]);
                }
        }
    };
    Parser.prototype.matchAny = function () {
        var _this = this;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        return (Array.isArray(arg[0]) ? arg[0] : arg)
            .map(function (type) { return _this.peek().isEqual(type); })
            .filter(function (truth) { return truth === false; })
            .length > 1 ? false : true;
    };
    Parser.prototype.accept = function (type) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var current = this.peek();
        switch (arg.length) {
            case 0:
                if (current && current.isEqual(type)) {
                    this.next();
                    return true;
                }
                else
                    return false;
            case 1:
                if (typeof arg[0] === 'string') {
                    if (current && current.isEqual(type, arg[0])) {
                        this.next();
                        return true;
                    }
                    else
                        return false;
                }
                else {
                    if (current && current.isEqual(type)) {
                        arg[0] = this.next();
                        return true;
                    }
                    else
                        return false;
                }
        }
    };
    Parser.prototype.expect = function (type, value) {
        var ret = value ? this.peek() : undefined;
        if (this.accept(type, value ? value : ret))
            return ret;
        var offender = this.next();
        var expected = typeof type === 'string' ? Token.stringToType(type) : Token.typeToString(type);
        if (offender) {
            this.info.errors.push({
                error: "Unexpected token: '" + offender.typeToString() + "'. Expected token: " + expected,
                type: 'ParseError',
                location: offender.location()
            });
        }
        else {
            this.info.errors.push({
                error: "Unexpected end of stream. Expected token: " + expected,
                type: 'ParseError',
                location: offender.location()
            });
            throw new Error();
        }
        return new Token(typeof expected === 'string' ? Token.stringToType(expected) : expected, '', this.location());
    };
    Parser.prototype.raise = function (message) {
        this.info.errors.push({
            error: "Unexpected token: " + this.next().typeToString(),
            type: 'ParseError',
            message: message ? message : '',
            location: this.location()
        });
    };
    return Parser;
})();
exports["default"] = Parser;
