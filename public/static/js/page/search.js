$(function() {
  var query = $.getQueryString('query')
  if (query) {
    location.href = "/search/#query=" + query
  }
  var relateWordUrl = "http://search.aixifan.com/think?cd=1&sys_name=pc&format=system.think&q="
  var searchUrl = "http://search.aixifan.com/search"
  var adKeyUrl = "http://webapi.aixifan.com/searchAdKey/"
  var liveUrl = "http://webapi.aixifan.com/live/compere/recomSearch?compereIds="
  var liveDetailUrl = "http://live.acfun.tv/space"
  var bangumiUrl = "http://icao.aixifan.com/search/bangumi"
  var searchType = "video" // video || bangumi
  var isInit = 0
  var allReady = false
  var videoTemplate = $.template($('#video-cell-template').html(), {variable: "video"})
  var albumTemplate = $.template($('#album-cell-template').html(), {variable: "album"})
  var bangumiTemplate = $.template($('#bangumi-cell-template').html(), {variable: "bangumi"})
  var articleTemplate = $.template($('#article-cell-template').html(), {variable: "article"})
  var uperTemplate = $.template($('#uper-cell-template').html(), {variable: "uper"})
  var videoFilterTemplate = $.template($('#video-filter-template').html(), {variable: "videoFilter"})
  var articleFilterTemplate = $.template($('#article-filter-template').html(), {variable: "articleFilter"})
  var itemTemplate = $.template($('#right-cell-template').html(), {variable: 'item'})
  var anchorTemplate = $.template($('#anchor-cell-template').html(), {variable: 'anchor'})
  var keyword
  var start = new Date().getTime()
  // var noGuess
  var searchParam = {
    cd: 1,
    sys_name: "pc",
    format: "system.searchResult",
    pageSize: 10,
    pageNo: 1,
    aiCount:3,
    spCount:3,
    type: 2,
    isWeb:1
  }
  var articleParam = {
    cd: 1,
    sys_name: "pc",
    format: "system.articleResult",
    pageSize: 10,
    pageNo: 1,
    aiCount:1,
    spCount:3,
    parentChannelId: 63,
    type: 2,
    isWeb:1
  }
  var uperParam = {
    cd: 1,
    sys_name: "pc",
    format: "system.uperResult",
    pageSize: 0,
    pageNo: 1,
    aiCount:0,
    spCount:0,
    userCount:10,
    type: 2,
    isWeb:1
  }
  var bangumiParam = {
    cd:1,
    format: "system.bangumiResult",
    isWeb:1,
    sort:0,
    pageNo:1,
    pageSize:10
  }

  //筛选数据
  var articleFilterData = {
    sortArray: [{
      name: "相关",
      value: 'score', // search接口需要
      sort: 0   // bangumi接口需要
    },{
      name: "最新发布",
      value: 'releaseDate',
      sort: 1
    },{
      name: "最多围观",
      value: 'views',
      sort: 11
    },{
      name: "最多评论",
      value: 'comments',
      sort: 13
    }]
  }
  var videoFilterData = {
    sortArray: [{
      name: "相关",
      value: 'score', // search接口需要
      sort: 0   // bangumi接口需要
    },{
      name: "最新发布",
      value: 'releaseDate',
      sort: 1
    },{
      name: "最多播放",
      value: 'views',
      sort: 11
    },{
      name: "最多评论",
      value: 'comments',
      sort: 13
    },{
      name: "最多弹幕",
      value: 'danmakuSize',
      sort: 17
    }],
    channelArray: [{
      name: "全部",
      value: "all",
      type: 2
    },{
      name: "影视",
      value: 68,
      type: 2
    },{
      name: "番剧",
      value: "bangumi",
      api: "http://icao.aixifan.com/search/bangumi"
    },{
      name: "动画",
      value: 1,
      type: 2
    },{
      name: "娱乐",
      value: 60,
      type: 2
    },{
      name: "科技",
      value: 70,
      type: 2
    },{
      name: "体育",
      value: 69,
      type: 2
    },{
      name: "彼女",
      value: 124,
      type: 2
    },{
      name: "鱼塘",
      value: 125,
      type: 2
    },{
      name: "舞蹈",
      value: 123,
      type: 2
    },{
      name: "音乐",
      value: 58,
      type: 2
    },{
      name: "游戏",
      value: 59,
      type: 2
    },{
      name: "合辑",
      value: "album",
      type: 1
    }],
    childChannelObj: {
      "1": [{name: "全部",value: "all"},{value:106,name:'动画短片'},{value:107,name:'MAD·AMV'},{value:108,name:'MMD·3D'},
        {value:133,name:'2.5次元'},{value:67,name:'新番连载'},{value:120,name:'国产动画'},{value:109,name:'旧番补档'},
        {value:159,name:'动画资讯'}],
      "68": [{name: "全部",value: "all"},{value:96,name:'电影'},{value:162,name:'日剧'},
        {value:163,name:'美剧'},{value:141,name:'国产剧'},{value:121,name:'网络剧'},
        {value:142,name:'韩剧'},{value:99,name:'布袋·特摄'},{value:100,name:'纪录片'},
        {value:143,name:'其他'}],
      "70": [{name: "全部",value: "all"},{value:147,name:'SF'},{value:148,name:'黑科技'},
        {value:91,name:'数码'},{value:149,name:'广告'},{value:150,name:'白科技'},
        {value:151,name:'自我发电'},{value:90,name:'科学技术'},{value:122,name:'汽车'}],
      "60": [{name: "全部",value: "all"},{value:86,name:'生活娱乐'},{value:87,name:'鬼畜调教'},
          {value:88,name:'萌宠'},{value:89,name:'美食'},{value:98,name:'综艺'}],
      "69": [{name: "全部",value: "all"},{value:152,name:'综合体育'},{value:94,name:'足球'},
          {value:95,name:'篮球'},{value:153,name:'搏击'},{value:154,name:'11区体育'},
          {value:93,name:'惊奇体育'}],
      "123": [{name: "全部",value: "all"},{value:134,name:'宅舞'},{value:135,name:'综合舞蹈'}],
      "124": [{name: "全部",value: "all"},{value:127,name:'造型'},{value:128,name:'西皮'},
          {value:129,name:'爱豆'},{value:130,name:'其他'}],
      "125": [{name: "全部",value: "all"},{value:92,name:'军事'},{value:131,name:'历史'},
          {value:132,name:'焦点'}],
      "58": [{name: "全部",value: "all"},{value:136,name:'原创·翻唱'},{value:137,name:'演奏'},{value:103,name:'Vocaloid'},
          {value:138,name:'日系音乐'},{value:139,name:'综合音乐'},{value:140,name:'演唱会'}],
      "59": [{name: "全部",value: "all"},{value:83,name:'游戏集锦'},{value:145,name:'电子竞技'},
          {value:84,name:'主机单机'},{value:85,name:'英雄联盟'},{value:170,name:'守望先锋'},{value:165,name:'桌游卡牌'},{value:72,name:'Mugen'}],
      "bangumi": [{name: "全部",value: "all"}, {value:1, name:"动画"}, {value:2, name:"电影"}, {value:3, name:"综艺"}, {value:4, name:"电视剧"}]
    }
  }

  //防止XSS
  function htmlEncode(str) {
    var div = document.createElement("div")
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }
  // 工具函数
  function hashStringify(obj) {
    var hash = []
    for (var i in obj) {
      if (obj.hasOwnProperty(i) && obj[i] != undefined) {
        hash.push(i + '=' + obj[i])
      }
    }
    return hash.join(';')
  }

  function textSearch(dom, search) {
    $(dom).each(function(index, ele){
      var html = $(ele).html().replace(/<!--[\s\S]*?-->/g, '');
      var reg = new RegExp('(>[^<"\']*?)' + search + '([^>"\']*?<)', 'g');
      if(reg.test(html)){
        html = html.replace(reg, "$1<span class='mark'>" + search + "</span>$2")
      }
      $(ele).html(html)
    })
  }

  function tabCount(data) {
    // $('.search-nav [data-type=video] .search-count').text("（"+(data.videoCount>100 ? "100+" : data.videoCount)+"）")
    // $('.search-nav [data-type=article] .search-count').text("（"+(data.greenCount>100 ? "100+" : data.greenCount)+"）")
    // $('.search-nav [data-type=uper] .search-count').text("（"+(data.userCount>100 ? "100+" : data.userCount)+"）")
    $('.video-list .result-count span').text(data.totalCount+ (data.sp && data.sp.length || 0) + (data.ai && data.ai.length || 0))
    $('.article-list .result-count span').text(data.greenCount + (data.sp && data.sp.length || 0))
    $('.uper-list .result-count span').text(data.userCount)
  }

  function pager(data) {
    // 分页
    var pagerHtml = $.makePager({
      num: data.pageNo,
      count: data.totalCount,
      size: data.pageSize,
      total: Math.ceil(data.totalCount/data.pageSize),
      addon: true,
      hash: true
    });
    $('#list-pager').html(pagerHtml);
  }

  $('#list-pager').readyPager({
    addon: true,
    callback: function (n) {
      location.hash = hashStringify({
        page: n,
        query: $.fomatHash().query,
        type: $.fomatHash().type || "video"
      })
    }
  });

  function searchRelate(str) {
    $.getScript(relateWordUrl + (str||""))
    .done(function() {
      var data = $.parseJson($.parseString(system.think)) || {};
      if (data.status == 200) {
        var html = ""
        data.data.slice(0, 4).forEach(function(wordObj, index) {
          html += '<a href="/search/#query=' + wordObj.name + '">' + htmlEncode(wordObj.name) + '</a>'
        })
        $('.search-box-bg .word-wrap').html(html)
      }
    })
  }

  getData = {
    video: function() {
      $.getScript(searchUrl + "?" + $.param($.extend({q: keyword, isArticle: 1}, searchParam)))
      .done(function() {
        var data = $.parseJson($.parseString(system.searchResult)) || {}
        var videoHtml = ""
        var albumHtml = ""
        var bangumiHtml = ""
        var position = 0
        if (data.status == 200) {
          data.data.page.ai && data.data.page.ai.forEach(function(ele, index) {
            ele._position = ++position
            ele.sets = []
            var length = ele.bangumVideosTitle && ele.bangumVideosTitle.length || 0
            var dot = false
            ele.bangumVideosTitle && ele.bangumVideosTitle.forEach(function(title, index) {
              if (ele.status == 0) {
                if (index < 5) {
                  ele.sets.push({name: title, id: index+1})
                } else if (length - index <= 2) {
                  ele.sets.push({name: title, id: index+1})
                } else if (!dot) {
                  ele.sets.push({name: "...", id: 1})
                  dot = true
                }
              } else {
                if (index < 2) {
                  ele.sets.unshift({name: title, id: index+1})
                } else if (length - index <= 5) {
                  ele.sets.unshift({name: title, id: index+1})
                } else if (!dot) {
                  ele.sets.unshift({name: "...", id: 1})
                  dot = true
                }
              }
            })

            bangumiHtml += bangumiTemplate(ele)
          })

          data.data.page.sp && data.data.page.sp.forEach(function(ele, index) {
            ele._position = ++position
            albumHtml += albumTemplate(ele)
          })

          data.data.page.list && data.data.page.list.forEach(function(item, index) {
            item._position = ++position
            // 分类数据增强
            var parentId = item.channelIds[1]
            var id = item.channelIds[0]
            item.channelIds = [{},{}]
            for (var i = 0; i < videoFilterData.channelArray.length; i++) {
              if (parentId == videoFilterData.channelArray[i].value) {
                item.channelIds[1] = {id: parentId, name: videoFilterData.channelArray[i].name}
                break;
              }
            }
            if (videoFilterData.childChannelObj[parentId]) {
              for (var i = 0; i < videoFilterData.childChannelObj[parentId].length; i++) {
                if (id == videoFilterData.childChannelObj[parentId][i].value) {
                  item.channelIds[0] = {id: id, name: videoFilterData.childChannelObj[parentId][i].name}
                  break;
                }
              }
            }
            videoHtml += videoTemplate(item)
          })

          tabCount(data.data.page)
          pager({
            pageNo: data.data.page.pageNo,
            totalCount: data.data.page.totalCount,
            pageSize: data.data.page.pageSize
          })
        } else {
          $.info.warning('搜索失败，请稍候再试')
        }
        $('.video-list-wrap').html(videoHtml)
        $('.video-album-wrap').html(albumHtml)
        $('.video-bangumi-wrap').html(bangumiHtml)
        textSearch($('.video-list-wrap .video-cell'), keyword)
        textSearch($('.video-album-wrap .album-cell'), keyword)
        textSearch($('.video-bangumi-wrap .bangumi-cell'), keyword)
        albumHtml && $('.video-album-wrap').append("<p class='more-album more'>查看全部合辑（"+ data.data.page.spCount +"）</p>")
        bangumiHtml && $('.video-bangumi-wrap').append("<p class='more-bangumi more'>查看全部番剧（"+ data.data.page.aiCount +"）</p>")
      }).fail(function(){
        $.info.warning('搜索失败，请稍候再试')
      })
    },
    bangumi: function() {
      $.getScript(bangumiUrl + "?" + $.param($.extend({q: keyword}, bangumiParam)))
      .done(function() {
        var data = $.parseJson($.parseString(system.bangumiResult)) || {}
        var bangumiHtml = ""
        var position = 0
        if (data.status == 200) {
          if (data.data.page.list && data.data.page.list.length > 0) {
            data.data.page.list.forEach(function(ele, index) {
              ele._position = ++position
              ele.tags = ele.tagNames || []
              ele.description = ele.intro
              ele.titleImg = ele.cover
              ele.contentId = ele.id
              ele.sets = []
              var length = ele.bangumVideosTitle && ele.bangumVideosTitle.length
              var dot = false
              ele.bangumVideosTitle && ele.bangumVideosTitle.forEach(function(title, index) {
                if (ele.status == 0) {
                  if (index < 5) {
                    ele.sets.push({name: title, id: index+1})
                  } else if (length - index <= 2) {
                    ele.sets.push({name: title, id: index+1})
                  } else if (!dot) {
                    ele.sets.push({name: "...", id: 1})
                    dot = true
                  }
                } else {
                  if (index < 2) {
                    ele.sets.unshift({name: title, id: index+1})
                  } else if (length - index <= 5) {
                    ele.sets.unshift({name: title, id: index+1})
                  } else if (!dot) {
                    ele.sets.unshift({name: "...", id: 1})
                    dot = true
                  }
                }
              })
              bangumiHtml += bangumiTemplate(ele)
            })
          }
          tabCount(data.data.page)
          pager({
            pageNo: data.data.page.pageNo,
            totalCount: data.data.page.totalCount,
            pageSize: data.data.page.pageSize
          })
        } else {
          $.info.warning('搜索失败，请稍候再试')
        }
        $('.video-bangumi-wrap').html(bangumiHtml)
        textSearch($('.video-bangumi-wrap .bangumi-cell'), keyword)
        $('.video-album-wrap').empty()
        $('.video-list-wrap').empty()
      }).fail(function(){
        $.info.warning('搜索失败，请稍候再试')
      })
    },
    album: function() {
      $.getScript(searchUrl + "?" + $.param($.extend({q: keyword, mediaType:1 }, searchParam)))
      .done(function() {
        var data = $.parseJson($.parseString(system.searchResult)) || {}
        var albumHtml = ""
        var position = 0
        if (data.status == 200) {
          if (data.data.page.list && data.data.page.list.length > 0) {
            data.data.page.list.forEach(function(ele, index) {
              ele._position = ++position
              albumHtml += albumTemplate(ele)
            })
          }
          tabCount(data.data.page)
          pager({
            pageNo: data.data.page.pageNo,
            totalCount: data.data.page.totalCount,
            pageSize: data.data.page.pageSize
          })
        } else {
          $.info.warning('搜索失败，请稍候再试')
        }
        $('.video-album-wrap').html(albumHtml)
        textSearch($('.video-album-wrap .album-cell'), keyword)
        $('.video-list-wrap').empty()
        $('.video-bangumi-wrap').empty()
      }).fail(function(){
        $.info.warning('搜索失败，请稍候再试')
      })
    },
    article: function() {
      $.getScript(searchUrl + "?" + $.param($.extend({q: keyword}, articleParam)))
      .done(function() {
        var data = $.parseJson($.parseString(system.articleResult)) || {}
        var albumHtml = ""
        var articleHtml = ""
        var position = 0
        if (data.status == 200) {
          data.data.page.sp && data.data.page.sp.forEach(function(ele, index) {
            ele._position = ++position
            albumHtml += albumTemplate(ele)
          })
          if (data.data.page.list && data.data.page.list.length > 0) {
            data.data.page.list.forEach(function(ele, index) {
              ele._position = ++position
              articleHtml += articleTemplate(ele)
            })
          }
          tabCount(data.data.page)
          pager({
            pageNo: data.data.page.pageNo,
            totalCount: data.data.page.greenCount,
            pageSize: data.data.page.pageSize
          })
        } else {
          $.info.warning('搜索失败，请稍候再试')
        }
        $('.article-album-wrap').html(albumHtml)
        $('.article-list-wrap').html(articleHtml)
        textSearch($('.article-album-wrap .album-cell'), keyword)
        textSearch($('.article-list-wrap .article-cell'), keyword)
      }).fail(function(){
        $.info.warning('搜索失败，请稍候再试')
      })
    },
    uper: function() {
      $.getScript(searchUrl + "?" + $.param($.extend({q: keyword}, uperParam)))
      .done(function() {
        var data = $.parseJson($.parseString(system.uperResult)) || {}
        var uperHtml = ""
        var position = 0
        if (data.status == 200) {
          if (data.data.page.user && data.data.page.user.length > 0) {
            data.data.page.user.forEach(function(ele, index) {
              ele._position = ++position
              uperHtml += uperTemplate(ele)
            })
          }
          tabCount(data.data.page)
          pager({
            pageNo: data.data.page.pageNo,
            totalCount: data.data.page.userCount,
            pageSize: 10
          })
        } else {
          $.info.warning('搜索失败，请稍候再试')
        }
        $('.uper-list-wrap').html(uperHtml)
        textSearch($('.uper-list-wrap .uper-cell'), keyword)
      }).fail(function(){
        $.info.warning('搜索失败，请稍候再试')
      })
    }
  }


  function searchFun(str) {
    if (str) {
      var promise
      $.searchCache(str)
      switch ($.fomatHash().type) {
        case "article":
          getData.article()
          break;
        case "uper":
          getData.uper()
          break;
        default:
          if (searchType == "bangumi") {
            getData.bangumi()
          } else if(searchParam.type == 2) {
            getData.video()
          } else {
            getData.album()
          }
      }
    } else {
      // 没有关键词时
    }
  }

  function search(str) {
    if (keyword !== str) {
      start = new Date().getTime()
      $.ajax({
          type :"get",
          url: adKeyUrl + str + '?type=0',
          dataType:"json"
      }).done(function(data) {
        if (data.data && data.data.length > 0) {
          $.ajax({
            type: "get",
            url: liveUrl + data.data[0].count_id,
            dataType:"json"
          }).done(function(data) {
            if (data.data && data.data.compereList && data.data.compereList.length > 0) {
              var html = ""
              data.data.compereList.forEach(function(live, index) {
                live.link = liveDetailUrl + '#' + hashStringify({
                  from: 0,
                  platform: live.platformId,
                  videoId: live.videoId,
                  compereId: live.compereId,
                  isLive: live.isLive,
                  contentId: live.id,
                  liveType: live.liveType
                })
              })
              $('.video-anchor-box').removeClass('hidden')
              $('.video-anchor-wrap').html(anchorTemplate(data.data.compereList))
            } else {
              $('.video-anchor-box').addClass('hidden')
            }
          }).fail(function(data) {
            $('.video-anchor-box').addClass('hidden')
          })
        } else {
          $('.video-anchor-box').addClass('hidden')
        }
      }).fail(function() {
        $('.video-anchor-box').addClass('hidden')
      })
      $.ajax({
          type :"get",
          url: adKeyUrl + str + '?type=1',
          dataType:"json"
      }).done(function(data) {
        var html = ""
        if (data.data && data.data.length > 0) {
          data.data.forEach(function(item, index) {
            item.index = index
            html += itemTemplate(item)
          })
          $('.module-recommend .module-wrap').html(html)
          $('.module-recommend').removeClass('hidden')
          $('.ad').addClass('hidden')
        } else {
          $('.module-recommend').addClass('hidden')
          $('.ad').removeClass('hidden')
        }
      }).fail(function() {
        $('.module-recommend').addClass('hidden')
        $('.ad').removeClass('hidden')
      })
      searchRelate(str)
      keyword = str
      searchFun(keyword)
    } else {
      searchFun(keyword)
    }
  }


  function hashSearch() {
    var queryParam = $.fomatHash()
    var type = queryParam.type || 'video'
    $('#search-text').val(queryParam.query || "")
    switch (type) {
      case "article":
        articleParam.pageNo = queryParam.page || 1
        break;
      case "uper":
        uperParam.pageNo = queryParam.page || 1
        break;
      default:
        searchParam.pageNo = queryParam.page || 1
        bangumiParam.pageNo = queryParam.page || 1
    }
    $('.search-nav li.active').removeClass('active')
    $('.search-nav li[data-type='+type+']').addClass('active')
    $('.list-warp.active').removeClass("active")
    $('.' + type + '-list').addClass('active')
    search(queryParam.query || "")
  }
  $(window).on('hashchange', function(ev) {
    hashSearch()
  })

  $('.search-btn').click(function(ev) {
    var $searchText = $.trim($('#search-text').val());
    if ($searchText) {
      ev.stopPropagation()
      ev.preventDefault()
      location.hash = hashStringify({
        page: 1,
        query: $searchText,
        type: $.fomatHash().type|| "video"
      })
    }
  })

  //tab切换
  $('.search-nav').on('click', 'li:not(.active)', function(ev) {

    location.hash = hashStringify({
      page: 1,
      query: $.fomatHash().query,
      type: $(this).data('type')
    })
  })


  //筛选
  $('.video-list-filter .filter-box-content').html(videoFilterTemplate(videoFilterData))
  $('.article-list-filter .filter-box-content').html(articleFilterTemplate(articleFilterData))

  $('.filter-box').on('click', '.expand-btn span', function() {
    var $this = $(this)
    switch ($this.data("type")) {
      case "whole":
        $this.parents('.filter-box').removeClass('simple-mode')
        break;
      case "simple":
        $this.parents('.filter-box').addClass('simple-mode')
        break;
    }
    $this.addClass('hidden').siblings().removeClass('hidden')
  })
  // 简单模式不展示的标记
  function gaveTag (threshold, $this) {
    if ($this.data().num < threshold) {
      $this.parent('.filter-wrap').find('.filter-btn').each(function(index, ele) {
        index < threshold ? $(ele).removeClass("extra") : $(ele).addClass("extra")
      })
    } else {
      $this.parent('.filter-wrap').find('.filter-btn').each(function(index, ele) {
        index < (threshold - 1) ? $(ele).removeClass("extra") : $(ele).addClass("extra")
      })
      $this.removeClass("extra")
    }
  }

  $('.filter-box').on('click', '.filter-wrap span:not(.active)', function(ev) {
    var $this = $(this)
    if ($this.hasClass('more')) {
      $this.parents('.filter-box').find('.expand-btn .hidden').siblings().click()
    } else {
      $this.siblings('.active').removeClass('active')
      var data = $this.addClass('active').data()
      switch (data.mode) {
        case 1:
          switch ($this.parents('.list-warp').data('type')) {
            case "article":
              articleParam.sortField = data.value;
              break;
            default:
            searchParam.sortField = data.value;
            bangumiParam.sort = data.sort;
            gaveTag(3, $this)
          }
          break;
        case 2:
          searchParam.type = data.type;
          gaveTag(5, $this)
          switch (data.value) {
            case "all" :
              delete searchParam.parentChannelId
              delete searchParam.channelId
              searchType = "video"
              break;
            case "bangumi" :
              delete bangumiParam.type
              searchType = "bangumi"
              break;
            case "album" :
              delete searchParam.parentChannelId
              delete searchParam.channelId
              searchType = "video"
              break;
            default:
              searchParam.parentChannelId = data.value
              delete searchParam.channelId
              searchType = "video"
          }
          var selectChildChannel = videoFilterData.childChannelObj[data.value]
          if (selectChildChannel) {
            var html = ""
            for (var i = 0; i < selectChildChannel.length; i++) {
              html += "<span data-val='" + selectChildChannel[i].value + "' class='" + (i==0 ? "active" : "") + "' data-mode='3'>" +
              selectChildChannel[i].name + "</span>"
            }
            $('.child-channel-filter .filter-wrap').html(html)
            $('.child-channel-filter').removeClass('hidden')
          } else {
            $('.child-channel-filter').addClass('hidden')
          }
          break;
        case 3:
          if (searchType == "bangumi") {
            if (typeof data.val == "nmuber") {
              bangumiParam.type = data.val
            } else {
              delete bangumiParam.type
            }
          } else {
            if (typeof data.val == "number") {
              searchParam.channelId = data.val
            } else {
              delete searchParam.channelId
            }
          }
          break;
      }
      if (allReady) {
        // 搜索
        if ($.fomatHash().page != 1) {
          location.hash = hashStringify({
            page: 1,
            query: keyword,
            type: $.fomatHash().type || "video"
          })
        } else {
          search(keyword)
        }
      }
    }
  })
  $('.video-list').on('click', '.more-album', function() {
    $('.channel-filter').find('[data-value="album"]').click()
  })
  $('.video-list').on('click', '.more-bangumi', function() {
    $('.channel-filter').find('[data-value="bangumi"]').click()
  })
  $('.sort-filter .filter-wrap span:first-child').click()
  $('.channel-filter .filter-wrap span:first-child').click()
  $('.column-left').on('click', "a[target=_blank]", function(ev) {
    var $this = $(this)
    if ($.fomatHash().query) {
      window.sa && sa.track('ClickSearch', {
        keyword: $.fomatHash().query,
        result:  $this.attr('href'),
        position: parseInt($this.parents('[data-position]').data().position) || 0,
        pagenumber: parseInt($.fomatHash().page) || 1,
        range: $.fomatHash().type||'video',
        timecost: new Date().getTime()-start
      });
    }
  })
  hashSearch()
  allReady = true

})
