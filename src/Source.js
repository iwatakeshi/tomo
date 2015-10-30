'use strict';

export default class Source {
  constructor(source) {
    source = source[source.length - 1] === this.EOF ? 
    source : source += this.EOF;
    this._source = [];
    for(var i = 0; i < source.length; i++) { this._source[this._source.length] = source[i]; }

    this._line = 1;
    this._position = 0;
    this._column = 1;
  }

  /** 
   * Returns the source
   * @return {Array} The source
   */
  get file () {
    return this._source;
  }

  /** 
   * Sets the line number
   * @param  {Number} num The number to assign
   */
  set line (num) {
    this._line = num;
  }

  /** 
   * Returns the current line number
   * @return {Number} The current line number
   */
  get line () {
    return this._line;
  }

  /** 
   * Sets the position number
   * @param  {Number} num The number to assign
   */
  set position (num) {
    this._position = num;
  }

  /** 
   * Returns the current position
   * @return {Number} The current position
   */
  get position () {
    return this._position;
  }


  /** 
   * Sets the column number
   * @param  {Number} num The number to assign
   */
  set column (num) {
    this._column = num;
  }

  /** 
   * Returns the current column
   * @return {Number} The current column
   */
  get column () {
    return this._column;
  }

  /** 
   * Returns the End of File character
   */
  get EOF () {
    return '\0';
  }

  toString () {
    return `line: ${ this.line }, column: ${ this.column }, position: ${ this.position }`;
  }

  toJSON(){
    return {
      "source": {
        "line": this.line,
        "column": this.column,
        "position": this.position
      }
    };
  }
}