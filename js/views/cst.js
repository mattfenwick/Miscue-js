define([
    "HTML"
], function (HTML) {
    'use strict';

    function Cst(tag_id) {
        this.elem = HTML.query(tag_id);
        this.$div = this.elem.query("#parseerror");
    }
    
    Cst.prototype.render = function(result) {
        if ( result.stage === 'cst' ) {
            this.elem.each('classList.remove', 'hidden');
            var str = result.value.map(function(e) {
                return ['  ', 
                        e[0], 
                        ' at line ', 
                        e[1][0], 
                        ', column ', 
                        e[1][1]].join('');
            }).join('\n');
            this.$div.textContent = 'Parse error while parsing:\n' + str;
        } else {
            this.elem.each('classList.add', 'hidden');
        }
    };

    return Cst;
});
