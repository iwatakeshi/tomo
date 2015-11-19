var Source = (function () {
    function Source(source) {
        if (source) {
            source = source[source.length - 1] === (this.EOF = '\0') ?
                source : source += this.EOF;
            this.source = source;
        }
        this.line = 1;
        this.position = 0;
        this.column = 1;
        this.length = this.source.length;
    }
    Source.prototype.charAt = function (position) {
        return this.source[position];
    };
    Source.prototype.toString = function () {
        return "line: " + this.line + ", column: " + this.column + ", position: " + this.position;
    };
    Source.prototype.toJSON = function () {
        return {
            source: {
                line: this.line,
                column: this.column,
                position: this.position
            }
        };
    };
    return Source;
})();
exports["default"] = Source;
