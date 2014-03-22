'use strict';

var G = require('genhtml-js'),
    H = G.html,
    S = H.serialize;

var td = H.td, tr = H.tr, table = H.table,
    div = H.div, elem = H.elem;


function Output(elem) {
    // let's assume the elem is $("#output") -- a div
    this.elem = elem;
}

function cst(result) {
    var errs = result.value.map(function(e) {
        return ['  ', e[0],
                ' at line ', e[1][0],
                ', column ', e[1][1]].join('');
    });
    return div({'class': 'error'},
               pre({}, 'Parse error trace:\n' + str.join('\n')));
}

function position(pos) {
    return 'line: ' + pos[0] + ', column: ' + pos[1];
}

function ast(result) {
    result.value.map(function(w) {
        var items, pos;
        if ( w.message === 'duplicate key' ) {
            items = w.position.map(function(p) { return li({}, position(p));});
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
    return div({'class': 'error'}, table({}, tbody));
}

var ACTIONS = {
    'unexerr': function(result) {
        return div({'class': 'error'}, 'Unexpected error -- ' + result.message);
    },
    'success': function(result) {
        return div({'class': 'success'}, "Success -- no errors or warnings to report!");
    },
    'cst': cst,
    'ast': ast
};

Output.prototype.render = function(result) {
    // blow away everything on this.elem
    throw new Error('not sure what schema of "result" is -- need to check');
    this.elem.clear();
    if ( ACTIONS.hasOwnProperty(result.type) ) {
        this.elem.append(serialize.serialize(ACTIONS[result.type](result)));
    } else {
        throw new Error('unrecognized type');
    }
};

module.exports = Output;

