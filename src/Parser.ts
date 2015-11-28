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
      let token: Tokenize.Token;
      let ast = {};
      while (!((token = this.stream.next()).isEqual(TokenType.End))) {
        ast = parser.call(this, token, ast);
      }
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
  public prev() {
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
  public match(type: Tokenize.TokenType | string, ...arg) {
    const current = this.peek();
    switch (arg.length) {
      case 0:
        return current && current.isEqual(type);
      case 1:
        if (typeof arg[0] === 'string') {
          return current && current.isEqual(type, arg[0]);
        } else {
          const ahead = this.peek(1);
          return current && current.isEqual(type) &&
           ahead && ahead.isEqual(arg[0]);
        }
    }
  }
  public matchAny(...arg) {
    return (Array.isArray(arg[0]) ? arg[0] : arg)
    .map(type => this.peek().isEqual(type))
    .filter(truth => truth === false)
    .length > 1 ? false : true;
  }
  public accept(type: Tokenize.TokenType | string, ...arg) {
    const current = this.peek();
    switch (arg.length) {
      case 0:
        if (current && current.isEqual(type)) {
          this.next();
          return true;
        } else return false;
      case 1:
        if (typeof arg[0] === 'string') {
          if (current && current.isEqual(type, arg[0])) {
            this.next();
            return true;
          } else return false;
        } else {
          if (current && current.isEqual(type)) {
            arg[0] = this.next();
            return true;
          } else return false;
        }
    }
  }

  public expect(type: Tokenize.TokenType | string, value?: string) {
    const ret: Tokenize.Token = value ? this.peek() : undefined;
    if (this.accept(type, value ? value: ret)) return ret;
    const offender: Tokenize.Token = this.next();
    const expected = typeof type === 'string' ? Token.stringToType(type) : Token.typeToString(type);
    if (offender) {
      this.info.errors.push({
        error: `Unexpected token: '${offender.typeToString() }'. Expected token: ${ expected }`,
        type: 'ParseError',
        location: offender.location()
      });
    } else {
      this.info.errors.push({
        error: `Unexpected end of stream. Expected token: ${ expected }`,
        type: 'ParseError',
        location: offender.location()
      });
      throw new Error();
    }
    return new Token(typeof expected === 'string' ? Token.stringToType(expected) : expected, '', this.location());
  }
  public raise(message?:string) {
    this.info.errors.push({
      error: `Unexpected token: ${this.next().typeToString()}`,
      type: 'ParseError',
      message: message ? message : '',
      location: this.location()
    });
  }
}
export default Parser;
