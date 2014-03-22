"use strict";

var M = require('unparse-js').maybeerror,
    P = require('./parser.js'),
    TC = require('./treechecker.js');


function validate(input) {
    var parsed = P.json.parse(input, [1, 1]);
    if ( parsed.status !== 'success' ) {
        return M.error({'stage': 'cst', 'value': parsed.value});
    }
    // shouldn't happen -- just a sanity check
    if ( parsed.value.rest.length !== 0 ) {
        var st = parsed.value.state;
        return M.error({
            'stage': 'unexerr', 
            'value': 'unparsed input remaining at line ' + st[0] + ', column ' + st[1]
        });
    }
    var valids = TC.t_json(parsed.value.result);
    if ( valids.errors.length > 0 ) {
        return M.error({'stage': 'ast', 'value': valids.errors});
    }
    return M.pure(null);
};


module.exports = {
    'validate': validate
};

