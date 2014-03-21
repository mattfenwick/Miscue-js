'use strict';

function Input(button, elem, model) {
    button.click(function() {
        model.parse(elem.val());
        elem.removeClass('changed');
    });
    
    elem.on('input', function() {
        elem.addClass('changed');
    });
}

module.exports = Input;

