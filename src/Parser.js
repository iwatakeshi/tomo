import Tokenize from './Token';
import Location from './Location';
const { TokenType, Token } = Tokenize;
class Parser {
    constructor(stream) {
        this.stream = stream;
        this.info = { time: { elapsed: 0 }, errors: [] };
    }
    parse(driver, parser) {
        // Bind the context if the scanner object is provided
        if (parser) {
            for (let fn in parser) {
                if (parser.hasOwnProperty(fn) && typeof parser[fn] === 'function') {
                    parser[fn] = parser[fn].bind(this);
                }
            }
        }
        if (typeof driver === 'function') {
            let start = Date.now();
            let ast = {};
            ast = driver.call(this);
            this.info.time.elapsed = (Date.now() - start);
            return ast;
        }
    }
    lookBack(peek) {
        return this.stream.peekBack(peek);
    }
    peek(peek = 0) {
        return this.stream.peek(peek);
    }
    previous() {
        return this.stream.previous();
    }
    next() {
        return this.stream.next();
    }
    location() {
        if (this.peek()) {
            return this.peek().location();
        }
        else if (this.stream.length === 0) {
            return {
                start: new Location(0, 0),
                end: new Location(0, 0)
            };
        }
        else
            return this.lookBack(1).location();
    }
    match(type, value) {
        // Get the current token
        let current = this.peek();
        if ((type || typeof type === 'number') && (!value || value === null))
            return current && current.isEqual(type);
        if ((type || typeof type === 'number') && value)
            return current && current.isEqual(type, value);
    }
    /*
      Match any should match the tokens with "||" (or)
     */
    matchAny(array) {
        let results = [];
        for (let i = 0; i < array.length; i++) {
            results.push(this.match.apply(this, array[i]));
        }
        return results.indexOf(true) > -1;
    }
    expect(type, value) {
        const token = this.peek();
        if (this.match(type, value))
            this.next();
        else
            throw new Error(`Expected type "${Token.typeToString(type)}"" but received "${token.stype}"`);
    }
    /*
      @method {raise} - Adds an error message into the errors stack.
      @param {message?: string} - The message to add to the error.
      @param {type?: string} - The type of error.
     */
    raise(message, type) {
        this.info.errors.push({
            error: `Unexpected token: ${this.peek().typeToString()}`,
            type: type || 'ParseError',
            message: message || '',
            location: this.location()
        });
    }
}
export default Parser;
