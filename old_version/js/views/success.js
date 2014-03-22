define([
    "HTML"
], function (HTML) {
    'use strict';

    function Success(tag_id) {
        this.elem = HTML.query(tag_id);
    }
    
    Success.prototype.render = function(result) {
        if ( result.stage === 'done' ) {
            this.elem.each('classList.remove', 'hidden');
        } else {
            this.elem.each('classList.add', 'hidden');
        }
    };

    return Success;
});
