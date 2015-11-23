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
            while ((token = this.stream.next()).stype !== Token.typeToString(TokenType.End)) {
                ast = parser.call(this, token, ast);
            }
            this.info.time.elapsed = (Date.now() - start);
            return ast;
        }
    };
    Parser.prototype.lookBack = function (peek) {
        return this.stream.lookBack(peek);
    };
    Parser.prototype.peek = function (peek) {
        if (peek === void 0) { peek = 0; }
        return this.stream.peek(peek);
    };
    Parser.prototype.prev = function () {
        return this.stream.prev();
    };
    Parser.prototype.next = function () {
        return this.stream.next();
    };
    Parser.prototype.location = function () {
        if (this.peek()) {
            return this.peek().location();
        }
        else if (this.stream.length() === 0) {
            return {
                start: new Location_1["default"](0, 0),
                end: new Location_1["default"](0, 0)
            };
        }
        else
            return this.lookBack(1).location();
    };
    Parser.prototype.matchString = function (type) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        switch (arg.length) {
            case 0:
                return this.peek() && this.peek().stype === type;
            case 1:
                if (typeof arg[0] === 'string') {
                    return this.peek() &&
                        this.peek().stype === type &&
                        this.peek().value === arg[0];
                }
                else {
                    return this.peek() && this.peek().stype === type &&
                        this.peek(1) && this.peek(1).type === arg[0];
                }
        }
    };
    Parser.prototype.matchAnyString = function () {
        var _this = this;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        return arg
            .map(function (stype) { return stype === _this.peek().stype; })
            .filter(function (truth) { return truth === false; })
            .length > 1 ? false : true;
    };
    Parser.prototype.accept = function (type) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        switch (arg.length) {
            case 0:
                if (this.peek() && this.peek().stype === type) {
                    this.next();
                    return true;
                }
                else
                    return false;
            case 1:
                if (typeof arg[0] === 'string') {
                    if (this.peek() && this.peek().stype === type && this.peek().value === arg[0]) {
                        this.next();
                        return true;
                    }
                    else
                        return false;
                }
                else {
                    if (this.peek() && this.peek().stype === type) {
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
        if (offender) {
            this.info.errors.push({
                error: "Unexpected token: '" + offender.typeToString() + "'. Expected token: " + Token.typeToString(type),
                type: 'ParseError',
                location: offender.location()
            });
        }
        else {
            this.info.errors.push({
                error: "Unexpected end of stream. Expected token: " + Token.typeToString(type),
                type: 'ParseError',
                location: offender.location()
            });
            throw new Error();
        }
        return new Token(Token.stringToType(type), '', this.location());
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
