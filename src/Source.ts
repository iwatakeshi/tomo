class Source {
  public length: number;
  public position: number;
  public EOF: string | number;
  private source: string;
  private options: any;
  constructor(source?:string, options?: any) {
    if(source) {
      this.EOF = options.isCharCode ? '\0'.charCodeAt(0) : '\0';
      source = source[source.length - 1] === this.EOF ?
      source : source += this.EOF;
      this.source = source;
      this.options = options;
    }
    this.position = 0;
    this.length = this.source.length;
  }
  public charAt(position) : string | number {
    const ch = this.source[position];
    return this.options.isCharCode ? ch.charCodeAt(0) : ch;
  }
  public toString () {
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
