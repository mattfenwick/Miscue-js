define([
    "HTML"
], function (HTML) {
    'use strict';

    function Ast(tag_id) {
        this.elem = HTML.query(tag_id);
        this.$tbody = this.elem.query("tbody");
    }
    
    function position(pos) {
        return 'line: ' + pos[0] + ', column: ' + pos[1];
    }
    
    Ast.prototype.render = function(result) {
        var elem = this.$tbody;
        elem.query('tr').remove();
        if ( result.stage === 'ast' ) {
            this.elem.each('classList.remove', 'hidden');
            result.value.map(function(w) {
                var row = elem.add('tr');
                row.each('classList.add', w.type);
                if ( w.message === 'duplicate key' ) {
                    row.add('td').textContent = w.message;
                    row.add('td').textContent = w.element;
                    row.add('td').textContent = w.text;
                    var list = row.add('td').add('ul');
                    w.position.map(function(p) {
                        list.add('li').textContent = position(p);
                    });
                } else {
                    row.add('td').textContent = w.message;
                    row.add('td').textContent = w.element;
                    row.add('td').textContent = w.text;
                    row.add('td').textContent = position(w.position);
                }
            });
        } else {
            this.elem.each('classList.add', 'hidden');
        }
    };

    return Ast;
});
