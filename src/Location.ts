/* @export {class Location} */
export class Location {
  /** The line number of the source */
  public line: number;
  /** The column number of the source */
  public column: number;
  /*
    @param {line = 1} - The line number.
    @param {column = 0} - The column number.
    @example: javascript {
      let location = new Location(0, 0);
    }
   */
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
/* @export {class Range} */
export class Range {
  /** The start of the location */
  public start : Location;
  /** The end of the location */
  public end : Location;
  /*
    @param {start?: Location} - The starting location.
    @param {end?: Location} - The ending location.
    @example: javascript {
      let range = new Range(new Location(), new Location());
    }
   */
  constructor(start?:Location, end?:Location) {
    this.start = start;
    this.end = end;
  }
  /*
    @method {location}
    @return {Array<any>} - Returns the range.
   */
  public location (): Array<any> {
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
