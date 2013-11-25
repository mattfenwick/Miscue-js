define(function () {
    'use strict';

    function Input(button, elem, model) {
        button.click(function() {
            model.parse(elem.val());
        });
    }

    return Input;
});
