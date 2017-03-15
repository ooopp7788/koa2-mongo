require(['Slider', 'Gotop', 'Lazyload'], function(Slider, Gotop, Lazyload){

	var Tab = new Slider({
		container: $("#tab")
	});

	var Top = new Gotop({
		container: $("#gotop")
	});

	(function(){
		var api = "https://f.3.cn/index-floor?argv="
		var map = {
			//"1": "basic_1",
			"2": "basic_2",
			"3": "basic_3",
			"4": "basic_4",
			"5": "basic_5",
			"6": "basic_6",
			"7": "basic_7"
		}
		var tpl = [
			"<li>",
				"<a href='{url}'>",
					"<img width=200 height=200 src='{imgUrl}' />",
					"<p>{subTitle}</p>",
				"</a>",
			"</li>"
		].join('');

		function compile(tpl, data){
			var tplStr = "", i=0;
			for(; i < data.length; i++){
				tplStr+=tpl.replace(/\{(\w+)\}/g, function(a,b){
					return data[i][b];
				})
			}
			tplStr = "<ul>"+tplStr+"</ul>";
			return tplStr;
		}
		
		var lazyLoad = new Lazyload({
			elements: $(".mod"),
			sectionLoad: true,
			afterAppear: function(dom){
				var id = dom.data("id");
				var _self = dom;
				$.ajax({
					url: api+map[id],
					type: "GET",
					dataType: 'jsonp',
					jsonp: 'callback',
					success: function(res){
						var data = res.data.cols[0].content[0].bi;
						_self.html(compile(tpl, data));
					}
				});
			}
		});
		
	})();
	
})
