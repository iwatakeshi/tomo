import Utils from './Utils';
import { Location, Range } from './Location';
import Stream from './Stream';
import Options from './Options';
/** @class {Scanner} - Creates a scanner object. */
class Scanner {
    /**
      @param {source: Source} - The source object.
      @param {options = Options.Scanner} - The options.
      @example: javascript {
        const scanner = new Scanner(new Source('var x = 12;'));
      }
     */
    constructor(source, options = Options.Scanner) {
        this.source = source;
        this.options = options;
        this.tokens = [];
        this.stack = [];
        this.position = 0;
        this.line = 1;
        this.column = 0;
        this.range = new Range();
        this.info = {
            time: { elapsed: 0 },
            file: {
                name: source.name,
                length: source.length,
                source: source.source,
                position: this.position
            },
            errors: []
        };
    }
    /**
      @method {scan} - Calls the tokenizer as it scans through the source.
      @param {driver: (char: string | number) => Token} - The driver function which returns a token.
      @param {scanner?: object} - The scanner object to bind the context.
      @return {class Stream} - The token stream.
      @example: javascript {
        let scanner = new Scanner(new Source('...'));
        scanner.scan(function(ch) {
          //...
        });
      }
    */
    scan(driver, scanner) {
        // Bind the context if the scanner object is provided
        if (scanner) {
            for (let fn in scanner) {
                if (scanner.hasOwnProperty(fn) && typeof scanner[fn] === 'function') {
                    scanner[fn] = scanner[fn].bind(this);
                }
            }
        }
        let start = Date.now();
        this.ignoreWhiteSpace();
        while (this.peek() !== undefined) {
            const token = driver.call(this, this.peek());
            if (token)
                this.tokens.push(token);
            this.ignoreWhiteSpace();
        }
        if (this.peek() === undefined) {
            const token = driver.call(this, this.peek());
            if (token)
                this.tokens.push(token);
        }
        this.info.time.elapsed = (Date.now() - start);
        return new Stream(this.tokens.slice());
    }
    /**
      @method {location} - Marks the locations.
      @return {
        {
          start: () => void,
          end: () => Range,
          eof: () => Range
        }
      } - The location helpers.
      @example: javascript {
        //...
        scanner.scan(ch => {
          this.location().start();
          //...
          this.location().end();
        });
      }
    */
    location() {
        const { line, column } = this;
        return {
            start: () => {
                this.range = new Range();
                this.range.start = new Location(Number(line), Number(column));
            },
            end: () => {
                this.range.end = new Location(Number(line), Number(column));
                return this.range;
            },
            eof: () => {
                this.location().start();
                return this.location().end();
            }, line, column
        };
    }
    /**
      @return {string | number} - The previous character.
     */
    previous() {
        if (this.stack.length === 0)
            return;
        this.pop();
        const { line, column } = this.stack[this.stack.length - 1];
        this.line = line;
        this.column = column;
        return this.source.charAt(this.position--);
    }
    /**
      @return {string | number} - The next character.
     */
    next() {
        // If we are at the end or over the length
        // of the source then return EOF
        if (this.position >= this.source.length) {
            return undefined;
        }
        // If we reach a new line then
        // increment the line and reset the column
        // else increment the column
        if (Utils.Code.isLineTermintor(this.source.charAt(this.position))) {
            this.line++;
            this.column = 0;
            this.push();
        }
        else {
            this.column++;
            this.push();
        }
        return this.source.charAt(this.position++);
    }
    /**
      @param {peek = 0} - The number of steps to peek backward.
      @return {string | number} - The previous character(s) to peek.
     */
    peekBack(peek = 0) {
        return this.source.charAt(this.position - peek);
    }
    /**
      @param {peek = 0} - The number of steps to peek forward.
      @return {string | number} - The next character(s) to peek.
     */
    peek(peek = 0) {
        // If we peek and the we reach the end or over
        // the length then return EOF
        if (this.position + peek >= this.source.length) {
            return undefined;
        }
        return this.source.charAt(this.position + peek);
    }
    /**
      @method {isEOF} - Determines whether the current character is the end of file.
      @return {boolean} - The truth value.
     */
    isEOF() {
        return !this.source.charAt(this.position) && this.position === this.source.length;
    }
    /**
      @method {raise} - Adds an error message into the errors stack.
      @param {message?: string} - The message to add to the error.
      @param {type?: string} - The type of error.
     */
    raise(message, type) {
        let source = '';
        // Build the spaces and find the error
        for (let i = 0; i < this.info.file.length; i++) {
            const ch = this.info.file.source[i];
            if (ch === this.info.file.source[this.position])
                source += '^';
            else
                source += ' ';
        }
        source = this.info.file.source + '\n' + source;
        this.info.errors.push({
            error: `Unexpected character: ${this.peek()}`,
            type: type || 'ScanError',
            message: message || '',
            source: source,
            location: { line: this.location().line, column: this.location().column }
        });
    }
    /**
      @method {ignoreWhiteSpace} - Ignores the whitespaces in the source.
     */
    ignoreWhiteSpace() {
        if (!this.options.ignore.whitespace) {
            if (this.options.override.whitespace &&
                typeof this.options.override.whitespace === 'function') {
                const isWhiteSpace = this.options.override.whitespace;
                if (!this.peek())
                    this.next();
                else
                    while (isWhiteSpace(this.peek())) {
                        this.next();
                    }
            }
        }
        else {
            if (!this.peek())
                this.next();
            else
                while (Utils.Code.isWhiteSpace(this.peek())) {
                    this.next();
                }
        }
        return;
    }
    /**
      @method {push} - Pushes the current charater and location into the history stack.
     */
    push() {
        this.stack.push({
            char: this.source.charAt(this.position),
            location: {
                range: this.range
            }
        });
    }
    /**
      @method {pop} - Pops the previous charater and location from the history stack.
     */
    pop() {
        this.stack.pop();
    }
}
export default Scanner;
