define(function(){
	var Slider = function(opt){
		var defaultOpt = {
			container: ""
		}
		this.defaultOpt = $.extend(defaultOpt, opt);
		this.$sliderBox = this.defaultOpt.container;
		this.$sliderItem = this.$sliderBox.find('.slider-item');
		this.$sliderCon =  this.$sliderBox.find('.slider-con');
		this.sliderLength = this.$sliderItem.length;
		this._init();
	}

	$.extend(Slider.prototype, {
		_init: function(){
			var self = this;
			if (this.sliderLength > 1) {
				var countHtml = '';
				for (var i = 0; i < this.sliderLength; i++) {
					countHtml += '<span>' + (i + 1) + '</span>';
				}
				this.$sliderBox.append('<div class="slider-count">' + countHtml + '</div>');
				var sliderIndex = 0;

				var sliderFun = function (sliderItem, sliderLength, index) {
					var itemWidth = sliderItem.width();
                    var img = self.$sliderCon.find("img").eq(index);
					self.$sliderCon.width(itemWidth * sliderLength);
                    img.attr("src", img.data("src"));
					self.$sliderCon.animate({
						left: -itemWidth * index
					}, 300);
					self.$sliderBox.find('.slider-count span').eq(index).addClass('active').siblings('span').removeClass('active');
				};

				var sliderInterval;
				var sliderAutoPlay = function () {
					sliderInterval = setInterval(function () {
						sliderFun(self.$sliderItem, self.sliderLength, sliderIndex);
						if (sliderIndex >= self.sliderLength - 1) {
							sliderIndex = 0;
						} else {
							sliderIndex++;
						}
					}, 3000);
				};
				sliderFun(self.$sliderItem, self.sliderLength,0);
				sliderAutoPlay();

				this.$sliderBox.hover(function () {
					clearInterval(sliderInterval);
				}, function () {
					if (sliderIndex >= self.sliderLength - 1) {
						sliderIndex = 0;
					} else {
						sliderIndex++;
					}
					sliderAutoPlay();
				});

				this.$sliderBox.on('click', '.slider-count span', function () {
					sliderIndex = $(this).index();
					sliderFun(self.$sliderItem, self.sliderLength, sliderIndex)
				});
			}
		}

	});

	return Slider;

});