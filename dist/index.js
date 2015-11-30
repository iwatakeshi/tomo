(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
let Cherry = {};
const Scanner     = require('./lib/Scanner').default,
      Parser      = require('./lib/Parser').default,
      Source      = require('./lib/Source').default,
      Tokenize    = require('./lib/Token').default,
      Stream      = require('./lib/Stream').default,
      Location    = require('./lib/Location').default,
      Range       = require('./lib/Location').Range,
      Collections = require('./lib/Collections').default,
      Utils       = require('./lib/Utils').default;

      
Cherry = { 
  Scanner, Parser, Source, 
  Tokenize, Collections, Utils, 
  Stream, Location, Range
};

if(window) {
  window.Cherry = Cherry;
  window.cherry = Cherry;
}
else module.exports = Cherry;
},{"./lib/Collections":2,"./lib/Location":3,"./lib/Parser":5,"./lib/Scanner":6,"./lib/Source":7,"./lib/Stream":8,"./lib/Token":9,"./lib/Utils":10}],2:[function(require,module,exports){
'use strict';
/*
  Copyright (C) 2015 by Takeshi Iwana, @iwatakeshi
    Copyright (C) 2011 by Andrea Giammarchi, @WebReflection

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
 */
//shared pointer
var i;
//shortcuts
var defineProperty = Object.defineProperty, is = function (a, b) { return isNaN(a) ? isNaN(b) : a === b; };
/**
  * ES6 collection constructor
  * @return {Function} a collection class
  */
function createCollection(proto, objectOnly) {
    function Collection(a) {
        if (!this || this.constructor !== Collection)
            return new Collection(a);
        this._keys = [];
        this._values = [];
        this._itp = []; // iteration pointers
        this.objectOnly = objectOnly;
        //parse initial iterable argument passed
        if (a)
            init.call(this, a);
    }
    //define size for non object-only collections
    if (!objectOnly) {
        defineProperty(proto, 'size', {
            get: sharedSize
        });
    }
    //set prototype
    proto.constructor = Collection;
    Collection.prototype = proto;
    return Collection;
}
/** parse initial iterable argument passed */
function init(a) {
    var i;
    //init Set argument, like `[1,2,3,{}]`
    if (this.add)
        a.forEach(this.add, this);
    else
        a.forEach(function (a) { this.set(a[0], a[1]); }, this);
}
/** delete */
function sharedDelete(key) {
    if (this.has(key)) {
        this._keys.splice(i, 1);
        this._values.splice(i, 1);
        // update iteration pointers
        this._itp.forEach(function (p) { if (i < p[0])
            p[0]--; });
    }
    // Aurora here does it while Canary doesn't
    return -1 < i;
}
function sharedGet(key) {
    return this.has(key) ? this._values[i] : undefined;
}
function has(list, key) {
    if (this.objectOnly && key !== Object(key))
        throw new TypeError('Invalid value used as weak collection key');
    //NaN or 0 passed
    if (key !== key || key === 0)
        for (i = list.length; i-- && !is(list[i], key);) {
        }
    else
        i = list.indexOf(key);
    return -1 < i;
}
function setHas(value) {
    return has.call(this, this._values, value);
}
function mapHas(value) {
    return has.call(this, this._keys, value);
}
/** @chainable */
function sharedSet(key, value) {
    this.has(key) ?
        this._values[i] = value :
        this._values[this._keys.push(key) - 1] = value;
    return this;
}
/** @chainable */
function sharedAdd(value) {
    if (!this.has(value))
        this._values.push(value);
    return this;
}
function sharedClear() {
    (this._keys || 0).length =
        this._values.length = 0;
}
/** keys, values, and iterate related methods */
function sharedKeys() {
    return sharedIterator(this._itp, this._keys);
}
function sharedValues() {
    return sharedIterator(this._itp, this._values);
}
function mapEntries() {
    return sharedIterator(this._itp, this._keys, this._values);
}
function setEntries() {
    return sharedIterator(this._itp, this._values, this._values);
}
function sharedIterator(itp, array, array2) {
    var p = [0], done = false;
    itp.push(p);
    return {
        next: function () {
            var v, k = p[0];
            if (!done && k < array.length) {
                v = array2 ? [array[k], array2[k]] : array[k];
                p[0]++;
            }
            else {
                done = true;
                itp.splice(itp.indexOf(p), 1);
            }
            return { done: done, value: v };
        }
    };
}
function sharedSize() {
    return this._values.length;
}
function sharedForEach(callback, context) {
    var it = this.entries();
    for (;;) {
        var r = it.next();
        if (r.done)
            break;
        callback.call(context, r.value[1], r.value[0], this);
    }
}
var Collections;
(function (Collections) {
    var Map = (function () {
        function Map() {
            return createCollection({
                // WeakMap#delete(key:void*):boolean
                'delete': sharedDelete,
                //:was Map#get(key:void*[, d3fault:void*]):void*
                // Map#has(key:void*):boolean
                has: mapHas,
                // Map#get(key:void*):boolean
                get: sharedGet,
                // Map#set(key:void*, value:void*):void
                set: sharedSet,
                // Map#keys(void):Iterator
                keys: sharedKeys,
                // Map#values(void):Iterator
                values: sharedValues,
                // Map#entries(void):Iterator
                entries: mapEntries,
                // Map#forEach(callback:Function, context:void*):void ==> callback.call(context, key, value, mapObject) === not in specs`
                forEach: sharedForEach,
                // Map#clear():
                clear: sharedClear
            }).apply(this, arguments);
        }
        Map.prototype.delete = function (key) { };
        Map.prototype.has = function (value) { };
        Map.prototype.get = function (key) { };
        Map.prototype.set = function (key, value) { };
        Map.prototype.keys = function () { };
        Map.prototype.values = function () { };
        Map.prototype.entries = function () { };
        Map.prototype.forEach = function (callback, thisArg) { };
        Map.prototype.clear = function () { };
        return Map;
    })();
    Collections.Map = Map;
    var WeakMap = (function () {
        function WeakMap() {
            return createCollection({
                // WeakMap#delete(key:void*):boolean
                'delete': sharedDelete,
                // WeakMap#clear():
                clear: sharedClear,
                // WeakMap#get(key:void*):void*
                get: sharedGet,
                // WeakMap#set(key:void*, value:void*):void
                set: sharedSet,
                // WeakMap#has(key:void*):boolean
                has: mapHas
            }, true).apply(this, arguments);
        }
        WeakMap.prototype.delete = function (key) { };
        WeakMap.prototype.clear = function () { };
        WeakMap.prototype.get = function (key) { };
        WeakMap.prototype.set = function (key, value) { };
        WeakMap.prototype.has = function (value) { };
        return WeakMap;
    })();
    Collections.WeakMap = WeakMap;
    var Set = (function () {
        function Set() {
            return createCollection({
                // Set#has(value:void*):boolean
                has: setHas,
                // Set#add(value:void*):boolean
                add: sharedAdd,
                // Set#delete(key:void*):boolean
                'delete': sharedDelete,
                // Set#clear():
                clear: sharedClear,
                // Set#keys(void):Iterator
                keys: sharedValues,
                // Set#values(void):Iterator
                values: sharedValues,
                // Set#entries(void):Iterator
                entries: setEntries,
                // Set#forEach(callback:Function, context:void*):void ==> callback.call(context, value, index) === not in specs
                forEach: sharedForEach
            }).apply(this, arguments);
        }
        Set.prototype.delete = function () { };
        Set.prototype.has = function (value) { };
        Set.prototype.add = function (value) { };
        Set.prototype.keys = function () { };
        Set.prototype.values = function () { };
        Set.prototype.entries = function () { };
        Set.prototype.forEach = function (callback, thisArg) { };
        Set.prototype.clear = function () { };
        return Set;
    })();
    Collections.Set = Set;
    var WeakSet = (function () {
        function WeakSet() {
            return createCollection({
                // WeakSet#delete(key:void*):boolean
                'delete': sharedDelete,
                // WeakSet#add(value:void*):boolean
                add: sharedAdd,
                // WeakSet#clear():
                clear: sharedClear,
                // WeakSet#has(value:void*):boolean
                has: setHas
            }, true).apply(this, arguments);
        }
        WeakSet.prototype.delete = function () { };
        WeakSet.prototype.add = function (value) { };
        WeakSet.prototype.clear = function () { };
        WeakSet.prototype.has = function (value) { };
        return WeakSet;
    })();
    Collections.WeakSet = WeakSet;
})(Collections || (Collections = {}));
exports["default"] = Collections;

},{}],3:[function(require,module,exports){
/* @export {class Location} */
var Location = (function () {
    /*
      @param {line = 1} - The line number.
      @param {column = 0} - The column number.
      @example: javascript {
        let location = new Location(0, 0);
      }
     */
    function Location(line, column) {
        if (line === void 0) { line = 1; }
        if (column === void 0) { column = 0; }
        this.line = line;
        this.column = column;
    }
    Location.prototype.toJSON = function () {
        return {
            line: Number(this.line),
            column: Number(this.column)
        };
    };
    return Location;
})();
exports.Location = Location;
;
/* @export {class Range} */
var Range = (function () {
    /*
      @param {start?: Location} - The starting location.
      @param {end?: Location} - The ending location.
      @example: javascript {
        let range = new Range(new Location(), new Location());
      }
     */
    function Range(start, end) {
        this.start = start;
        this.end = end;
    }
    /*
      @method {location}
      @return {Array<any>} - Returns the range.
     */
    Range.prototype.location = function () {
        return [this.start.toJSON(), this.end.toJSON()];
    };
    Range.prototype.toJSON = function () {
        return {
            start: {
                line: this.start.line,
                column: this.start.column
            },
            end: {
                line: this.end.line,
                column: this.end.column
            }
        };
    };
    return Range;
})();
exports.Range = Range;
exports["default"] = Location;

},{}],4:[function(require,module,exports){
var Options;
(function (Options) {
    Options.Scanner = {
        ignore: {
            whitespace: true
        },
        override: {
            isWhiteSpace: undefined
        }
    };
})(Options || (Options = {}));
exports["default"] = Options;

},{}],5:[function(require,module,exports){
var Token_1 = require('./Token');
var Location_1 = require('./Location');
var TokenType = Token_1["default"].TokenType, Token = Token_1["default"].Token;
var Parser = (function () {
    function Parser(stream) {
        this.stream = stream;
        this.info = { time: { elapsed: 0 }, errors: [] };
    }
    Parser.prototype.parse = function (parser) {
        if (typeof parser === 'function') {
            var start = Date.now();
            var token;
            var ast = {};
            while (!((token = this.stream.next()).isEqual(TokenType.End))) {
                ast = parser.call(this, token, ast);
            }
            this.info.time.elapsed = (Date.now() - start);
            return ast;
        }
    };
    Parser.prototype.lookBack = function (peek) {
        return this.stream.peekBack(peek);
    };
    Parser.prototype.peek = function (peek) {
        if (peek === void 0) { peek = 0; }
        return this.stream.peek(peek);
    };
    Parser.prototype.prev = function () {
        return this.stream.previous();
    };
    Parser.prototype.next = function () {
        return this.stream.next();
    };
    Parser.prototype.location = function () {
        if (this.peek()) {
            return this.peek().location();
        }
        else if (this.stream.length === 0) {
            return {
                start: new Location_1["default"](0, 0),
                end: new Location_1["default"](0, 0)
            };
        }
        else
            return this.lookBack(1).location();
    };
    Parser.prototype.match = function (type) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var current = this.peek();
        switch (arg.length) {
            case 0:
                return current && current.isEqual(type);
            case 1:
                if (typeof arg[0] === 'string') {
                    return current && current.isEqual(type, arg[0]);
                }
                else {
                    var ahead = this.peek(1);
                    return current && current.isEqual(type) &&
                        ahead && ahead.isEqual(arg[0]);
                }
        }
    };
    Parser.prototype.matchAny = function () {
        var _this = this;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        return (Array.isArray(arg[0]) ? arg[0] : arg)
            .map(function (type) { return _this.peek().isEqual(type); })
            .filter(function (truth) { return truth === false; })
            .length > 1 ? false : true;
    };
    Parser.prototype.accept = function (type) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var current = this.peek();
        switch (arg.length) {
            case 0:
                if (current && current.isEqual(type)) {
                    this.next();
                    return true;
                }
                else
                    return false;
            case 1:
                if (typeof arg[0] === 'string') {
                    if (current && current.isEqual(type, arg[0])) {
                        this.next();
                        return true;
                    }
                    else
                        return false;
                }
                else {
                    if (current && current.isEqual(type)) {
                        arg[0] = this.next();
                        return true;
                    }
                    else
                        return false;
                }
        }
    };
    Parser.prototype.expect = function (type, value) {
        var ret = value ? this.peek() : undefined;
        if (this.accept(type, value ? value : ret))
            return ret;
        var offender = this.next();
        var expected = typeof type === 'string' ? Token.stringToType(type) : Token.typeToString(type);
        if (offender) {
            this.info.errors.push({
                error: "Unexpected token: '" + offender.typeToString() + "'. Expected token: " + expected,
                type: 'ParseError',
                location: offender.location()
            });
        }
        else {
            this.info.errors.push({
                error: "Unexpected end of stream. Expected token: " + expected,
                type: 'ParseError',
                location: offender.location()
            });
            throw new Error();
        }
        return new Token(typeof expected === 'string' ? Token.stringToType(expected) : expected, '', this.location());
    };
    Parser.prototype.raise = function (message) {
        this.info.errors.push({
            error: "Unexpected token: " + this.next().typeToString(),
            type: 'ParseError',
            message: message ? message : '',
            location: this.location()
        });
    };
    return Parser;
})();
exports["default"] = Parser;

},{"./Location":3,"./Token":9}],6:[function(require,module,exports){
var Utils_1 = require('./Utils');
var Location_1 = require('./Location');
var Stream_1 = require('./Stream');
var Options_1 = require('./Options');
/* @class {Scanner} - Creates a scanner object. */
var Scanner = (function () {
    /*
      @param {source: Source} - The source object.
      @param {options = Options.Scanner} - The options.
      @example: javascript {
        const scanner = new Scanner(new Source('var x = 12;'));
      }
     */
    function Scanner(source, options) {
        if (options === void 0) { options = Options_1["default"].Scanner; }
        this.source = source;
        this.options = options;
        this.tokens = [];
        this.stack = [];
        this.line = 1;
        this.column = 0;
        this.range = new Location_1.Range();
        this.info = { time: { elapsed: 0 } };
    }
    /*
      @method {scan} - Calls the tokenizer as it scans through the source.
      @param {tokenizer: (char: string | number) => Token} - The tokenizer function which returns a token.
      @return {class Stream} - The token stream.
      @example: javascript {
        let scanner = new Scanner(new Source('...'));
        scanner.scan(function(ch) {
          //...
        });
      }
    */
    Scanner.prototype.scan = function (tokenizer) {
        var start = Date.now();
        this.ignoreWhiteSpace();
        while (this.peek() !== this.source.EOF) {
            var token = tokenizer.call(this, this.peek());
            if (token)
                this.tokens.push(token);
            this.ignoreWhiteSpace();
        }
        if (this.peek() === this.source.EOF) {
            var token = tokenizer.call(this, this.peek());
            if (token)
                this.tokens.push(token);
        }
        this.info.time.elapsed = (Date.now() - start);
        return new Stream_1["default"](this.tokens.slice());
    };
    /*
      @method {location} - Marks the locations.
      @return {{ start: () => void, end: () => Range, eof: () => Range }} - The location helpers.
      @example: javascript {
        //...
        scanner.scan(ch => {
          this.location().start();
          //...
          this.location().end();
        });
      }
    */
    Scanner.prototype.location = function () {
        var _this = this;
        var _a = this, line = _a.line, column = _a.column;
        return {
            start: function () {
                _this.range = new Location_1.Range();
                _this.range.start = new Location_1.Location(Number(line), Number(column));
            },
            end: function () {
                _this.range.end = new Location_1.Location(Number(line), Number(column));
                return _this.range;
            },
            eof: function () {
                _this.location().start();
                return _this.location().end();
            }
        };
    };
    /*
      @return {string | number} - The previous character.
     */
    Scanner.prototype.previous = function () {
        if (this.stack.length === 0)
            return;
        this.pop();
        var _a = this.stack[this.stack.length - 1], line = _a.line, column = _a.column;
        this.line = line;
        this.column = column;
        return this.source.charAt(--this.source.position);
    };
    /*
      @return {string | number} - The next character.
     */
    Scanner.prototype.next = function () {
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
        }
        else {
            this.column++;
            this.push();
        }
        return this.source.charAt(this.source.position++);
    };
    /*
      @param {peek = 0} - The number of steps to peek backward.
      @return {string | number} - The previous character(s) to peek.
     */
    Scanner.prototype.peekBack = function (peek) {
        if (peek === void 0) { peek = 0; }
        return this.source.charAt(this.source.position - peek);
    };
    /*
      @param {peek = 0} - The number of steps to peek forward.
      @return {string | number} - The next character(s) to peek.
     */
    Scanner.prototype.peek = function (peek) {
        if (peek === void 0) { peek = 0; }
        // If we peek and the we reach the end or over
        // the length then return EOF
        if (this.source.position + peek >= this.source.length) {
            return this.source.EOF;
        }
        return this.source.charAt(this.source.position + peek);
    };
    /*
      @method {ignoreWhiteSpace} - Ignores the whitespaces in the source.
     */
    Scanner.prototype.ignoreWhiteSpace = function () {
        if (!this.options.ignore.whitespace) {
            if (this.options.override.whitespace &&
                typeof this.options.override.whitespace === 'function') {
                var isWhiteSpace = this.options.override.whitespace;
                while (isWhiteSpace(this.peek())) {
                    this.next();
                }
            }
        }
        else
            while (Utils_1["default"].Code.isWhiteSpace(this.peek())) {
                this.next();
            }
        return;
    };
    /*
      @method {push} - Pushes the current charater and location into the history stack.
     */
    Scanner.prototype.push = function () {
        this.stack.push({
            char: this.source.charAt(this.source.position),
            location: {
                range: this.range
            }
        });
    };
    /*
      @method {pop} - Pops the previous charater and location from the history stack.
     */
    Scanner.prototype.pop = function () {
        this.stack.pop();
    };
    return Scanner;
})();
exports["default"] = Scanner;

},{"./Location":3,"./Options":4,"./Stream":8,"./Utils":10}],7:[function(require,module,exports){
/* @class {Source} - Creates a source object. */
var Source = (function () {
    /*
      @param {source?:string} - The source file.
      @param {options:any} - The options.
      @example: javascript {
        const source = new Source('var x = 12;');
        // or
        const source = new Source({source: '...', name: 'mysource.js'});
      }
     */
    function Source(source, options) {
        if (options === void 0) { options = { isCharCode: true }; }
        this.EOF = options.isCharCode ? '\0'.charCodeAt(0) : '\0';
        if (typeof source === 'string') {
            source = source[source.length - 1] === this.EOF ?
                source : source += this.EOF;
            this.source = source;
            this.name = '';
        }
        if (typeof source === 'object') {
            var src = (source.source ? source.source : '');
            src = src[src.length - 1] === this.EOF ? src : src += this.EOF;
            this.name = source.source ? source.name : '';
            this.source = src;
        }
        this.options = options;
        this.position = 0;
        this.length = this.source.length;
    }
    /*
      @method {charAt} Returns the character in the source at position n.
      @param {position:number} - The position in the source.
      @return {string | number} - The character in the source.
     */
    Source.prototype.charAt = function (position) {
        var ch = this.source[position];
        return this.options.isCharCode ? ch.charCodeAt(0) : ch;
    };
    Source.prototype.toString = function () {
        return "position: " + this.position;
    };
    Source.prototype.toJSON = function () {
        return {
            source: {
                position: this.position
            }
        };
    };
    return Source;
})();
exports["default"] = Source;

},{}],8:[function(require,module,exports){
var Token_1 = require('./Token');
/* @class {Stream} - Creates a stream object. */
var Stream = (function () {
    /*
      @param {tokens: Array<class Token>} - The scanned tokens.
    */
    function Stream(tokens) {
        if (tokens === void 0) { tokens = []; }
        this.stream = tokens;
        this.length = tokens.length;
        this.position = 0;
    }
    /*
     @method {add} - Adds the token to the stream.
     @param {token: class Token} - The token.
    */
    Stream.prototype.add = function (token) {
        this.stream.push(token);
    };
    /*
      @method {previous} - Moves to the previous token.
      @return {class Token} - The previous token.
    */
    Stream.prototype.previous = function () {
        return this.stream[--this.position];
    };
    /*
      @method {next} - Moves to the next token.
      @return {class Token} - The next token.
    */
    Stream.prototype.next = function () {
        if (this.position >= this.stream.length)
            return new Token_1["default"].Token(Token_1["default"].TokenType.End);
        return this.stream[this.position++];
    };
    /*
     @method {peek} - Looks ahead by n tokens.
     @return {class Token} - The look-ahead token.
    */
    Stream.prototype.peek = function (n) {
        return this.stream[this.position + n];
    };
    /*
      @method {peekBack} - Looks behind by n tokens.
      @return {class Token} - The look-behind token.
    */
    Stream.prototype.peekBack = function (n) {
        return this.stream[this.position - n];
    };
    /*
      @method {current}
      @return {class Token} - The current token.
    */
    Stream.prototype.current = function () {
        return this.stream[this.position];
    };
    /*
      @method {forEach} - Loops through the tokens in the stream.
    */
    Stream.prototype.forEach = function (callback, thisArg) {
        var T, k, O = this.stream, len = O.length;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1)
            T = thisArg;
        k = 0;
        while (k < len) {
            var kValue = void 0;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
    return Stream;
})();
exports["default"] = Stream;

},{"./Token":9}],9:[function(require,module,exports){
/* @module {Token} - Contains the necessary data structures to define a Token */
var Token;
(function (Token_1) {
    /* @export {enum TokenType} - Identifies the token type. */
    (function (TokenType) {
        /** Identifiers */
        TokenType[TokenType["Identifier"] = 1] = "Identifier";
        TokenType[TokenType["Reserved"] = 2] = "Reserved";
        /** Literals */
        TokenType[TokenType["Literal"] = 3] = "Literal";
        /** Operator */
        TokenType[TokenType["Operator"] = 4] = "Operator";
        /** Punctuation */
        TokenType[TokenType["Punctuation"] = 5] = "Punctuation";
        /** Other types */
        TokenType[TokenType["Comment"] = 100] = "Comment";
        TokenType[TokenType["Whitespace"] = 50] = "Whitespace";
        TokenType[TokenType["End"] = 0] = "End";
        TokenType[TokenType["Error"] = -1] = "Error";
    })(Token_1.TokenType || (Token_1.TokenType = {}));
    var TokenType = Token_1.TokenType;
    /* @export {class Token} - Creates a token object. */
    var Token = (function () {
        /*
          @param {type?: enum TokenType} - The token's type.
          @param {value?: string} - The token's character value.
          @param {location?: class Location} - The token's location.
          @example: javascript {
            let location = { start: new Location(), end: new Location() };
            let token = new Token(TokenType.Identifier, 'hello', location);
          }
          @notes: markdown {
            * Use `type` and not `stype` for token comparisons.
            * Token `stype` are camel cased when normalized.
          }
         */
        function Token(type, value, location) {
            this.type = type;
            this.stype = this.typeToString();
            this.value = value;
            this.pvalue = '';
            this.loc = location;
        }
        /*
          @param {str: string} - The string to transform.
          @returns {enum TokenType} - Returns the token type by string.
          @example: javascript {
            let type = Token.stringToType('Identifier');
          }
         */
        Token.stringToType = function (str) {
            var type;
            [
                'Identifier',
                'Reserved',
                'Literal',
                'Operator',
                'Punctuation',
                'Comment',
                'Whitespace',
                'End',
                'Error'
            ].forEach(function (t) {
                if (str.indexOf(t) > -1)
                    type = TokenType[t];
            });
            return type;
        };
        /*
          @param {type: enum TokenType} - The token type to transform.
          @param {prepend?: string} - The additional info to prepend to the token type.
          @return {string} - The string representation by token type.
          @example: javascript {
            let type = Token.typeToString(TokenType.Identifier);
          }
          @notes: markdown {
            * Using `typeToString()` normalizes 'semi colon', 'semi-colon' => 'SemiColon' but fails
              when 'SemiColon' which => 'Semicolon'.
          }
         */
        Token.typeToString = function (type, prepend) {
            var normalize = function (str) {
                if (!str) {
                    return '';
                }
                if (str.match(/[ -_]/g)) {
                    return str.replace(/[-_]/g, ' ')
                        .split(' ')
                        .map(function (s) { return s[0].toUpperCase() + s.substring(1, s.length).toLowerCase(); })
                        .join('');
                }
                else
                    return str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
            };
            switch (type) {
                case TokenType.Identifier:
                    return 'Identifier';
                case TokenType.Reserved:
                    return 'Reserved';
                case TokenType.Literal:
                    return normalize(prepend) + 'Literal';
                case TokenType.Operator:
                    return normalize(prepend) + 'Operator';
                case TokenType.Punctuation:
                    return normalize(prepend) + 'Punctuation';
                case TokenType.Comment:
                    return normalize(prepend) + 'Comment';
                case TokenType.Whitespace:
                    return 'Whitespace';
                case TokenType.Error:
                    return 'Error';
                case TokenType.End:
                    return 'End';
            }
        };
        /*
          @param {value = '': string} - The value to prepend to the token type.
          @return {class Token}
          @notes: {
            * Use `prepend()` to add additional info to the token type. e.g. 'Operator' => 'AddOperator'
          }
        */
        Token.prototype.prepend = function (value) {
            if (value === void 0) { value = ''; }
            this.pvalue = value;
            this.stype = this.typeToString();
            return this;
        };
        /*
          @param {type: enum TokenType} - The token type.
          @return {class Token}
        */
        Token.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        /*
         @param {location: class Location} - The token's location.
         @return {class Token}
       */
        Token.prototype.setLocation = function (location) {
            this.loc = location;
            return this;
        };
        /*
          @param {location: class Location} - The token's character value.
          @return {class Token}
        */
        Token.prototype.setValue = function (value) {
            this.value = value;
            return this;
        };
        /* @return {object: { start: class Location, end: class Location }} - The token's location. */
        Token.prototype.location = function () {
            return this.loc;
        };
        /* @see {static Token.typeToString()} */
        Token.prototype.typeToString = function () {
            return Token.typeToString(this.type, this.pvalue);
        };
        /*
          @param {t: TokenType | string | Token} - The type or token to compare.
          @return {boolean} - Determines whether the token is equal to the type.
        */
        Token.prototype.isEqual = function (t, value) {
            var _this = this;
            var isEqual = function () {
                if (typeof t === 'string') {
                    return t === (_this.stype || Token.stringToType(t) === _this.type);
                }
                else if (t instanceof Token) {
                    return t.type === _this.type || t.stype === _this.stype;
                }
                else
                    return t === _this.type;
            };
            if (value)
                return this.value === value && isEqual();
            else
                return isEqual();
        };
        /* @return {string} - The string representation of the Token class. */
        Token.prototype.toString = function () {
            return "token type: " + this.type + ", value: " + this.value;
        };
        /* @return {object} - The JSON representation of the Token class. */
        Token.prototype.toJSON = function () {
            var _a = this.loc, start = _a.start, end = _a.end;
            start = start.toJSON();
            end = end.toJSON();
            return {
                token: {
                    type: { key: this.type, value: this.stype },
                    value: this.value,
                    location: {
                        start: start,
                        end: end,
                        range: {
                            line: [start.line, end.line],
                            column: [start.column, end.column]
                        }
                    }
                }
            };
        };
        return Token;
    })();
    Token_1.Token = Token;
})(Token || (Token = {}));
exports["default"] = Token;

},{}],10:[function(require,module,exports){
/*
  Copyright (C) 2015 Takeshi Iwana <iwatakeshi@gmail.com>
  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var Utils;
(function (Utils) {
    var Code = (function () {
        function Code() {
        }
        /**
        * Determines whether a digit is a decimal.
        * @return {boolean}
        */
        Code.isDecimalDigit = function (char) {
            var ch = typeof char === 'number' ? char : char.charCodeAt(0);
            // 0..9
            return 0x30 <= ch && ch <= 0x39;
        };
        /**
        * Determines whether a digit is a hex.
        * @return {boolean}
        */
        Code.isHexDigit = function (char) {
            var ch = typeof char === 'number' ? char : char.charCodeAt(0);
            // 0..9
            return 0x30 <= ch && ch <= 0x39 ||
                // a..f
                0x61 <= ch && ch <= 0x66 ||
                // A..F
                0x41 <= ch && ch <= 0x46;
        };
        /**
        * Determines whether a digit is an octal.
        * @return {boolean}
        */
        Code.isOctalDigit = function (char) {
            var ch = typeof char === 'number' ? char : char.charCodeAt(0);
            // 0..7
            return ch >= 0x30 && ch <= 0x37;
        };
        /**
        * Determines whether a character is a whitespace.
        * @return {boolean
        */
        Code.isWhiteSpace = function (char) {
            var ch = typeof char === 'number' ? char : char.charCodeAt(0);
            var whitespaces = [
                0x1680, 0x180E,
                0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
                0x202F, 0x205F,
                0x3000,
                0xFEFF
            ];
            return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
                ch >= 0x1680 && whitespaces.indexOf(ch) >= 0;
        };
        /**
        * Determines whether a character is a line terminator
        * @return {boolean}
        */
        Code.isLineTermintor = function (char) {
            var ch = typeof char === 'number' ? char : char.charCodeAt(0);
            return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
        };
        return Code;
    })();
    Utils.Code = Code;
})(Utils || (Utils = {}));
exports["default"] = Utils;

},{}]},{},[1]);
