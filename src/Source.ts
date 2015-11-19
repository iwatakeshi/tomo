class Source {
  public length: number;
  public line: number;
  public column: number;
  public position: number;
  public EOF: string;
  private source: string;
  constructor(source?:string) {
    if(source) {
      source = source[source.length - 1] === (this.EOF = '\0') ?
      source : source += this.EOF;
      this.source = source;
    }
    this.line = 1;
    this.position = 0;
    this.column = 1;
    this.length = this.source.length;
  }
  public charAt(position) {
    return this.source[position];
  }
  public toString () {
    return `line: ${ this.line }, column: ${ this.column }, position: ${ this.position }`;
  }
  public toJSON() {
    return {
      source: {
        line: this.line,
        column: this.column,
        position: this.position
      }
    };
  }
}

export default Source;
