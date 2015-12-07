/* @class {Source} - Creates a source object. */
class Source {
  /** The length of source */
  public length: number;
  /** The source file name */
  public name: string;
  /** The source file */
  public source: string;
  /** The options */
  private options: any;
  /*
    @param {source?:string} - The source file.
    @param {options:any} - The options.
    @example: javascript {
      const source = new Source('var x = 12;');
      // or
      const source = new Source({source: '...', name: 'mysource.js'});
    }
   */
  constructor(source?: string | any, options: any = { isCharCode: true }) {
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
  public charAt(position: number): string | number {
    const ch = this.source[position];
    return ch ? (this.options.isCharCode ? ch.charCodeAt(0) : ch) : undefined;
  }
  public toString() {
    return `position: ${ this.source }`;
  }
  public toJSON() {
    return {
      source: this.source
    };
  }
}

export default Source;
