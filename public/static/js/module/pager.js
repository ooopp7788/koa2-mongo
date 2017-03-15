//分页事件
$.fn.readyPager = function (param, callback) {
	var func;
	func = {
		name: '$.fn.readyPager()',
		callback: callback
	};
	if (param) {
		switch ($.type(param)) {
			case 'object':
				$.extend(func, param);
				func.name = '$.fn.readyPager()';
				break;
			case 'function':
				func.callback = param;
		}
	}
	if (this.length) {
		return this.each(function () {
			var area;
			area = $(this);
			area.delegate('span.pager:not(.active)', 'click', function () {
				return func.callback($(this).data().page);
			});
			if (func.addon) {
				return area.delegate('input.ipt-pager', 'focus', function () {
					return $(this).select();
				}).delegate('input.ipt-pager', 'keyup', function () {
					var ipt, len, width;
					ipt = $(this);
					len = $.trim(ipt.val()).length;
					width = len ? 32 + (len - 1) * 8 : 32;
					width = (width > 240 ? 240 : void 0) - 6;
					return ipt.css({
						width: width
					});
				}).delegate('input.ipt-pager', 'keydown', function (e) {
					var btn, ipt;
					ipt = $(this);
					btn = ipt.siblings('button.btn-pager').eq(0);
					if (e.which === 13) {
						return btn.click();
					} else if ($.inArray(e.which, [8, 35, 36, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]) === -1) {
						return false;
					}
				}).delegate('button.btn-pager', 'click', function () {
					var btn, ipt, m, n, ref, ref1;
					btn = $(this);
					ipt = btn.siblings('input.ipt-pager').eq(0);
					n = (ref = parseInt(ipt.val())) != null ? ref : 1;
					m = (ref1 = ipt.data().max) != null ? ref1 : 65535;
					if (n < 1) {
						n = 1;
					}
					if (n > m) {
						n = m;
					}
					return func.callback(n);
				});
			}
		});
	} else {
		//$.info("debug::[" + func.name + "]#3");
		return $();
	}
};

//分页模板
$.makePager = function (param) {
	var f, i, p;
	f = {
		num: 1,
		count: 0,
		size: 20,
		long: 7,
		haslast: false,
		hasfirst: true,
		hasjumpPage: false
	};
	if (param) {
		$.extend(f, param);
	}
	p = {
		total: f.totalPage || Math.ceil(f.count / f.size),
		num: f.num,
		hasjumpPage: f.hasjumpPage
	};

	// 坑啊
	if(location.href.indexOf("spn") < 0 && (param && !(param.hash))){
		location.hash = "#page=" + f.num;
	}
	if (p.total > 1) {
		p.fore = p.num >= 5 ? '<span class="pager pager-fore" data-page="' + (p.num - 1) + '"><i class="icon icon-chevron-left" title="上一页"></i></span>' : '';
		p.hind = p.num !== p.total ? '<span class="pager pager-hind" data-page="' + ((p.num | 0) + 1) + '"><i class="icon icon-arrow-slim-right" title="下一页"></i></span>' : '';
		if (f.haslast) {
			p.last = p.num !== p.total ? '<span class="pager pager-first" data-page="' + p.total + '"><i class="icon icon-step-forward" title="最末"></i></span>' : '';
		} else {
			p.last = '';
		}
		if (f.hasfirst) {
			p.first = p.num >= 5 ? '<span class="pager pager-last" data-page="' + 1 + '"><i class="icon icon-step-backward" title="最初"></i></span>' : '';
		} else {
			p.first = '';
		}
		p.here = '<span class="pager pager-here active" data-page="' + p.num + '">' + p.num + '</span>';
		p.fores = '';
		if (p.num <= 4) {
			for (var k = 1; k < p.num; k++) {
				p.fores = p.fores + '<span class="pager pager-hinds" data-page="' + k + '">' + k + '</span>';
			}
		} else {
			for (var k = p.num - 3; k < p.num; k++) {

				p.fores = p.fores + '<span class="pager pager-hinds" data-page="' + k + '">' + k + '</span>';
			}
		}
		p.hinds = '';
		if (p.total < f.long) {
			f.long = p.total;
		}
		if (p.num <= 4) {
			for (var k = p.num + 1; k <= f.long; k++) {

				p.hinds = p.hinds + '<span class="pager pager-hinds" data-page="' + k + '">' + k + '</span>';
			}
		} else {
			for (var k = p.num + 1; k <= p.num + 3; k++) {
				if (k <= p.total) {
					p.hinds = p.hinds + '<span class="pager pager-hinds" data-page="' + k + '">' + k + '</span>';
				}
			}
		}
		if (p.hasjumpPage) {
			return p.html = '<div id="' + (f.id || '') + '" class="area-pager ' + (f['class'] || '') + '">' + (f.before || '') + p.first + p.fore + p.fores + p.here + p.hinds + p.hind + p.last + '<span class="hint">共' + p.total + '页</span>' + (f.after || '') + '<span class="clearfix"></span> </div>';
		}else{
			return p.html = '<div id="' + (f.id || '') + '" class="area-pager ' + (f['class'] || '') + '">' + (f.before || '') + p.first + p.fore + p.fores + p.here + p.hinds + p.hind + p.last + '<span class="hint">当前页：' + p.num + '/' + p.total + '页' + '</span>' + (f.after || '') + '<span class="clearfix"></span> </div>';
		}

	} else {
		return '';
	}
};
