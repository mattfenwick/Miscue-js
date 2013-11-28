define([
    'parser/json',
    'parser/jsontree'
], function(J, JT) {
    
    function parse(input) {
        var parsed = J.json.parse(input, [1, 1]);
        if ( parsed.status !== 'success' ) {
            return {
                'stage': 'cst',
                'value': parsed.value
            };
        }
        if ( parsed.value.rest.length !== 0 ) { // shouldn't happen
            throw new Error('unparsed input remaining at line ' + st[0] + ', column ' + st[1]);
        }
        var valids = JT.t_json(parsed.value.result);
        if ( valids[0].length > 0 ) {
            return {
                'stage': 'ast',
                'value': valids[0]
            };
        }
        return {'stage': 'done', 'value': 'success'};
    }
    
    return {'parse': parse};

});
