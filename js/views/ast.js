define(function () {
    'use strict';

    function Ast(elem) {
        this.elem = elem;
        this.$tbody = elem.find("tbody");
    }
    
    Ast.prototype.render = function(result) {
        var self = this;
        this.elem.toggleClass('hidden', result.stage !== 'ast');
        this.$tbody.empty();
        if ( result.stage === 'ast' ) {
            result.value.map(function(w) {
                // needs escaping
                if ( w.message === 'duplicate key' ) {
                    var pos = w.position.map(function(p) {return '<li>line: ' + p[0] + ', column: ' + p[1] + '</li>';}),
                        list = '<ul>' + pos.join('') + '</ul>';
                    self.$tbody.append('<tr><td>'  + w.message + 
                                       '</td><td>' + w.element +
                                       '</td><td>' + w.text    +
                                       '</td><td>' + list      +
                                       '</td></tr>');
                } else {
                    var p = w.position;
                    self.$tbody.append('<tr><td>'  + w.message  +
                                       '</td><td>' + w.element  + 
                                       '</td><td>' + w.text     +
                                       '</td><td>' + 'line: ' + p[0] + ', column: ' + p[1] +
                                       '</td></tr>');
                }
            });
        }
    };

    Ast.prototype.render2 = function(result) {
        var self = this;
        this.elem.toggleClass('hidden', result.stage !== 'ast');
        this.$tbody.empty();
        if ( result.stage === 'ast' ) {
            result.value.map(function(w) {
                // needs escaping
                if ( w.message === 'duplicate key' ) {
                    self.$tbody.append('<tr><td>' + w.message + ' ' + w.key + '</td><td>' +
                                       JSON.stringify(w.positions));
                } else {
                    self.$tbody.append('<tr><td>' + w[0] + '</td><td>' + w[1][0] + 
                                       '</td><td>' + w[1][1] + '</td></tr>');
                }
            });
        }
    };

    return Ast;
});
