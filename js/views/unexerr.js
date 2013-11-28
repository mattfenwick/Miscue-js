define(function () {
    'use strict';

    function UnexErrr(elem) {
        this.elem = elem;
    }
    
    UnexErrr.prototype.render = function(result) {
        var self = this;
        this.elem.toggleClass('hidden', result.stage !== 'unexerr');
        if ( result.stage === 'unexerr' ) {
            this.elem.text('Unexpected error -- ' + result.message);
        }
    };

    return UnexErrr;
});
