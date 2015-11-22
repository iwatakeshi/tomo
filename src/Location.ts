export class Location {
  public line: number;
  public column: number;
  constructor (line = 1, column = 0) {
    this.line = line;
    this.column = column;
  }
  public toJSON () {
    return {
      line: Number(this.line),
      column: Number(this.column)
    };
  }
};

export class Range {
  public start : Location;
  public end : Location;
  constructor(start:Location, end:Location) {
    this.start = start;
    this.end = end;
  }
  public location () {
    return [this.start.toJSON(), this.end.toJSON()];
  }
  public toJSON() {
    return {
      start: {
        line: this.start.line,
        column: this.start.column
      },
      end: {
        line: this.end.line,
        column: this.end.column
      }
    };
  }
}

export default Location;
