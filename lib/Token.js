/* @module {Token} - Contains the necessary data structures to define a Token */
var Token;
(function (Token_1) {
    /* @export {enum TokenType} - Identifies the token type. */
    (function (TokenType) {
        /** Identifiers */
        TokenType[TokenType["Identifier"] = 1] = "Identifier";
        TokenType[TokenType["Keyword"] = 2] = "Keyword";
        /** Reserved */
        TokenType[TokenType["Reserved"] = 3] = "Reserved";
        /** Literals */
        TokenType[TokenType["Literal"] = 4] = "Literal";
        /** Operator */
        TokenType[TokenType["Operator"] = 5] = "Operator";
        /** Punctuation */
        TokenType[TokenType["Punctuation"] = 6] = "Punctuation";
        /** Other types */
        TokenType[TokenType["Comment"] = 100] = "Comment";
        TokenType[TokenType["Whitespace"] = 50] = "Whitespace";
        TokenType[TokenType["End"] = 0] = "End";
        TokenType[TokenType["Invalid"] = -1] = "Invalid";
    })(Token_1.TokenType || (Token_1.TokenType = {}));
    var TokenType = Token_1.TokenType;
    /* @export {class Token} - Creates a token object. */
    var Token = (function () {
        /*
          @param {type?: enum TokenType} - The token's type.
          @param {value?: string} - The token's character value.
          @param {location?: class Location} - The token's location.
          @example: javascript {
            let location = { start: new Location(), end: new Location() };
            let token = new Token(TokenType.Identifier, 'hello', location);
          }
          @notes: markdown {
            * Use `type` and not `stype` for token comparisons.
            * Token `stype` are camel cased when normalized.
          }
         */
        function Token(type, value, location) {
            this.type = type;
            this.stype = this.typeToString();
            this.value = value;
            this.pvalue = '';
            this.loc = location;
        }
        /*
          @param {str: string} - The string to transform.
          @returns {enum TokenType} - Returns the token type by string.
          @example: javascript {
            let type = Token.stringToType('Identifier');
          }
         */
        Token.stringToType = function (str) {
            var type;
            [
                'Identifier',
                'Keyword',
                'Reserved',
                'Literal',
                'Operator',
                'Punctuation',
                'Comment',
                'Whitespace',
                'End',
                'Invalid'
            ].forEach(function (t) {
                if (str.indexOf(t) > -1)
                    type = TokenType[t];
            });
            return type;
        };
        /*
          @param {type: enum TokenType} - The token type to transform.
          @param {prepend?: string} - The additional info to prepend to the token type.
          @return {string} - The string representation by token type.
          @example: javascript {
            let type = Token.typeToString(TokenType.Identifier);
          }
          @notes: markdown {
            * Using `typeToString()` normalizes 'semi colon', 'semi-colon' => 'SemiColon' but fails
              when 'SemiColon' which => 'Semicolon'.
          }
         */
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
                    return 'Identifier';
                case TokenType.Keyword:
                    return 'Keyword';
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
                case TokenType.Whitespace:
                    return 'Whitespace';
                case TokenType.Invalid:
                    return 'Invalid';
                case TokenType.End:
                    return 'End';
            }
        };
        /*
          @param {value = '': string} - The value to prepend to the token type.
          @return {class Token}
          @notes: {
            * Use `prepend()` to add additional info to the token type. e.g. 'Operator' => 'AddOperator'
          }
        */
        Token.prototype.prepend = function (value) {
            if (value === void 0) { value = ''; }
            this.pvalue = value;
            this.stype = this.typeToString();
            return this;
        };
        /*
          @param {type: enum TokenType} - The token type.
          @return {class Token}
        */
        Token.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        /*
         @param {location: class Location} - The token's location.
         @return {class Token}
       */
        Token.prototype.setLocation = function (location) {
            this.loc = location;
            return this;
        };
        /*
          @param {location: class Location} - The token's character value.
          @return {class Token}
        */
        Token.prototype.setValue = function (value) {
            this.value = value;
            return this;
        };
        /* @return {object: { start: class Location, end: class Location }} - The token's location. */
        Token.prototype.location = function () {
            return this.loc;
        };
        /* @see {static Token.typeToString()} */
        Token.prototype.typeToString = function () {
            return Token.typeToString(this.type, this.pvalue);
        };
        /*
          @param {t: TokenType | string | Token} - The type or token to compare.
          @return {boolean} - Determines whether the token is equal to the type.
        */
        Token.prototype.isEqual = function (t, value) {
            var _this = this;
            var isEqual = function () {
                if (typeof t === 'string') {
                    return t === (_this.stype || Token.stringToType(t) === _this.type);
                }
                else if (t instanceof Token) {
                    return t.type === _this.type || t.stype === _this.stype;
                }
                else
                    return t === _this.type;
            };
            if (value)
                return this.value === value && isEqual();
            else
                return isEqual();
        };
        /* @return {string} - The string representation of the Token class. */
        Token.prototype.toString = function () {
            return "token type: " + this.type + ", value: " + this.value;
        };
        /* @return {object} - The JSON representation of the Token class. */
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
    Token_1.Token = Token;
})(Token || (Token = {}));
exports["default"] = Token;
