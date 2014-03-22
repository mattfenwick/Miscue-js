"use strict";

var u = require('unparse-js'),
    C = u.combinators,
    Cst = u.cst;

var pos     = C.position,
    item    = pos.item,
    literal = pos.literal,
    satisfy = pos.satisfy,
    oneOf   = pos.oneOf,
    not1    = pos.not1,
    string  = pos.string,
    node    = Cst.node,
    cut     = Cst.cut,
    sepBy0  = Cst.sepBy0,
    addError = Cst.addError;
    
var many0 = C.many0, optional = C.optional,
    pure  = C.pure , seq2R = C.seq2R,
    many1 = C.many1, seq   = C.seq,  alt   = C.alt,
    seq2L = C.seq2L, not0  = C.not0, error = C.error,
    bind  = C.bind;

function quantity(p, num) {
    var parsers = [];
    for(var i = 0; i < num; i++) {
        parsers.push(p);
    }
    return seq.apply(undefined, parsers);
}

var whitespace = many0(oneOf(' \t\n\r')),
    
    _digit = oneOf('0123456789'),
    
    _digits = many1(_digit),

    _decimal = node('decimal',
                    ['dot', literal('.')],
                    ['digits', cut('digits', _digits)]),
                    
    _exponent = node('exponent',
                     ['letter', oneOf('eE')         ],
                     ['sign', optional(oneOf('+-')) ],
                     ['power', cut('power', _digits)]),
    
    _integer = addError('invalid leading 0',
                        bind(_digits,
                             function(ds) {
                                 if ( ds[0] === '0' && ds.length > 1 ) {
                                     return error([]);
                                 }
                                 return pure(ds);
                             })),

    _number_1 = node('number',
                     ['sign', literal('-')              ],
                     ['integer', cut('digits', _integer)],
                     ['decimal', optional(_decimal)     ],
                     ['exponent', optional(_exponent)   ]),

    _number_2 = node('number',
                     ['sign', pure(null)             ], // to match _number_1's schema
                     ['integer', _integer            ],
                     ['decimal', optional(_decimal)  ],
                     ['exponent', optional(_exponent)]),

    // there are two number patterns solely to get the error reporting right
    //   if there's a `-` but a number can't be parsed, that's an error
    _number = alt(_number_1, _number_2);


var _control = addError('invalid control character',
                   seq(satisfy(function(c) {return c.charCodeAt() < 32;}), error([]))),
    
    _char = node('character',
                 ['value', not1(alt(oneOf('\\"'), _control))]),

    _escape = node('escape',
                   ['open', literal('\\')                            ],
                   ['value', cut('simple escape', oneOf('"\\/bfnrt'))]),

    _hexC = oneOf('0123456789abcdefABCDEF'),

    _unic = node('unicode escape',
                 ['open', string('\\u')                                   ],
                 ['value', cut('4 hexadecimal digits', quantity(_hexC, 4))]),

    _jsonstring = node('string',
                       ['open', literal('"')                      ],
                       ['value', many0(alt(_char, _unic, _escape))],
                       ['close', cut('double-quote', literal('"'))]),

    _keyword = node('keyword',
                    ['value', alt(string('true'), string('false'), string('null'))]);


function tok(parser) {
    return seq2L(parser, whitespace);
}

var jsonstring = tok(_jsonstring),
    number     = tok(_number),
    keyword    = tok(_keyword),
    os         = tok(literal('[')),
    cs         = tok(literal(']')),
    oc         = tok(literal('{')),
    cc         = tok(literal('}')),
    comma      = tok(literal(',')),
    colon      = tok(literal(':'));

var obj = error('unimplemented'),
    array = error('unimplemented');

var value = alt(jsonstring, number, keyword, obj, array),

    keyVal = node('key/value pair',
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

var _json = node('json',
                 ['value', value]), // alt(obj, array)),

    json = seq2L(seq2R(whitespace, cut('json value', _json)),
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

