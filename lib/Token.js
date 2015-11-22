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
            this.stype = this.typeToString();
            this.value = value;
            this.pvalue = '';
            this.loc = location;
        }
        Token.stringToType = function (str) {
            var type;
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
            ].forEach(function (t) {
                if (str.indexOf(t) > -1)
                    type = TokenType[t];
            });
            return type;
        };
        Token.typeToString = function (type, prepend) {
            var normalize = function (str) {
                if (!str) {
                    return '';
                }
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
        };
        /**
         * Appends a detailed description to the specified type when
         * converting the type to string.
         */
        Token.prototype.prepend = function (value) {
            if (value === void 0) { value = ''; }
            this.pvalue = value;
            this.stype = this.typeToString();
            return this;
        };
        Token.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        Token.prototype.setLocation = function (location) {
            this.loc = location;
            return this;
        };
        Token.prototype.setValue = function (value) {
            this.value = value;
            return this;
        };
        Token.prototype.location = function () {
            return this.loc;
        };
        /**
         * Converts type to string.
         */
        Token.prototype.typeToString = function () {
            return Token.typeToString(this.type, this.pvalue);
        };
        /**
         * Returns a string representation of the Token class.
         */
        Token.prototype.toString = function () {
            return "token type: " + this.type + ", value: " + this.value;
        };
        Token.prototype.toJSON = function () {
            var _a = this.loc, start = _a.start, end = _a.end;
            start = start.toJSON();
            end = end.toJSON();
            return {
                token: {
                    type: { key: this.type, value: this.stype },
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
