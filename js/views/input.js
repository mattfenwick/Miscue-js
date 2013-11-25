define(function () {
    'use strict';

    function Input(elem, model) {
        elem.click(function() {
            model.parse(elem.val());
        });
    }

    return Input;
});
