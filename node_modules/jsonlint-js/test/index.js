"use strict";

var V = require('../index'),
    assert = require('assert');

var module = describe,
    test = it,
    deepEqual = assert.deepEqual;


module("validator", function() {

    test("cst error", function() {
        deepEqual(V.validate("["), {'status': 'cst error',
                                    'value': [['json', [1,1]], ['array', [1,1]], ['close', [1,2]]]});
    });
    
    test("unexpected error", function() {
        // not sure how to test this
        deepEqual(true, false);
    });
    
    test("ast error", function() {
        deepEqual(V.validate('{"a": 1, "a": 2}'),
                             {'status': 'ast error',
                              'value': [{'element': 'object',
                                         'message': 'duplicate key',
                                         'text': 'a',
                                         'position': [[1,2], [1,10]]}]});
    });
    
    test("success", function() {
        deepEqual(V.validate('["a", 1, true, {}]'),
                  {'status': 'success', 'value': undefined});
    });
    
});

