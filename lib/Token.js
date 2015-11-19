'use strict';
var Tokenization;
(function (Tokenization) {
    (function (TokenType) {
        /** Identifiers */
        TokenType[TokenType["Identifier"] = 1] = "Identifier";
        TokenType[TokenType["Reserved"] = 2] = "Reserved";
        /** Literals */
        TokenType[TokenType["NumberLiteral"] = 3] = "NumberLiteral";
        TokenType[TokenType["IntLiteral"] = 4] = "IntLiteral";
        TokenType[TokenType["FloatLiteral"] = 5] = "FloatLiteral";
        TokenType[TokenType["StringLiteral"] = 6] = "StringLiteral";
        TokenType[TokenType["CharacterLiteral"] = 7] = "CharacterLiteral";
        /** Operator */
        TokenType[TokenType["Operator"] = 8] = "Operator";
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
        function Token(type, value, range) {
            this.type = type;
            this.value = value;
            this.range = range;
        }
        Token.typeToString = function (type, key) {
            switch (type) {
                case TokenType.Identifier:
                    return 'Indentifier';
                case TokenType.Reserved:
                    return 'Reserved';
                case TokenType.NumberLiteral:
                    return 'NumberLiteral';
                case TokenType.IntLiteral:
                    return 'IntLiteral';
                case TokenType.FloatLiteral:
                    return 'FloatLiteral';
                case TokenType.StringLiteral:
                    return 'StringLiteral';
                case TokenType.CharacterLiteral:
                    return 'CharacterLiteral';
                case TokenType.Operator:
                    return key + 'Operator';
                case TokenType.Comment:
                    return key + 'Comment';
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
        Token.prototype.append = function (key) {
            if (key === void 0) { key = ''; }
            this.key = key;
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
            return {
                token: {
                    type: { key: this.type, value: this.typeToString() },
                    value: this.value,
                    location: {
                        start: this.range.start.toJSON(),
                        end: this.range.end.toJSON()
                    }
                }
            };
        };
        return Token;
    })();
    Tokenization.Token = Token;
})(Tokenization || (Tokenization = {}));
exports["default"] = Tokenization;
