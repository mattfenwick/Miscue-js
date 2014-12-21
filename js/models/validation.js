'use strict';

var Val = require('jsonlint-js');


function V() {
    this.listeners = [];
}

V.prototype.parse = function(input) {
    var parsed = Val.validate(input);
    this.notify(parsed);
};

V.prototype.listen = function(listener) {
    this.listeners.push(listener);
};

V.prototype.notify = function(data) {
    this.listeners.map(function(l) {
        l(data);
    });
};

module.exports = V;

