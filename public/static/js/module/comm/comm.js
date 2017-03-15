$(function() {
  var aid;
  var cb;
  var hasNoLayer = true;
  window.comment = function(id, callback) {
    aid = id
    cb = callback
    mark++
    if (mark==3) {
      main()
    }
  }
  var $commentAble, commentAbleValue,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  var userGroupLevel = 0
  var level = 0
  var mark = 0
  window.$$ = function(selector) {
    var h, s;
    h = system.handle;
    if (s = selector) {
      return h[s] || (h[s] = $(s));
    } else {
      return h;
    }
  };
  if ($.user.uid) {
    if ($.cookie('userGroupLevel')) {
      userGroupLevel = $.cookie('userGroupLevel')
      mark++
      if (mark==3) {
        main()
      }
    } else {
      $.get('/member/getUserGroupLevel.aspx')
      .done(function(data){
        userGroupLevel = data.result && data.result.groupLevel || 0
        mark++
        if (mark==3) {
          main()
        }
      })
      .fail(function(data){
        $.info.error("用户等级获取失败");
        mark++
        if (mark==3) {
          main()
        }
      })
    }
    $.get('/online.aspx?uid='+$.user.uid)
    .done(function(data){
      level = data.level || 0
      mark++
      if (mark==3) {
        main()
      }
    })
    .fail(function(data){
      mark++
      if (mark==3) {
        main()
      }
      level = -100
    })
  } else {
    mark+=2
    if (mark==3) {
      main()
    }
  }
  function main() {
    $("body").append('<div id="stage"><div id="area-window"><div id="win-info" class="win"><div class="mainer"></div></div><div id="win-hint" class="win win-hint"><div class="mainer"></div><div class="tail"></div></div></div></div>')

    $.salt = function(day) {
      var c, d, s, _base;
      if (day == null) {
        day = 1;
      }
      c = (_base = $.salt).cache || (_base.cache = {});
      d = day || 1;
      s = system;
      return c[d] || (c[d] = '?salt=' + (!s.debug ? ((s.st / (864e5 * d)) | 0) + s.ver.replace(/\./g, '') : s.st));
    };
    $.addVersion = function() {
      return "?v=0.5.2";
    };

    $.require = function(param, callback) {
      var base, bind, c, fix, fn, insert, p, r, salt;
      p = param;
      c = callback || function() {
        return null;
      };
      r = (base = $.require).cache || (base.cache = {});
      salt = $.addVersion();
      fix = [(globalConfig.debug ? '.js' : '.min.js') + salt, '.css' + salt];
      bind = function(name, path) {
        var url;
        if (r[name]) {
          if (r[name] === 1) {
            return c();
          } else {
            return r[name].add(c);
          }
        } else {
          (r[name] = $.Callbacks('once')).add(c);
          url = globalConfig.oldPath + (path ? '/script/' + path + '.js' : '/script/require/' + name + fix[0]);
          return $.getScript(url, function() {
            r[name].fire();
            return r[name] = 1;
          });
        }
      };
      insert = function(id, path) {
        var href;
        id = 'style-require-' + id;
        href = globalConfig.oldPath + path;
        if (!($('#' + id)).length) {
          return $('<link>').attr({
            id: id,
            href: href,
            rel: 'stylesheet'
          }).appendTo('head');
        }
      };
      switch (p) {
        case 'comm':
          if (r.comm) {
            return c();
          } else {
            insert('comm', '/project/homura/style/comm' + fix[1]);
            return $.getScript(globalConfig.oldPath + '/project/homura/script/comm' + fix[0], function() {
              r.comm = 1;
              return c();
            });
          }
          break;
        case 'qrcode':
          return bind('qrcode', 'jquery.qrcode.min');
        case 'jqueryui':
          return bind('jqueryui', 'jquery.ui.min');
        case 'transit':
          return bind('transit', 'jquery.transit.min');
        case 'chart':
          return bind('chart', 'chart.min');
        case 'ubb':
          return bind('ubb', 'ubb.min');
        case 'canvas':
          if (r.canvas) {
            return c();
          } else {
            fn = function() {
              r.canvas = 1;
              return c();
            };
            if ($('<canvas>')[0].getContext != null) {
              return fn();
            } else {
              return $.getScript(globalConfig.oldPath + '/script/excanvas.min.js', fn);
            }
          }
          break;
        case 'editor':
          if (r.editor) {
            return c();
          } else {
            insert('editor', '/umeditor/themes/ac/css/umeditor.css' + $.addVersion());
            return $.getScript(globalConfig.oldPath + '/umeditor/umeditor.config.min.js' + $.addVersion(), function() {
              return $.getScript(globalConfig.oldPath + '/umeditor/umeditor.min.js' + $.addVersion(), function() {
                r.editor = 1;
                return c();
              });
            });
          }
          break;
        case 'ready':
          if (r.ready) {
            return c();
          } else {
            return system.func.ready(function() {
              r.ready = 1;
              return c();
            });
          }
          break;
        default:
          return bind(p);
      }
    };

    var bind,
      __slice = [].slice;

    bind = function(c, a) {
      var d, v, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        d = a[_i];
        v = d.split('.');
        if (v.length === 1) {
          _results.push((function() {
            var f;
            f = v[0];
            return $[f] = function() {
              var p;
              p = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return $.require(c, function() {
                return $[f].apply($, p);
              });
            };
          })());
        } else {
          _results.push((function() {
            var f;
            f = v[1];
            return $.fn[f] = function() {
              var e, p;
              p = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              e = this;
              $.require(c, function() {
                return e[f].apply(e, p);
              });
              return e;
            };
          })());
        }
      }
      return _results;
    };

    bind('jqueryui', ['fn.draggable', 'fn.droppable', 'fn.selectable', 'fn.sortable'])

    $.fn.card = function(param, callback) {
      var c, f, p, t;
      f = {
        name: '$.fn.card()',
        win: $$('#win-info'),
        direction: 'auto',
        callback: callback
      };
      f.mainer = f.win.children('div.mainer');
      switch ($.type(p = param)) {
        case 'string':
          f.direction = $.trim(p);
          break;
        case 'function':
          f.callback = p;
      }
      c = '.card';
      t = f.win.data().timer || 0;
      return this.each(function() {
        var obj;
        obj = $(this);
        return obj.off('mouseenter' + c).on('mouseenter' + c, function() {
          clearTimeout(t);
          return t = setTimeout(function() {
            system.func.showCard(obj, f);
          }, 200);
        }).off('mouseleave' + c).on('mouseleave' + c, function() {
          clearTimeout(t);
          return $$('#win-info').mouseleave();
        });
      });
    };

    $.makePagerOld = function(param) {
      var f, i, k, o, p, ref, ref1, ref2, ref3;
      f = {
        num: 1,
        count: 0,
        size: 10,
        long: 5
      };
      if (param) {
        $.extend(f, param);
      }
      p = {
        total: f.totalPage || Math.ceil(f.count / f.size),
        num: f.num
      };
      if (p.total > 1) {
        p.fore = p.num !== 1 ? '<span class="pager-old pager-old-fore" data-page="' + (p.num - 1) + '"><i class="icon icon-chevron-left" title="上一页"></i></span>' : '';
        p.hind = p.num !== p.total ? '<span class="pager-old pager-old-hind" data-page="' + ((p.num | 0) + 1) + '"><i class="icon icon-chevron-right" title="下一页"></i></span>' : '';
        p.last = p.num !== p.total ? '<span class="pager-old pager-old-first" data-page="' + p.total + '"><i class="icon icon-step-forward" title="最末"></i></span>' : '';
        p.first = p.num !== 1 ? '<span class="pager-old pager-old-last" data-page="' + 1 + '"><i class="icon icon-step-backward" title="最初"></i></span>' : '';
        p.here = '<span class="pager-old pager-old-here active" data-page="' + p.num + '">' + p.num + '</span>';
        p.fores = '';
        for (i = k = ref = p.num - 1, ref1 = p.num - f.long; k > ref1; i = k += -1) {
          if (i >= 1) {
            p.fores = '<span class="pager-old pager-old-hinds" data-page="' + i + '">' + i + '</span>' + p.fores;
          }
        }
        p.hinds = '';
        for (i = o = ref2 = p.num + 1, ref3 = p.num + f.long; o < ref3; i = o += 1) {
          if (i <= p.total) {
            p.hinds += '<span class="pager-old pager-old-fores" data-page="' + i + '">' + i + '</span>';
          }
        }
        return p.html = '<div id="' + (f.id || '') + '" class="area-pager-old ' + (f['class'] || '') + '">' + (f.before || '') + p.first + p.fore + p.fores + p.here + p.hinds + p.hind + p.last + '<span class="hint">当前位置：' + (!f.addon ? p.num : '<input class="ipt-pager-old" type="number" value="' + p.num + '" data-max="' + p.total + '">') + (f.addon ? '<button class="btn mini btn-pager-old">跳页</button>' : '') + '&nbsp;&nbsp;共' + p.total + '页' + '</span>' + (f.after || '') + '<span class="clearfix"></span> </div>';
      } else {
        return '';
      }
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

    $.hash = function() {
      var a, b, hash, k, len1, ref, ref1, v;
      if (window.location.hash) {
        a = window.location.hash.toString().replace(/\#/, '').split(';');
        hash = {};
        for (k = 0, len1 = a.length; k < len1; k++) {
          v = a[k];
          b = [v.replace(/=[\s\S]+/, ''), v.replace(/[\s\S]+?=/, '')];
          if (((ref = b[0]) != null ? ref.length : void 0) && ((ref1 = b[1]) != null ? ref1.length : void 0)) {
            hash[b[0]] = b[1];
          }
        }
        return hash;
      } else {
        return {};
      }
    };

    $.oldChannelMap = {
      101: "演唱乐器",
      104: "acg音乐",
      114: "音乐专题",
      102: "舞蹈",
      84: "实况解说",
      115: "游戏专题",
      121: "原创网络剧",
      116: "娱乐专题",
      90: "科学技术",
      119: "科技专题",
      97: "剧集",
      117: "影视专题",
      118: "体育专题",
      105: "流行音乐"
    };

    $.parseOldChannel = function(param) {
      switch ($.type(param)) {
        case 'number':
          return $.oldChannelMap[param];
        case 'string':
          return $.each(function(k, v) {
            if (v === param) {
              return k;
            }
          });
        default:
          return '未知频道';
      }
    };

    $.parseChannel = function(param) {
      var a, c, list, _i, _j, _len, _len1;
      list = $.parseChannel.list || [];
      switch ($.type(param)) {
        case 'number':
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            a = list[_i];
            if (!(a[0] === param)) {
              continue;
            }
            c = a[1];
            break;
          }
          return c || $.parseOldChannel(param) || '未知频道';
        case 'string':
          for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
            a = list[_j];
            if (!(a[1] === param)) {
              continue;
            }
            c = a[0];
            break;
          }
          return c || $.parseOldChannel(param) || 1;
        default:
          return '未知频道';
      }
    };

    $.parseChannel.list = [[1, '动画'], [106, '动画短片'], [107, 'MAD·AMV'], [108, 'MMD·3D'], [133, '2.5次元'], [67, '新番连载'], [120, '国产动画'], [109, '旧番补档'], [159, '动画资讯'], [58, '音乐'], [136, '原创·翻唱'], [137, '演奏'], [103, 'Vocaloid'], [138, '日系音乐'], [139, '综合音乐'], [140, '演唱会'], [123, '舞蹈'], [134, '宅舞'], [135, '综合舞蹈'], [59, '游戏'], [83, '游戏集锦'], [145, '电子竞技'], [84, '主机单机'], [85, '英雄联盟'], [165, '桌游卡牌'], [72, 'Mugen'], [60, '娱乐'], [86, '生活娱乐'], [87, '鬼畜调教'], [88, '萌宠'], [89, '美食'], [98, '综艺'], [70, '科技'], [147, 'SF'], [148, '黑科技'], [91, '数码'], [149, '广告'], [150, '白科技'], [151, '自我发电'], [90, '科学技术'], [122, '汽车'], [69, '体育'], [152, '综合体育'], [94, '足球'], [95, '篮球'], [153, '搏击'], [154, '11区体育'], [93, '惊奇体育'], [68, '影视'], [96, '电影'], [162, '日剧'], [163, '美剧'], [141, '国产剧'], [121, '网络剧'], [142, '韩剧'], [99, '布袋·特摄'], [100, '纪录片'], [143, '其他'], [97, '剧集'], [110, '文章'], [110, '文章综合'], [73, '工作·情感'], [74, '动漫文化'], [75, '漫画·小说'], [164, '游戏'], [76, '页游资料'], [77, '1区'], [78, '21区'], [79, '31区'], [80, '41区'], [81, '文章里区(不审)'], [82, '视频里区(不审)'], [42, '图库'], [125, '鱼塘'], [92, '军事'], [131, '历史'], [132, '焦点'], [124, '彼女'], [127, '造型'], [128, '西皮'], [129, '爱豆'], [130, '其他']];

    $.parsePost = function(param) {
      var a, arr, b, fs, func, k, len1, len2, len3, list, mails, o, q, r, ref;
      func = {
        name: '$.parsePost()',
        text: ''
      };
      if (param) {
        switch ($.type(param)) {
          case 'string':
          case 'number':
            func.text = param;
            break;
          default:
            console.log("[" + func.name + "]#7");
        }
      }
      if ((ref = func.text) != null ? ref.length : void 0) {
        func.text = '[mimiko]' + func.text.replace(/<span\sstyle="text\-decoration\:underline;">([\s\S]+?)<\/span>/g, '[u]$1[/u]').replace(/<span\sstyle="text\-decoration:line\-through;">([\s\S]+?)<\/span>/g, '[s]$1[/s]').replace(/<img[^>]*?src="[^>]*?\/um?editor\/dialogs\/emotion\/images\/(\w+?)\/(\d+?)\.gif".*?>/g, '[emot=$1,$2/]');
        mails = func.text.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g);
        if (mails != null ? mails.length : void 0) {
          func.text = func.text.replace(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g, '[mimiko-mail-mark]');
        }
        if (window.html2ubb) {
          func.text = window.html2ubb(func.text);
        }
        func.text = func.text.replace(/<br\s?\/?>/g, '').replace(/(http:\/\/.*?\.(?:jpg|jpeg|png|gif))(?!\[)/g, '[img]$1[/img]').replace(/\[url\](.*?\.(?:jpg|jpeg|png|gif))\[\/url\]/g, '[img]$1[/img]').replace(/\[url\]\[img\](.*?)\[\/img\]\[\/url\]/g, '[img]$1[/img]').replace(/@([^\s<>\[\]\(\)\{\}]{2,20})/g, '[at]$1[/at]').replace(/\[ac(\d+?)\]/g, '[ac=$1]ac$1[/ac]').replace(/([^\w=\[\]\/])ac(\d+)/g, '$1[ac=$2]ac$2[/ac]').replace(/\[aa(\d+?)\]/g, '[aa=$1]aa$1[/aa]').replace(/([^\w=\[\]\/])aa(\d+)/g, '$1[aa=$2]aa$2[/aa]').replace(/\[ab(\d+?)\]/g, '[ab=$1]ab$1[/ab]').replace(/([^\w=\[\]\/])ab(\d+)/g, '$1[ab=$2]ab$2[/ab]').replace(/\[mimiko\]/g, '');
        if (mails != null ? mails.length : void 0) {
          for (k = 0, len1 = mails.length; k < len1; k++) {
            a = mails[k];
            func.text = func.text.replace(/\[mimiko\-mail\-mark\]/, '[email]' + a + '[/email]');
          }
        }
        fs = func.text.match(/\[size.*?\]/g);
        if (fs != null ? fs.length : void 0) {
          func.text = func.text.replace(/\[size.*?\]/g, '[mimiko-fontsize-mark]');
          list = [10, 12, 16, 18, 24, 32, 48];
          for (o = 0, len2 = fs.length; o < len2; o++) {
            a = fs[o];
            b = a.match(/\d+/)[0] | 0;
            if ($.inArray(b, list) < 0) {
              a = '[size=14px]';
            }
            func.text = func.text.replace(/\[mimiko\-fontsize\-mark\]/, a);
          }
        }
      }
      func.text = func.text.replace(/\[img\].+\/um?editor\/dialogs\/emotion\/images\/(\w+?)\/(\d+?)\.gif\[\/img\]/g, '[emot=$1,$2/]');
      list = ['b', 'i', 'u', 's', 'color'];
      for (q = 0, len3 = list.length; q < len3; q++) {
        a = list[q];
        r = new RegExp('\\[' + a, 'ig');
        arr = func.text.match(r);
        if (arr != null ? arr.length : void 0) {
          r = new RegExp('\\[\\/' + a, 'ig');
          b = func.text.match(r);
          if (!b || arr.length !== b.length) {
            func.text = func.text.replace(/\[.*?\]/g, '');
          }
        }
      }
      if (func.text.search(/\[[^\]]+\[/) >= 0 || func.text.search(/\][^\[]+\]/) >= 0) {
        $.info.error("[" + func.name + "]#7");
        func.text = func.text.replace(/\[.*?\]/g, '');
      }
      return $.trim(func.text);
    };

    $.setHash = function(param) {
      var h, hash;
      hash = $.extend($.hash(), param);
      h = ($.param(hash)).replace(/(?:&=)||(?:=&)/g, '').replace(/&/g, ';');
      return window.location.hash = h ? '#' + h : '';
    };

    $.parseGet = function(param) {
      var func;
      func = {
        name: '$.parseGet()'
      };
      if (param) {
        switch ($.type(param)) {
          case 'string':
            func.text = param;
            break;
          case 'object':
            $.extend(func, param);
            func.name = '$.parseGet()';
        }
        func.text = func.text.search(/(?:\[[^\]]*?\[)|(?:\][^\[]*?\])/) === -1 ? func.text : func.text.replace(/\[.*?\]/g, '').replace(/\[|\]/g, '');
        func.text = func.text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;/g, '\'').replace(/(&quot;|&#34;)/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/<br\s?\/?>/g, '').replace(/((\s|&nbsp;)*\r?\n){3,}/g, "\r\n\r\n").replace(/^((\s|&nbsp;)*\r?\n)+/g, "").replace(/((\s|&nbsp;)*\r?\n)+$/g, "");
        if (window.ubb2html) {
          func.text = window.ubb2html(func.text);
          func.text = func.text.replace(/\[p\]/g, '<p>').replace(/\[\/p\]/g, '</p>');
        } else {
          func.text = $.parseSafe(func.text);
        }
        func.text = func.text.replace(/\[ac\=(\S+?)\](\S+?)\[\/ac\]/g, '<a class="ac title btn" data-aid="$1" href="/v/ac$1" target="_blank"><i class="icon icon-play-circle"></i>$2</a>').replace(/\[aa\=(\S+?)\](\S+?)\[\/aa\]/g, '<a class="aa btn" href="/a/aa$1" target="_blank" title="该链接通向AcFun合辑"><i class="icon icon-list"></i>$2</a>').replace(/\[sm\=(\S+?)\](\S+?)\[\/sm\]/g, '<a class="sm btn" href="http://www.nicovideo.jp/watch/sm$1" target="_blank" title="该链接通向ニコニコ动画"><i class="icon icon-film"></i>$2</a>').replace(/\[email\](\S+?)\[\/email\]/g, '<a class="email btn" href="mailto:$1" target="_blank" title="点击以发送邮件"><i class="icon icon-envelope"></i>$1</a>').replace(/\[wiki\=(\S+?)\](\S+?)\[\/wiki\]/g, '<a class="wiki btn" href="http://wiki.acfun.cn/index.php/$1" target="_blank" title="该链接通向AC百科"><i class="icon icon-tag"></i>$2</a>').replace(/\[emot\=(\S+?)\,(\S+?)\/\]/g, '<img class="emotion" src="' + globalConfig.oldPath + '/umeditor/dialogs/emotion/images/$1/$2.gif">');
        if (!func.showImage) {
          func.text = func.text.replace(/\[img\](\S+?)\[\/img\]/g, '<a class="btn-img" href="$1" target="_blank" title="点击以浏览图像"><img src="$1" class="_icon-picture-o"/></a>').replace(/\[img\=(\S+?)\](\S+?)\[\/img\]/g, function(text, g1, g2) {
            var p1, p2;
            p1 = g2.replace(/javascript(:|\s+:)/gi, '');
            if (p1.match(/.*(acfun.tv|acfun.cn|tudou.acfun.com)/)) {
              p2 = '';
            } else {
              p2 = p1;
            }
            return '<a class="btn-img" href="' + p2 + '" target="_blank" title="点击以浏览图像"><img src="' + p2 + '" class="_icon-picture-o"/></a>';
          });
        } else {
          func.text = func.text.replace(/\[img\](\S+?)\[\/img\]/g, '<a class="thumb" href="$1" target="_blank" title="点击以浏览图像"><img class="preview" src="$1"></a>').replace(/\[img\=(\S+?)\](\S+?)\[\/img\]/g, function(text, g1, g2) {
            var p1, p2;
            p1 = g2.replace(/javascript(:|\s+:)/gi, '');
            if (p1.match(/.*(acfun.tv|acfun.cn|tudou.acfun.com)/)) {
              p2 = '';
            } else {
              p2 = p1;
            }
            return '<a class="thumb" href="' + p2 + '" target="_blank" title="' + g1 + '"><img class="preview" src="' + p2 + '"></a>';
          });
        }
        func.text = func.text.replace(/\[at\]([\s\S]+?)\[\/at\]/g, '<a class="name" target="_blank" href="/member/findUser.aspx?userName=$1">@$1</a>').replace(/\[\/?back.*?\]/g, '').replace(/\[username\]([\s\S]+?)\[\/username\]/g, '<a  class="name" target="_blank" href="/member/findUser.aspx?userName=$1">$1</a>').replace(/\[.*?\]/g, '').replace(/([\s\W\_])[o|O][n|N]\w+?\s*?\=/g, '$1data-event=');
        $.trim(func.text);
        return func.text = func.text.replace(/&amp;/g, '&').replace(/&#91;/g, '[').replace(/&#93;/g, ']');
      } else {
        return '';
      }
    };
    $.followUser = function(param, callback) {
      var func, _ref;
      func = {
        name: '$.followUser()',
        callback: callback
      };
      if ((param != null) && $.type(param) === 'object') {
        $.extend(func, param);
        func.name = '$.followUser()';
        if ($.user.uid) {
          if ((_ref = system.port.followUser) != null) {
            _ref.abort();
          }
          return system.port.followUser = $.post('/api/friend.aspx?name=follow', {
            username: func.username,
            userId: func.uid,
            groupId: 0
          }).done(function(data) {
            var text, _ref1, _ref2;
            if (data.success) {
              text = '关注' + (func.username ? '[' + func.username + ']' : '用户') + '成功。';
              $.info.success(text);
              if ((_ref1 = func.singer) != null) {
                _ref1.info(text);
              }
              return typeof func.callback === "function" ? func.callback() : void 0;
            } else {
              text = '' + data.result;
              $.info.warning(text);
              return (_ref2 = func.singer) != null ? _ref2.info(text) : void 0;
            }
          }).fail(function() {
            var text, _ref1;
            text = '关注' + (func.username ? '[' + func.username + ']' : '用户') + '失败。请于稍后重试。';
            $.info.error(text);
            return (_ref1 = func.singer) != null ? _ref1.info(text) : void 0;
          });
        }
      }
    };

    $.fn.readyPager = function(param, callback) {
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
        return this.each(function() {
          var area;
          area = $(this);
          area.delegate('span.pager-old:not(.active)', 'click', function() {
            return func.callback($(this).data().page);
          });
          if (func.addon) {
            return area.delegate('input.ipt-pager-old', 'focus', function() {
              return $(this).select();
            }).delegate('input.ipt-pager-old', 'keyup', function() {
              var ipt, len, width;
              ipt = $(this);
              len = $.trim(ipt.val()).length;
              width = len ? 32 + (len - 1) * 8 : 32;
              width = (width > 240 ? 240 : void 0) - 6;
              return ipt.css({
                width: width
              });
            }).delegate('input.ipt-pager-old', 'keydown', function(e) {
              var btn, ipt;
              ipt = $(this);
              btn = ipt.siblings('button.btn-pager-old').eq(0);
              if (e.which === 13) {
                return btn.click();
              } else if ($.inArray(e.which, [8, 35, 36, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]) === -1) {
                return false;
              }
            }).delegate('button.btn-pager-old', 'click', function() {
              var btn, ipt, m, n, ref, ref1;
              btn = $(this);
              ipt = btn.siblings('input.ipt-pager-old').eq(0);
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
        $.info.warning("[" + func.name + "]#3");
        return $();
      }
    };

    $.fn.scrollOnto = function(time, callback) {
      if (time == null) {
        time = 500;
      }
      return this.eq(0).each(function() {
        var top;
        top = $(this).offset().top - 64;
        return $('body, html').stop().animate({
          scrollTop: top
        }, time, function() {
          return typeof callback === "function" ? callback() : void 0;
        });
      });
    };

    $.fn.unfold = function(param, callback) {
      var func;
      func = {
        name: '$.fn.unfold()',
        token: 'mimiko',
        callback: callback
      };
      if (param) {
        switch ($.type(param)) {
          case 'string':
            func.id = "@" + param;
            break;
          case 'object':
            $.extend(func, param);
            func.name = '$.fn.unfold()';
            break;
          default:
            $.info.warning("[" + func.name + "]#6");
        }
      }
      if (this.length) {
        if (this.length === 1) {
          return this.each(function() {
            var src, win;
            func.singer = $(this);
            if (func.left == null) {
              func.left = func.singer.offset().left;
            }
            if (func.top == null) {
              func.top = func.singer.offset().top + 32;
            }
            if (func.id.slice(0, 1) === '@') {
              switch (func.id) {
                case '@follow':
                  $.extend(func, {
                    id: 'win-follow',
                    title: '关注',
                    width: 480,
                    height: 'auto',
                    src: 'win-follow',
                    curtain: true
                  });
                  win = $('#' + func.id);
                  if (win.length) {
                    return win.shut(function() {
                      return $.unfold(func);
                    });
                  } else {
                    return $.unfold(func);
                  }
                  break;
                case '@img':
                  src = func.singer.data().src || func.singer.attr('src') || func.singer.attr('href');
                  if ((src.search('baidu\.com')) !== -1) {
                    window.open('https://ssl.acfun.tv/block-image-baidu.html?src=' + src);
                    return;
                  }
                  $.extend(func, {
                    id: 'win-image',
                    icon: 'picture-o',
                    title: '图像',
                    width: 'auto',
                    height: 'auto',
                    src: 'win-image',
                    curtain: true,
                    draggable: false,
                    start: function() {
                      win = $('#' + func.id);
                      return win.data().src = src;
                    }
                  });
                  win = $('#' + func.id);
                  if (win.length) {
                    return win.shut(function() {
                      return $.unfold(func);
                    });
                  } else {
                    return $.unfold(func);
                  }
                  break;
                case '@login':
                  $.extend(func, {
                    id: 'win-login',
                    title: '登录/注册',
                    width: 560,
                    height: 240,
                    src: 'win-login-index',
                    curtain: true,
                    draggable: false
                  });
                  win = $('#' + func.id);
                  if (win.length) {
                    return win.shut(function() {
                      return $.unfold(func);
                    });
                  } else {
                    return $.unfold(func);
                  }
                  break;
                case '@mail':
                  return window.open('/member/#area=mail-new;username=' + (func.singer.data().name || ''));
                case '@qrcode':
                  $.extend(func, {
                    id: 'win-qrcode',
                    icon: 'qrcode',
                    title: '二维码',
                    width: 256,
                    height: 256,
                    src: 'win-qrcode',
                    curtain: true,
                    draggable: false,
                    start: function() {
                      win = $('#' + func.id);
                      return win.data().src = func.singer.data().src || func.singer.attr('href') || func.singer.attr('src');
                    }
                  });
                  win = $('#' + func.id);
                  if (win.length) {
                    return win.shut(function() {
                      return $.unfold(func);
                    });
                  } else {
                    return $.unfold(func);
                  }
                  break;
                case '@reg':
                  $.extend(func, {
                    id: 'win-reg',
                    icon: 'user',
                    title: '注册',
                    width: 400,
                    height: 'auto',
                    src: 'win-reg',
                    curtain: true
                  });
                  win = $('#' + func.id);
                  if (win.length) {
                    return win.shut(function() {
                      return $.unfold(func);
                    });
                  } else {
                    return $.unfold(func);
                  }
              }
            } else {
              return $.unfold(func);
            }
          });
        } else {
          return $.info.warning("[" + func.name + "]#4");
        }
      } else {
        return $.info.warning("[" + func.name + "]#3");
      }
    };

    $.fn.info = function(param, callback) {
      var a, func, p;
      func = {
        name: '$.fn.info()',
        id: 'win-hint',
        type: 'default',
        direction: 'auto',
        text: null,
        cooldown: 5e3,
        fadeout: 5e3,
        callback: callback
      };
      func.text = (function() {
        switch ($.type(p = param)) {
          case 'string':
            if ((p.search('::')) === -1) {
              return $.trim(p);
            } else {
              a = p.split('::');
              func.type = a[0];
              return a[1];
            }
            break;
          case 'object':
            $.extend(func, p);
            func.name = '$.fn.info()';
            if (func.text && (func.text.search('::')) !== -1) {
              a = func.text.split('::');
              func.type = a[0];
              return a[1];
            } else {
              return func.text;
            }
            break;
          case 'function':
            func.callback = p;
            return null;
          default:
            $.info.error("[" + func.name + "]#6");
            return null;
        }
      })();
      return this.each(function() {
        var cs, fix, getX, getY, left, mainer, o, obj, r, s, tail, top, w, win;
        obj = $(this);
        if (func.text == null) {
          func.text = (function() {
            var title;
            title = obj.attr('title');
            if (title) {
              obj.data({
                title: title
              }).removeAttr('title');
              return title != null ? title : null;
            } else {
              return obj.data().title || null;
            }
          })();
        }
        if (func.text) {
          if ((func.text.substr(func.text.length - 1)) === '。') {
            func.text = func.text.substr(0, func.text.length - 1);
          }
          if (func.id === 'win-hint') {
            clearTimeout(system.timer.hintFadeOut);
            win = $('#win-hint');
            if (!win.hasClass('win-hint')) {
              win.addClass('win-hint');
            }
            win.removeClass('error success info debug warning');
          } else {
            win = $('#' + func.id);
            if (!win.length) {
              $('#area-window').append('<div id="' + func.id + '" class="win win-hint"><div class="mainer"></div><div class="tail"></div></div>');
              win = $('#' + func.id);
            }
          }
          mainer = win.children('div.mainer');
          tail = win.children('div.tail');
          win.addClass(func.type);
          func.text = func.text.replace(/&#13;?/, '\n').replace(/\<br\s*?\/?\>/g, '\n').replace(/\<[\s\S]*?\>/g, '');
          mainer.html(($.parseSafe($.trim(func.text))).replace(/\n/g, '<br />'));
          s = {
            w: win.width(),
            h: win.height()
          };
          o = {
            l: obj.offset().left,
            t: obj.offset().top,
            w: obj.innerWidth(),
            h: obj.height()
          };
          w = (function(e) {
            return {
              w: e.innerWidth(),
              h: e.innerHeight(),
              t: e.scrollTop()
            };
          })($(window));
          getY = function() {
            if (o.t - s.h - 32 > w.t) {
              return [o.t - s.h - 8, 'top', -4];
            } else {
              return [o.t + o.h + 8, 'bottom', 4];
            }
          };
          getX = function() {
            if (o.l + s.w < w.w - 16) {
              return [o.l + o.w + 16, 'right', 4];
            } else {
              return [o.l - s.w - 16, 'left', -4];
            }
          };
          cs = 'left right top bottom';
          switch (func.direction) {
            case 'x':
              r = getX();
              left = r[0];
              top = o.t;
              fix = [r[2], 0];
              tail.removeClass(cs).addClass(r[1]);
              break;
            case 'y':
              r = getY();
              left = o.l;
              top = r[0];
              fix = [0, r[2]];
              tail.removeClass(cs).addClass(r[1]);
              break;
            case 'left':
              left = o.l - s.w - 16;
              top = o.t;
              fix = [-4, 0];
              tail.removeClass(cs).addClass(func.direction);
              break;
            case 'right':
              left = o.l + o.w + 16;
              top = o.t;
              fix = [4, 0];
              tail.removeClass(cs).addClass(func.direction);
              break;
            case 'top':
              left = o.l;
              top = o.t - s.h - 8;
              fix = [0, -4];
              tail.removeClass(cs).addClass(func.direction);
              break;
            case 'bottom':
              left = o.l;
              top = o.t + o.h + 8;
              fix = [0, 4];
              tail.removeClass(cs).addClass(func.direction);
              break;
            default:
              r = getY();
              left = o.l;
              top = r[0];
              fix = [0, r[2]];
              tail.removeClass(cs).addClass(r[1]);
          }
          return win.stop(false, true).css({
            left: left,
            top: top,
            opacity: 0,
            display: 'block'
          }).transition({
            left: left + fix[0],
            top: top + fix[1],
            opacity: 1
          }, 200, function() {
            if (func.fadeout > 0) {
              if (func.id === 'win-hint') {
                clearTimeout(system.timer.hintFadeOut);
                system.timer.hintFadeOut = setTimeout(function() {
                  return win.click();
                }, func.fadeout);
              } else {
                setTimeout(function() {
                  return win.click();
                }, func.fadeout);
              }
            }
            return typeof func.callback === "function" ? func.callback() : void 0;
          });
        } else {
          return $.info.error("[" + func.name + "]#5");
        }
      });
    };

    $.curtain = function(param, callback) {
      var e;
      if (param) {
        if (!$('#curtain').length) {
          $$('body').append('<div id="curtain">&nbsp;</div>');
        }
        $$()['#curtain'] = $('#curtain');
        if (window.Worker) {
          return $$('#curtain').transition({
            opacity: 0
          }, 0).transition({
            opacity: 1
          }, 250, function() {
            return typeof callback === "function" ? callback() : void 0;
          });
        } else {
          return typeof callback === "function" ? callback() : void 0;
        }
      } else {
        e = $$('#curtain');
        if (window.Worker) {
          return e.stop(false, true).transition({
            opacity: 0
          }, 250, function() {
            e.remove();
            return typeof callback === "function" ? callback() : void 0;
          });
        } else {
          e.remove();
          return typeof callback === "function" ? callback() : void 0;
        }
      }
    };

    $.fn.ensure = function(param) {
      var func;
      func = $.extend({}, param);
      func.name = '$.fn.ensure()';
      func.singer = this.eq(0);
      $.ensure(func);
      return func.singer;
    };

    $.ensure = function(param, callback) {
      var area, func, html, left, top, win, _ref;
      func = {
        name: '$.ensure()',
        callback: callback
      };
      if (param) {
        switch ($.type(param)) {
          case 'function':
            func.callback = param;
            break;
          case 'object':
            $.extend(func, param);
            func.name = '$.ensure()';
            break;
          default:
            $.info.warning("[" + func.name + "]#6");
        }
        if (func.singer == null) {
          func.singer = func.obj;
        }
        if (func.text == null) {
          func.text = '若确信继续当前操作，请点击 <a onclick="$(\'#btn-ok-ensure\').click();">[确定]</a> 按钮，反之则请点击 <a onclick="$(\'#btn-cancel-ensure\').click();">[取消]</a> 按钮。';
        }
        if (func.callback != null) {
          area = $('#area-window');
          $('#win-ensure').remove();
          html = '<div id="win-ensure" class="win"> <button id="btn-ok-ensure" class="btn danger"><i class="icon icon-check-circle"></i>确定</button> <button id="btn-cancel-ensure" class="btn primary"><i class="icon icon-times-circle"></i>取消</button> </div>';
          area.append(html);
          win = $('#win-ensure');
          if ((_ref = func.singer) != null ? _ref.length : void 0) {
            left = func.singer.offset().left + func.singer.width() * 0.5 - win.width() * 0.5;
            top = func.singer.offset().top + func.singer.height() * 0.5 - win.height() * 0.5;
            win.css({
              left: left,
              top: top + 16,
              opacity: 0
            }).stop().transition({
              top: top,
              opacity: 1
            }, 500, function() {
              return win.info({
                type: 'warning',
                text: func.text,
                fadeout: 0,
                id: 'win-hint-ensure'
              });
            });
          } else {
            $$('#stage').one('click', function(e) {
              left = e.pageX - win.width() * 0.5;
              top = e.pageY - win.height() * 0.5;
              return win.css({
                left: left,
                top: top + 16,
                opacity: 0
              }).stop().transition({
                top: top,
                opacity: 1
              }, 500, function() {
                $.info.warning('' + func.text);
                return win.info({
                  type: 'warning',
                  text: func.text,
                  fadeout: 0,
                  id: 'win-hint-ensure'
                });
              });
            });
          }
          if (func.curtain) {
            $.curtain(true, function() {
              return $$('#curtain').one('click', function() {
                $('#win-hint-ensure').click();
                $.curtain(false);
                return win.shut();
              });
            });
          }
          return setTimeout(function() {
            $('#btn-ok-ensure').one('click', function() {
              $('#win-hint-ensure').click();
              win.shut();
              if (typeof func.callback === "function") {
                func.callback();
              }
              if (func.curtain) {
                return $.curtain(false);
              }
            });
            return $('#btn-cancel-ensure').one('click', function() {
              $('#win-hint-ensure').click();
              win.shut();
              if (func.curtain) {
                return $.curtain(false);
              }
            });
          }, 500);
        } else {
          return $.info.error("[" + func.name + "]#5");
        }
      } else {
        return $.info.error("[" + func.name + "]#5");
      }
    };
    $.fn.shut = function(callback) {
      var func;
      func = {
        name: '$.fn.shut()',
        callback: callback
      };
      return this.each(function() {
        var win;
        win = $(this).closest('div.win');
        if (win.length) {
          clearTimeout(system.timer.winHint);
          $('#win-hint').click();
          return win.stop().transition({
            top: win.offset().top + 16,
            opacity: 0
          }, 500, function() {
            win.remove();
            return typeof func.callback === "function" ? func.callback() : void 0;
          });
        } else {
          return $.info.warning("[" + func.name + "]#3");
        }
      });
    };

    $.unfold = function(param, callback) {
      var area, func, h, height, hfix, hint, html, l, left, mainer, nl, nt, shadow, src, t, temp, top, w, wfix, width, win;
      func = {
        name: '$.unfold()',
        id: 'win-unexisted',
        "class": '',
        curtain: true,
        draggable: true,
        icon: 'globe',
        title: '窗体',
        left: 64,
        top: 64,
        width: 320,
        height: 160,
        src: '',
        callback: callback
      };
      area = $('#area-window');
      if (param) {
        switch ($.type(param)) {
          case 'string':
            if (param.search(/\@/) !== -1) {
              func.id = '@' + $.trim(param).replace(/\@/g, '');
            } else {
              $.info.warning("[" + func.name + "]#6");
            }
            break;
          case 'object':
            $.extend(func, param);
            func.name = '$.unfold()';
            break;
          default:
            $.info.warning("[" + func.name + "]#6");
        }
      } else {
        $.info.warning("[" + func.name + "]#5");
      }
      if (func.id.length) {
        win = $('#' + func.id);
        if (win.length) {
          return win.shut(function() {
            return $.unfold(param, callback);
          });
        } else {
          temp = '<div id="[id]" class="win [type]"> <div class="block-title"> <p class="title"><i class="icon icon-[icon]"></i>[title]</p> <div class="area-tool"> <div class="close" onclick="$(this).shut($.curtain(false));" title="点击关闭窗体"><i class="icon icon-times"></i></div> </div> <span class="clearfix"></span> </div> <div class="mainer"> <div class="hint-window">少女祈祷中...</div> </div> </div>';
          html = $.parseTemp(temp, {
            id: func.id,
            type: func['class'] || func.type || '',
            icon: func.icon,
            title: func.title
          });
          area.append(html);
          win = $('#' + func.id);
          mainer = win.children("div.mainer").eq(0);
          hint = mainer.children("div.hint-window").eq(0);
          left = func.left;
          top = func.top;
          width = func.width;
          height = func.height;
          w = {
            w: $(window).innerWidth(),
            h: $(window).innerHeight(),
            t: $(window).scrollTop()
          };
          if (left < 32) {
            left = 32;
          }
          if (left + width > w.w - 32) {
            left = w.w - 32 - width;
          }
          if (top < 32) {
            top = 32;
          }
          if (top + height > w.t + w.h - 32) {
            top = w.t + w.h - 32 - height;
          }
          shadow = $('#ACFlashPlayer-re');
          if (shadow.length) {
            l = shadow.offset().left;
            t = shadow.offset().top;
            w = shadow.width();
            h = shadow.height();
            if (!(left > l + w || top > t + h || left + width < l || top + height < t)) {
              win.data().scrollOnto = 1;
              nl = l;
              nt = top;
              if (left > l + w * 0.5 && l + w + 16 + width < $(window).innerWidth()) {
                nl = l + w + 16;
              } else if (l - width - 16 > 0) {
                nl = l - width - 16;
              } else {
                nt = t + h + 16;
              }
              left = nl;
              top = nt;
            }
          }
          mainer.css({
            width: width,
            height: height
          });
          hint.css({
            width: width,
            height: height,
            'line-height': height + 'px'
          });
          if (func.src.length) {
            src = func.src.search(/http\:\/\//) === -1 ? '/dotnet/date/html/' + func.src + '.html' : func.src;
            src += $.addVersion();
            $.get(src).done(function(data) {
              var base, ref;
              if (data != null ? data.length : void 0) {
                if (typeof func.start === "function") {
                  func.start();
                }
                mainer.html(data);
                setTimeout(function() {
                  if (!shadow.length && win.offset().top + win.height() > w.t + w.h - 48) {
                    if (!func.curtain) {
                      return win.scrollOnto(200);
                    } else {
                      return win.stop().transition({
                        top: w.t + 48,
                        opacity: 1
                      }, 500);
                    }
                  }
                }, 500);
                return typeof (base = (ref = func.callback) != null ? ref : func.finish) === "function" ? base() : void 0;
              } else {
                $.info.error('返回数据错误。请于稍后重试。');
                return mainer.html('<p class="alert alert-danger">返回数据错误。请于稍后重试。</p>');
              }
            }).fail(function() {
              $.info.error('同服务器通信失败。请于稍后重试。');
              return mainer.html('<p class="alert alert-danger">同服务器通信失败。请于稍后重试。</p>');
            });
          }
          wfix = !$.browser.rgba ? 2 : 0;
          hfix = 36;
          if (func.type === 'simple') {
            hfix = 0;
          }
          win.css({
            left: left,
            top: top + 16,
            width: mainer.width() + wfix + parseInt(mainer.css('padding-left')) + parseInt(mainer.css('padding-right')),
            opacity: 0,
            display: 'block'
          }).stop().transition({
            opacity: 0
          }, 0, function() {
            if (!func.src.length) {
              if (typeof func.callback === "function") {
                func.callback();
              }
            }
            if (func.curtain) {
              return $.curtain(true, function() {
                var btnClose;
                btnClose = win.find('div.close').eq(0);
                $('#curtain').off('click').one('click', function() {
                  return btnClose.click();
                });
                return btnClose.click(function() {
                  return $.curtain(false);
                });
              });
            }
          }).transition({
            top: top,
            opacity: 1
          }, 500, function() {
            if (win.data().scrollOnto) {
              return win.scrollOnto(200);
            }
          }).click(function() {
            if (!win.hasClass('active')) {
              $('#area-window>div.active').removeClass('active');
              return win.addClass('active');
            }
          }).click();
          if (func.draggable && !win.hasClass('.fixed')) {
            return win.draggable({
              handle: 'div.block-title',
              cancel: 'div.area-tool',
              containment: '#stage',
              snap: false,
              opacity: 0.8,
              start: function() {
                $('#area-window').find('div.win-hint').click();
                return $(this).stop().click();
              },
              stop: function() {
                left = $(this).offset().left;
                top = $(this).offset().top;
                width = $(this).width();
                height = $(this).height();
                if (top < 48) {
                  top = 48;
                  return $(this).stop().transition({
                    top: top
                  }, 500);
                } else if (shadow.length) {
                  l = shadow.offset().left;
                  t = shadow.offset().top;
                  w = shadow.width();
                  h = shadow.height();
                  if (!(left > l + w || top > t + h || left + width < l || top + height < t)) {
                    nl = l;
                    nt = top;
                    if (left > l + w * 0.5 && l + w + 16 + width < $(window).innerWidth()) {
                      nl = l + w + 16;
                    } else if (l - width - 16 > 0) {
                      nl = l - width - 16;
                    } else {
                      nt = t + h + 16;
                    }
                    return $(this).stop().transition({
                      left: nl,
                      top: nt
                    }, 500);
                  }
                }
              }
            });
          }
        }
      }
    };

    system.ver = '0.3.21';
    system.st = $.now();

    system.handle = {
      comm: {
        list: {
          url: '/comment_list_json.aspx',
          id: 'contentId',
          pageNo: 'currentPage'
        },
        send: {
          url: '/comment.aspx',
          content: 'text',
          id: 'contentId'
        },
        "delete": {
          url: '/admin/comment_delete.aspx',
          id: 'contentId'
        }
      }
    };

    system.port = {};

    system.post = {};
    system.path = {
      short: globalConfig.oldPath
    }
    system.timer = {}
    system.func = system.func || {}
    system.func.showCard = function(obj, func) {
      clearTimeout(system.timer.winHint);
      return system.timer.winHint = setTimeout(function() {
        var aid, inner, left, name, o, top, uid, url, win, _ref, _ref1;
        win = func.win;
        inner = func.mainer;
        o = obj.offset();
        switch (func.direction) {
          case 'left':
            left = o.left - win.width() - 24;
            top = o.top;
            break;
          case 'right':
            left = o.left + obj.width() + 8;
            top = o.top;
            break;
          case 'top':
            left = o.left;
            top = o.top - win.height();
            break;
          case 'bottom':
            left = o.left;
            top = o.top + obj.height();
            break;
          default:
            if (o.top + win.height() > $(window).scrollTop() + $(window).innerHeight() - 32) {
              left = o.left;
              top = o.top - win.height();
            } else {
              left = o.left;
              top = o.top + obj.height();
            }
            if (left + win.width() > $(window).innerWidth() - 16) {
              left = $(window).innerWidth() - 16 - win.width();
            }
        }
        if (obj.hasClass('name') || obj.hasClass('avatar')) {
          name = obj.data().name || obj.text();
          uid = obj.data().uid;
          if ($.user.uid && name !== $.user.name && uid !== $.user.uid) {
            if (name.slice(0, 1) === '@') {
              name = name.slice(1);
            }
            inner.html('<div class="hint-info">少女祈祷中...</div>');
            win.css({
              left: left - 16,
              top: top,
              opacity: 0,
              display: 'block'
            }).stop(true, false).transition({
              opacity: 1,
              left: left + 16
            }, 200);
            url = uid ? '/usercard.aspx?uid=' + uid : name ? '/usercard.aspx?username=' + encodeURIComponent(name) : '';
            if ((_ref = system.port.getUserInfo) != null) {
              _ref.abort();
            }
            return system.port.getUserInfo = $.get(url).done(function(data) {
              var a, html, temp;
              if (data.success) {
                a = data.userjson;
                temp = '<div class="l"> <a target="_blank" href="/member/user.aspx?uid=[uid]" class="thumb"> <img class="avatar" [avatar]> </a> </div> <div class="r"> <a title="注册于 [regTime] (Uid:[uid])&#13;最后登录于 [lastTime]" target="_blank" href="/member/user.aspx?uid=[uid]" class="name">[name]<span class="gender">([gender])</span></a> <p class="location">[from]</p> <p class="sign">[sign]</p> </div> <span class="clearfix"></span> <div class="area-info"> <a target="_blank" href="/u/[uid].aspx#area=following">关注</a>：<span class="pts">[followings]</span>[spx] <a target="_blank" href="/u/[uid].aspx#area=followers">听众</a>：<span class="pts">[followeds]</span>[spx] <a target="_blank" href="/u/[uid].aspx#area=post-history">投稿</a><span class="pts">：[posts]</span> </div> <div class="area-tool"> <a id="mail-user-info" href="[mailto]" target="_blank" title="私信"><i class="icon icon-envelope"></i></a> <a id="follow-user-info" title="关注"><i class="icon icon-plus-circle"></i></a> <span class="clearfix"></span> </div>';
                html = $.parseTemp(temp, {
                  uid: a.uid || 4,
                  avatar: 'src="' + $.parseSafe(a.avatar) + '"',
                  regTime: a.regTime ? $.parseTime(a.regTime) : '未知时间',
                  lastTime: a.lastLoginDate ? $.parseTime(a.lastLoginDate) : '未知时间',
                  name: $.parseSafe(a.name),
                  gender: (function() {
                    switch (a.gender | 0) {
                      case 0:
                        return '♀';
                      case 1:
                        return '♂';
                      default:
                        return '?';
                    }
                  })(),
                  from: '来自' + (a.comeFrom ? $.parseSafe(a.comeFrom.replace(/[\s\,]/g, '')) : ' ' + a.lastLoginIp),
                  sign: a.sign ? $.parseSafe(a.sign) : '这个人很懒，神马都没有写…',
                  followings: $.parsePts(a.follows),
                  followeds: $.parsePts(a.fans),
                  posts: $.parsePts(a.posts),
                  mailto: '/member/#area=mail-new;username=' + encodeURIComponent(a.name),
                  spx: '&nbsp;&nbsp;/&nbsp;&nbsp;'
                });
                return inner.removeClass('card-video').css({
                  opacity: 0
                }).stop().transition({
                  opacity: 0
                }, 0, function() {
                  inner.html(html);
                  $('#mail-user-info').click(function(e) {
                    var btn, text;
                    btn = $(this);
                    if (!$.user.uid) {
                      e.preventDefault();
                      text = '您尚未登录。请先行登录。';
                      $.info.warning(text);
                      btn.info(text);
                      if (!$('#win-login').length) {
                        return btn.unfold('login');
                      }
                    }
                  });
                  $('#follow-user-info').click(function() {
                    var btn, text;
                    btn = $(this);
                    if (!btn.hasClass('active')) {
                      if ($.user.uid) {
                        return $.followUser({
                          singer: btn,
                          uid: a.uid,
                          username: a.name,
                          callback: function() {
                            html = '<i class="icon icon-star"></i>已关注';
                            return btn.html(html);
                          }
                        });
                      } else {
                        text = '您尚未登录。请先行登录。';
                        $.info.warning(text);
                        btn.info(text);
                        return btn.unfold('login');
                      }
                    } else {
                      text = '您已关注该用户。';
                      $.info.warning(text);
                      return btn.info(text);
                    }
                  });
                  return typeof func.callback === "function" ? func.callback() : void 0;
                }).delay(50).transition({
                  opacity: 1
                }, 200);
              } else {
                $.info.error('该用户不存在或尚不可用。');
                return inner.html('<div class="hint-info">不存在的用户。</div>');
              }
            }).fail(function() {
              $.info.error('获取用户信息失败。请稍后重试。');
              return inner.html('<div class="hint-info">网络连接超时。</div>');
            });
          }
        } else if (obj.hasClass('title') || obj.hasClass('preview') || obj.hasClass('unit')) {
          aid = obj.is('[data-aid]') ? obj.data().aid : obj.closest('div.unit, span.unit, a.unit, li.unit').data().aid;
          win.css({
            left: left,
            top: top,
            opacity: 0,
            display: 'block'
          }).stop(true, false).transition({
            opacity: 1
          }, 200);
          if ((_ref1 = system.port.getVideoInfo) != null) {
            _ref1.abort();
          }
          return system.port.getVideoInfo = $.get('/videoinfo.aspx?aid=' + aid).done(function(data) {
            var a, html, temp;
            if (data.success) {
              a = data.contentjson;
              temp = '<div class="a"> <div class="l"> <a class="thumb" href="/v/ac[aid]" target="_blank"> <img class="preview" [preview]> </a> </div> <div class="r"> <a class="title" href="/v/ac[aid]" title="[title]" target="_blank">[title]</a> <p class="desc" title="[desc]">[desc]</p> </div><span class="clearfix"></span> </div> <div class="b"> <a class="name" href="/member/user.aspx?uid=[uid]" target="_blank" title="[name]"><i class="icon icon-user"></i>[name]</a> <p class="time"><i class="icon icon-clock-o"></i><span class="pts">[pubTime]</span></p> <div class="c"> <span class="views pts" title="点击数：[views]"><i class="icon icon-play-circle"></i>[views]</span>[spx] <span class="comments pts" title="评论数：[comms]"><i class="icon icon-comment"></i>[comms]</span>[spx] <span class="favors pts" title="收藏数：[favors]"><i class="icon icon-star"></i>[favors]</span> </div> <a class="channel" href="/v/list[cid]/index.htm" target="_blank">[channel]</a> </div>';
              html = $.parseTemp(temp, {
                uid: a.authorId || 4,
                aid: aid || 41,
                cid: $.parseChannel(a.channel),
                preview: 'src="' + $.parseSafe(a.preview) + '"',
                pubTime: a.date ? $.parseTime(a.date) : '未知时间',
                name: $.parseSafe(a.author),
                title: $.parseSafe(a.title),
                desc: a.desc ? $.parseSafe(a.desc) : '该视频暂无简介。',
                channel: $.parseSafe(a.channel),
                views: $.parsePts(a.views),
                comms: $.parsePts(a.comments),
                favors: $.parsePts(a.stows),
                mailto: '/member/#area=mail-new;username=' + encodeURI($.parseSafe(a.name)),
                spx: '&nbsp;&nbsp;'
              });
              return inner.addClass('card-video').stop().transition({
                opacity: 0
              }, 0, function() {
                return inner.html(html);
              }).delay(50).transition({
                opacity: 1
              }, 200);
            } else {
              $.info.error('该视频不存在或尚不可用。');
              return inner.html('<div class="hint-info">不存在的视频。</div>');
            }
          }).fail(function() {
            $.info.error('获取视频信息失败。请稍后重试。');
            return inner.html('<div class="hint-info">网络连接超时。</div>');
          });
        } else {
          return $.info.warning("[" + func.name + "]无法识别的非法参数。");
        }
      }, 400);
    };

    var winInfoTimeOut = $$('#win-info').data().timer;
    $$('#win-info').on('mouseenter', function() {
      return clearTimeout(winInfoTimeOut);
    }).on('mouseleave', function() {
      clearTimeout(winInfoTimeOut);
      return winInfoTimeOut = setTimeout(function() {
        return $$('#win-info').css({
          display: 'none'
        });
      }, 200);
    });

    $$('#area-window').delegate('div.win-hint', 'click', function() {
      var win;
      win = $(this);
      return win.stop(false, true).transition({
        opacity: 0
      }, 200, function() {
        win.css({
          display: 'none'
        });
        if (!win.is('#win-hint')) {
          return win.remove();
        }
      });
    });

    if ($$('#area-comment').length) {
      $commentAble = $('#comment_able');
      commentAbleValue = $commentAble.val();
      if ($commentAble.length && commentAbleValue === "2") {
        $('#area-comment').find(' > .mainer').text('现在不能进行评论了，你懂的~');
        $('#btn-refresh').hide();
      } else {
        $$('#area-comment').data({
          func: {
            ready: function(aid, callback) {
              var area, comm, f, func, html;
              system.post.aid = aid;
              func = {
                name: 'comm.ready()',
                callback: callback
              };
              area = $$('#area-comment');
              comm = area.data();
              f = comm.func;
              comm.sendCommAllowed = 1;
              html = '<div class="banner"> <i class="icon _icon-commentLeft"></i> <p class="tab _fixed">评论区</p> <p class="comment_pts_num">0</p> <p class="tab more"> <button id="btn-refresh" class="btn primary" onclick="$$(\'#area-comment\').data().func.refreshComm();"><i class="icon _icon-refresh"></i>刷新评论</button> <button id="btn-fastreply" class="btn primary hidden"><i class="icon _icon-comment"></i>发表评论</button> </p> </div> <div id="area-comment-inner"> <div class="btn-load"><img src="' + globalConfig.oldPath + '/project/lite/style/image/loading.gif" /></div> <button id="btn-showComm" class="btn info">显示评论</button> </div>';
              area.after('<div id="area-editor"></div>').html(html);
              $$('#area-comment-inner').readyPager({
                addon: true,
                callback: function(n) {
                  $$('#item-editor-shadow').click();
                  f.showComm([system.post.aid, n]);
                  return area.scrollOnto(0);
                }
              });
              $$('#area-comment-inner').delegate('div.content-comment>a.btn-img', 'click', function(e) {
                e.preventDefault();
                return $(this).unfold('img');
              }).delegate('div.content-comment', 'dblclick', function(e) {
                var objNext;
                e.preventDefault();
                objNext = $(this).next();
                if (objNext.length) {
                  return objNext.find('a.btn-quote:last').click();
                } else {
                  return $(this).prev().find('a.btn-quote:last').click();
                }
              }).delegate('div.author-comment', 'dblclick', function(e) {
                e.preventDefault();
                return $(this).find('a.btn-quote:last').click();
              });
              $$('#btn-showComm').one('click', function() {
                f.showComm([system.post.aid, 1]);
                if (commentAbleValue === "0" || !commentAbleValue) {
                  setTimeout(function() {
                    f.readyEditor();
                    return $('a.btn-quote').removeClass('hidden');
                  }, 1e3);
                }
                if (commentAbleValue === "1") {
                  return $('#btn-refresh').removeClass('hidden');
                }
              });
              var config = JSON.parse(localStorage.getItem("config"))
              if ((config && config.comment && config.comment.autoShowCommentAllowed) || (!config || !config.comment)) {
                $$('#btn-showComm').click()
              } else {
                $$('#btn-showComm').css('display','block')
              }
              return typeof func.callback === "function" ? func.callback() : void 0;
            },
            readyEditor: function(callback) {
              var f, func, html, temp;
              func = {
                name: 'comm.readyEditor()',
                token: 'mimiko'
              };
              f = $$('#area-comment').data().func;
              if ($.user.uid) {
                if (level > 0) {
                  temp = '<div id="area-editor-inner" class="form"> <script type="text/plain" id="editor" style="width:100%"></script> <div id="block-tool-editor"><div class="captcha-block hidden"><div class="captcha-body"><input type="text" class="captcha-ipt" placeholder="请输入验证码" style="width:120px;height:26px"/><img width="90" height="28" class="captcha-img" style="position:relative;top:1px;margin-right:5px;cursor:pointer"/><span class="captcha-next" style="color:#409CD7;cursor:pointer">换一张</span></div><p class="captcha-hint" style="padding:6px 0 4px 3px">请输入验证码完成评论</p></div><div class="l"> <button id="btn-send-editor" class="btn success do"><i class="icon icon-check-circle"></i>发送评论</button> </div> <div class="r"> <button id="btn-quote-return" class="btn danger hidden" onclick="$(\'#item-editor-shadow\').click();"><i class="icon icon-times-circle-o"></i>取消</button> </div> <span class="clearfix"></span> </div> </div> <div id="item-editor-shadow" class="hidden">编辑器正处于[快速回复]或[引用发言]状态，点击以恢复正常状态。</div> <span class="clearfix"></span>';
                  $$('#area-editor').html(temp);
                  $('.captcha-img, .captcha-next').on('click', function () {
                    $(".captcha-img").attr("src", "/comment/captcha.svl" + "?random=" + new Date().getTime())
                  })
                  $$('#quick-comment-fixed').show();
                  $$('#btn-send-editor').on('click', function() {
                    var _self, bananaLeft, obj;
                    if (userGroupLevel < 1) {
                      bananaLeft = ($$(window).width() - 550) / 2;
                      _self = $(this);
                      $(this).unfold({
                        src: '../project/sanae/html/warning',
                        id: 'win-banana',
                        icon: 'warning',
                        title: "",
                        width: 528,
                        height: 177,
                        left: bananaLeft,
                        top: ($$(window).height() - 348) / 2.5 + $$(window).scrollTop(),
                        curtain: true,
                        callback: function() {
                          var btn, win;
                          win = $('#win-banana');
                          win.css({
                            left: bananaLeft
                          });
                          win.find('.pp .h').html('您的账号权限不能评论，你可以通过');
                          win.find('.pp a').html('游戏答题');
                          win.find('.pp .f').html('激活。');
                          btn = win.find('.btn');
                          btn.html('答题激活');
                          return btn.attr({
                            href: '/'
                          }).on('click', function(e) {
                            var src;
                            e.preventDefault();
                            src = '../html/pop';
                            src = src.search(/http\:\/\//) === -1 ? '/dotnet/date/html/' + src + '.html' : src;
                            src += $.salt();
                            return $.get(src).done(function(data) {
                              win.find('.close').click();
                              return $('#mainer').append('<div>' + data + '</div>');
                            }).fail(function() {
                              return $.info.error('通信失败！');
                            });
                          });
                        }
                      });
                      return;
                    }
                    obj = {
                      quoteId: $$('#btn-send-editor').data('qid'),
                      quoteName: $$('#btn-send-editor').data('qname'),
                      text: $$().ue.getContent()
                    };
                    return f.sendComm(obj);
                  });
                  $.require('editor', function() {
                    var ue;
                    $.extend(window.UMEDITOR_CONFIG, {
                      toolbar: ['bold italic underline strikethrough | forecolor fontsize | emotion image '],
                      autoFloatEnabled: false,
                      funcCtrlEnter: function() {
                        return $$('#btn-send-editor').click();
                      }
                    });
                    ue = $$().ue = UM.getEditor('editor', {
                      filterRules: (function() {
                        return {
                          span: function(node) {
                            if (/Wingdings|Symbol/.test(node.getStyle("font-family"))) {
                              true;
                            } else {
                              node.parentNode.removeChild(node, true);
                            }
                          },
                          p: function(node) {
                            var listTag;
                            listTag = void 0;
                            if (node.getAttr("class") === "MsoListParagraph") {
                              listTag = "MsoListParagraph";
                            }
                            node.setAttr();
                            if (listTag) {
                              node.setAttr("class", "MsoListParagraph");
                            }
                            if (!node.firstChild()) {
                              node.innerHTML((UM.browser.ie ? "&nbsp;" : "<br>"));
                            }
                          },
                          div: function(node) {
                            var p, tmpNode;
                            tmpNode = void 0;
                            p = UM.uNode.createElement("p");
                            while (tmpNode = node.firstChild()) {
                              if (tmpNode.type === "text" || !UM.dom.dtd.$block[tmpNode.tagName]) {
                                p.appendChild(tmpNode);
                              } else {
                                if (p.firstChild()) {
                                  node.parentNode.insertBefore(p, node);
                                  p = UM.uNode.createElement("p");
                                } else {
                                  node.parentNode.insertBefore(tmpNode, node);
                                }
                              }
                            }
                            if (p.firstChild()) {
                              node.parentNode.insertBefore(p, node);
                            }
                            node.parentNode.removeChild(node);
                          },
                          br: {
                            $: {}
                          },
                          ol: {
                            $: {}
                          },
                          ul: {
                            $: {}
                          },
                          dl: function(node) {
                            node.tagName = "ul";
                            node.setAttr();
                          },
                          dt: function(node) {
                            node.tagName = "li";
                            node.setAttr();
                          },
                          dd: function(node) {
                            node.tagName = "li";
                            node.setAttr();
                          },
                          li: function(node) {
                            var className, tmpNodes;
                            className = node.getAttr("class");
                            if (!className || !/list\-/.test(className)) {
                              node.setAttr();
                            }
                            tmpNodes = node.getNodesByTagName("ol ul");
                            UM.utils.each(tmpNodes, function(n) {
                              node.parentNode.insertAfter(n, node);
                            });
                          },
                          table: function(node) {
                            var val;
                            UM.utils.each(node.getNodesByTagName("table"), function(t) {
                              UM.utils.each(t.getNodesByTagName("tr"), function(tr) {
                                var child, html, p;
                                p = UM.uNode.createElement("p");
                                child = void 0;
                                html = [];
                                while (child = tr.firstChild()) {
                                  html.push(child.innerHTML());
                                  tr.removeChild(child);
                                }
                                p.innerHTML(html.join("&nbsp;&nbsp;"));
                                t.parentNode.insertBefore(p, t);
                              });
                              t.parentNode.removeChild(t);
                            });
                            val = node.getAttr("width");
                            node.setAttr();
                            if (val) {
                              node.setAttr("width", val);
                            }
                          },
                          tbody: {
                            $: {}
                          },
                          caption: {
                            $: {}
                          },
                          th: {
                            $: {}
                          },
                          td: {
                            $: {
                              valign: 1,
                              align: 1,
                              rowspan: 1,
                              colspan: 1,
                              width: 1,
                              height: 1
                            }
                          },
                          tr: {
                            $: {}
                          },
                          h3: {
                            $: {}
                          },
                          h2: {
                            $: {}
                          },
                          "-": "script style meta iframe embed object"
                        };
                      })()
                    });
                    return ue.ready(function() {
                      var btn, editor;
                      btn = $$('#btn-send-editor');
                      editor = $$('#editor');
                      $$('#item-editor-shadow').click(function() {
                        $(this).addClass('hidden');
                        $$('#area-editor-inner').css({
                          position: 'relative',
                          left: 0,
                          top: 0
                        }).data({
                          lastQuote: null
                        });
                        $$('#btn-send-editor').data({
                          qid: 0,
                          qname: ''
                        });
                        $$('#editor').css({
                          width: '100%'
                        });
                        $$('#btn-quote-return').addClass('hidden');
                        $('#area-quoter-space').remove();
                        $$('#item-editor-shadow-top').addClass('hidden');
                        return $$('#btn-fastreply').removeClass('active');
                      });
                      (function() {
                        var html, mainer;
                        mainer = $$('#area-comment-inner');
                        btn = $$('#btn-fastreply');
                        html = '<div id="item-editor-shadow-top" class="block hidden"></div>';
                        mainer.before(html);
                        return btn.click(function() {
                          var shadow, target;
                          editor = $$('#editor');
                          target = $$('#area-editor');
                          shadow = $$('#item-editor-shadow-top');
                          if (!$$('#item-editor-shadow').is(':visible') || !btn.hasClass('active')) {
                            $$('#item-editor-shadow').click();
                            $$('#btn-quote-return, #item-editor-shadow').removeClass('hidden');
                            var fixNum = $('.captcha-block').hasClass('hidden') ? 0 : 44
                            shadow.removeClass('hidden').css({
                              height: editor.height() + 98 + fixNum
                            });
                            editor.css({
                              width: shadow.width() - 16
                            });
                            $$('#area-editor-inner').css({
                              display: 'block',
                              position: 'absolute',
                              left: mainer.offset().left - target.offset().left + 8,
                              top: mainer.offset().top - target.offset().top - shadow.height(),
                              opacity: 0
                            }).transition({
                              opacity: 1
                            }, 200, function() {
                              return ue.focus();
                            });
                            return btn.addClass('active');
                          } else {
                            return $$('#item-editor-shadow').click();
                          }
                        }).removeClass('hidden');
                      })();
                      return console.log('[' + func.name + ']编辑器加载完成。');
                    });
                  });
                } else {
                  if (level == -100) {
                    html = '<p class="alert warning">查询等级失败，请稍候刷新页面再试。</p>';
                  } else {
                    html = '<p class="alert warning">您的等级不足[1]级，暂时无权发送评论。<a href="/info/#page=limit" target="_blank">[详细]</a><a href="'+globalConfig.rootDomain+'/member/#area=splash;answer=true" target="_blank" class="answer-positive">[答题转正]</a></p>';
                  }
                  $$('#area-comment-inner').prepend(html).append(html);
                }
              } else {
                html = '<p class="alert warning">您尚未登录，请先行<a href="' + globalConfig.rootDomain + '/login/?returnUrl='+location.href+'">[登录/注册]</a>。</p>';
                $$('#area-comment-inner').prepend(html).append(html);
              }
              return typeof callback === "function" ? callback() : void 0;
            },
            showComm: function(param, callback) {
              var area, func, inner, obj, ref;
              func = {
                name: 'comm.showComm()',
                elem: param.elem,
                cid: param[0],
                page: param[1],
                layer: param[2],
                cooldown: 1e3,
                limit: 10
              };
              area = $$('#area-comment');
              inner = $$('#area-comment-inner');
              if (!area.data().loading) {
                if (globalConfig.debug) {
                  func.st = $.now();
                }
                area.data().loading = 1;
                setTimeout(function() {
                  return area.data().loading = 0;
                }, func.cooldown);
                obj = {isNeedAllCount: true};
                obj[system.handle.comm.list.id] = func.cid;
                if (func.page) {
                  obj[system.handle.comm.list.pageNo] = func.page
                }
                if (func.layer) {
                  obj.layer = func.layer
                }
                if ((ref = area.data().port) != null) {
                  ref.abort();
                }
                return area.data().port = $.get(system.handle.comm.list.url, obj).done(function(data) {
                  var $personalEmail, avatar, avatarBg, base, breakFloorBtn, breakFloorText, cA, cC, cCid, cDivider, cHide, cHtml, classDown, classDownQuote, comm, commIndex, dHtml, html, htmlDown, i, isBlock, j, k, len1, n, o, page, pre, q, quoted, ref1, ref2, ref3, text, tool;
                  if (data.data) {
                    data = data.data;
                    if (!(parseInt($('.comment_pts_num').text()) > 0)) {
                      if (data.allCount) {
                        $('.comment_pts_num').text(data.allCount + '条评论');
                        $('.comment_pts_num2').text(data.allCount + '条评论');
                        $("#to-comm .pts").text(data.allCount);
                      } else if (data.commentList[0]) {
                        var comCount = data.commentContentArr["c"+data.commentList[0]].count
                        $('.comment_pts_num').text(comCount + '条评论');
                        $('.comment_pts_num2').text(comCount + '条评论');
                        $("#to-comm .pts").text(comCount);
                      }
                    }
                  }
                  pre = "$$(\'#area-comment\').data().func.";
                  tool = (base = $$()).tool != null ? base.tool : base.tool = (function() {
                    var arr;
                    arr = ['<span class="area-tool-comment tool_">', '<a class="btn-quote" onclick="' + pre + 'quoteComm($(this));">引用 |</a>', '<a class="btn-delete" onclick="' + pre + 'deleteComm($(this));"> 删除 |</a>', '<a class="btn-report" onclick="' + pre + 'reportComm($(this));"> 举报 |</a>'];
                    return [arr.join(''), '', arr[0] + arr[1] + arr[3], arr.join('')][$.user.group];
                  })();
                  if (!data.commentList.length) {
                    text = '目前尚未有评论。';
                    html = '<span class="alert info">' + text + '</span>';
                    $.info.show('' + text);
                    inner.html(html);
                  } else {
                    page = $.makePagerOld({
                      num: data.page,
                      count: data.totalCount,
                      size: data.pageSize,
                      long: 5,
                      addon: true
                    });
                    quoted = [];
                    html = "";
                    ref1 = data.commentList;
                    for (k = 0, len1 = ref1.length; k < len1; k++) {
                      i = ref1[k];
                      comm = data.commentContentArr['c' + i];
                      commIndex = [comm.cid];
                      quoted.push(comm.cid);
                      cC = comm;
                      for (j = o = 0; o < 1024; j = ++o) {
                        if (cC && cC.quoteId && data.commentContentArr['c' + cC.quoteId]) {
                          if (!(ref2 = cC.quoteId, indexOf.call(quoted, ref2) >= 0)) {
                            commIndex.push(cC.quoteId);
                            quoted.push(cC.quoteId);
                            cC = data.commentContentArr['c' + cC.quoteId];
                          } else {
                            commIndex.push('fin');
                            break;
                          }
                        } else {
                          break;
                        }
                      }
                      cHtml = '';
                      dHtml = '';
                      if (indexOf.call(commIndex, 'fin') >= 0) {
                        cHide = '';
                        commIndex.pop();
                        cHide = '<span class="item-quote-hidden" data-qid="' + commIndex[commIndex.length - 1] + '">重复引用已隐藏[点击展开]</span>';
                        cDivider = '';
                      } else {
                        cHide = '';
                        cDivider = (commIndex.length === 1 ? '' : '<div class="item-comment-divider"></div>');
                      }
                      avatar = '<img class="avatar" src="' + (comm.userImg || globalConfig.oldPath + '/style/image/avatar.jpg') + '" data-name="' + comm.userName + '">';
                      avatarBg = '<img class="avatar-bg" src="' + (globalConfig.oldPath + '/style/image/avatar-bg.png') + '">';
                      cCid = [];
                      breakFloorBtn = '';
                      breakFloorText = '砍楼';
                      for (n = q = ref3 = commIndex.length - 1; q >= 0; n = q += -1) {
                        classDown = classDownQuote = '';
                        htmlDown = '';
                        cA = data.commentContentArr['c' + commIndex[n]];
                        cA.userName = $.parseSafe(cA.userName);
                        cCid.push(cA.cid);
                        isBlock = '';
                        $personalEmail = '';

                        var verified = '';
                        switch (cA.verified) {
                          case 0:
                            verified = ''
                            break;
                          case 1:
                            verified = '<span class="verified-ico verified-1" title="AcFun管理员"></span>'
                            break;
                          case 2:
                            verified = '<span class="verified-ico verified-2" title="AcFun官方认证"></span>'
                            break;
                          case 3:
                            verified = '<span class="verified-ico verified-3" title="AcFun认证"></span>'
                            break;
                          default:
                            verified = ''
                            break;
                        }

                        // 用户头像挂件
                        switch(cA.avatarFrame){
                          case 1:
                          case 14:
                            avatarBg = '<img class="avatar-bg" src="' + (globalConfig.oldPath + '/style/image/avatar-bg.png') + '">';
                            break;
                          case 11:
                            avatarBg = '<img class="avatar-bg-a" src="' + (globalConfig.oldPath + '/style/image/pumpkin.png') + '">';
                            break;
                          case 12:
                            avatarBg = '<img class="avatar-bg-a" src="' + (globalConfig.oldPath + '/style/image/zombie.png') + '">';
                            break;
                          case 13:
                            avatarBg = '<img class="avatar-bg-a" src="' + (globalConfig.oldPath + '/style/image/ghost.png') + '">';
                            break;
                          case 15:
                            avatarBg = '<img class="avatar-bg-b" src="' + (system.path.short + '/style/image/t-15.png') + '">';
                            break;
                          case 16:
                            avatarBg = '<img class="avatar-bg-c" src="' + (system.path.short + '/style/image/t-16.png') + '">';
                            break;
                          case 17:
                            avatarBg = '<img class="avatar-bg-d" src="' + (system.path.short + '/style/image/christmas.png') + '">';
                            break;
                          case 18:
                            avatarBg = '<img class="avatar-bg-sp2017" src="' + (system.path.short + '/style/image/avatar-bg-sp2017.png') + '">';
                            break;
                          case 21:
                            avatarBg = '<img class="avatar-bg-cw2017" src="' + (system.path.short + '/style/image/avatar-bg-cw2017.png') + '">';
                            break;
                        }

                        // 用户名颜色
                        switch(cA.nameRed) {
                          case 10:
                          case 1:
                            color = 'nameRed'
                            break;
                          case 9:
                            color = 'nameOrange'
                            break;
                          case 8:
                            color = 'namePurple'
                        }

                        var jianzheng = '';
                        if (cA.nameType && cA.nameType === 1) {
                          jianzheng = '<span class="sp2017-juexingjianzheng" >AC娘觉醒见证者</span>'

                        }

                        if (tool !== '') {
                          $personalEmail = '<a href="/member/#area=mail-new;username=' + cA.userName + '"> 私信</a>';
                        }
                        if (parseInt(cA.downs) >= 10) {
                          classDown = 'item-comment-closed';
                          classDownQuote = 'item-comment-closed-quote';
                          htmlDown = '<p class="item-down-hidden">#' + cA.count + ' 因过多举报已自动隐藏 [点击展开]</p>';
                        }
                        if (n === 0) {
                          cHtml = cDivider + cHide + dHtml + cHtml + '<div '+ (cA.isUpDelete==true ? ' style="opacity:.5;"' : '') + ' id="c-' + cA.cid + '" class="item-comment ' + classDown + ' ' + ' item-comment-first " data-fullcid="' + cCid.join() + '" data-qid="' + cA.quoteId + '" data-layer="' + cA.count + '"> <div class="area-comment-left"> <a class="thumb" target="_blank" href="' + globalConfig.rootDomain + '/u/' + cA.userID + '.aspx#home">' + avatar + (cA.avatarFrame !== 0 ? avatarBg : '') + '</a> </div> <div class="area-comment-right"> <div class="author-comment last" data-uid="' + cA.userID + '"> <span class="index-comment">#' + cA.count + ' </span> <a class="name ' + (cA.nameRed !== 0 ? color : '') + '" data-uid="' + cA.userID + '" target="_blank" href="' + globalConfig.rootDomain + '/u/' + cA.userID + '.aspx#home">' + cA.userName + '</a>' + verified + jianzheng +' <span class="time_">发表于 ' + cA.postDate + '</span><p class="floor-comment">' + (commIndex.length - n) + '</p> </div> <div class="content-comment">' + $.parseGet(cA.content) + '</div><div '+ (cA.isUpDelete==true ? ' style="visibility:hidden;"' : '') + ' class="author-comment last"'+ (cA.isDelete==true ? ' style="visibility:hidden;"' : '') + '>' + tool + $personalEmail + '</span></div>' + htmlDown + '</div>' + breakFloorBtn + '</div>';
                        } else if (n < func.limit) {
                          if (n === commIndex.length - 1 && $.user.group === 0) {
                            breakFloorBtn = '<a class="break-floor danger btn" onclick="' + pre + 'breakFloor($(this));"><i class="icon icon-power-off"></i>' + breakFloorText + '</a>';
                          }
                          cHtml = '<div id="c-' + cA.cid + '" class="item-comment ' + classDownQuote + ' item-comment-quote" data-qid="' + cA.quoteId + '">' + cHtml + '<div '+ (cA.isUpDelete==true ? ' style="opacity:.5;"' : '') + ' class="author-comment top"><span class="index-comment" title="">#' + cA.count + ' </span> <a class="name " data-uid="' + cA.userID + '" target="_blank" href="' + globalConfig.rootDomain + '/u/' + cA.userID + '.aspx#home">' + cA.userName + '</a>' + verified  +'<span class="time_">' + (commIndex.length - n) + '</span></div> <div '+ (cA.isUpDelete==true ? ' style="opacity:.5;"' : '') + ' class="content-comment">' + $.parseGet(cA.content) + '</div>' + htmlDown + '<div '+ (cA.isUpDelete==true ? ' style="visibility:hidden;"' : '') + ' class="author-comment" data-uid="' + cA.userID + '"'+ (cA.isDelete==true ? ' style="visibility:hidden;"' : '') + '>' + tool + $personalEmail + '</span><p class="floor-comment"></p> </div> </div>';
                        } else {
                          if (n === commIndex.length - 1 && $.user.group === 0) {
                            breakFloorBtn = '<a class="break-floor danger btn" onclick="' + pre + 'breakFloor($(this));"><i class="icon icon-power-off"></i>岭上开花</a>';
                          }
                          cHtml += '<div id="c-' + cA.cid + '" class="item-comment ' + classDownQuote + ' item-comment-quote item-comment-quote-simple" data-qid="' + cA.quoteId + '"> <div '+ (cA.isUpDelete==true ? ' style="opacity:.5;"' : '') + ' class="author-comment top"><span class="index-comment" title="">#' + cA.count + ' </span> <a class="name " data-uid="' + cA.userID + '" target="_blank" href="' + globalConfig.rootDomain + '/u/' + cA.userID + '.aspx#home">' + cA.userName + '</a>' + verified  + '<span class="time_">' + (commIndex.length - n) + '</span></div> <div '+ (cA.isUpDelete==true ? ' style="opacity:.5;"' : '') + ' class="content-comment">' + $.parseGet(cA.content) + '</div>' + htmlDown + '<div '+ (cA.isUpDelete==true ? ' style="visibility:hidden;"' : '') + ' class="author-comment" data-uid="' + cA.userID + '"'+ (cA.isDelete==true ? ' style="visibility:hidden;"' : '') + '>' + tool + $personalEmail + '</span><p class="floor-comment"></p> </div> </div>';
                        }
                      }
                      html += cHtml;
                    }
                    $$('#area-comment-inner').on('click', 'p.item-down-hidden', function() {
                      var btn, item;
                      btn = $(this);
                      item = btn.closest('div.item-comment');
                      if (item.hasClass('item-comment-closed')) {
                        return item.removeClass('item-comment-closed');
                      } else if (item.hasClass('item-comment-closed-quote')) {
                        return item.removeClass('item-comment-closed-quote');
                      }
                    });
                    inner.html(page + html + page).find('span.item-quote-hidden').on('click', function() {
                      var lastQid, qid, u;
                      obj = $(this);
                      qid = $(obj).data().qid;
                      comm = data.commentContentArr['c' + qid];
                      commIndex = [qid];
                      cC = comm;
                      for (j = u = 0; u < 1024; j = ++u) {
                        if (cC && cC.quoteId && data.commentContentArr['c' + cC.quoteId]) {
                          commIndex.push(cC.quoteId);
                          quoted.push(cC.quoteId);
                          cC = data.commentContentArr['c' + cC.quoteId];
                        } else {
                          commIndex.reverse();
                          break;
                        }
                      }
                      cHtml = '';
                      for (n in commIndex) {
                        classDown = classDownQuote = '';
                        htmlDown = '';
                        cA = data.commentContentArr['c' + commIndex[n]];
                        cA.userName = $.parseSafe(cA.userName);
                        var verified = '';
                        switch (cA.verified) {
                          case 0:
                            verified = ''
                            break;
                          case 1:
                            verified = '<span class="verified-ico verified-1" title="AcFun管理员"></span>'
                            break;
                          case 2:
                            verified = '<span class="verified-ico verified-2" title="AcFun官方认证"></span>'
                            break;
                          case 3:
                            verified = '<span class="verified-ico verified-3" title="AcFun认证"></span>'
                            break;
                          default:
                            verified = ''
                            break;
                        }
                        if (parseInt(cA.downs) >= 10) {
                          classDown = 'item-comment-closed';
                          classDownQuote = 'item-comment-closed-quote';
                          htmlDown = '<p class="item-down-hidden">#' + cA.count + ' 因过多举报已自动隐藏 [点击展开]</p>';
                        }
                        if (parseInt(n) === commIndex.length - 1) {

                        } else if (n >= commIndex.length - func.limit) {
                          cHtml = '<div id="c-' + cA.cid + '" class="item-comment ' + classDownQuote + ' item-comment-quote" data-qid="' + cA.quoteId + '">' + cHtml + '<div class="author-comment top"><span class="index-comment" title="">#' + cA.count + ' </span> <a class="name " data-uid="' + cA.userID + '" target="_blank" href="' + globalConfig.rootDomain + '/u/' + cA.userID + '.aspx#home\">' + cA.userName + '</a>' + verified + '<span class="time_">' + (parseInt(n) + 1) + '</span></div> <div class="content-comment">' + $.parseGet(cA.content) + '</div>' + htmlDown + '<div class="author-comment"></span><p class="floor-comment"></p> </div> </div>';
                        } else {
                          cHtml += '<div id="c-' + cA.cid + '" class="item-comment ' + classDownQuote + ' item-comment-quote item-comment-quote-simple" data-qid="' + cA.quoteId + '"> <div class="author-comment top"><span class="index-comment" title="">#' + cA.count + ' </span> <a class="name " data-uid="' + cA.userID + '" target="_blank" href="' + globalConfig.rootDomain + '/u/' + cA.userID + '.aspx#home\">' + cA.userName + '</a>' + verified + '<span class="time_">' + (parseInt(n) + 1) + '</span></div> <div class="content-comment">' + $.parseGet(cA.content) + '</div>' + htmlDown + '<div class="author-comment"></span><p class="floor-comment"></p> </div> </div>';
                        }
                      }
                      obj.css({
                        cursor: 'auto'
                      }).html(cHtml);
                      obj.find('a.name, a.ac').card();
                      lastQid = $$('#area-editor-inner').data().lastQuote;
                      if (lastQid) {
                        return $('#' + lastQid).find('.btn-quote').click();
                      }
                    });
                    inner.find('a.name, a.ac').card();
                    console.log('评论载入完成于' + ($.now() - func.st) + 'ms。');
                    if (commentAbleValue === "0" || !commentAbleValue) {
                      $('a.btn-quote').removeClass('hidden');
                    }
                    (function() {
                      var elem;
                      return elem = $$('#area-comment').find('.opencHtml').on('click', function() {
                        $('#hide' + this.id).hide();
                        return $('#c-' + this.id).show();
                      });
                    })();
                  }
                  (function() {
                    var getLayer;
                    if ($.hash().layer) {
                      if ($.hash().layer > 0) {
                        if (hasNoLayer) {
                          area.data().loading = 0;
                          hasNoLayer = false;
                          $$('#area-comment').data().func.showComm([system.post.aid, null, parseInt($.hash().layer)]);
                          return
                        }
                        getLayer = function() {
                          var a, layer, layers, ref4, scrollOnto;
                          layer = $.hash().layer | 0;
                          layers = $$('#area-comment-inner').children('div.item-comment[data-layer]');
                          a = layers.eq(0).data().layer | 0;
                          scrollOnto = function(p) {
                            var brick, u;
                            obj = layers.filter('[data-layer="' + p + '"]');
                            if (obj.length) {
                              $.info.show('已跳转至楼层[#' + p + ']。');
                              obj.scrollOnto(0).stop();
                              for (brick = u = 0; u <= 2; brick = ++u) {
                                obj.transition({
                                  opacity: 0
                                }, 500).transition({
                                  opacity: 1
                                }, 500);
                              }
                            } else {
                              $.info.error('所查找的楼层[#' + p + ']定位失败。<br>这通常是由于评论区内部分楼层被删除所导致。');
                              area.scrollOnto(0);
                            }
                            return $.setHash({
                              layer: null
                            });
                          };
                          return scrollOnto($.hash().layer);
                        };
                        return setTimeout(getLayer, 500);
                      } else {
                        return $.setHash({
                          layer: null
                        });
                      }
                    }
                  })();
                  return typeof callback === "function" ? callback() : void 0;
                }).fail(function() {
                  $.info.warning('获取评论信息失败。请点击[刷新评论]按钮重试。');
                  return inner.html('<p class="alert alert-error">获取评论信息失败。请点击<a onclick="$$(\'#area-comment\').data().func.refreshComm();">[这里]</a>重试。</p>');
                });
              } else {
                return $.info.warning("正处于评论获取不应期。");
              }
            },
            sendComm: function(param, callback) {
              var btn, f, form, func, ref, ue;
              func = {
                name: 'sendComm()',
                token: 'mimiko',
                quoteId: 0,
                text: '',
                mentionList: [],
                topicList: [],
                cooldown: 1e4,
                source: 'pc'
              };
              func[system.handle.comm.send.id] = system.post.aid;
              if (!$('.captcha-block').hasClass('hidden')) {
                func.captcha = $('.captcha-ipt').val()
              }
              form = $$('#area-editor-inner');
              btn = $$('#btn-send-editor');
              ue = $$().ue;
              f = $$('#area-comment').data().func;
              if (param) {
                if ($.type(param) === 'string' && param.length) {
                  func.text = $.trim(param);
                } else if ($.type(param) === 'object') {
                  $.extend(func, param);
                } else {
                  $.info.warning("[" + func.name + "]#6");
                }
              } else {
                $.info.warning("[" + func.name + "]#5");
              }
              if (func.text.length) {
                func.text = func.text.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
                func.text = $.parsePost(func.text);
                if (func.text.search(/\[at\][^\s]+?\[\/at\]/) !== -1) {
                  func.mentionList = $.unique(func.text.match(/\[at\][^\s]+?\[\/at\]/g));
                  func.mentionList = func.mentionList.join('|').replace(/\[at\]|\[\/at\]/g, '').split('|');
                }
                if (func.qname && func.qname !== $.user.name) {
                  func.mentionList.push(func.qname);
                }
              }
              if (func.mentionList.length > 5) {
                $.info.warning('召唤人数超出上限。召唤人数应不多于5人。');
                return func.mentionList.splice(5);
              } else if ($.trim(func.text.replace(/\[.*?\]/g, '').replace(/\<.*?\>/g, '').replace(/[\s\n\r]/g, '').replace(/\&\w+?\;/g, '')).length < 5) {
                return $.info.warning('回复长度过短。回复字数应不少于5个字符。');
              } else {
                if ($$('#area-comment').data().sendCommAllowed !== 1) {
                  return $.info.warning('评论技能冷却中。');
                } else if (!($('.captcha-block').hasClass('hidden')||$('.captcha-ipt').val())) {
                  $('.captcha-hint').text('请正确输入验证码').css({color:'#E74C3C'})
                } else {
                  $$('#area-comment').data().sendCommAllowed = 0;
                  btn.addClass('disabled');
                  if ((ref = system.port.postComm) != null) {
                    ref.abort();
                  }
                  $.info.show('回复发送中...');
                  if (system.handle.comm.send.content !== 'text') {
                    func[system.handle.comm.send.content] = func.text;
                    func.text = '';
                  }
                  return system.port.postComm = $.post(system.handle.comm.send.url, $.param(func, true).toString().replace(/\[\]/g, '')).done(function(data) {
                    if (data.success || data.status === 200) {
                      $.info.success('回复发送成功。');
                      window.setTimeout(function() {
                        if (data.captcha) {
                          $(".captcha-block").removeClass('hidden')
                          $('.captcha-hint').text('请输入验证码完成评论').css({color:'#999'})
                          $(".captcha-img").attr("src", "/comment/captcha.svl" + "?random=" + new Date().getTime())
                        }
                        else {
                          $(".captcha-block").addClass('hidden')
                        }
                        $('.captcha-ipt').val('')
                      }, 1000)
                      f.showComm([system.post.aid, 1], function() {
                        ue.setContent('');
                        if ($$('#btn-quote-return').length) {
                          $$('#btn-quote-return').click();
                        }
                        return $$('#area-comment').scrollOnto(200);
                      });
                      setTimeout(function() {
                        $$('#area-comment').data().sendCommAllowed = 1;
                        return btn.removeClass('disabled');
                      }, func.cooldown);
                      return typeof callback === "function" ? callback() : void 0;
                    } else {
                      if (data.status === 401) {
                        $.info.error('' + (data.info || '您已因违规操作被临时禁言。如有疑问请联系客服。'));
                      } else if (data.status == 402) {
                        $.info.warning(data.info || '验证码错误')
                        $('.captcha-hint').text('请正确输入验证码').css({color:'#E74C3C'})
                        $(".captcha-block").removeClass('hidden')
                        $(".captcha-img").attr("src", "/comment/captcha.svl" + "?random=" + new Date().getTime())
                        $$('#area-comment').data().sendCommAllowed = 1
                        btn.removeClass('disabled')
                      } else if (data.status == 403) {
                        $.info.warning(data.info || '验证码超时')
                        $('.captcha-hint').text('验证码超时').css({color:'#E74C3C'})
                        $(".captcha-block").removeClass('hidden')
                        $(".captcha-img").attr("src", "/comment/captcha.svl" + "?random=" + new Date().getTime())
                        $$('#area-comment').data().sendCommAllowed = 1
                        btn.removeClass('disabled')
                      } else if (data.status == 405) {
                        $.info.warning(data.info || '请输入验证码')
                        $('.captcha-hint').text('请输入验证码完成评论').css({color:'#999'})
                        $(".captcha-block").removeClass('hidden')
                        $(".captcha-img").attr("src", "/comment/captcha.svl" + "?random=" + new Date().getTime())
                        $$('#area-comment').data().sendCommAllowed = 1
                        btn.removeClass('disabled')
                        var shadow = $('#area-quoter-space').length == 1 ? $('#area-quoter-space') : $('#item-editor-shadow-top')
                        shadow.css({height: $$('#editor').height() + 97 + 44})
                        $$('#area-editor-inner').css({top: shadow.offset().top - $$('#area-editor').offset().top})
                      } else {
                        $.info.error('' + (data.info || '评论发送失败。请于稍后重试。'));
                      }
                      return setTimeout(function() {
                        $$('#area-comment').data().sendCommAllowed = 1;
                        return btn.removeClass('disabled');
                      }, func.cooldown);
                    }
                  }).fail(function() {
                    $.info.warning('发送信息失败。请于稍后重试。');
                    return setTimeout(function() {
                      $$('#area-comment').data().sendCommAllowed = 1;
                      return btn.removeClass('disabled');
                    }, func.cooldown);
                  });
                }
              }
            },
            quoteComm: function(param) {
              var area, btn, content, editor, obj, objQ, shadow, target, time, ue;
              if ($.user.uid) {
                $$('#item-editor-shadow').click();
                obj = param;
                content = obj.closest('div.item-comment').find('div.content-comment:last');
                ue = $$().ue;
                $('#area-quoter-space').remove();
                content.after('<div id=\'area-quoter-space\'></div>');
                area = $$('#area-editor-inner');
                btn = $$('#btn-send-editor');
                editor = $$('#editor');
                shadow = $('#area-quoter-space');
                target = $$('#area-editor');
                objQ = obj.closest('div.item-comment');
                btn.data({
                  qid: objQ.attr('id').replace(/c\-/, ''),
                  qname: objQ.children('div.author-comment').children('a.name').text()
                });
                $$('#btn-quote-return, #item-editor-shadow').removeClass('hidden');
                time = $.browser.isIE() ? 0 : 200;
                var fixNum = $('.captcha-block').hasClass('hidden') ? 0 : 44
                shadow.css({
                  height: editor.height() + 97 + fixNum
                });
                editor.css({
                  width: shadow.width() - 16
                });
                return area.css({
                  display: 'block',
                  position: 'absolute',
                  left: shadow.offset().left - target.offset().left + 8,
                  top: shadow.offset().top - target.offset().top,
                  opacity: 0
                }).transition({
                  opacity: 1
                }, time, function() {
                  return ue.focus();
                }).data({
                  lastQuote: objQ.attr('id')
                });
              } else {
                return $.info.warning('请先行登录。');
              }
            },
            deleteComm: function(param) {
              var ref;
              if ((ref = $.user.group) === 0 || ref === 3) {
                return param.ensure({
                  text: '是否确定删除该评论？',
                  callback: function() {
                    var btn, obj, ref1;
                    btn = param;
                    obj = {
                      commentId: btn.parents('div.item-comment:first').attr('id').replace(/c\-/, '')
                    };
                    obj[system.handle.comm["delete"].id] = system.post.aid;
                    if ((ref1 = system.port.deleteComm) != null) {
                      ref1.abort();
                    }
                    return system.port.deleteComm = $.post(system.handle.comm["delete"].url, obj).done(function(data) {
                      if (data.success || data.status === 200) {
                        btn.text('[已删除]').off('click');
                        return $.info.show('删除了一条评论。');
                      } else {
                        return $.info.warning('删除评论操作失败。');
                      }
                    }).fail(function() {
                      return $.info.warning('删除评论操作失败。');
                    });
                  }
                });
              }
            },
            breakFloor: function(param) {
              if ($.user.group === 0) {
                return param.ensure({
                  curtain: true,
                  text: '是否确定删除该楼内所有评论？',
                  callback: function() {
                    var btn, divider, item, items, ref;
                    btn = param;
                    item = btn.closest('div.item-comment');
                    items = item.prev('div.item-comment-quote');
                    divider = items.prev('div.item-comment-divider, div.item-quote-hidden');
                    btn.addClass('active');
                    if ((ref = system.port.deleteComm) != null) {
                      ref.abort();
                    }
                    return system.port.deleteComm = $.post('/comment/delete.aspx', {
                      commentId: item.data().fullcid,
                      contentId: system.post.aid
                    }).done(function() {
                      btn.text('已删除').off('click');
                      item.remove();
                      items.remove();
                      divider.remove();
                      btn.removeClass('active');
                      return $.info.show('砍楼成功。');
                    }).fail(function() {
                      $.info.error('砍楼失败。');
                      return btn.removeClass('active');
                    });
                  }
                });
              }
            },
            reportComm: function(param) {
              var func;
              func = {
                name: 'comm.reportComm()',
                btn: param
              };
              if ($.user.group !== 1) {
                return param.ensure({
                  text: '是否确定举报该评论？',
                  callback: function() {
                    var cont, obj, proof, tid, url;
                    obj = func.btn.closest('div.item-comment');
                    proof = obj.find('div.content-comment:last').text().toString().slice(0, 50);
                    cont = obj.find('span.index-comment:last').text().replace(/\s/g, '') + '楼 评论内容违规。';
                    tid = obj.attr('id').split('-')[1];
                    url = globalConfig.rootDomain + '/report.aspx#name=' + func.btn.closest('div.author-comment').prevAll('.author-comment').find('a.name:first').text().replace(/[\#\;\@\=]/g, '') + ';from=' + self.location.href.toString().replace(/\#.*/, '') + ';type=' + '评论' + ';desc=' + cont.replace(/[\#\;\@\=]/g, '') + ';proof=' + proof.replace(/[\#\;\@\=]/g, '') + ';oid=' + tid;
                    return window.open(encodeURI(url));
                  }
                });
              } else {
                return $.info.warning('权限不足的非法用户组。');
              }
            },
            refreshComm: function() {
              var mimikoPage;
              mimikoPage = $('#area-comment-inner span.pager-old-here').length ? $('#area-comment-inner span.pager-old-here').data().page : 1;
              return $$('#area-comment').data().func.showComm([system.post.aid, mimikoPage], function() {
                return $$('#item-editor-shadow').click();
              });
            }
          }
        });
      }
    } else {
      console.log('[comm.coffee]#3');
    }
    $$('#area-comment').data().func.ready(aid, cb)
  }
})
