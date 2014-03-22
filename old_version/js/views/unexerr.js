define([
    "HTML"
], function (HTML) {
    'use strict';

    function UnexErrr(tag_id) {
        this.elem = HTML.query(tag_id);
    }
    
    UnexErrr.prototype.render = function(result) {
        if ( result.stage === 'unexerr' ) {
            this.elem.each('classList.remove', 'hidden');
            this.elem.textContent = 'Unexpected error -- ' + result.message;
        } else {
            this.elem.each('classList.add', 'hidden');
        }
    };

    return UnexErrr;
});
