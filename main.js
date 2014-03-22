'use strict';


var m = require('./js/models/validation'),
    I = require('./js/views/input'),
    O = require('./js/views/output'),
    V = m,
    $ = require('jquery');
// what about jquery?

var model = new V(),
    output = new O($("#output"));
    
model.listen(function(d) {output.render(d);});

new I($("#validate"), $("#input"), model);

window.m = m;
window.I = I;

module.exports = {
    'model': model
};

