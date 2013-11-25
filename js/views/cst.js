define(function () {
    'use strict';

    function Cst(elem) {
        this.elem = elem;
    }
    
    Cst.prototype.render = function(result) {
        var self = this,
            estack;
        this.elem.empty();
        if ( result.stage === 'cst' ) {
            estack = result.value;
            estack.map(function(e) {
                // needs escaping
                self.elem.append('<tr><td>' + e[0] + '</td><td>' + e[1][0] +
                                 '</td><td>' + e[1][1] + '</td></tr>');
            });
        }
    };

    return Cst;
});
