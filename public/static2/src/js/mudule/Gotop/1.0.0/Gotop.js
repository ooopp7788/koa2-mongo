define(function(){
	var Gotop = function(opt){
		var defaultOpt = {
			container: ""
		}
		this.opt = $.extend(defaultOpt, opt);
		this._init();
	}

	$.extend(Gotop.prototype, {
		_init: function(){
			var container = this.opt.container;
			var self = this;
			container.on("click", function(){
				$('html, body').animate({scrollTop: 0}, 200);
			})
			$(window).on("scroll", function(){
				self._debounce();
			})
		},
		_debounce: function(){
			var debounce = _.debounce(function(){
				var t = document.documentElement.scrollTop || document.body.scrollTop;
				if(t>200){
					if(!container.is(":visible")){
						container.show();
					}
				}else {
					container.hide();
				}
			}, 300);
			return debounce;
		}
	});

	return Gotop;

});