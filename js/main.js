'use strict';

require.config({
	paths: {
		jquery: '../bower_components/jquery/jquery',
	}
});

require([
    'jquery',
    'models/validation',
	'views/ast',
	'views/cst',
	'views/success',
	'views/input'
], function ($, V, A, C, S, I) {
    var model = new V(),
        ast = new A($("#ast tbody")),
        cst = new C($("#cst tbody")),
        suc = new S($("#success"));
    
    model.listen(function(d) {ast.render(d);});
    model.listen(function(d) {cst.render(d);});
    model.listen(function(d) {suc.render(d);});
    
    new I($("#validate"), $("#input"), model);
});
