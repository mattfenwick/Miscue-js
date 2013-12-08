"use strict";

require.config({
    paths: {
        'unparse-js': '../bower_components/unparse-js/'
    }
});

require([
    "test/json",
    "test/jsontree"
], function() {
    var mods = Array.prototype.slice.call(arguments);
    mods.map(function(mod, ix) {
        mod();
    });
});
