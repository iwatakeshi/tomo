class Location {
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
export default Location;
