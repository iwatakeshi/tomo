/* @class {Source} - Creates a source object. */
class Source {
  /** The length of source */
  public length: number;
  /** The position of source */
  public position: number;
  /** The source file name */
  public name: string;
  /** The end of file character */
  public EOF: string | number;
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
    this.EOF = options.isCharCode ? '\0'.charCodeAt(0) : '\0';
    if (typeof source === 'string') {
      source = source[source.length - 1] === this.EOF ?
        source : source += this.EOF;
      this.source = source;
      this.name = '';
    }
    if (typeof source === 'object') {
      let src: string = (source.source ? source.source : '');
      src = src[src.length - 1] === this.EOF ? src : src += this.EOF;
      this.name = source.source ? source.name : '';
      this.source = src;
    }
    this.options = options;
    this.position = 0;
    this.length = this.source.length;
  }
  /*
    @method {charAt} Returns the character in the source at position n.
    @param {position:number} - The position in the source.
    @return {string | number} - The character in the source.
   */
  public charAt(position:number): string | number {
    const ch = this.source[position];
    return this.options.isCharCode ? ch.charCodeAt(0) : ch;
  }
  public toString() {
    return `position: ${ this.position }`;
  }
  public toJSON() {
    return {
      source: {
        position: this.position
      }
    };
  }
}

export default Source;
