import Tokenize from './Token';
import Location from './Location';
import Stream from './Stream';
const { TokenType, Token } = Tokenize;

class Parser {
  public info: { time: {elapsed: Date | number }, errors: Array<any> };
  private stream: Stream;
  constructor(stream: Stream) {
    this.stream = stream;
    this.info = { time: { elapsed: 0 }, errors: [] };
  }
  public parse(parser) {
    if (typeof parser === 'function') {
      let start = Date.now();
      let ast = {};
        ast = parser.call(this);
      this.info.time.elapsed = (Date.now() - start);
      return ast;
    }
  }
  public lookBack(peek: number) {
    return this.stream.peekBack(peek);
  }
  public peek(peek = 0) {
    return this.stream.peek(peek);
  }
  public previous() {
    return this.stream.previous();
  }
  public next() {
    return this.stream.next();
  }
  public location (): { start: Location, end: Location } {
    if(this.peek()) {
      return this.peek().location();
    } else if(this.stream.length === 0) {
      return {
        start: new Location(0, 0),
        end: new Location(0, 0)
      };
    } else return this.lookBack(1).location();
  }
  public match(type: Tokenize.TokenType | string, value?: string) {
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
  public matchAny(array: Array<Array<any>>) : boolean {
    let results: Array<any> = [];
    for (let i = 0; i < array.length; i++) {
      results.push(this.match.apply(this, array[i]));
    }
    return results.indexOf(true) > -1;
  }
  public expect(type: Tokenize.TokenType | string, value?: string) {
    const token = this.peek();
    if (this.match(type, value)) this.next();
    else throw new Error(`Expected type "${Token.typeToString(<Tokenize.TokenType>type)}"" but received "${token.stype}"`);
  }
  /*
    @method {raise} - Adds an error message into the errors stack.
    @param {message?: string} - The message to add to the error.
    @param {type?: string} - The type of error.
   */
  public raise(message?:string, type?: string) {
    this.info.errors.push({
      error: `Unexpected token: ${this.peek().typeToString()}`,
      type: type || 'ParseError',
      message: message || '',
      location: this.location()
    });
  }
}
export default Parser;
