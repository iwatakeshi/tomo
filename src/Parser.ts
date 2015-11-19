import Tokenization from './Token';
import { Map } from './Map';

class Parser {
  private stream;
  private position: number;
  private read = [];
  constructor(stream) {
    this.stream = stream;
  }
  public match(expected) {
    let token = this.lookAhead(0);
    if (token.type !== expected) {
      return false;
    }
    this.consume();
    return true;
  }

  public consume (expected?) {
    if(expected) {
      let token = this.lookAhead(0);
      if (token.type !== expected) {
        throw 'Expected token \'' + expected + '\' and found ' + token.type;
      }
      return this.consume();
    } else {
       this.lookAhead(0);
      this.read.splice(0,1);
    }
  }

  public lookAhead (distance) {
    while(distance >= this.stream.length()) {
      this.read.push(this.stream.next());
    }
    return this.stream.get(distance);
  }

  public parse(parser) {
    if(typeof parser === 'function') {
      return parser.call(this);
    }
  }
}

export default Parser;
