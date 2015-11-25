/* @export {class Location} */
var Location = (function () {
    /*
      @param {line = 1} - The line number.
      @param {column = 0} - The column number.
      @example: javascript {
        let location = new Location(0, 0);
      }
     */
    function Location(line, column) {
        if (line === void 0) { line = 1; }
        if (column === void 0) { column = 0; }
        this.line = line;
        this.column = column;
    }
    Location.prototype.toJSON = function () {
        return {
            line: Number(this.line),
            column: Number(this.column)
        };
    };
    return Location;
})();
exports.Location = Location;
;
/* @export {class Range} */
var Range = (function () {
    /*
      @param {start?: Location} - The starting location.
      @param {end?: Location} - The ending location.
      @example: javascript {
        let range = new Range(new Location(), new Location());
      }
     */
    function Range(start, end) {
        this.start = start;
        this.end = end;
    }
    /*
      @method {location}
      @return {Array<any>} - Returns the range.
     */
    Range.prototype.location = function () {
        return [this.start.toJSON(), this.end.toJSON()];
    };
    Range.prototype.toJSON = function () {
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
    };
    return Range;
})();
exports.Range = Range;
exports["default"] = Location;
