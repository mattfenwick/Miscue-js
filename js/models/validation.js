define([
    'parser/full'
], function (Parser) {
    'use strict';

    function V() {
        this.listeners = [];
    }
    
    V.prototype.parse = function(input) {
        var parsed = Parser.parse(input, [1, 1]);
        console.log(JSON.stringify(parsed));
        this.notify(parsed);
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
