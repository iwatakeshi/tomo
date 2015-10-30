'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Source2 = require('./Source');

var _Source3 = _interopRequireDefault(_Source2);

var _TokenStream = require('./TokenStream');

var _TokenStream2 = _interopRequireDefault(_TokenStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scanner = (function (_Source) {
  _inherits(Scanner, _Source);

  function Scanner(source) {
    _classCallCheck(this, Scanner);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Scanner).call(this, source));

    _this._stringBuffer = '';
    _this._isEOF = false;
    return _this;
  }

  _createClass(Scanner, [{
    key: 'isWhiteSpace',
    value: function isWhiteSpace(char) {
      return char === ' ';
    }
  }, {
    key: 'isLetter',
    value: function isLetter(char) {
      return (/[a-zA-Z]/.test(char)
      );
    }
  }, {
    key: 'isDigit',
    value: function isDigit(char) {
      return (/[0-9]/.test(char)
      );
    }
  }, {
    key: 'scan',
    value: function scan(tokenizer) {
      var stream = new _TokenStream2.default();
      this.ignoreWhiteSpace();
      while (this.peekChar() !== this.EOF) {
        var token = this.nextToken(tokenizer);
        if (token) stream.addToken(token);
        this.ignoreWhiteSpace();
      }
      return stream;
    }
  }, {
    key: 'nextChar',
    value: function nextChar() {
      // If we are at the end or over the length
      // of the source then return EOF
      if (this.position >= this.file.length) {
        this.isEOF = true;
        return this.EOF;
      }
      // If we reach a new line then
      // increment the line and reset the column
      // else increment the column
      if (this.file[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else this.column++;
      return this.file[this.position++];
    }
  }, {
    key: 'peekChar',
    value: function peekChar(peek) {
      // If we peek and the we reach the end or over
      // the length then return EOF
      if (this.position + peek >= this.file.length) {
        this.isEOF = true;
        return this.EOF;
      }
      return this.file[this.position + (peek ? peek : 0)];
    }
  }, {
    key: 'nextToken',
    value: function nextToken(tokenizer) {
      if (typeof tokenizer === 'function') {
        var character = this.peekChar();
        return tokenizer.apply(this, [character]);
      }
    }
  }, {
    key: 'ignoreWhiteSpace',
    value: function ignoreWhiteSpace() {
      while (this.isWhiteSpace(this.peekChar())) {
        this.nextChar();
      }
    }
  }, {
    key: 'isEOF',
    set: function set(truth) {
      this._isEOF = truth;
    },
    get: function get() {
      return this._isEOF;
    }
  }]);

  return Scanner;
})(_Source3.default);

exports.default = Scanner;