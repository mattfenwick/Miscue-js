'use strict';

require.config({
	paths: {
		'jquery': '../bower_components/jquery/jquery',
		'HTML': '../bower_components/HTML/HTML'
	}
});

require([
    'jquery',
    'models/validation',
	'views/ast',
	'views/cst',
	'views/success',
	'views/input',
	'views/unexerr'
], function ($, V, A, C, S, I, E) {
    var model = new V(),
        ast = new A("#ast"),
        cst = new C("#cst"),
        suc = new S("#success"),
        err = new E("#unexerr");
    
    model.listen(function(d) {ast.render(d);});
    model.listen(function(d) {cst.render(d);});
    model.listen(function(d) {suc.render(d);});
    model.listen(function(d) {err.render(d);});
    
    new I($("#validate"), $("#input"), model);
});
