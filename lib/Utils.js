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
