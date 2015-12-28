# tomo

[![Join the chat at https://gitter.im/iwatakeshi/tomo](https://badges.gitter.im/iwatakeshi/tomo.svg)](https://gitter.im/iwatakeshi/tomo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A small generic scanner and parser written in TypeScript for Node and the web.

Note: Not production ready and it's more like a toy for the moment.

[![Build Status](https://travis-ci.org/iwatakeshi/tomo.svg?branch=master)](https://travis-ci.org/iwatakeshi/tomo)

## Background

tomo is a small generic lexer and parser that started out of curiousity on how lexers and parsers work. In addition to my curiosity,
a [discussion](https://github.com/mr-doc/mr-doc/issues/94) appeared on [Mr. Doc's](https://github.com/mr-doc/) issue about creating a parser that
replaces Mr. Doc's current core ([Dox](https://github.com/tj/dox) and tomo is the result of that discussion. If this succeeds, it will mean that Mr. Doc can generate documentation for any language*. Of course, tomo can be used for other things such as a text editor, etc.

\* It will depend on the parser.


## Usage

```bash
npm i --save tomo
```

tomo contains 3 main classes and 1 module that makes up the lexer and parser combo: Source, Scanner, Parser, and Token respectively.

The Source class initializes a new source object which provides the essential methods to the Scanner class 
to begin the tokenization process. To tokenize, one must pass a callback function to `scan` 
that tokenizes the source. Once it has finished the tokenization process, it wraps the tokens
into a Token stream which the TokenStream class (in the Token module) provides a few helper methods to access the tokens.

The Token class (in the Token module) provides the essentials to describe the scanned characters. `Token.ts` exports two
modules which is the `TokenType: enum`, and the Token class. See `Token.ts` 

The Parser class ( __Help Needed__ ) _should parse the tokens and return an AST_.

As the descriptions says, tomo can be used in the web browser. The library is bundled using browserify and all classes have no external dependency (npm modules) other than the tomo classes. You may simply add the source from `dist/` into your html file and use it as you normally would. Note that the source is not minified at the moment.


### Example

See example on [rawgit](https://rawgit.com/iwatakeshi/tomo/master/html/index.html).


```bash
# Install modules
npm i

# Run the example file
npm start
```

## Develop

Contributions are gladly accepted. tomo uses Typescript and the source files
are located under the `src/` directory.

To build the files, run `gulp`.
