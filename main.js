'use strict';


var V = require('./js/models/validation'),
    I = require('./js/views/input'),
    O = require('./js/views/output'),
    jQuery = require('jquery');


var model = new V(),
    output = new O(jQuery("#output"));
    
model.listen(function(d) {output.render(d);});

new I(jQuery("#validate"), jQuery("#input"), model);

module.exports = {
    'model': model
};

