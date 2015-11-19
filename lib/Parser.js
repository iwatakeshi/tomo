var Parser = (function () {
    function Parser(stream) {
        this.read = [];
        this.stream = stream;
    }
    Parser.prototype.match = function (expected) {
        var token = this.lookAhead(0);
        if (token.type !== expected) {
            return false;
        }
        this.consume();
        return true;
    };
    Parser.prototype.consume = function (expected) {
        if (expected) {
            var token = this.lookAhead(0);
            if (token.type !== expected) {
                throw 'Expected token \'' + expected + '\' and found ' + token.type;
            }
            return this.consume();
        }
        else {
            this.lookAhead(0);
            this.read.splice(0, 1);
        }
    };
    Parser.prototype.lookAhead = function (distance) {
        while (distance >= this.stream.length()) {
            this.read.push(this.stream.next());
        }
        return this.stream.get(distance);
    };
    Parser.prototype.parse = function (parser) {
        if (typeof parser === 'function') {
            return parser.call(this);
        }
    };
    return Parser;
})();
exports["default"] = Parser;
