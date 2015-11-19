class Source {
  public length: number;
  public position: number;
  public EOF: string;
  private source: string;
  constructor(source?:string) {
    if(source) {
      source = source[source.length - 1] === (this.EOF = '\0') ?
      source : source += this.EOF;
      this.source = source;
    }
    this.position = 0;
    this.length = this.source.length;
  }
  public charAt(position) {
    return this.source[position];
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
