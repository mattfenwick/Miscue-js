define(function () {
    'use strict';

    function Ast(elem) {
        this.elem = elem;
        this.$tbody = elem.find("tbody");
    }
    
    Ast.prototype.render = function(result) {
        var self = this;
        this.elem.toggleClass('hidden', result.stage !== 'ast');
        this.$tbody.empty();
        if ( result.stage === 'ast' ) {
            result.value.map(function(w) {
                // needs escaping
                self.$tbody.append('<tr><td>' + w[0] + '</td><td>' + w[1][0] + 
                                   '</td><td>' + w[1][1] + '</td></tr>');
            });
        }
    };

    return Ast;
});
