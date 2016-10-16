"use strict";

var u = require('unparse-js'),
    C = u.combinators,
    Cst = u.cst;

const pos     = C.position,
    item    = pos.item,
    literal = pos.literal,
    satisfy = pos.satisfy,
    oneOf   = pos.oneOf,
    not1    = pos.not1,
    string  = pos.string,
    node    = Cst.node,
    addErrorState = Cst.addErrorState,
    cut     = Cst.cut;

const many0 = C.many0, optional = C.optional,
    pure  = C.pure , app      = C.app,
    many1 = C.many1, seq      = C.seq,
    alt   = C.alt  , error    = C.error,
    seq2L = C.seq2L, repeat   = C.repeat,
    bind  = C.bind , sepBy0   = C.sepBy0,
    not0  = C.not0;

const whitespace = many0(oneOf(' \t\n\r'));
    
const _digit = oneOf('0123456789');
    
const _digits = many1(_digit);

const _decimal = node('decimal',
    ['dot', literal('.')],
    ['digits', cut('digits', _digits)]);

const _exponent = node('exponent',
    ['letter', oneOf('eE')         ],
    ['sign', optional(oneOf('+-')) ],
    ['power', cut('power', _digits)]);

const _integer = addErrorState('invalid leading 0',
    bind(_digits,
         (ds) => (ds[0] === '0' && ds.length > 1) ? error([]) : pure(ds)));

const _number_1 = node('number',
    ['sign', literal('-')              ],
    ['integer', cut('digits', _integer)],
    ['decimal', optional(_decimal)     ],
    ['exponent', optional(_exponent)   ]);

const _number_2 = node('number',
    ['sign', pure(null)             ], // to match _number_1's schema
    ['integer', _integer            ],
    ['decimal', optional(_decimal)  ],
    ['exponent', optional(_exponent)]);

// there are two number patterns solely to get the error reporting right
//   if there's a `-` but a number can't be parsed, that's an error
const _number = alt([_number_1, _number_2]);


const _control = addErrorState('invalid control character',
    seq([satisfy((c) => c.charCodeAt() < 32),
         error([])]));
    
const _char = node('character',
    ['value', not1(alt([oneOf('\\"'), _control]))]);

const _escape = node('escape',
    ['open', literal('\\')                            ],
    ['value', cut('simple escape', oneOf('"\\/bfnrt'))]);

const _hexC = oneOf('0123456789abcdefABCDEF');

const _unic = node('unicode escape',
    ['open', string('\\u')                                 ],
    ['value', cut('4 hexadecimal digits', repeat(4, _hexC))]);

const _jsonstring = node('string',
    ['open', literal('"')                        ],
    ['value', many0(alt([_char, _unic, _escape]))],
    ['close', cut('double-quote', literal('"'))  ]);

const _keyword = node('keyword',
    ['value', alt([string('true'), string('false'), string('null')])]);


function tok(parser) {
    return seq2L(parser, whitespace);
}

const jsonstring = tok(_jsonstring),
    number     = tok(_number),
    keyword    = tok(_keyword),
    os         = tok(literal('[')),
    cs         = tok(literal(']')),
    oc         = tok(literal('{')),
    cc         = tok(literal('}')),
    comma      = tok(literal(',')),
    colon      = tok(literal(':'));

const obj = error('unimplemented');
const array = error('unimplemented');

const value = alt([jsonstring, number, keyword, obj, array]);

const keyVal = node('key/value pair',
    ['key', jsonstring           ],
    ['colon', cut('colon', colon)],
    ['value', cut('value', value)]);

array.parse = node('array',
    ['open', os                  ],
    ['body', sepBy0(value, comma)],
    ['close', cut('close', cs)   ]).parse;

obj.parse = node('object',
    ['open', oc                   ],
    ['body', sepBy0(keyVal, comma)],
    ['close', cut('close', cc)    ]).parse;

const _json = node('json',
    ['value', value]); // alt([obj, array])),

const json = app((_1, v, _2) => v, 
    whitespace,
    cut('json value', _json),
    cut('unparsed input remaining', not0(item)));

module.exports = {
    'json'   : json,
    'obj'    : obj,
    'array'  : array,
    'keyVal' : keyVal,
    'number' : number,
    'keyword': keyword,
    'value'  : value,
    'jsonstring': jsonstring,
    'oc'     : oc,
    'cc'     : cc,
    'os'     : os,
    'cs'     : cs,
    'comma'  : comma,
    'colon'  : colon
};

