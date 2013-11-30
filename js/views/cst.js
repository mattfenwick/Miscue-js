define([
    "HTML"
], function (HTML) {
    'use strict';

    function Cst(tag_id) {
        this.elem = HTML.query(tag_id);
        this.$tbody = this.elem.query("tbody");
    }
    
    Cst.prototype.render = function(result) {
        var elem = this.$tbody;
        elem.query('tr').remove();
        if ( result.stage === 'cst' ) {
            this.elem.each('classList.remove', 'hidden');
            result.value.map(function(e) {
                // does HTML do the escaping?
                var row = elem.add('tr');
                row.add('td').textContent = e[0];
                row.add('td').textContent = e[1][0];
                row.add('td').textContent = e[1][1];
            });
        } else {
            this.elem.each('classList.add', 'hidden');
        }
    };

    return Cst;
});
