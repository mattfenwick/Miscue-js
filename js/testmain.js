"use strict";

require([
    "test/json",
    "test/jsontree"
], function() {
    var mods = Array.prototype.slice.call(arguments);
    mods.map(function(mod, ix) {
        mod();
    });
});
