var Location = (function () {
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
var Range = (function () {
    function Range(start, end) {
        this.start = start;
        this.end = end;
    }
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
