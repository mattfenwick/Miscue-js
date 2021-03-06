'use strict';

var G = require('genhtml-js'),
    H = G.html,
    S = G.serialize;

var td = H.td, tr = H.tr, table = H.table,
    div = H.div, elem = H.elem, th = H.th;


function Output(elem) {
    // let's assume the elem is $("#output") -- a div
    this.elem = elem;
}

function cst(value) {
    var errs = value.map(function(e) {
        return ['  ', e[0],
                ' at line ', e[1][0],
                ', column ', e[1][1]].join('');
    });
    return div({'class': 'error'},
               elem('pre', {}, ['Parse error trace:\n' + errs.join('\n')]));
}

function position(pos) {
    return 'line: ' + pos[0] + ', column: ' + pos[1];
}

var HEADER = elem('thead',
                  {},
                  [tr({}, th({}, 'problem'), // can't remember interface for `elem` -- is third arg an array?
                          th({}, 'element'),
                          th({}, 'offending text'),
                          th({}, 'position(s)'))]);

function ast(value) {
    var rows = value.map(function(w) {
        var items, pos;
        if ( w.message === 'duplicate key' ) {
            items = w.position.map(function(p) { return elem('li', {}, [position(p)]);});
            pos = elem('ul', {}, items);
        } else {
            pos = position(w.position);
        }
        return tr({},
                  td({}, w.message),
                  td({}, w.element),
                  td({}, w.text),
                  td({}, pos));
    });
    var tbody = elem('tbody', {}, rows);
    return div({'class': 'error'}, table({'class': 'errtable'}, HEADER, tbody));
}

var ACTIONS = {
    'unexpected error': function(value) {
        return div({'class': 'error'}, 'Unexpected error -- ' + value);
    },
    'success': function(_value_) {
        return div({'class': 'success'}, "Success -- no errors or warnings to report!");
    },
    'cst error': cst,
    'ast error': ast
};

Output.prototype.render = function(result) {
    // blow away everything on this.elem
    this.elem.empty();
    if ( ACTIONS.hasOwnProperty(result.status) ) {
        this.elem.append(S.serialize(ACTIONS[result.status](result.value)));
    } else {
        throw new Error('unrecognized status -- ' + result.status);
    }
};

module.exports = Output;

