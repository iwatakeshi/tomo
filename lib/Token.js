'use strict';
exports.assign = Object.assign ? Object.assign : function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return;
};
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);
                var keysArray = Object.keys(nextSource);
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
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
        function Token(type, value, source) {
            this.key = { operator: '', comment: '' };
            this.type = type;
            this.value = value;
            this.source = source;
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
                    return (key.operator || key) + 'Operator';
                case TokenType.Comment:
                    return (key.comment || key) + 'Comment';
                case TokenType.WhiteSpace:
                    return 'WhiteSpace';
                case TokenType.Invalid:
                    return 'Invalid';
                case TokenType.End:
                    return 'End';
            }
        };
        /**
         * Appends a detailed description to the operator type when
         * converting the type to string.
         */
        Token.prototype.appendToOperator = function (key) {
            if (key === void 0) { key = ''; }
            this.key.operator = key;
            return this;
        };
        /**
         * Appends a detailed description to the comment type when
         * converting the type to string.
         */
        Token.prototype.appendToComment = function (key) {
            if (key === void 0) { key = ''; }
            this.key.comment = key;
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
            return Object.assign(this.source.toJSON(), {
                token: {
                    type: { key: this.type, value: this.typeToString() },
                    value: this.value
                }
            });
        };
        return Token;
    })();
    Tokenization.Token = Token;
})(Tokenization || (Tokenization = {}));
exports["default"] = Tokenization;
