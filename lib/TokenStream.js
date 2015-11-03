'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TokenType = require('./TokenType');

var _TokenType2 = _interopRequireDefault(_TokenType);

var _Token = require('./Token');

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var TokenStream = (function () {
  function TokenStream() {
    _classCallCheck(this, TokenStream);

    this._stack = [];
    this._position = 0;
  }

  _createClass(TokenStream, [{
    key: 'isEOS',
    value: function isEOS() {
      return this.position > this._stack.length;
    }
  }, {
    key: 'addToken',
    value: function addToken(token) {
      this._stack[this._stack.length] = token;
    }
  }, {
    key: 'match',
    value: function match(type, type2, value) {
      if (type && _instanceof(type, _TokenType2.default)) {

        if (!type2) return this.peekToken() !== undefined && this.peekToken().type === type;

        if (!type && _instanceof(type, _TokenType2.default)) return this.peekToken() !== undefined && this.peekToken().type === type && this.peekToken(1) !== undefined && this.peekToken(1).type === type2;

        if (!type2 && value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === String) return this.peekToken() !== undefined && this.peekToken().type === type && this.peekToken().value === value;
      }
    }
  }, {
    key: 'accept',
    value: function accept(type, token, value) {
      if (type && _instanceof(type, _TokenType2.default)) {

        if (!token && !value) if (this.peekToken() !== undefined && this.peekToken().type === type) {
          this.scanToken();
          return true;
        } else return false;
        if (token && _instanceof(token, _Token2.default)) if (this.peekToken() !== undefined && this.peekToken().type === type) {
          token = this.scanToken();
          return true;
        } else return false;

        if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === String) if (this.peekToken() !== undefined && this.peekToken().type === type && this.peekToken().value === val) {
          this.scanToken();
          return true;
        } else return false;
      }
    }
  }, {
    key: 'expect',
    value: function expect(type, value, source) {
      if (_instanceof(type, _TokenType2.default) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === String && source) {
        var token = this.peekToken();
        if (this.accept(type, value)) {
          return token;
        }
        var failed = this.scanToken();
        if (failed !== undefined) {
          throw new Error('cherry [error: Invalid Token]: ' + value + ' at line: ' + source.line + ', position: ' + source.position + '. Expected ' + type);
        } else {
          throw new Error('cherry [error: EOF]: ' + value + ' at line: ' + source.line + ', position: ' + source.position + '. Expected ' + type);
        }
        return new _Token2.default(type, "", source);
      }
    }
  }, {
    key: 'peekToken',
    value: function peekToken(peek) {
      peek = peek ? peek : 0;
      if (this.position + peek < this._stack.length) {
        return this._stack[this.position + peek];
      }
      return undefined;
    }
  }, {
    key: 'scanToken',
    value: function scanToken() {
      if (this.position >= this._stack.length) return undefined;else this._stack[this.position++];
    }
  }, {
    key: 'toBuffer',
    value: function toBuffer() {
      return this._stack;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return JSON.parse(JSON.stringify(this._stack));
    }
  }, {
    key: 'position',
    set: function set(position) {
      return this._position = position;
    },
    get: function get() {
      return this._position;
    }
  }]);

  return TokenStream;
})();

exports.default = TokenStream;