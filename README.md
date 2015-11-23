# cherry
A small generic lexer and parser written in JavaScript for Node and the web.

Note: Not production ready and it's more like a toy for the moment.

[![Build Status](https://travis-ci.org/iwatakeshi/cherry.svg?branch=master)](https://travis-ci.org/iwatakeshi/cherry)

## Background

Cherry is a small generic lexer and parser that started out of curiousity on how lexers and parsers work. In addition to my curiosity,
a [discussion](https://github.com/mr-doc/mr-doc/issues/94) appeared on [Mr. Doc's](https://github.com/mr-doc/) issue about creating a parser that
replaces Mr. Doc's current core ([Dox](https://github.com/tj/dox)). If this succeeds, it will mean that Mr. Doc can generate documentation for any language*.

Due to the fact that I have self studied about lexing and parsing, it is quite possible that the way I've implemented the lexer and parser may be incorrect but since
this is an open source project I encourage you to point out to me those mistakes (in layman's terms).

As of right now, the areas where I lack knowledge is in parsing and creating a symbol table (if necessary such as in the 
[source code for VSCode](https://github.com/Microsoft/vscode/blob/master/src/vs/languages/css/common/parser/cssSymbols.ts)). 
From what I do know, parsing deals with Nodes and grammars. I've seen BNF for grammar but the only source that I found about transforming
BNF to code [is written in Python](http://parsingintro.sourceforge.net/) which is an awkward language IMO. Therefore I am struggling to create
a parser that is somewhat object oriented yet small enough for others to understand. If you have the time, please contact me and share your
great skills with me to make this project happen! :)

\* It will depend on the parser.


## Usage

Cherry is currently being incubated under this repo so it is not published on npm. The plan is to stabilize this project
and move the repo over to [Mr. Doc core](https://www.github.com/mr-doc/core) once it is accepted by the community.
While cherry may not be on npm, it is still possible to install directly from the GitHub repo:

```bash
npm i --save https://github.com/iwatakeshi/cherry.git
```

Cherry contains 4 main classes that makes up the lexer and parser combo: Source, Scanner, Parser, and Token.

The Source class provides the Scanner the `source: string`, `line: number`, `column: number`, and the `position: number`. 
The Source class also provides the source a EOF (`'\0'`) character if it doens't end with one.

The Scanner class initializes a new source in the constructor and provides the essential methods 
to begin the tokenization process. To tokenize, one must pass a callback function to `scan` 
that tokenizes the source. Once it has finished tokenization process, it wraps the tokens
into a stream which the it provides a few methods to access the tokens.

The Token class provides the essentials to describe a scanned character. `Token.ts` exports two
modules which is the `TokenType: enum`, and the Token class. See `Token.ts` 

The Parser class ( __Help Needed__ ) _should parse the tokens and return an AST_.


```javascript
// Enable destructuring in Node using the '--harmony_destructuring' flag
const { Scanner, Tokenization } = require('cherry');
const { Token, TokenType } = Tokenization;

const isDigit = function (c) { return /[0-9]/.test(c); };

const source = '123.45'

const scanner = new Scanner(source);

const scan = {
	'number': function (ch) {
		// Mark the beginning of the location
		this.location().start();
		let buffer = [];
    do {
      if (ch == '.')
        do buffer.push((ch = this.peekChar())); while (isDigit(this.nextChar()));
      else buffer.push(this.nextChar());
      ch = this.peekChar();
    } while (isDigit(ch) || ch === '.');
		// Create a new token and mark the end of the location
    return new Token(TokenType.Literal)
		// Preprend the type of literal.
      .prepend('number')
      .setValue(buffer.join(''))
      .setLocation(this.location().end());
	}
};

const stream = scanner.scan(function(ch){
	switch(ch) {
		case '0': case '1': case '2': case '3': case '4':
		case '5': case '6': case '7': case '8': case '9':
			return scan.number.call(this);
		default:
			this.location.start();
			return new Token(TokenType.End, '', this.location().eof());
	}
});

// Print all tokens
stream.forEach(s => console.log(JSON.stringify(s.toJSON(), null, 2));
 
/* 
	OUTPUT:
	{
		"token": {
			"type": {
				"key": 3,
				"value": "NumberLiteral"
			},
			"value": "123.45",
			"location": {
				"start": {
					"line": 1,
					"column": 0
				},
				"end": {
					"line": 1,
					"column": 6
				},
				"range": {
					"line": [
						1,
						1
					],
					"column": [
						0,
						6
					]
				}
			}
		}
	}
	{
		"token": {
			"type": {
				"key": 0,
				"value": "End"
			},
			"value": "\u0000",
			"location": {
				"start": {
					"line": 1,
					"column": 6
				},
				"end": {
					"line": 1,
					"column": 6
				},
				"range": {
					"line": [
						1,
						1
					],
					"column": [
						6,
						6
					]
				}
			}
		}
	}
*/

```

A working example can be found in `examples/scanner.js`;


```bash
# Install modules
npm i

# Run the test/example file
npm start
```

## Develop

Contributions are gladly accepted. Cherry uses Typescript and the source files
are located under the `src/` directory.

To build the files, run `gulp`.
