var Source = (function () {
    function Source(source, options) {
        if (source) {
            this.EOF = options.isCharCode ? '\0'.charCodeAt(0) : '\0';
            source = source[source.length - 1] === this.EOF ?
                source : source += this.EOF;
            this.source = source;
            this.options = options;
        }
        this.position = 0;
        this.length = this.source.length;
    }
    Source.prototype.charAt = function (position) {
        var ch = this.source[position];
        return this.options.isCharCode ? ch.charCodeAt(0) : ch;
    };
    Source.prototype.toString = function () {
        return "position: " + this.position;
    };
    Source.prototype.toJSON = function () {
        return {
            source: {
                position: this.position
            }
        };
    };
    return Source;
})();
exports["default"] = Source;
