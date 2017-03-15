$(function () {
	var w = window;
	w.user ={
		ver: '0.1.0',
		name: $.cookie('ac_username') ? $.cookie('ac_username') : '用户',
		avatar: $.cookie('ac_userimg') || 'http://cdn.aixifan.com/style/image/avatar.jpg',
		online: 0,
		ban: false,
		uid: -1,
		group: -1
	};
	$.mAjax = function (type, url, data, success, error, opts) {
		var def = {
			type: "GET",
			data: data,
			url: url,
			dataType: "json",
			beforeSend: function () {
			},
			success: success,
			error: error,
			complete: function () {
			}
		};
		var st = $.extend({}, def, opts);
		var responseData = {};
		if (!st.url) {
			return false;
		}
		return $.ajax({
			type: st.type,
			data: st.data,
			url: st.url,
			dataType: st.dataType,
			beforeSend: function () {
				$.isFunction(st.beforeSend) && st.beforeSend();
			},
			success: function (data) {
				responseData = data;
				$.isFunction(st.success) && st.success(data);
			},
			error: function (data) {
				responseData = data;
				$.isFunction(st.error) && st.error(data);
			},
			complete: function () {
				if (window.globalConfig && window.globalConfig.debug) {
					console.log('start---------------------------' + url + '---------------------------start');
					console.log(responseData);
					console.log('end---------------------------------------------------------------------end\n');
				}
				$.isFunction(st.complete) && st.complete(data);
			}
		});
	};

	$.getHttp = function (url, data, success, error, opts) {
		return $.mAjax('GET', url, data, success, error, opts);
	};

	$.postHttp = function (url, data, success, error, opts) {
		return $.mAjax('POST', url, data, success, error, opts);
	};


	$.log = function (msg) {
		return console.log(msg);
	};
	$.parseSafe = function(text) {
		var t;
		if (t = text) {
			t = $.parseString(t).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, '').replace(/&apos;/g, "'");
			if (window.Worker) {
				return new Option(t).innerHTML;
			} else {
				if (!$$()['#item-safe-parse']) {
					$$('#stage').append('<div id="item-safe-parse" class="hidden"></div>');
				}
				return $$('#item-safe-parse').text(t).html();
			}
		} else {
			return '';
		}
	};

	$.parseTemp = function (string, object) {
		for (var key in object) {
			var value = object[key];
			string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
		}
		return string;
	};

	$.parseString = function (data) {
		var d, e, error1;
		switch ($.type(d = data)) {
			case 'string':
				return d;
			case 'number':
				return d.toString();
			case 'array':
				return (JSON.stringify({
					_obj: d
				})).replace(/\{(.*)\}/, '$1').replace(/"_obj":/, '');
			case 'object':
				return JSON.stringify(d);
			case 'boolean':
				return d.toString();
			case 'undefined':
				return 'undefined';
			case 'null':
				return 'null';
			default:
				try {
					return d.toString();
				} catch (error1) {
					e = error1;
					return '';
				}
		}
	};

	$.parseJson = function (data) {
		var d, f;
		f = function (p) {
			var e, error1;
			try {
				return $.parseJSON(p);
			} catch (error1) {
				e = error1;
				return null;
			}
		};
		switch ($.type(d = data)) {
			case 'string':
				return f(d);
			case 'object':
				return d;
			default:
				return null;
		}
	};

	//-获取hash
	$.fomatHash = function(){
			var hash = location.hash.length > 0 ? location.hash.substring(1) : "";
			var items = hash.length > 0 ? hash.split(";") : [];
			var hashArgs = {};
			var item,name,value;
			var i = 0,len = items.length;

			for (i = 0; i < len; i++) {
					item = items[i].split("=");
					name = decodeURIComponent(item[0]);
					value = decodeURIComponent(item[1]);
					if (name.length > 0) {
							hashArgs[name] = value;
					}
			}
			return hashArgs;
	}

	$.randomNumber = function (start, end) {
		return Math.floor(Math.random() * (end - start + 1) + start);
	};

	$.parseTime = function (param) {
		var trans;
		trans = function (t) {
			var dayAgo, dt, dtNow, hrAgo, hrMin, longAgo, longLongAgo, minAgo, secAgo, ts, tsDistance, tsNow;
			dt = new Date(t);
			ts = dt.getTime();
			dtNow = new Date();
			tsNow = dtNow.getTime();
			tsDistance = tsNow - ts;
			hrMin = dt.getHours() + '时' + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes() + '分';
			longAgo = (dt.getMonth() + 1) + '月' + dt.getDate() + '日(星期' + ['日', '一', '二', '三', '四', '五', '六'][dt.getDay()] + ') ' + hrMin;
			longLongAgo = dt.getFullYear() + '年' + longAgo;
			if (tsDistance < 0) {
				return '刚刚';
			}
			if ((tsDistance / 1000 / 60 / 60 / 24 / 365) | 0) {
				return longLongAgo;
			}
			if ((dayAgo = tsDistance / 1000 / 60 / 60 / 24) > 3) {
				if (dt.getFullYear() !== dtNow.getFullYear()) {
					return longLongAgo;
				}
				return longAgo;
			}
			if ((dayAgo = (dtNow.getDay() - dt.getDay() + 7) % 7) > 2) {
				return longAgo;
			}
			if (dayAgo > 1) {
				return '前天 ' + hrMin;
			}
			if ((hrAgo = tsDistance / 1000 / 60 / 60) > 12) {
				return (dt.getDay() !== dtNow.getDay() ? '昨天 ' : '今天 ') + hrMin;
			}
			if (hrAgo = (tsDistance / 1000 / 60 / 60 % 60) | 0) {
				return hrAgo + '小时前';
			}
			if (minAgo = (tsDistance / 1000 / 60 % 60) | 0) {
				return minAgo + '分钟前';
			}
			if ((secAgo = (tsDistance / 1000 % 60) | 0) > 30) {
				return secAgo + '秒前';
			}
			return '刚刚';
		};
		return trans(this.timeStamp(param));
	};

	$.timeStamp = function (param) {
		var a, b, c, d, i, j, p, text;
		switch ($.type(p = param)) {
			case 'number':
				return p;
			case 'string':
				text = $.trim(p);
				if (text.search(/[\s\.\-\/]/) !== -1) {
					if (text.search(/\:/) !== -1) {
						a = text.split(' ');
						if (a[0].search(/\:/) === -1) {
							b = a[0].replace(/[\-\/]/g, '.').split('.');
							c = a[1].split(':');
						} else {
							b = a[1].replace(/[\-\/]/g, '.').split('.');
							c = a[0].split(':');
						}
					} else {
						b = text.replace(/[\-\/]/g, '.').split('.');
						c = [0, 0, 0];
					}
					for (i = j = 0; j <= 2; i = ++j) {
						b[i] = b[i] | 0;
						c[i] = (c[i] || 0) | 0;
					}
					d = new Date();
					d.setFullYear(b[0], b[1] - 1, b[2]);
					d.setHours(c[0], c[1], c[2]);
					return ((d.getTime() / 1e3) | 0) * 1e3;
				} else {
					return $.now();
				}
				break;
			default:
				return $.now();
		}
	};

	$.fn.showDanmu = function (opts) {
		var def = {
			lifeTime: 5,
			delay: 1,
			"class": 'danmaku',
			lines: 3,
			lineHeight: 20,
			loop: true
		};
		var st = $.extend({}, def, opts);
		var $this = $(this);
		var hasTransform = typeof (document.createElement('div').style.transform) === 'string';
		var status = {};

		$('body').on('mouseenter.dmscroll', $this.selector, function () {
			var _$this = $(this);
			var space = _$this.children('.space-' + st["class"]);
			_$this.data().onscroll = true;

			if (!space.length) {
				_$this.append('<div class="init-space space-' + st["class"] + '"></div>');
				space = _$this.children('.space-' + st["class"]);
				setTimeout(function () {
					return space.removeClass('init-space');
				}, 50);
			}
			var funcScroll = function () {
				var w = _$this.width();
				var count = 0;
				var texts = _$this.data().text;
				if (!texts.length) {
					return;
				}
				var rolling = function () {
					var pX, transitParam, wd;
					var text = texts[count];
					if (!hasTransform) {
						pX = 'left:' + w + 'px;';
					} else {
						pX = 'transform:translate3d(' + w + 'px,0,0);';
					}
					var dm = $("<span class='" + st["class"] + "' style='" + pX + "top:" + ((count % st.lines) * st.lineHeight) + "px'>" + text + "</span>");
					space.append(dm);
					wd = dm.width();
					if (!hasTransform) {
						transitParam = {
							left: -wd
						};
					} else {

						transitParam = {
							transform: 'translate3d(' + -wd + 'px,0,0)'
						};
					}
					//ie9不飘弹幕...
					if(!hasTransform){
						dm.animate(transitParam, st.lifeTime * 1000,'linear',function () {
							return dm.remove();
						});
					}else{
						dm.transition(transitParam, st.lifeTime * 1000, 'linear', function () {
							return dm.remove();
						});
					}
					count++;
					if (count > texts.length - 1) {
						clearInterval(status.dmScroll);
						count = 0;
						if (st.loop) {
							clearTimeout(status.dmloop);
							return status.dmloop = setTimeout(function () {
								if (_$this.data().onscroll) {
									clearInterval(status.dmScroll);
									return status.dmScroll = setInterval(rolling, st.delay * 1000);
								}
							}, 5000);
						}
					}
				};
				clearInterval(status.dmScroll);
				space.children('.' + st["class"]).remove();
				if (texts.length > 1) {
					rolling();
				}
				return status.dmScroll = setInterval(rolling, st.delay * 1000);
			};
			var getDanmaku = function (obj) {
				var ref, vid;
				vid = obj.data().did;
				if (!obj.data().failCount) {
					obj.data().failCount = 0;
				}
				if (vid && obj.data().failCount < 3) {
					system.tv = function (data) {
						var a, d, i, j, len, text;
						text = [];
						d = data[2].concat(data[0]);
						if (d.length) {
							for (i = j = 0, len = d.length; j < len; i = ++j) {
								a = d[i];
								if (text.length > 20) {
									break;
								}
								if (a.c.split(',')[2] !== '7') {
									if (!/(.{1,4}?)\1{3,}/.test(a.m)) {
										text.push(a.m);
									}
								}
							}
						}
						obj.data().text = text;
						if (obj.data().onscroll) {
							return funcScroll();
						}
					};
					if ((ref = obj.data().port) != null) {
						ref.abort();
					}
					obj.data().port = $.ajax({
						url: 'http://danmu.aixifan.com/V3/' + vid + '/1/20/system.tv',
						dataType: 'script',
						cache: true
					}).fail(function () {
						return obj.data().failCount++;
					});
				}
			};
			if (_$this.data().text) {
				return funcScroll();
			} else {
				clearTimeout(status.getDanmaku);
				return status.getDanmaku = setTimeout(function () {
					if (_$this.data().onscroll) {
						return getDanmaku(_$this);
					}
				}, 500);
			}
		}).on('mouseleave.dmscroll click.dmscroll',$this.selector, function () {
			var _$this = $(this);
			var $space = _$this.children('.space-' + st["class"]);

			_$this.data().onscroll = false;

			clearInterval(status.dmScroll);
			return $space.children('.' + st["class"]).remove();
		});

		return $this;
	};

	$.fn.searchComplete = function (opts) {
		var def = {
			maxLength: 7
		};
		var st = $.extend({}, def, opts);
		var $this = $(this);

		$this.one('focus', function () {
			var dropdown, placeholder;
			var $form = $('#search-box');
			var $searchText = $form.find('#search-text');
			dropdown = $form.find('.search-result');
			placeholder = $searchText.attr('placeholder') || '搜索';
			if ($searchText.length) {
				$form.data({
					timer: null,
					port: null
				});
				if (!window.Worker) {
					$searchText.val(placeholder);
				}
				dropdown.css({
					left: $searchText.offset().left - $form.offset().left,
					top: $searchText.outerHeight(),
					'min-width': $searchText.outerWidth()
				}).delegate('a', 'click', function () {
					var obj;
					obj = $(this);
					return $searchText.val(obj.find('span.cont').text());
				});

				$searchText.focus(function () {
					$searchText.keyup();
					return dropdown.css({
						display: 'block',
						opacity: 0,
						'min-width': $searchText.outerWidth()
					}).stop(false, true).animate({
						opacity: 1
					}, 200);
				}).blur(function () {
					$searchText.val($.trim($searchText.val()));
					if (!$.trim($searchText.val()).length && !window.Worker) {
						$searchText.val(placeholder);
					}
					return dropdown.stop(false, true).animate({
						opacity: 0
					}, 200, function () {
						return dropdown.css({
							display: 'none'
						});
					});
				}).keydown(function (e) {
					if (e.which === 13 || e.which === 10) {
						return $searchText.val($.trim($searchText.val()));
					}
				}).keyup(function (e) {
					var i, obj, temp, val;
					obj = dropdown.find('li.active');
					if (e.which === 38 || e.which === 40) {
						e.preventDefault();
						if (!obj.length) {
							system.tv = e.which === 38 ? 'last' : 'first';
							dropdown.find('li:' + system.tv).addClass('active');
						} else {
							i = e.which === 38 ? obj.index() - 1 : obj.index() + 1;
							if (i < 0) {
								i = dropdown.find('li').length - 1;
							}
							if (i >= dropdown.find('li').length) {
								i = 0;
							}
							obj.removeClass('active');
							dropdown.find('li:eq(' + i + ')').addClass('active');
						}
						return $searchText.val(dropdown.find('li.active').find('span.cont').text());
					} else {
						var ref;
						val = $.trim($searchText.val());
						temp = '';
						if (val.length) {
							clearTimeout($form.data().timer);
							return $form.data().timer = setTimeout(function () {
								if ((ref = $form.data().port) != null) {
									ref.abort();
								}
								return $form.data().port = $.getScript('http://search.acfun.cn/suggest?cd=1&sys_name=pc&q=' + encodeURI(val)).done(function () {
									var a, d, html, j, len1, ref1;
									d = $.parseJson($.parseString(system.tv));
									if ((d != null ? d.status : void 0) === 200) {
										if (d.data.length) {
											html = '';
											ref1 = d.data;
											len1 = ref1.length;
											var showLength = len1 >= st.maxLength ? st.maxLength : len1;
											for (j = 0; j < showLength; j++) {
												a = ref1[j];
												var reg = new RegExp(val, "i");
												var resName = a.name.toString().replace(reg, '<i class="light">' + val + '</i>');
												html += '<li><a href=' + (window.globalConfig.rootDomain || "") + '/search/#query=' + a.name + ' target="_blank"><span class="cont">' + resName + '</span></a></li>';
											}
										} else {
											html = temp;
										}
									} else {
										html = temp;
									}
									var allHtml = "<ul>" + html + "</ul>";
									if (!html) {
										dropdown.html(allHtml).addClass('hidden').css({
											opacity: 0,
											display: 'none'
										});
										return false;
									}
									dropdown.html(allHtml)
									if ($searchText.is(':focus')) {
										dropdown.removeClass('hidden').css({
											opacity: 1,
											display: 'block'
										});
									}
									return dropdown.html(allHtml);
								}).fail(function () {
									return dropdown.html(temp);
								});
							}, 500);
						} else {
							//return dropdown.addClass('hidden');
							clearTimeout($form.data().timer);
							ref && ref.abort();
							var historyHtml = "";
							var searchHotHtml = $('#temp-search-hot').html();
							if (localStorage) {
								if (localStorage.getItem("searchCache")) {
									var historyTag = ""
									JSON.parse(localStorage.getItem("searchCache")).forEach(function(tag, index){
										historyTag += "<a id='search-history-count-"+ (index + 1) +"' href='/search/#query=" + tag + "'>" + tag + "</a>"
									})
									historyHtml = "<div class='search-history-box'>" +
									"<div class='search-history-tool clearfix'><p class='fl'>历史记录</p><p class='clear-history fr'>清除历史</p></div>" +
									"<div class='search-history-body clearfix'>" + historyTag + "</div>" +
									"</div>"
								}
							}
							dropdown.html(historyHtml + searchHotHtml).removeClass('hidden').css({
								display: 'block',
								opacity: 0,
								'min-width': $searchText.outerWidth()
							}).stop(false, true).animate({
								opacity: 1
							}, 500)
							dropdown.find('.clear-history').click(function() {
								localStorage.removeItem('searchCache')
								dropdown.find('.search-history-box').css('display','none')
								dropdown.find('.search-history-body').html("")
							})
						}
					}
				}).focus();
			}
		});

		return $this;
	};

	//save
	$.save = function(param, callback){
		//check param
		if(param){
			switch(param){
				case'cache':
					store.set('cache', cache);
					break;
				case 'config':
					store.set('config', config);
					break;
				case 'user':
					store.set('user', user);
					break;
				case 'extendUser':
					//为兼容老站 进行不覆盖storge 存储
					var oldUser = store.get('user');
					user = $.extend(oldUser,user);
					store.set('user', user);
					break;
				default:
					return false
			}
			if (callback){callback()};
		}
	};

	$.user = {
		uid: $.cookie('auth_key'),
		avatar: $.cookie('ac_userimg'),
		name: $.cookie('ac_username'),
		onlineTime: 0,
		level: $.cookie('userLevel') | 0,
		ban: false,
		//online : false,
		isChecking: {},
		unread: {},
		isLogin: function () {
			return this.uid > 0;
		},
		getHistory: function (count) {
			count = count || 10;
			if (window.localStorage) {
				var cacheData = JSON.parse(localStorage.getItem('cache'));
				if (cacheData && cacheData.history && cacheData.history.views) {
					var views = cacheData.history.views;
					return $.isArray(views) && views.reverse().splice(0, count);
				}
			}
			return [];
		},
		removeCookie: function (key, path, domain) {
			$.cookie(key, null, {
				path: path || '/',
				domain: domain || '.acfun.cn'
			});
		},
		setCookie: function (key, value, obj) {
			var dateCookie = new Date();
			dateCookie.setTime(dateCookie.getTime() + (5 * 60 * 1000));

			obj = $.extend({}, {
				expires: dateCookie,
				path: '/',
				domain: '.acfun.cn'
			}, obj);

			$.cookie(key, value, obj);
		},
		clear: function () {
			$.user = {};

			//TODO $.save
			//$.save 'user'
			this.clearLevel();
			this.clearGroupLevel();
		},
		clearLevel: function () {
			this.removeCookie('online_status');
			this.removeCookie('userLevel');
		},
		clearGroupLevel: function () {
			this.removeCookie('userGroupLevel');
			this.removeCookie('checkMobile');
			this.removeCookie('checkEmail');
		},
		getOnlineStatus: function () {
			return $.cookie("online_status") > 0;
		},
		setOnlineTime: function (time) {
			return this.onlineTime = time || this.getOnlineTime();
		},
		getOnlineTime: function () {
			return parseInt($.cookie('online_status')) || 0;
		},
		checkAndPullLevel: function () {
			var _this = this;
			if (this.isLogin() && (location.href.search(/acfun/) !== -1 || location.href.search(/tudou/) !== -1)) {
				if (this.getOnlineStatus()) {
					this.setOnlineTime();
				} else {
					var f;
					(f = function () {
						$.get('/online.aspx', {
							uid: _this.uid
						}).done(function (data) {
							if (data.success) {
								_this.setCookie('online_status', data.duration);
								_this.level = data.level | 0;
								_this.ban = data.isdisabled;
								_this.onlineTime = data.duration | 0;
								_this.setCookie('userLevel', data.level | 0);
								//赋值全局变量user
								user.level = data.level | 0;
								user.ban = data.isdisabled;
								user.onlineTime = data.duration | 0;
								$.save('extendUser');
							}
						});
					})();
					return setInterval(f, 3e5);
				}
			}
		},
		getGroupLevel: function () {
			return $.cookie('userGroupLevel');
		},
		checkMobile: function () {
			var checkMobile = $.cookie('checkMobile');
			return Boolean(checkMobile && checkMobile != "-1");
		},
		checkEmail: function () {
			var checkEmail = $.cookie('checkEmail');
			return Boolean(checkEmail && checkEmail != "-1");
		},
		checkAndPullGroupLevel: function (callBack) {
			var _this = this;
			if (!_this.isLogin()) {
				return false;
			}
			if (!_this.getGroupLevel() || (_this.getGroupLevel() == "-1")) {
				if (_this.isChecking.groupLevel != null) {
					_this.isChecking.groupLevel.abort();
				}
				_this.isChecking.groupLevel = $.get('/member/getUserGroupLevel.aspx').done(function (data) {
					if (data.success) {
						_this.setCookie('userGroupLevel', data.result.groupLevel);
						_this.setCookie('checkMobile', data.result.checkMobile);
						_this.setCookie('checkEmail', data.result.checkEmail);
					} else {
						_this.clearGroupLevel();
					}
				});
			}
		},
		getUnRead: function (callBack) {
			var _this = this;
			$.get('/member/unRead.aspx', {
				uid: _this.uid
			}).fail(function () {
				return 0;
			}).done(function (data) {

				_this.unread = {
					push: data.newPush | 0,
					at: data.mention | 0,
					mail: data.unReadMail | 0,
					fan: data.newFollowed | 0,
					special: data.special,
					bangumi: data.bangumi,
					setting: data.setting | 0
				};
				//TODO
				//$.save('user');
				callBack(_this.unread);

			});
		},
		renderUnRead: function (data) {
			var _this = this;
			var html = '';
			var counts = 0;
			var url = '';

			if (data) {
				var rootDomain = window.globalConfig && window.globalConfig.rootDomain ? window.globalConfig.rootDomain : '';
				var temp = '<li><a class="unit" href="' + rootDomain + '/member/#area=[path]" target="_blank">您有<span class="pts">[pts]</span>[unit]新[type]</a></li>';
				var arr = [
					{
						type: '推送',
						path: 'push',
						pts: _this.unread.push
					}, {
						type: '听众',
						path: 'followers',
						// icon: 'user',
						pts: _this.unread.fan,
						unit: '个'
					}, {
						type: '召唤',
						path: 'mention',
						// icon: 'at',
						pts: _this.unread.at
					}, {
						type: '私信',
						path: 'mail',
						// icon: 'envelope',
						pts: _this.unread.mail
					}, {
						type: '剧集推送',
						path: 'favourite-bangumi',
						pts: _this.unread.bangumi && _this.unread.bangumi.length
					}, {
						type: '合辑推送',
						path: 'favourite-album',
						pts: _this.unread.special && _this.unread.special.length
					}, {
						type: '设置提醒',
						path: 'profile',
						pts: _this.unread.setting
					}
				];
				var renderItem = function (itemData) {
					if (itemData.pts) {
						html += $.parseTemp(temp, {
							type: itemData.type,
							path: itemData.path || 'splash',
							icon: itemData.icon || 'play-circle',
							pts: itemData.pts || 0,
							unit: itemData.unit || '条'
						});
						counts += itemData.pts;
						url = rootDomain + '/member/#area=' + itemData.path;
					}
				};

				$.each(arr, function (k, v) {
					renderItem(v);
				});

				if (counts > 0) {
					if (counts > 99) {
						counts = '99+';
					}
				} else {
					html = '<li><i class="icon icon-info-circle"></i>暂未有任何推送或未读信息。</li>';
				}
			}

			return '<ul id="user-message-con" data-count="' + counts + '" data-url="' + url + '">' + html + '</ul>';
		},
		init: function () {
			this.checkAndPullLevel();
			this.checkAndPullGroupLevel();
		}

	};
	//-
	$.user.group = $.cookie('ac_time') ? 0 : $.cookie('auth_key') ? 2 : 1;

	//- Object.defineProperty($.user,'group',{set:function(){debugger;}})

	//TODO ie11
	$.browser = (function () {
		var UA = window.navigator.userAgent.toLowerCase();
		var isChrome = UA.indexOf('chrome') > 0;
		return {
			ua: UA,
			isIE: function (ver) {
				var b = document.createElement('b');
				b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
				return b.getElementsByTagName('i').length === 1 || document.documentMode == 10
			},
			isWin: UA.indexOf('windows') > 0,
			isMac: UA.indexOf('mac') > 0,
			isChrome: isChrome,
			isFirefox: UA.indexOf('firefox') > 0,
			isSafari: !isChrome && UA.indexOf('safari') > 0,
			initClass: function () {
				var body = document.getElementsByTagName('body')[0];

				if (this.isWin) {
					body.className += " win";
				}
				if (this.isMac) {
					body.className += " mac";
				}
				if (this.isChrome) {
					body.className += " chrome";
				}
				if (this.isSafari) {
					body.className += " safari";
				}
				if (this.isIE()) {
					body.className += " ie";
				}
				for (var i = 6; i <= 9; i++) {
					if (this.isIE(i)) {
						body.className += " ie" + i;
					}
				}
				if (this.isIE() && document.documentMode == 10) {
					body.className += " ie10";
				}

				if (this.isFirefox) {
					body.className += " firefox";
				}
			}
		};
	})();

	//搜索历史记录
	$.searchCache = function(textValue) {
		var searchCache = []
		if (textValue && localStorage) {
			searchCache = JSON.parse(localStorage.getItem("searchCache")) || []
			searchCache = searchCache.filter(function(word, index) {
				return word !== textValue
			})
			searchCache.unshift(textValue)
			searchCache.splice(8)
			localStorage.setItem("searchCache", JSON.stringify(searchCache))
		}
	}


	$.info = {
		show: function (text, time, addClass) {
			var $infoBox = $('#info-box');
			var classString = addClass ? addClass : 'info';
			var $p = $('<p class="info ' + addClass + '"><i class="icon icon-' + classString + '"></i><span>' + text + '</span></p>');
			$infoBox.append($p);
			$p.animate({
				left: 0
			}, 300);
			setTimeout(function () {
				$p.animate({
					left: '-100%'
				}, 300, function () {
					$p.remove();
				});
			}, time || 10000);
			return this;
		},
		error: function (text, time) {
			return this.show(text, time, 'error');
		},
		warning: function (text, time) {
			return this.show(text, time, 'warning');
		},
		success: function (text, time) {
			return this.show(text, time, 'success');
		}
	};

	$.fn.riseInfo = function (param) {
		var text;
		text = param || '+1';
		return this.each(function () {
			var obj, singer, top;
			singer = $(this);
			obj = $('<span class="info-rise">' + text + '</span>');
			obj.appendTo($('body'));
			top = singer.offset().top - obj.height();
			return obj.css({
				opacity: 0,
				left: singer.offset().left,
				top: top
			}).transition({
				opacity: 1,
				top: top - 16
			}, 250).transition({
				opacity: 1,
				top: top - 20
			}, 500).transition({
				top: top - 20
			}, 500).transition({
				opacity: 0,
				top: top - 32
			}, 250, function () {
				return obj.remove();
			});
		});
	};

	$.parsePts = function (number) {
		var n;
		if ((n = (number || 0) | 0) >= 1e5) {
			return (((n * 0.001) | 0) / 10) + '万';
		} else {
			return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
	};

	/**
	 * 根据key返回第二个数组中与第一个数组不同的值
	 * @param arr1
	 * @param arr2
	 * @param key
	 * @returns {Array}
	 */
	$.removeRepeatObject = function (arr1, arr2, key) {
		var obj = {};
		var result = [];
		for (var i = 0; i < arr1.length; i++) {
			obj[arr1[i][key]] = 1;
		}

		for (var m = 0; m < arr2.length; m++) {
			if (!obj[arr2[m][key]]) {
				result.push(arr2[m]);
			}
		}
		return result;
	};
	/*$.fn.share = function(param, callback) {
		var elem, p;
		p = $.extend({
			key: {
				tsina: 529993022,
				tqq: 801259307,
				t163: '',
				tsohu: ''
			},
			icon: {
				size: 16
			},
			callback: callback
		}, param);
		elem = $(this);
		elem.addClass('bdsharebuttonbox').html('<a title="分享到新浪微博" data-cmd="tsina" class="bds_tsina"></a> <a title="分享到QQ空间" data-cmd="qzone" class="bds_qzone"></a> <a title="分享到百度贴吧" data-cmd="tieba" class="bds_tieba"></a> <a title="分享到微信朋友圈" data-cmd="weixin" class="bds_weixin"></a> <span class="clearfix"></span>');
		window._bd_share_config = {
			common: {
				bdSnsKey: p.key,
				bdText: p.text,
				bdUrl: p.url,
				bdPic: p.preview,
				bdDesc: p.desc,
				bdComment:p.comment
			},
			share: [
				{
					bdSize: p.icon.size
				}
			]
		};
		$('#main').after('<script src="http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5) + '"></script>');
		$.fn.share = function() {
			return $.i('This function can not be executed again.');
		};
		return typeof p.callback === "function" ? p.callback() : void 0;
	};
	$.fn.share2 = function(param, callback) {
		var elem, p;
		p = $.extend({
			key: {
				tsina: 529993022,
				tqq: 801259307,
				t163: '',
				tsohu: ''
			},
			icon: {
				size: 16
			},
			callback: callback
		}, param);
		elem = $(this);
		elem.addClass('bdsharebuttonbox').html('<a title="分享到新浪微博" data-cmd="tsina" class="bds_tsina"></a> <a title="分享到QQ空间" data-cmd="qzone" class="bds_qzone"></a> <a title="分享到百度贴吧" data-cmd="tieba" class="bds_tieba"></a> <a title="分享到微信朋友圈" data-cmd="weixin" class="bds_weixin"></a> <span class="clearfix"></span>');
		window._bd_share_config = {
			common: {
				bdSnsKey: p.key,
				bdText: p.text,
				bdUrl: p.url,
				bdPic: p.preview,
				bdDesc: p.desc,
				bdComment: p.comment
			},
			share: [
				{
					bdSize: p.icon.size
				}
			]
		};
		$('#main').after('<script src="http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5) + '"></script>');
		$.fn.share = function() {
			return $.i('This function can not be executed again.');
		};
		return typeof p.callback === "function" ? p.callback() : void 0;
	};*/

	/**
	 * 获取value属于obj的某个key
	 * @param value
	 * @param obj
	 * @returns key || false
	 */
	$.getObjectKey = function(value,obj){
		var cb;
		$.each(obj,function(k,v){
			switch(typeof(v)){
				case 'string':
					if(value == v){
						cb = k
					}
					break;
				case 'object':
					if(v instanceof Array){
						for(a in v){
							if(value == v[a]){
								cb = k
							}
						}
					}else{
						$.each(v,function(k2,v2){
							if(value == v2){
								cb = k
							}
						})
					}
					break;
				default :
					cb = false
			}
		});
		return cb
	};
	$.channel= {
		list: [
			[1, '动画'],
			[106, '动画短片'],
			[107, 'MAD·AMV'],
			[108, 'MMD·3D'],
			[133, '2.5次元'],
			[67, '新番连载'],
			[120, '国产动画'],
			[109, '旧番补档'],
			[159, '动画资讯'],
			[58, '音乐'],
			[136, '原创·翻唱'],
			[137, '演奏'],
			[103, 'Vocaloid'],
			[138, '日系音乐'],
			[139, '综合音乐'],
			[140, '演唱会'],
			[123, '舞蹈'],
			[134, '宅舞'],
			[135, '综合舞蹈'],
			[59, '游戏'],
			[83, '游戏集锦'],
			[145, '电子竞技'],
			[84, '主机单机'],
			[85, '英雄联盟'],
			[165, '桌游卡牌'],
			[72, 'Mugen'],
			[60, '娱乐'],
			[86, '生活娱乐'],
			[87, '鬼畜调教'],
			[88, '萌宠'],
			[89, '美食'],
			[98, '综艺'],
			[70, '科技'],
			[147, 'SF'],
			[148, '黑科技'],
			[91, '数码'],
			[149, '广告'],
			[150, '白科技'],
			[151, '自我发电'],
			[90, '科学技术'],
			[122, '汽车'],
			[69, '体育'],
			[152, '综合体育'],
			[94, '足球'],
			[95, '篮球'],
			[153, '搏击'],
			[154, '11区体育'],
			[93, '惊奇体育'],
			[68, '影视'],
			[96, '电影'],
			[162, '日剧'],
			[163, '美剧'],
			[141, '国产剧'],
			[121, '网络剧'],
			[142, '韩剧'],
			[99, '布袋·特摄'],
			[100, '纪录片'],
			[143, '其他'],
			[110, '文章'],
			[110, '文章综合'],
			[73, '工作·情感'],
			[74, '动漫文化'],
			[75, '漫画·小说'],
			[164, '游戏'],
			[76, '页游资料'],
			[77, '1区'],
			[78, '21区'],
			[79, '31区'],
			[80, '41区'],
			[81, '文章里区(不审)'],
			[82, '视频里区(不审)'],
			[42, '图库'],
			[125, '鱼塘'],
			[92, '军事'],
			[131, '历史'],
			[132, '焦点'],
			[124, '彼女'],
			[127, '造型'],
			[128, '西皮'],
			[129, '爱豆'],
			[130, '其他']
		],
		map: {
			1: [106, 107, 108, 133, 67, 120, 109, 159],
			58: [136, 137, 103, 138, 139, 140],
			59: [83, 145, 84, 85, 165, 72],
			60: [86, 87, 88, 89, 98],
			70: [147, 148, 91, 149, 150, 151, 90, 122],
			125: [92, 131, 132],
			124: [127, 128, 129, 130],
			69: [152, 94, 95, 153, 154, 93],
			68: [96, 162, 163, 141, 121, 142, 99, 100, 143],
			110: [110, 73, 74, 75, 164],
			123: [134, 135],
			0: [76, 77, 78, 79, 80, 81, 82, 42]
		}
	};
	$.fn.share = function(param, callback) {
		var elem, p;
		p = $.extend({
			key: {
				tsina: 529993022,
				tqq: 801259307,
				t163: '',
				tsohu: ''
			},
			icon: {
				size: 16
			},
			callback: callback
		}, param);
		elem = $(this);
		elem.addClass('bdsharebuttonbox').html('<div class="jiathis_style_32x32">' +
			'<a title="分享到新浪微博" class="jiathis_button_tsina" id="bd_shareweibo"></a> ' +
			'<a title="分享到QQ空间" class="jiathis_button_qzone" id="bd_shareqq"></a> ' +
			'<a title="分享到百度贴吧" class="jiathis_button_tieba" id="bd_sharetieba"></a> ' +
			'<a title="分享到微信朋友圈" class="jiathis_button_weixin" id="bd_sharewechat">' +
			'</a> <span class="clearfix"></span></div>');
		window.jiathis_config ={
			uid:2106688,
			url:p.url,
			title:p.text,
			pic: p.preview,
			summary:p.desc || ' ',
			appkey:{
				tsina: p.key.tsina,
				tqq: p.key.tqq
			},
			data_track_clickback:true
		};
		if(typeof jiathis_SetString == 'undefined'){
			$('#main').after('<script src="http://v3.jiathis.com/code/jia.js?uid=2106688" charset="utf-8"></script>');
		}
		return typeof p.callback === "function" ? p.callback() : void 0;
	};
	$.getQueryString = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return r[2]; return null;
	}

	//模板处理函数
	var _ = {};
	_.templateSettings = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};

	var noMatch = /(.)^/;

	var escapes = {
		"'": "'",
		'\\': '\\',
		'\r': 'r',
		'\n': 'n',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

	var escapeChar = function(match) {
		return '\\' + escapes[match];
	};

	var escapeMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&#x60;'
	};
	var createEscaper = function(map) {
		var escaper = function(match) {
			return map[match];
		};
		var source = '(?:' + Object.keys(map).join('|') + ')';
		var testRegexp = RegExp(source);
		var replaceRegexp = RegExp(source, 'g');
		return function(string) {
			string = string == null ? '' : '' + string;
			return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
		};
	};
	$.escape = createEscaper(escapeMap);
	$.template = function(text, settings) {
		settings = $.extend({}, _.templateSettings, settings)

		var matcher = RegExp([
				(settings.escape || noMatch).source,
				(settings.interpolate || noMatch).source,
				(settings.evaluate || noMatch).source
			].join('|') + '|$', 'g');

		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
			index = offset + match.length;

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':$.escape(__t))+\n'";
			} else if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			} else if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}

			return match;
		});
		source += "';\n";

		if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," +
			"print=function(){__p+=__j.call(arguments,'');};\n" +
			source + 'return __p;\n';

		var render;
		try {
			render = new Function(settings.variable || 'obj', '$', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		var template = function(data) {
			return render.call(this, data, $);
		};

		var argument = settings.variable || 'obj';
		template.source = 'function(' + argument + '){\n' + source + '}';
		return template;
	};

	var formatNumberByZero = function(num) {
		if(num < 10 && num >= 0) {
			num = '0' + num;
		}
		return num;
	};
	var formatByCn = function (num) {
		return ['日', '一', '二', '三', '四', '五', '六'][num];
	};
	/**
	 * @param date  时间戳
	 * @param template  模板参数 Y-年 M-月 D-日 h-时 m-分 s-秒 w-星期几
	 */
	$.formatDate = function (date, template) {
		date = new Date(date);
		template = template || '[Y]/[M]/[D]';
		var obj = {
			Y: date.getFullYear(),
			M: formatNumberByZero(date.getMonth()+1),
			D: formatNumberByZero(date.getDate()),
			h: formatNumberByZero(date.getHours()),
			m: formatNumberByZero(date.getMinutes()),
			s: formatNumberByZero(date.getSeconds()),
			w: formatNumberByZero(formatByCn(date.getDay()))
		};
		return $.parseTemp(template, obj);
	};



	$(function() {
		var appVer, browser, browser_version, chrome, cooper_id, d, deviceId, device_os, device_type, firefox, network, previous_page, product_id, refer, resolution, safari,  session_id, t, ti, time, uid, url;
		uid = $.cookie('auth_key') === null ? '' : $.cookie('auth_key');
		ti = new Date().getTime().toString();
		time = system.st;
		previous_page = '';
		network = '';
		refer = document.referrer;
		url = 'http://tongji.aixifan.com:8106/sa.gif?uuid=';
		t = new Date();
		t.setTime(t.getTime() + (5 * 60 * 1000));
		chrome = $.browser.isChrome;
		firefox = $.browser.isFirefox;
		safari = $.browser.isSafari;
		browser = [chrome, firefox, safari];
		browser_version = '';
		//-浏览器
		$.each(browser, function() {
			if (chrome === true && window.navigator.userAgent.indexOf('Edge') > -1) {
				return browser_version = 'Edge';
			} else if (chrome === true) {
				return browser_version = 'chrome';
			} else if (firefox === true) {
				return browser_version = 'firefox';
			} else if (safari === true) {
				return browser_version = 'safari';
			}
		});
		if (window.navigator.userAgent.indexOf('MSIE 9.0') > -1) {
			browser_version = 'IE9';
		} else if (window.navigator.userAgent.indexOf('MSIE 10.0') > -1) {
			browser_version = 'IE10';
		} else if (window.navigator.userAgent.indexOf('rv:11.0') > -1) {
			browser_version = 'IE11';
		} else if (window.navigator.userAgent.indexOf('Edge') > -1) {
			browser_version = 'Edge';
		}
		//-平台
		device_os = window.navigator.platform;
		appVer = window.navigator.userAgent;
		if (window.navigator.platform === 'Win32') {
			if (appVer.indexOf("WOW64") > -1) {
				device_os = 'Win64';
			}
		}
		//-分辨率
		resolution = window.screen.width + '*' + window.screen.height;
		//- 有uuid
		if ($.cookie('uuid')) {
			//- 直接统计
			//-console.info("old:" + $.cookie('uuid'));
			$.get(url + $.cookie('uuid'));
		//-无uuid
		} else {
			//-生成deviceId
			d = new Date().getTime();
			deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r, s;
				r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				s = c === 'x' ? r : r & 0x7 | 0x8;
				return s.toString(16);
			});
			session_id = ti.substr(-6) + deviceId;
			//-deviceId,session_id,uid,time,previous_page,network,refer,resolution,device_os
			var str_ = deviceId+session_id+uid+time+previous_page+network+refer+resolution+device_os;

			var ac_uuid = $.md5(str_);

			$.cookie("uuid", ac_uuid, {
				path: "/",
				expires: 365
			});
			//-$.fn.param = [deviceId, uid, session_id, time, previous_page, network, refer, url];
			//-发统计
			//-console.info("new:" + ac_uuid);
			$.get(url + ac_uuid);
		}

	});
});
