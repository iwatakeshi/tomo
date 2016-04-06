/* @export {Location: class} */
export class Location {
    /*
      @param {line = 1} - The line number.
      @param {column = 0} - The column number.
      @example: javascript {
        let location = new Location(0, 0);
      }
     */
  constructor(line = 1, column = 0) {
    this.line = line;
    this.column = column;
  }
  toJSON() {
    return {
      line: Number(this.line),
      column: Number(this.column),
    };
  }
}
/* @export {Range: class} */
export class Range {
    /*
      @param {start?: Location} - The starting location.
      @param {end?: Location} - The ending location.
      @example: javascript {
        let range = new Range(new Location(), new Location());
      }
     */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
    /*
      @method {location}
      @return {Array<any>} - Returns the range.
     */
  location() {
    return [this.start.toJSON(), this.end.toJSON()];
  }
  toJSON() {
    return {
      start: {
        line: this.start.line,
        column: this.start.column,
      },
      end: {
        line: this.end.line,
        column: this.end.column,
      },
    };
  }
}
export default Location;
