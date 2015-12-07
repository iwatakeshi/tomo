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
        if (typeof source === 'string') {
            this.source = source || '';
            this.name = '';
        }
        if (typeof source === 'object') {
            this.source = source.source;
            this.name = source.name || '';
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
        return ch ? (this.options.isCharCode ? ch.charCodeAt(0) : ch) : undefined;
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
