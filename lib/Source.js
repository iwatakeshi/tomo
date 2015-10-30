'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Source = (function () {
  function Source(source) {
    _classCallCheck(this, Source);

    source = source[source.length - 1] === this.EOF ? source : source += this.EOF;
    this._source = [];
    for (var i = 0; i < source.length; i++) {
      this._source[this._source.length] = source[i];
    }

    this._line = 1;
    this._position = 0;
    this._column = 1;
  }

  /** 
   * Returns the source
   * @return {Array} The source
   */

  _createClass(Source, [{
    key: 'toString',
    value: function toString() {
      return 'line: ' + this.line + ', column: ' + this.column + ', position: ' + this.position;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        "source": {
          "line": this.line,
          "column": this.column,
          "position": this.position
        }
      };
    }
  }, {
    key: 'file',
    get: function get() {
      return this._source;
    }

    /** 
     * Sets the line number
     * @param  {Number} num The number to assign
     */

  }, {
    key: 'line',
    set: function set(num) {
      this._line = num;
    }

    /** 
     * Returns the current line number
     * @return {Number} The current line number
     */
    ,
    get: function get() {
      return this._line;
    }

    /** 
     * Sets the position number
     * @param  {Number} num The number to assign
     */

  }, {
    key: 'position',
    set: function set(num) {
      this._position = num;
    }

    /** 
     * Returns the current position
     * @return {Number} The current position
     */
    ,
    get: function get() {
      return this._position;
    }

    /** 
     * Sets the column number
     * @param  {Number} num The number to assign
     */

  }, {
    key: 'column',
    set: function set(num) {
      this._column = num;
    }

    /** 
     * Returns the current column
     * @return {Number} The current column
     */
    ,
    get: function get() {
      return this._column;
    }

    /** 
     * Returns the End of File character
     */

  }, {
    key: 'EOF',
    get: function get() {
      return '\0';
    }
  }]);

  return Source;
})();

exports.default = Source;