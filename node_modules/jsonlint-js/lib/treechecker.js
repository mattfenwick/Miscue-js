// tasks:
//    no number overflow/underflow
//    no duplicate keys in maps
//    number literals to numbers
//    unicode escape sequences to chars
//    characters to chars
//    escapes to chars
//    join up string literal
//    object/array at top level
// implementation:
//   similar to the logging monad

"use strict";

const _escapes = new Map([
        ['"' , '"' ],
        ['\\', '\\'],
        ['/' , '/' ],  
        ['b' , '\b'],
        ['f' , '\f'], 
        ['n' , '\n'],
        ['r' , '\r'],
        ['t' , '\t']
    ]);

function concat(first, second) {
    second.forEach((e) => first.push(e));
}

function make_error(element, message, text, position) {
    return {
        'element' : element ,
        'message' : message ,
        'text'    : text    ,
        'position': position
    };
}

function ret_err(errors, value) {
    return {
        'errors': errors,
        'value': value
    };
}

function unicode(val) {
    return String.fromCharCode(parseInt(val.join(''), 16));
}

function escape(val) {
    if ( !_escapes.has(val)) {
        throw new Error('invalid character escape -- ' + val);
    }
    return _escapes.get(val);
}

var _chars = new Map([
    ['escape', escape],
    ['unicode escape', unicode],
    ['character', (c) => c]
]);

function t_char(node) {
    return _chars.get(node._name)(node.value);
}

function t_string(node) {
    return ret_err([], node.value.map(t_char).join(''));
}

function format_number(sign, i, d, exp) {
    return [sign, i, d ? ( '.' + d ) : '', exp].join('');
}

function t_number(node) {
    // check that node _name is number (optional)
    var errors = [],
        sign = node.sign ? node.sign : '',
        i = node.integer.join(''),
        pos = node._start;
    var d = node.decimal ? node.decimal.digits.join('') : '',
        exp = '';
    if ( node.exponent ) {
        exp += node.exponent.letter;
        if ( node.exponent.sign ) {
            exp += node.exponent.sign;
        }
        exp += node.exponent.power.join('');
    }
    var val = [sign, i, '.', d, exp].join(''),
        // convert to a float
        num = parseFloat(val);
    // check for overflow
    if ( num === Infinity || num === -Infinity ) {
        errors.push(make_error('number',
                               'overflow',
                               format_number(sign, i, d, exp),
                               pos));
    }
    // underflow check may be incorrect:
    // ??? false negatives ??? other IEEE 0's or NaN's or something ???
    if ( num === 0 && node.exponent ) {
        errors.push(make_error('number',
                               'possible underflow',
                               format_number(sign, i, d, exp),
                               pos));
    }
    return ret_err(errors, num);
}

const _keywords = new Map([
        ['true' , true ],
        ['false', false],
        ['null' , null ]
    ]);

function t_keyword(node) {
    if ( _keywords.has(node.value) ) {
        return ret_err([], _keywords.get(node.value));
    }
    throw new Error('invalid keyword -- ' + node.value);
}

function extractValues(body) {
    return (body !== null) ? [body[0]].concat(body[1].map(([_, v]) => v)) : [];
}

function t_array(node) {
    var errors = [],
        vals = [];
    const values = extractValues(node.body);
    values.forEach(function(v) {
        var e = t_value(v);
        concat(errors, e.errors);
        vals.push(e.value);
    });
    return ret_err(errors, vals); // array position not important
}

function t_pair(node) {
    var errors = [],
        s = t_string(node.key), // what if ... node.key is not a string CST?
        v = t_value(node.value);
    concat(errors, s.errors);
    concat(errors, v.errors);
    var kv_pair = [s.value, v.value];
    return ret_err(errors, kv_pair); // key/val position unimportant
}

function t_build_object(pairs) {
    var errors = [],
        obj = {},
        positions = new Map(),
        seenTwice = new Set();
    pairs.forEach(function(pair) {
        var p = t_pair(pair),
            key = p.value[0];
        concat(errors, p.errors);
        if ( positions.has(key) ) {
            seenTwice.add(key);
        } else {
            positions.set(key, []);
            obj[key] = p.value[1];
        }
        positions.get(key).push(pair.key._start);
    });
    seenTwice.forEach(function (key) {
        errors.push(make_error('object', 'duplicate key', key, positions.get(key)));
    });
    return ret_err(errors, obj);
}

function t_object(node) {
    const values = extractValues(node.body);
    return t_build_object(values); // what about the object position?
}

const NODE_ACTIONS = new Map([
        ['keyword', t_keyword],
        ['number' , t_number ],
        ['string' , t_string ],
        ['array'  , t_array  ],
        ['object' , t_object ]
    ]);

function t_value(node) {
    return NODE_ACTIONS.get(node._name)(node);
}

const TOP_LEVEL = new Set(['array', 'object']);
const TOP_LEVEL_WARNING = 'top-level element should be object or array';

function t_json(node) {
    var val = t_value(node.value);
    if ( !TOP_LEVEL.has(node.value._name) ) {
        val.errors.push(make_error(node._name, TOP_LEVEL_WARNING, '', node._start));
    }
    return val;
}


module.exports = {
    't_json'    : t_json,
    't_value'   : t_value,
    'make_error': make_error,
    'ret_err'   : ret_err,
    't_char'    : t_char
};

