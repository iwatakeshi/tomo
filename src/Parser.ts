import Tokenization from './Token';
import Location from './Location';
import Stream from './Stream';
const { TokenType, Token } = Tokenization;

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
      let token: Tokenization.Token;
      let ast = {};
      while ((token = this.stream.next()).stype !== Token.typeToString(TokenType.End)) {
        ast = parser.call(this, token, ast);
      }
      this.info.time.elapsed = (Date.now() - start);
      return ast;
    }
  }
  public lookBack(peek: number) {
    return this.stream.lookBack(peek);
  }
  public peek(peek = 0) {
    return this.stream.peek(peek);
  }
  public prev() {
    return this.stream.prev();
  }
  public next() {
    return this.stream.next();
  }
  public location (): { start: Location, end: Location } {
    if(this.peek()) {
      return this.peek().location();
    } else if(this.stream.length() === 0) {
      return {
        start: new Location(0, 0),
        end: new Location(0, 0)
      };
    } else return this.lookBack(1).location();
  }
  public matchString(type: string, ...arg) {
    switch (arg.length) {
      case 0:
        return this.peek() && this.peek().stype === type;
      case 1:
        if (typeof arg[0] === 'string') {
          return this.peek() &&
            this.peek().stype === type &&
            this.peek().value === arg[0];
        } else {
          return this.peek() && this.peek().stype === type &&
            this.peek(1) && this.peek(1).type === arg[0];
        }
    }
  }
  public matchAnyString(...arg) {
    return arg
    .map(stype => stype === this.peek().stype)
    .filter(truth => truth === false)
    .length > 1 ? false : true;
  }
  public accept(type: string, ...arg) {
    switch (arg.length) {
      case 0:
        if (this.peek() && this.peek().stype === type) {
          this.next();
          return true;
        } else return false;
      case 1:
        if (typeof arg[0] === 'string') {
          if (this.peek() && this.peek().stype === type && this.peek().value === arg[0]) {
            this.next();
            return true;
          } else return false;
        } else {
          if (this.peek() && this.peek().stype === type) {
            arg[0] = this.next();
            return true;
          } else return false;
        }
    }
  }

  public expect(type: string, value?: string) {
    let ret: Tokenization.Token = value ? this.peek() : undefined;
    if (this.accept(type, value ? value: ret)) return ret;
    let offender: Tokenization.Token = this.next();
    if (offender) {
      this.info.errors.push({
        error: `Unexpected token: '${offender.typeToString() }'. Expected token: ${ Token.typeToString(type) }`,
        type: 'ParseError',
        location: offender.location()
      });
    } else {
      this.info.errors.push({
        error: `Unexpected end of stream. Expected token: ${ Token.typeToString(type) }`,
        type: 'ParseError',
        location: offender.location()
      });
      throw new Error();
    }
    return new Token(Token.stringToType(type), '', this.location());
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
