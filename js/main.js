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
    var model = new V();
    
    V.listen(new A($("#ast")));
    V.listen(new C($("#cst")));
    V.listen(new S($("#success")));
    
    new I($("#input"), model);
});
