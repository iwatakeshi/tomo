'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = (function () {
  function Token(type, value, source) {
    _classCallCheck(this, Token);

    this._type = type;
    this._value = value;
    this._source = source;
  }

  _createClass(Token, [{
    key: "toJSON",
    value: function toJSON() {
      return Object.assign(this._source, {
        "token": {
          "type": this.type,
          "value": this.value
        }
      });
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    }
  }, {
    key: "source",
    get: function get() {
      return this._source;
    }
  }]);

  return Token;
})();

exports.default = Token;