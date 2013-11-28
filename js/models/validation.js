define([
    'parser/full'
], function (Parser) {
    'use strict';

    function V() {
        this.listeners = [];
    }
    
    V.prototype.parse = function(input) {
        try {
            var parsed = Parser.parse(input, [1, 1]);
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
