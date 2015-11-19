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
;
exports["default"] = Location;
