import { tokenize, parse, Environment, Interpreter } from '../src/utils/chat-templates.js';
import { compare } from './test_utils.js';


const TEST_STRINGS = {

    // If statements
    IF_ONLY: `{% if 1 == 1 %} {{ 'A' }} {% endif %} {{ 'B' }}`,
    IF_ELSE_ONLY: `{% if 1 == 2 %} {{ 'A' }} {% else %} {{ 'B' }} {% endif %} {{ 'C' }}`,
    IF_ELIF_ELSE: `{% if 1 == 2 %} {{ 'A' }} {{ 'B' }} {{ 'C' }} {% elif 1 == 2 %} {{ 'D' }} {% elif 1 == 3 %} {{ 'E' }} {{ 'F' }} {% else %} {{ 'G' }} {{ 'H' }} {{ 'I' }} {% endif %} {{ 'J' }} `,

    // For loops
    FOR_LOOP: `{% for message in messages %}{{ message['content'] }}{% endfor %}`,

    // Set variables
    VARIABLES: `{% set x = 'Hello' %}{% set y = 'World' %}{{ x + ' ' + y }}`,

    // Binary expressions
    BINOP_EXPR: `{{ 1 % 2 }}{{ 1 < 2 }}{{ 1 > 2 }}{{ 1 >= 2 }}{{ 2 <= 2 }}{{ 2 == 2 }}{{ 2 != 3 }}{{ 2 + 3 }}`,

    // Strings
    STRINGS: `{{ 'Bye' }} {{ bos_token + '[INST] ' }}`,

    // Function calls
    FUNCTIONS: `{{ func() }} {{ func(apple) }} {{ func(x, 'test', 2, false) }}`,

    // Object properties
    PROPERTIES: `{{ obj.x + obj.y }} {{ obj['x'] + obj.y }}`,

    // Object methods
    OBJ_METHODS: `{{ obj.x(x, y) }} {{ obj.x() }} {{ obj.x[x](x, y) }} `,
}


