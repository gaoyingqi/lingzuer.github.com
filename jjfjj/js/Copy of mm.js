var MM = {};
(function (mm) {
	var pub = {};
	pub.init = function() {
		pub.sss();
	};
	
	pub.getProduct = F;
	
	mm.core = pub;
})(MM)


(function (mm) {
	var pub = {};
	pub.init = function() {
		pub.core.getProduct();
	};
	
	pub.sss = F;
	
	mm.index = pub;
})(MM)


MM.index.init();







