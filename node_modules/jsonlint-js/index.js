"use strict";

var P = require('./lib/parser.js'),
    TC = require('./lib/treechecker.js');

function result(status, value) {
    return {'status': status, 'value': value};
}

function validate(input) {
    // 4 possible results:
    //   - cst error
    //   - unexpected error
    //   - ast error
    //   - success
    var parsed = P.json.parse(input, [1, 1]);
    if ( parsed.status !== 'success' ) {
        return result('cst error', parsed.value);
    }
    // shouldn't happen -- just a sanity check
    if ( parsed.value.rest.length !== 0 ) {
        var st = parsed.value.state;
        return result('unexpected error',
                      'unparsed input remaining at line ' + st[0] + ', column ' + st[1]);
    }
    var valids = TC.t_json(parsed.value.result);
    if ( valids.errors.length > 0 ) {
        return result('ast error', valids.errors);
    }
    return result('success');
}


module.exports = {
    'validate': validate
};