const TEST_PARSED = {
    // If statements
    IF_ONLY: [
        { value: '{%', type: 'OpenStatement' },
        { value: 'if', type: 'If' },
        { value: '1', type: 'NumericLiteral' },
        { value: '==', type: 'ComparisonBinaryOperator' },
        { value: '1', type: 'NumericLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'A', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'endif', type: 'EndIf' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'B', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' }
    ],
    IF_ELSE_ONLY: [
        { value: '{%', type: 'OpenStatement' },
        { value: 'if', type: 'If' },
        { value: '1', type: 'NumericLiteral' },
        { value: '==', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'A', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'else', type: 'Else' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'B', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'endif', type: 'EndIf' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'C', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' }
    ],
    IF_ELIF_ELSE: [
        { value: '{%', type: 'OpenStatement' },
        { value: 'if', type: 'If' },
        { value: '1', type: 'NumericLiteral' },
        { value: '==', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'A', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'B', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'C', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'elif', type: 'ElseIf' },
        { value: '1', type: 'NumericLiteral' },
        { value: '==', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'D', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'elif', type: 'ElseIf' },
        { value: '1', type: 'NumericLiteral' },
        { value: '==', type: 'ComparisonBinaryOperator' },
        { value: '3', type: 'NumericLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'E', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'F', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'else', type: 'Else' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'G', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'H', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'I', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'endif', type: 'EndIf' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'J', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' }
    ],


    // For loops
    FOR_LOOP: [
        { value: '{%', type: 'OpenStatement' },
        { value: 'for', type: 'For' },
        { value: 'message', type: 'Identifier' },
        { value: 'in', type: 'In' },
        { value: 'messages', type: 'Identifier' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'message', type: 'Identifier' },
        { value: '[', type: 'OpenSquareBracket' },
        { value: 'content', type: 'StringLiteral' },
        { value: ']', type: 'CloseSquareBracket' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'endfor', type: 'EndFor' },
        { value: '%}', type: 'CloseStatement' }
    ],

    // Set variables
    VARIABLES: [
        { value: '{%', type: 'OpenStatement' },
        { value: 'set', type: 'Set' },
        { value: 'x', type: 'Identifier' },
        { value: '=', type: 'Equals' },
        { value: 'Hello', type: 'StringLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{%', type: 'OpenStatement' },
        { value: 'set', type: 'Set' },
        { value: 'y', type: 'Identifier' },
        { value: '=', type: 'Equals' },
        { value: 'World', type: 'StringLiteral' },
        { value: '%}', type: 'CloseStatement' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'x', type: 'Identifier' },
        { value: '+', type: 'AdditiveBinaryOperator' },
        { value: ' ', type: 'StringLiteral' },
        { value: '+', type: 'AdditiveBinaryOperator' },
        { value: 'y', type: 'Identifier' },
        { value: '}}', type: 'CloseExpression' }
    ],

    // Binary expressions
    BINOP_EXPR: [
        { value: '{{', type: 'OpenExpression' },
        { value: '1', type: 'NumericLiteral' },
        { value: '%', type: 'MultiplicativeBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '1', type: 'NumericLiteral' },
        { value: '<', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '1', type: 'NumericLiteral' },
        { value: '>', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '1', type: 'NumericLiteral' },
        { value: '>=', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '2', type: 'NumericLiteral' },
        { value: '<=', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '2', type: 'NumericLiteral' },
        { value: '==', type: 'ComparisonBinaryOperator' },
        { value: '2', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '2', type: 'NumericLiteral' },
        { value: '!=', type: 'ComparisonBinaryOperator' },
        { value: '3', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: '2', type: 'NumericLiteral' },
        { value: '+', type: 'AdditiveBinaryOperator' },
        { value: '3', type: 'NumericLiteral' },
        { value: '}}', type: 'CloseExpression' }
    ],

    // Strings
    STRINGS: [
        { value: '{{', type: 'OpenExpression' },
        { value: 'Bye', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'bos_token', type: 'Identifier' },
        { value: '+', type: 'AdditiveBinaryOperator' },
        { value: '[INST] ', type: 'StringLiteral' },
        { value: '}}', type: 'CloseExpression' }
    ],

    // Function calls
    FUNCTIONS: [
        { value: '{{', type: 'OpenExpression' },
        { value: 'func', type: 'Identifier' },
        { value: '(', type: 'OpenParen' },
        { value: ')', type: 'CloseParen' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'func', type: 'Identifier' },
        { value: '(', type: 'OpenParen' },
        { value: 'apple', type: 'Identifier' },
        { value: ')', type: 'CloseParen' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'func', type: 'Identifier' },
        { value: '(', type: 'OpenParen' },
        { value: 'x', type: 'Identifier' },
        { value: ',', type: 'Comma' },
        { value: 'test', type: 'StringLiteral' },
        { value: ',', type: 'Comma' },
        { value: '2', type: 'NumericLiteral' },
        { value: ',', type: 'Comma' },
        { value: 'false', type: 'Identifier' },
        { value: ')', type: 'CloseParen' },
        { value: '}}', type: 'CloseExpression' }
    ],

    // Object properties
    PROPERTIES: [
        { value: '{{', type: 'OpenExpression' },
        { value: 'obj', type: 'Identifier' },
        { value: '.', type: 'Dot' },
        { value: 'x', type: 'Identifier' },
        { value: '+', type: 'AdditiveBinaryOperator' },
        { value: 'obj', type: 'Identifier' },
        { value: '.', type: 'Dot' },
        { value: 'y', type: 'Identifier' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'obj', type: 'Identifier' },
        { value: '[', type: 'OpenSquareBracket' },
        { value: 'x', type: 'StringLiteral' },
        { value: ']', type: 'CloseSquareBracket' },
        { value: '+', type: 'AdditiveBinaryOperator' },
        { value: 'obj', type: 'Identifier' },
        { value: '.', type: 'Dot' },
        { value: 'y', type: 'Identifier' },
        { value: '}}', type: 'CloseExpression' }
    ],

    // Object methods
    OBJ_METHODS: [
        { value: '{{', type: 'OpenExpression' },
        { value: 'obj', type: 'Identifier' },
        { value: '.', type: 'Dot' },
        { value: 'x', type: 'Identifier' },
        { value: '(', type: 'OpenParen' },
        { value: 'x', type: 'Identifier' },
        { value: ',', type: 'Comma' },
        { value: 'y', type: 'Identifier' },
        { value: ')', type: 'CloseParen' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'obj', type: 'Identifier' },
        { value: '.', type: 'Dot' },
        { value: 'x', type: 'Identifier' },
        { value: '(', type: 'OpenParen' },
        { value: ')', type: 'CloseParen' },
        { value: '}}', type: 'CloseExpression' },
        { value: '{{', type: 'OpenExpression' },
        { value: 'obj', type: 'Identifier' },
        { value: '.', type: 'Dot' },
        { value: 'x', type: 'Identifier' },
        { value: '[', type: 'OpenSquareBracket' },
        { value: 'x', type: 'Identifier' },
        { value: ']', type: 'CloseSquareBracket' },
        { value: '(', type: 'OpenParen' },
        { value: 'x', type: 'Identifier' },
        { value: ',', type: 'Comma' },
        { value: 'y', type: 'Identifier' },
        { value: ')', type: 'CloseParen' },
        { value: '}}', type: 'CloseExpression' }
    ],
}

const TEST_CONTEXT = {

    // If statements
    IF_ONLY: {},
    IF_ELSE_ONLY: {},
    IF_ELIF_ELSE: {},

    // For loops
    FOR_LOOP: {
        messages: [
            { "role": "user", "content": "A" },
            { "role": "assistant", "content": "B" },
            { "role": "user", "content": "C" },
        ]
    },

    // Set variables
    VARIABLES: {},

    // Binary expressions
    BINOP_EXPR: {},

    // Strings
    STRINGS: {
        bos_token: '<s>',
    },

    // Function calls
    FUNCTIONS: {
        x: 10,
        apple: 'apple',
        func: (...args) => args.length,
    },

    // Object properties
    PROPERTIES: {
        obj: { x: 10, y: 20 }
    },

    // Object methods
    // OBJ_METHODS: {},
}

const EXPECTED_OUTPUTS = {
    // If statements
    IF_ONLY: 'AB',
    IF_ELSE_ONLY: 'BC',
    IF_ELIF_ELSE: 'GHIJ',

    // For loops
    FOR_LOOP: 'ABC',

    // Set variables
    VARIABLES: 'Hello World',

    // Binary expressions
    BINOP_EXPR: '1truefalsefalsetruetruetrue5',

    // Strings
    STRINGS: 'Bye<s>[INST] ',

    // Function calls
    FUNCTIONS: '014',

    // Object properties
    PROPERTIES: '3030',

    // Object methods
    // OBJ_METHODS
}

describe('Templates', () => {
    describe('Lexing', () => {
        it('should tokenize an input string', () => {
            for (const [name, text] of Object.entries(TEST_STRINGS)) {
                const tokens = tokenize(text);

                if (tokens.length !== TEST_PARSED[name].length) {
                    console.log(tokens);
                }
                compare(tokens, TEST_PARSED[name]);
            }
        });

        // TODO add failure cases
    });

    describe('Parsing and intepretation', () => {
        const AST_CACHE = new Map();
        it('should generate an AST', () => {
            // NOTE: In this test case, we just check that no error occurs
            for (const [name, text] of Object.entries(TEST_PARSED)) {
                const ast = parse(text);
                AST_CACHE.set(name, ast);
            }
        });

        it('should interpret an AST', () => {
            for (const [name, ast] of AST_CACHE.entries()) {
                if (TEST_CONTEXT[name] === undefined || EXPECTED_OUTPUTS[name] === undefined) {
                    console.warn(`Skipping test case "${name}" due to missing context or expected output`);
                    continue;
                };

                const env = new Environment();
                // Declare global variables
                env.set('false', false);
                env.set('true', true);

                // Add user-defined variables
                for (const [key, value] of Object.entries(TEST_CONTEXT[name])) {
                    env.set(key, value);
                }

                const interpreter = new Interpreter(env);
                const result = interpreter.run(ast);
                compare(result.value, EXPECTED_OUTPUTS[name]);
            }
        })
    })
});