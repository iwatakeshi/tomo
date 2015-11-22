const { Parser, Tokenization } = require('../');
const { Token, TokenType } = Tokenization;
const stream = require('./scanner');

function ts(type, prepend) {
	return Token.typeToString(type, prepend || '');
}

const parse = {
	'factor': function (ast) {
		if (this.match(ts(TokenType.Identifier)))
			console.log(this.next());
		else if (this.match(ts(TokenType.Literal, 'number')))
			console.log(this.next());
		else if (this.match(ts(TokenType.Punctuation, 'left parenthesis'))) {
			parse.expression.call(this, ast);
			this.expect(ts(TokenType.Punctuation, 'right parenthesis'));
		} else {
			this.raise('factor: syntax error');
			this.next();
		}

	},
	'expression': function (ast) {
		const plus = ts(TokenType.Operator, 'plus'),
			minus = ts(TokenType.Operator, 'minus');
		if (this.match(plus) || this.match(minus))
			parse.term.call(this, ast);
		while (this.match(plus) || this.match(minus))
			parse.term.call(this, ast);
	},
	'term': function (ast) {
		const mult = ts(TokenType.Operator, 'multiply'),
						div = ts(TokenType.Operator, 'divide');
		parse.factor.call(this, ast);
		while (this.match(mult) || this.match(div))
			parse.factor.call(this, ast);
	},
	'statement' : function (ast) {
		if(this.match(ts(TokenType.Identifier))) {
			this.expect(ts(TokenType.Operator, 'assign'));
			parse.expression.call(this, ast);
		} else if(this.match(ts(TokenType.Reserved, 'call'))) {
			this.expect(ts(TokenType.Identifier));
		} else if(this.match(ts(TokenType.Reserved, 'begin'))) {
				parse.statement.call(this, ast);
				while(this.match(ts(TokenType.Punctuation, 'semi colon')))
					parse.statement.call(this, ast);
				this.expect(ts(TokenType.Reserved, 'end'));
		} else if(this.match(ts(TokenType.Reserved), 'if')) {
			parse.condition.call(this, ast);
			this.expect(ts(TokenType.Reserved, 'then'));
			parse.statement.call(this, ast);
		} else if(this.match(ts(TokenType.Reserved), 'while')) {
			parse.condition.call(this, ast);
			this.expect(ts(TokenType.Reserved, 'do'));
			parse.statement.call(this, ast);
		}
	},
	'condition': function(ast) {
		const assign = ts(TokenType.Operator, 'assign'),
					pound	 = ts(TokenType.Operator, 'pound'),
					lt = ts(TokenType.Operator, 'less than'),
					lte = ts(TokenType.Operator, 'less than equal'),
					gt = ts(TokenType.Operator, 'greater than'),
					gte = ts(TokenType.Operator, 'greater than equal');
		if(this.match(ts(TokenType.Reserved, 'odd')))
			parse.expression.call(this, ast);
		else {
			parse.expression.call(this, ast);
			if(this.match(assign) || this.match(pound) || 
			this.match(lt) || this.match(lte) ||
			this.match(gt) || this.match(gte))
				parse.expression.call(this, ast);
			else {
				this.raise('condition: found invalid operator');
				this.next();
			}
		}
	},
	'block': function(ast) {
		const assign = ts(TokenType.Operator, 'assign'),
					num = ts(TokenType.Literal, 'number'),
					comma = ts(TokenType.Punctuation, 'comma'),
					semicolon = ts(TokenType.Punctuation, 'semi colon'),
					id = ts(TokenType.Identifier);
		if(this.match(ts(TokenType.Reserved, 'const'))){
			this.expect(id);
			this.expect(assign);
			this.expect(num);
			while(this.match(comma)) {
				this.expect(id);
				this.expect(assign);
				this.expect(num);
			}
			this.expect(semicolon);
		}
		if(this.match(ts(TokenType.Reserved, 'var'))) {
			this.expect(id);
			while(this.match(comma)) {
				this.expect(id);
			}
			this.expect(semicolon);
		}
		while(this.match(ts(TokenType.Reserved, 'procedure'))) {
			this.expect(id);
			this.expect(semicolon);
			parse.block.call(this, ast);
			this.expect(semicolon);
		}
		parse.statement.call(this, ast);
	}
};

const parser = new Parser(stream);
const tree = parser.parse(function (token, ast) {
		parse.block.call(this, ast);
		
		return ast;
});

console.log(parser)
console.log(tree);