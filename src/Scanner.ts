import Source from './Source';
import Utils from './Utils';
import { Location, Range } from './Location';
import Stream from './Stream';
import Options from './Options';
import Tokenize from './Token';
/* @class {Scanner} - Creates a scanner object. */
class Scanner {
  /** The information about the Scanner */
  public info: { time: { elapsed: Date | number } };
  /** The source object */
  private source: Source;
  /** The options */
  private options: any;
  /** The tokens stack */
  private tokens: Array<any>;
  /** The history stack */
  private stack: Array<any>;
  /** The source line number */
  private line: number;
  /** The source column number */
  private column: number;
  /** The range in the source. */
  private range: Range;
  /*
    @param {source: Source} - The source object.
    @param {options = Options.Scanner} - The options.
    @example: javascript {
      const scanner = new Scanner(new Source('var x = 12;'));
    }
   */
  constructor(source: Source, options = Options.Scanner) {
    this.source = source;
    this.options = options;
    this.tokens = [];
    this.stack = [];
    this.line = 1;
    this.column = 0;
    this.range = new Range();
    this.info = { time: { elapsed: 0 } };
  }
  /*
    @method {scan} - Calls the tokenizer as it scans through the source.
    @param {tokenizer: (char: string | number) => Token} - The tokenizer function which returns a token.
    @return {class Stream} - The token stream.
    @example: javascript {
      let scanner = new Scanner(new Source('...'));
      scanner.scan(function(ch) {
        //...
      });
    }
  */
  public scan(tokenizer: (char: string | number) => Tokenize.Token): Stream {
    let start = Date.now();
    this.ignoreWhiteSpace();
    while (this.peek() !== this.source.EOF) {
      const token: Tokenize.Token = tokenizer.call(this, this.peek());
      if (token) this.tokens.push(token);
      this.ignoreWhiteSpace();
    }
    if (this.peek() === this.source.EOF) {
      const token = tokenizer.call(this, this.peek());
      if (token) this.tokens.push(token);
    }
    this.info.time.elapsed = (Date.now() - start);
    return new Stream(this.tokens.slice());
  }
  /*
    @method {location} - Marks the locations.
    @return {{ start: () => void, end: () => Range, eof: () => Range }} - The location helpers.
    @example: javascript {
      //...
      scanner.scan(ch => {
        this.location().start();
        //...
        this.location().end();
      });
    }
  */
  public location(): { start: () => void, end: () => Range, eof: () => Range } {
    const { line, column } = this;
    return {
      start: (): void => {
        this.range = new Range();
        this.range.start = new Location(Number(line), Number(column));
      },
      end: (): Range => {
        this.range.end = new Location(Number(line), Number(column));
        return this.range;
      },
      eof: (): Range => {
        this.location().start();
        return this.location().end();
      }
    };
  }
  /*
    @return {string | number} - The previous character.
   */
  public previous(): string | number {
    if (this.stack.length === 0) return;
    this.pop();
    let { line, column } = this.stack[this.stack.length - 1];
    this.line = line;
    this.column = column;
    return this.source.charAt(--this.source.position);
  }
  /*
    @return {string | number} - The next character.
   */
  public next(): string | number {
    // If we are at the end or over the length
    // of the source then return EOF
    if (this.source.position >= this.source.length) {
      return this.source.EOF;
    }
    // If we reach a new line then
    // increment the line and reset the column
    // else increment the column
    if (this.source.charAt(this.source.position) === '\n' ||
      this.source.charAt(this.source.position) === '\n'.charCodeAt(0)) {
      this.line++;
      this.column = 0;
      this.push();
    } else {
      this.column++;
      this.push();
    }
    return this.source.charAt(this.source.position++);
  }
  /*
    @param {peek = 0} - The number of steps to peek backward.
    @return {string | number} - The previous character(s) to peek.
   */
  public peekBack(peek = 0): string | number {
    return this.source.charAt(this.source.position - peek);
  }
  /*
    @param {peek = 0} - The number of steps to peek forward.
    @return {string | number} - The next character(s) to peek.
   */
  public peek(peek = 0): string | number {
    // If we peek and the we reach the end or over
    // the length then return EOF
    if (this.source.position + peek >= this.source.length) {
      return this.source.EOF;
    }
    return this.source.charAt(this.source.position + peek);
  }
  /*
    @method {ignoreWhiteSpace} - Ignores the whitespaces in the source.
   */
  private ignoreWhiteSpace() {
    if (!this.options.ignore.whitespace) {
      if (this.options.override.whitespace &&
        typeof this.options.override.whitespace === 'function') {
        const isWhiteSpace = this.options.override.whitespace;
        while (isWhiteSpace(this.peek())) {
          this.next();
        }
      }
    } else while (Utils.Code.isWhiteSpace(this.peek())) {
      this.next();
    }
    return;
  }
  /*
    @method {push} - Pushes the current charater and location into the history stack.
   */
  private push() {
    this.stack.push({
      char: this.source.charAt(this.source.position),
      location: {
        range: this.range
      }
    });
  }
  /*
    @method {pop} - Pops the previous charater and location from the history stack.
   */
  private pop() {
    this.stack.pop();
  }
}

export default Scanner;
