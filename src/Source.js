/* @class {Source} - Creates a source object. */
class Source {
    /*
      @param {source?:string} - The source file.
      @param {options:any} - The options.
      @example: javascript {
        const source = new Source('var x = 12;');
        // or
        const source = new Source({source: '...', name: 'mysource.js'});
      }
     */
    constructor(source, options = { isCharCode: true }) {
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
    charAt(position) {
        const ch = this.source[position];
        return ch ? (this.options.isCharCode ? ch.charCodeAt(0) : ch) : undefined;
    }
    toString() {
        return `position: ${this.source}`;
    }
    toJSON() {
        return {
            source: this.source
        };
    }
}
export default Source;
