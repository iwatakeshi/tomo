'use strict';
var Tokenization;
(function (Tokenization) {
    (function (TokenType) {
        /** Identifiers */
        TokenType[TokenType["Identifier"] = 1] = "Identifier";
        TokenType[TokenType["Reserved"] = 2] = "Reserved";
        /** Literals */
        TokenType[TokenType["Literal"] = 3] = "Literal";
        /** Operator */
        TokenType[TokenType["Operator"] = 4] = "Operator";
        /** Punctuation */
        TokenType[TokenType["Punctuation"] = 5] = "Punctuation";
        /**
         * Other types
         */
        TokenType[TokenType["Comment"] = 100] = "Comment";
        TokenType[TokenType["WhiteSpace"] = 50] = "WhiteSpace";
        TokenType[TokenType["End"] = 0] = "End";
        TokenType[TokenType["Invalid"] = -1] = "Invalid";
    })(Tokenization.TokenType || (Tokenization.TokenType = {}));
    var TokenType = Tokenization.TokenType;
    var Token = (function () {
        function Token(type, value, location) {
            this.type = type;
            this.value = value;
            this.location = location;
        }
        Token.typeToString = function (type, key) {
            var normalize = function (str) {
                if (str.match(/[ -_]/g)) {
                    return str.replace(/[-_]/g, ' ')
                        .split(' ')
                        .map(function (s) { return s[0].toUpperCase() + s.substring(1, s.length).toLowerCase(); })
                        .join('');
                }
                else
                    return str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
            };
            switch (type) {
                case TokenType.Identifier:
                    return 'Indentifier';
                case TokenType.Reserved:
                    return 'Reserved';
                case TokenType.Literal:
                    return normalize(key) + 'Literal';
                case TokenType.Operator:
                    return normalize(key) + 'Operator';
                case TokenType.Punctuation:
                    return normalize(key) + 'Punctuation';
                case TokenType.Comment:
                    return normalize(key) + 'Comment';
                case TokenType.WhiteSpace:
                    return 'WhiteSpace';
                case TokenType.Invalid:
                    return 'Invalid';
                case TokenType.End:
                    return 'End';
            }
        };
        /**
         * Appends a detailed description to the specified type when
         * converting the type to string.
         */
        Token.prototype.prepend = function (key) {
            if (key === void 0) { key = ''; }
            this.key = key;
            return this;
        };
        Token.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        Token.prototype.setLocation = function (location) {
            this.location = location;
            return this;
        };
        Token.prototype.setValue = function (value) {
            this.value = value;
            return this;
        };
        /**
         * Converts type to string.
         */
        Token.prototype.typeToString = function () {
            return Token.typeToString(this.type, this.key);
        };
        /**
         * Returns a string representation of the Token class.
         */
        Token.prototype.toString = function () {
            return "token type: " + this.type + " - " + this.typeToString() + ", value: " + this.value;
        };
        Token.prototype.toJSON = function () {
            var _a = this.location, start = _a.start, end = _a.end;
            start = start.toJSON();
            end = end.toJSON();
            return {
                token: {
                    type: { key: this.type, value: this.typeToString() },
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
        };
        return Token;
    })();
    Tokenization.Token = Token;
})(Tokenization || (Tokenization = {}));
exports["default"] = Tokenization;
