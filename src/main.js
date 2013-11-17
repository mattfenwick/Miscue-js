var imports = [
    "app/maybeerror",
    "app/combinators",
    "app/cst",
    "app/json",
    "app/jsontree"
];

require(imports, function(me, pc, cst, json, jt) {
    // just for ease of debugging
    window.MaybeError = me;
    window.Combinators = pc;
    window.Cst = cst;
    window.json = json;
    window.jt = jt;
    
    $(document).ready(function() {

        var input    = $("#input"),
            parsing  = $("#parsing"),
            ast      = $("#ast"),
            validate = $("#validate");
        
        validate.click(function() {
            var parsed = pc.run(json.json, input.val(), [1,1]);
            
            parsing.empty();
            ast.empty();
            
            if ( parsed.status === 'success' ) {
                // did it parse *all* of the input?
                var valids = jt.t_json(parsed.value.result);
                alert(JSON.stringify(valids));
                if ( valids[0].length === 0 ) {
                    ast.append('<li class="good">Success!</li>');
                } else {
                    valids[0].map(function(e) {
                        ast.append('<li class="bad">' + e[0] + ' at line ' + 
                            e[1][0] + ', column ' + e[1][1] + '</li');
                    });
                }
            } else {
                parsed.value.map(function(e) {
                    parsing.append('<li class="bad">' + e[0] + ' at line ' + 
                        e[1][0] + ', column ' + e[1][1] + '</li>');
                });
            }
        });
        
    });

});
