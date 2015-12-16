# cherry
A small generic scanner and parser written in TypeScript for Node and the web.

Note: Not production ready and it's more like a toy for the moment.

[![Build Status](https://travis-ci.org/iwatakeshi/cherry.svg?branch=master)](https://travis-ci.org/iwatakeshi/cherry)

## Background

Cherry is a small generic lexer and parser that started out of curiousity on how lexers and parsers work. In addition to my curiosity,
a [discussion](https://github.com/mr-doc/mr-doc/issues/94) appeared on [Mr. Doc's](https://github.com/mr-doc/) issue about creating a parser that
replaces Mr. Doc's current core ([Dox](https://github.com/tj/dox) and cherry is the result of that discussion. If this succeeds, it will mean that Mr. Doc can generate documentation for any language*.

\* It will depend on the parser.


## Usage

Cherry is currently being incubated under this repo so it is not published on npm or bower. The plan is to stabilize this project
and move the repo over to [Mr. Doc core](https://www.github.com/mr-doc/core) once it is accepted by the community.
While cherry may not be on npm, it is still possible to install directly from the GitHub repo:

```bash
npm i --save https://github.com/iwatakeshi/cherry.git
```

Cherry contains 3 main classes and 1 module that makes up the lexer and parser combo: Source, Scanner, Parser, and Token respectively.

The Source class initializes a new source object which provides the essential methods to the Scanner class 
to begin the tokenization process. To tokenize, one must pass a callback function to `scan` 
that tokenizes the source. Once it has finished the tokenization process, it wraps the tokens
into a Token stream which the TokenStream class (in the Token module) provides a few helper methods to access the tokens.

The Token class (in the Token module) provides the essentials to describe the scanned characters. `Token.ts` exports two
modules which is the `TokenType: enum`, and the Token class. See `Token.ts` 

The Parser class ( __Help Needed__ ) _should parse the tokens and return an AST_.


### Example

See example on [rawgit](https://rawgit.com/iwatakeshi/cherry/master/html/index.html).


```bash
# Install modules
npm i

# Run the example file
npm start
```

## Develop

Contributions are gladly accepted. Cherry uses Typescript and the source files
are located under the `src/` directory.

To build the files, run `gulp`.
