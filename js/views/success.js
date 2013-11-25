define(function () {
    'use strict';

    function Success(elem) {
        this.elem = elem;
    }
    
    Success.prototype.render = function(result) {
        this.elem.toggleClass('hidden', result.stage !== 'done');
    };

    return Success;
});
