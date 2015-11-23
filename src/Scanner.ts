import Source from './Source';
import Utils from './Utils';
import Location from './Location';
import Stream from './Stream';
import Options from './Options';

class Scanner {
  public info: { time: { elapsed: Date | number } };
  private source: Source;
  private options: any;
  private tokens: Array<any>;
  private stack: Array<any>;
  private line: number;
  private column: number;
  private range: { start: Location, end: Location };
  constructor(source, options = Options.Scanner) {
    this.source = new Source(source, options);
    this.options = options;
    this.tokens = [];
    this.stack = [];
    this.line = 1;
    this.column = 0;
    this.range = { start: undefined, end: undefined };
    this.info = { time: { elapsed: 0 } };
  }

  public scan(tokenizer): Stream {
    let start = Date.now();
    this.ignoreWhiteSpace();
    while (this.peekChar() !== this.source.EOF) {
      const token = tokenizer.call(this, this.peekChar());
      if (token) this.tokens.push(token);
      this.ignoreWhiteSpace();
    }
    if (this.peekChar() === this.source.EOF) {
      const token = tokenizer.call(this, this.peekChar());
      if (token) this.tokens.push(token);
    }
    this.info.time.elapsed = (Date.now() - start);
    return new Stream(this.tokens);
  }
  public location() {
    const { line, column } = this;
    return {
      start: (): { start: Location, end: Location } => {
        this.range = { start: undefined, end: undefined };
        this.range.start = new Location(Number(line), Number(column));
        return this.range;
      },
      end: (): { start: Location, end: Location } => {
        this.range.end = new Location(Number(line), Number(column));
        return this.range;
      },
      eof: (): { start: Location, end: Location } => {
        this.location().start();
        return this.location().end();
      }
    };
  }
  public prevChar(): string | number {
    if (this.stack.length === 0) return;
    this.pop();
    let { line, column } = this.stack[this.stack.length - 1];
    this.line = line;
    this.column = column;
    return this.source.charAt(this.source.position--);
  }
  public nextChar(): string | number {
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
      // console.log(this.location().column, this.source.position);
      this.column++;
      this.push();
    }
    return this.source.charAt(this.source.position++);
  }
  public lookBackChar(peek = 0): string | number {
    return this.source.charAt(this.source.position - peek);
  }
  public peekChar(peek = 0): string | number {
    // If we peek and the we reach the end or over
    // the length then return EOF
    if (this.source.position + peek >= this.source.length) {
      return this.source.EOF;
    }
    return this.source.charAt(this.source.position + peek);
  }
  private ignoreWhiteSpace() {
    if (!this.options.ignore.whitespace) {
      if (this.options.override.whitespace &&
        typeof this.options.override.whitespace === 'function') {
        const isWhiteSpace = this.options.override.whitespace;
        while (isWhiteSpace(this.peekChar())) {
          this.nextChar();
        }
      } else while (Utils.Code.isWhiteSpace(this.peekChar())) {
        this.nextChar();
      }
    }
    return;
  }
  private push() {
    this.stack.push({
      char: this.source.charAt(this.source.position),
      location: {
        range: this.range
      }
    });
  }
  private pop() {
    this.stack.pop();
  }
}

export default Scanner;
