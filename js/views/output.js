// responsibilities
//   1. listen to validator and respond to its events
//     - unexpected error
//     - cst
//     - ast
//     - success
//   2. all content goes in 1 element
//     - when writing to it, blow everything in it away first
//     - then add stuff
//   3. ensure appropriate CSS classes on elements

function render(result) {
    // blow away everything on this.elem
    throw new Error('not sure what schema of "result" is -- need to check');
    if ( result.type === 'unexerr' ) {
        this.elem.textContent = 'Unexpected error -- ' + result.message;
    } else if ( result.type === 'success' ) {
        this.elem.textContent = "it's all good"; // or something -- need to look up in html file
    } else if ( result.type === 'cst' ) {
            var str = result.value.map(function(e) {
                return ['  ',
                        e[0],
                        ' at line ',
                        e[1][0],
                        ', column ',
                        e[1][1]].join('');
            }).join('\n');
            this.$div.textContent = 'Parse error trace:\n' + str;    
    } else if ( result.type === 'ast' ) {
        function position(pos) {
            return 'line: ' + pos[0] + ', column: ' + pos[1];
        }
        
        Ast.prototype.render = function(result) {
            var elem = this.$tbody; // guess I need to add a tbody too
            elem.query('tr').remove();
            if ( result.stage === 'ast' ) {
                this.elem.each('classList.remove', 'hidden');
                result.value.map(function(w) {
                    var row = elem.add('tr');
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
                    /*
                    if ( w.message === 'duplicate key' ) {
                        items = w.position.map(function(p) { return li({}, position(p));});
                        pos = ul.apply(null, [{}].concat(items));
                    } else {
                        pos = td({}, position(w.position));
                    }
                    tr({}, td(w.message), td(w.element), td(w.text), pos);
                    */
                });    
    } else { throw new Error('unrecognized type'); }
}

