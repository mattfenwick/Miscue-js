define(function () {
    'use strict';

    function Cst(elem) {
        this.elem = elem;
        this.$tbody = elem.find("tbody");
    }
    
    Cst.prototype.render = function(result) {
        var self = this;
        this.elem.toggleClass('hidden', result.stage !== 'cst');
        this.$tbody.empty();
        if ( result.stage === 'cst' ) {
            result.value.map(function(e) {
                // needs escaping
                self.$tbody.append('<tr><td>' + e[0] + '</td><td>' + e[1][0] +
                                   '</td><td>' + e[1][1] + '</td></tr>');
            });
        }
    };

    return Cst;
});
