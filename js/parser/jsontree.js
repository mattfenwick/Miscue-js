// tasks:
//    integer portion of number: no leading 0's (except for the number 0)
//    no number overflow/underflow
//    no duplicate keys in maps
//    number literals to numbers
//    no illegal control characters in strings
//    escape sequences from strings are valid
//    unicode escape sequences to chars
//    characters to chars
//    escapes to chars
//    join up string literal

define(["app/maybeerror", "app/json", "app/combinators"], function(M, J, C) {
    // uh, not sure if the json import is actually necessary.
    // just used for a convenience function that could really go elsewhere

    var _escapes = {'"': '"',  '\\': '\\', 
                    '/': '/',  'b': '\b' ,
                    'f': '\f', 'n': '\n' ,
                    'r': '\r', 't': '\t'  };
    
    function concat(first, second) {
        second.map(function(e) {
            first.push(e);
        });
    }
    
    function t_char(node) {
        var val = node.value;
        if ( node._name === 'unicode escape' ) {
            return [[], String.fromCharCode(parseInt(val.join(''), 16))];
        } else if ( node._name === 'escape' ) {
            if ( !(val in _escapes) ) {
                return [[['invalid escape sequence', node._state]], undefined];
            }
            return [[], _escapes[val]]; // else -- no problem
        } else if ( node._name === 'character' ) {
            // how do get the ord of the character?
            if ( String.charCodeAt(val) < 32 ) {
                return [[['invalid control character', node._state]], undefined];
            }
            return [[], val];  // else -- we're good
        }
        throw new Error('invalid character node type -- ' + str(node._name));
    }
    
    function t_string(node) {
        // check that node _name is string (optional)
        // pull out the value (?), fix up all the characters, join them into a string
        // watch out for errors, reporting position if necessary
        var errors = [],
            chars = [];
        node.value.map(function(t) {
            var c = t_char(t);
            concat(errors, c[0]);
            chars.push(c[1]);
        });
        console.log('in string: ' + JSON.stringify([errors, chars]));
        // a little hack -- if there's any errors, don't report a real value
        if ( errors.length > 0 ) {
            return [errors, undefined];
        } else {
            return [errors, chars.join('')]; // what about reporting the string's position?
        }
    }
    
    function t_number(node) {
        // check that node _name is number (optional)
        var errors = [],
            sign = node.sign ? node.sign : '+',
            i = node.integer.join('');
        // check that there's no leading 0's
        if ( (i[0] === '0') && (i.length > 1) ) {
            errors.push(['number: invalid leading 0', node._state]);
        }
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
        console.log('in: ' + val + ' ,  out: ' + num);
        // check for overflow
        if ( num === Infinity || num === -Infinity ) {
            errors.push(['number: floating-point overflow', node._state]);
        }
        // obviously this underflow check is not correct:
        // 1. false positives like '0'
        // 2. ??? false negatives ??? other IEEE 0's or NaN's or something ???
        if ( num === 0 ) {
            errors.push(['number: possible floating-point underflow', node._state]);
        }
        console.log('num out: ' + JSON.stringify([errors, num]));
        return [errors, num];
    }
    
    var _keywords = {
            'true' : true,
            'false': false,
            'null' : null
        };
    
    // invalid keywords aren't parsed, so this is really kind of a 
    //   sanity check more than something that's expected to happen
    function t_keyword(node) {
        if ( node.value in _keywords ) {
            return [[], _keywords[node.value]];
        }
        return [[['invalid keyword', node._state]], undefined];
    }
    
    function t_array(node) {
        var errors = [],
            vals = [];
        node.body.values.map(function(v) {
            var e = t_value(v);
            concat(errors, e[0]);
            vals.push(e[1]); // may contain undefineds ... right?  is that a problem?
        });
        return [errors, vals]; // what about the array position ?
    }
    
    function t_pair(node) {
        var errors = [],
            s = t_string(node.key),
            v = t_value(node.value);
        concat(errors, s[0]);
        concat(errors, v[0]);
        var kv_pair = [s[1], v[1]];
        return [errors, kv_pair]; // what about the key/val position?
    }
    
    function t_build_object(pairs) {
        var errors = [],
            obj = {},
            seen_keys = {};
        pairs.map(function(pair) {
            var p = t_pair(pair);
            concat(errors, p[0]);
            var key = p[1][0];
            if ( typeof key === 'string' ) { // `key` would be falsy if there were an error in it ... right?
                if ( key in seen_keys ) {
                    errors.push(['duplicate key', seen_keys[key], pair.key._state]);
                } else {
                    seen_keys[key] = pair.key._state;
                    obj[key] = p[1][1];
                }
            }
        });
        return [errors, obj];
    }

    function t_object(node) {
        return t_build_object(node.body.values); // what about the object position?
    }
    
    var _values = {
            'keyword': t_keyword,
            'number' : t_number ,
            'string' : t_string ,
            'array'  : t_array  ,
            'object' : t_object
        };
    
    function t_value(node) {
        return _values[node._name](node);
    }
    
    function t_json(node) {
        return t_value(node.value);
    }
    
    
    return {
        't_json': t_json
    };
    
});
