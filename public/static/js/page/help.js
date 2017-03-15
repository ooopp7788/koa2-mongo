/**
 * Created by user on 2016/8/4.
 */
$(function () {
	window.onload = function () {
		var $domWin = $(window);
		var $heaT = $('.heaTop');
		var windowW = $domWin.width();
		$heaT.css({'width': windowW});
		$(window).resize(function () {
			var $domWin = $(window);
			var $heaT = $('.heaTop');
			var windowW = $domWin.width();
			$heaT.css({'width': windowW});
		})
	};

	var $box = $('.help-right .box');
	var $helpL = $('.help-left');

	$helpL.delegate('.child div', 'click', function () {
		$helpL.find('.parent').eq(0).removeClass('active');
		$('.child div').removeClass('active');
		$(this).addClass('active');
		var index = $(this).parents('.parent').index('.parent');
		$box.addClass('hidden').eq(index).removeClass('hidden')
			.find('.querA').addClass('hidden').eq($(this).index()).removeClass('hidden');

		return false;
	});

	$helpL.delegate('.parent', 'click', function () {
		var $this = $(this);
		if (!$this.hasClass('one')) {
			$('.one').removeClass('active');
			$this.css({'padding':'12px 0 0 26px'});
			var $child = $this.find('.child');
			if ($child.hasClass('hidden')) {
				$child.removeClass('hidden');
				$this.find('.leftT').removeClass('ico').addClass('con');
				$child.find('div').eq(0).click();
			} else {
				$child.addClass('hidden');
				$this.css({'padding':'12px 0 12px 26px'});
				$this.find('.leftT').removeClass('con').addClass('ico');
			}
		} else {
			$box.addClass('hidden').eq($this.index('.parent')).removeClass('hidden');
			$('.child div').removeClass('active');
			$this.addClass('active');
		}

	});
}());
