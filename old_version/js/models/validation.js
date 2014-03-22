define([
    'parser/json',
    'parser/jsontree'
], function (J, JT) {
    'use strict';

    function V() {
        this.listeners = [];
    }
    
    V.prototype.parse_helper = function(input) {
        var parsed = J.json.parse(input, [1, 1]);
        if ( parsed.status !== 'success' ) {
            return {
                'stage': 'cst',
                'value': parsed.value
            };
        }
        if ( parsed.value.rest.length !== 0 ) { // shouldn't happen
            var st = parsed.value.state;
            throw new Error('unparsed input remaining at line ' + st[0] + ', column ' + st[1]);
        }
        var valids = JT.t_json(parsed.value.result);
        if ( valids.errors.length > 0 ) {
            return {
                'stage': 'ast',
                'value': valids.errors
            };
        }
        return {'stage': 'done', 'value': 'success'};
    };
    
    V.prototype.parse = function(input) {
        try {
            var parsed = this.parse_helper(input);
            this.notify(parsed);
        } catch (e) {
            this.notify({'stage': 'unexerr', 'message': e.message});
        }
    };
    
    V.prototype.listen = function(listener) {
        this.listeners.push(listener);
    };
    
    V.prototype.notify = function(data) {
        this.listeners.map(function(l) {
            l(data);
        });
    };

    return V;
});
