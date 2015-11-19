var Source = (function () {
    function Source(source) {
        if (source) {
            source = source[source.length - 1] === (this.EOF = '\0') ?
                source : source += this.EOF;
            this.source = source;
        }
        this.position = 0;
        this.length = this.source.length;
    }
    Source.prototype.charAt = function (position) {
        return this.source[position];
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
