$(function () {
	//日历
	var $win = $(".area-calendar");
	var $iptS = $("#calendar-start-date");
	var $iptE = $("#calendar-end-date");
	var $startDate = $(".area-date-list .area-start-date");
	var $endDate = $(".area-date-list .area-end-date");
	var $block = $("#list-data");
	var now = new Date();
	var $monthBtns = $(".btn-mouth");
	var $yearBtns = $(".btn-year");
	var mouth = now.getMonth();
	var year = now.getFullYear();
	var newStart = window.sessionStorage.getItem('dateStart');
	var newEnd = window.sessionStorage.getItem('endStart');
	var todayEnd = ( 23 * 60 * 60 + 59 * 60 + 59 ) * 1e3;
	if (newStart) {
		$block.data({
			startDate: (new Date(newStart).getTime()),
			endDate: (new Date(newEnd).getTime())
		});
	} else {
		$block.data({
			startDate: (new Date().getTime()) - 90 * 24 * 60 * 60 * 1e3
		});
	}
	//循环到当前年份2016年
	var ref = $yearBtns;
	for (var i = j = 0, len = ref.length; j < len; i = ++j) {
		v = ref[i];
		$yearBtns.eq(i).text(year + i + 1 - $yearBtns.length).data({
			year: year + i + 1 - $yearBtns.length
		});
	}
	//月份年份样式调整
	changeDateBtnActive = function (param) {
		var e, m, y;
		e = param;
		m = new Date(e).getMonth();
		$monthBtns.removeClass('thisMouth').eq(m).addClass('thisMouth');
		y = (new Date(e)).getFullYear() - now.getFullYear() + 2;
		$yearBtns.removeClass('thisYear');
		if (y >= 0) {
			return $yearBtns.eq(y).addClass('thisYear');
		}
	};

	//月份年份时间触发
	$(".calendar-sure").on('click', function () {
		var d1, d2, ed, sd;
		d1 = $iptS.datepicker('getDate').getTime();
		d2 = $iptE.datepicker('getDate').getTime();
		if (d1 > d2) {
			sd = d2;
			ed = d1;
		} else {
			sd = d1;
			ed = d2;
		}
		$block.data({
			startDate: sd,
			endDate: ed
		});
		$startDate.text($iptS.val());
		$endDate.text($iptE.val());

		changeDateBtnActive($block.data().startDate);
		dayColor(new Date($iptS.val()).getFullYear());
		$win.css({display: "none"});
		getData(1);
	});

	//获取当月的天数
	function getDaysInOneMonth(year, month) {
		month = parseInt(month, 10);
		var d = new Date(year, month, 0);
		return d.getDate();
	}

	//月份
	$monthBtns.on('click', function () {
		var obj, startYear, year;
		obj = $(this);
		$monthBtns.removeClass('thisMouth');
		obj.addClass('thisMouth');
		year = (new Date()).getFullYear();
		startYear = $iptS.datepicker('getDate').getFullYear();
		if (year <= startYear) {
			if (obj.data().month > (new Date()).getMonth() + 1) {
				year = year - 1;
			}
		} else {
			year = startYear;
		}
		$iptS.datepicker('setDate', new Date(year, obj.data().month - 1, 1));
		changeDateBtnActive($iptS.datepicker('getDate').getTime());
		var days = getDaysInOneMonth(year, obj.data().month);
		$iptE.datepicker('setDate', new Date(year, obj.data().month - 1, days));
		$(".calendar-sure").click();
	});

	//判断当前月份后的都置灰
	function dayColor(years){
		var currentY = new Date().getFullYear();
		var currentM = new Date().getMonth()+1;
		if(years < currentY){
			$('.btn-mouth').addClass('active').removeClass('disable');
			$monthBtns.on('click',function(){
				var obj, startYear, year;
				obj = $(this);
				$monthBtns.removeClass('thisMouth');
				obj.addClass('thisMouth');
				year = (new Date()).getFullYear();
				startYear = $iptS.datepicker('getDate').getFullYear();
				if (year <= startYear) {
					if (obj.data().month > (new Date()).getMonth() + 1) {
						year = year - 1;
					}
				} else {
					year = startYear;
				}
				$iptS.datepicker('setDate', new Date(startYear, obj.data().month - 1, 1));
				changeDateBtnActive($iptS.datepicker('getDate').getTime());
				var days = getDaysInOneMonth(year, obj.data().month);
				$iptE.datepicker('setDate', new Date(startYear, obj.data().month - 1, days));
				$(".calendar-sure").click();
			});
		}else{
			var $thisM = $('.unit-mouth').find('.thisMouth');
			if($thisM.attr("data-month") > currentM){
				changeDateBtnActive(new Date().getTime());
			}
			for(var i=0;i<$(".btn-mouth").length;i++){
				if($(".btn-mouth").eq(i).attr("data-month")== currentM){
					var $curr = $(".btn-mouth").eq(i);
					$curr.siblings('.btn-mouth').removeClass('active');
					$curr.next().prevAll().addClass('active');
				}else if($(".btn-mouth").eq(i).attr("data-month")>currentM){
					$(".btn-mouth").eq(i).addClass('disable');
					var $that = $('.unit-mouth').find('.disable');
					$that.off("click");
				}
			}
		}
	}
	if (newStart) {
		dayColor(new Date(newStart).getFullYear());
	} else {
		dayColor(new Date().getFullYear());
	}
	//年份
	$yearBtns.on('click', function () {
		var obj, sd;
		obj = $(this);
		dayColor(obj.text());
		$yearBtns.removeClass('thisYear');
		obj.addClass('thisYear');
		sd = $iptS.datepicker('getDate');
		$iptS.datepicker('setDate', new Date(obj.data().year, new Date(sd).getMonth(), new Date(sd).getDate()));
		//changeDateBtnActive($iptS.datepicker('getDate').getTime());
		var days = getDaysInOneMonth(obj.data().year, new Date(sd).getMonth() + 1) - 1;
		$iptE.datepicker('setDate', new Date(new Date(obj.data().year, new Date(sd).getMonth(), new Date(sd).getDate()).getTime() + days * 24 * 60 * 60 * 1000));
	});

	//日历控件选择时间
	onSelect = function () {
		return function (dateText, obj) {
			var date;
			if (Math.abs($iptE.datepicker('getDate').getTime() - $iptS.datepicker('getDate').getTime()) > 31 * 24 * 60 * 60 * 1e3) {
				date = obj.input.datepicker('getDate');
				if (obj.id === 'calendar-start-date') {
					$iptE.datepicker('setDate', new Date(date.getTime() + 31 * 24 * 60 * 60 * 1e3));
				} else {
					$iptS.datepicker('setDate', new Date(date.getTime() - 31 * 24 * 60 * 60 * 1e3));
				}
			}
		};
	};

	//开始时间日历控件
	$iptS.datepicker({
		constrainInput: true,
		defaultDate: '-1w',
		minDate: new Date(2007, 6 - 1, 1),
		maxDate: '+2m',
		//onSelect: onSelect(),
		gotoCurrent: true,
		changeMonth: true,
		changeYear: true
	}).datepicker('setDate', new Date($block.data().startDate));
	//结束时间日历控件
	$iptE.datepicker({
		constrainInput: true,
		minDate: new Date(2007, 6 - 1, 1),
		maxDate: '+2m',
		//onSelect: onSelect(),
		gotoCurrent: true,
		changeMonth: true,
		changeYear: true
	}).datepicker('setDate', new Date($block.data().endDate));

	$(".area-date-list").click(function () {
		$win.css({display: "block"});
		$iptS.val($startDate.html());
		$iptE.val($endDate.html());
		changeDateBtnActive($iptS.datepicker('getDate').getTime());
	});
	//关闭
	$win.find(".close").click(function () {
		$win.css({display: "none"});
	});
	getData = function (page) {
		newS = $iptS.val();
		newE = $iptE.val();
		$startDate.html(newS);
		$endDate.html(newE);
		window.sessionStorage.setItem('dateStart', newS);
		window.sessionStorage.setItem('endStart', newE);
		newS = forDate(newS);
		newE = forDate(newE);
		myShowList({
			//startDate: newS,
			//endDate: newE + todayEnd,
			pageNo: page
		});
	};
});