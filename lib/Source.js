/* @class {Source} - Creates a source object. */
var Source = (function () {
    /*
      @param {source?:string} - The source file.
      @param {options:any} - The options.
      @example: javascript {
        const source = new Source('var x = 12;');
        // or
        const source = new Source({source: '...', name: 'mysource.js'});
      }
     */
    function Source(source, options) {
        if (options === void 0) { options = { isCharCode: true }; }
        this.EOF = options.isCharCode ? '\0'.charCodeAt(0) : '\0';
        if (typeof source === 'string') {
            source = source[source.length - 1] === this.EOF ?
                source : source += this.EOF;
            this.source = source;
            this.name = '';
        }
        if (typeof source === 'object') {
            var src = (source.source ? source.source : '');
            src = src[src.length - 1] === this.EOF ? src : src += this.EOF;
            this.name = source.source ? source.name : '';
            this.source = src;
        }
        this.options = options;
        this.length = this.source.length;
    }
    /*
      @method {charAt} Returns the character in the source at position n.
      @param {position:number} - The position in the source.
      @return {string | number} - The character in the source.
     */
    Source.prototype.charAt = function (position) {
        var ch = this.source[position];
        return this.options.isCharCode ? ch.charCodeAt(0) : ch;
    };
    Source.prototype.toString = function () {
        return "position: " + this.source;
    };
    Source.prototype.toJSON = function () {
        return {
            source: this.source
        };
    };
    return Source;
})();
exports["default"] = Source;
