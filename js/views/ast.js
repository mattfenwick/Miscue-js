define(function () {
    'use strict';

    function Ast(elem) {
        this.elem = elem;
    }
    
    Ast.prototype.render = function(result) {
        var self = this,
            warnings;
        this.elem.clear();
        if ( result.stage === 'ast' ) {
            warnings = result.value;
            warnings.map(function(w) {
                // needs escaping
                self.elem.append('<tr><td>' + w[0] + '</td><td>' + w[1][0] + 
                                 '</td><td>' + w[1][1] + '</td></tr>');
            });
        }
    });
        

    return Ast;
});
