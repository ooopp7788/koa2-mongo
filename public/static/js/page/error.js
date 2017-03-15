$(function(){
  if($.user.isLogin()){
      $(".user-avatar").show();
  }
  $('.error-page').css({"min-height": $(window).height() - $('#header').outerHeight() - $("#footer").outerHeight() - 50})
  var recommendUrl ='';
  var videoTemplate =
    '<figure class="fl block-box block-video">' +
      '<a class="block-img has-danmu" href="<%= itemData.link %>" data-did="<%= itemData.videoId||"" %>" target="_blank">' +
        '<img src="<%= itemData.image %>?imageView2/1/w/160/h/90" />' +
        '<% if (itemData.videoTimeFormat) { %>' +
          '<time><%= itemData.videoTimeFormat %></time>' +
        '<% } %>' +
        '<% if (itemData.isCrown) { %>' +
          '<i><%= itemData.isCrown %></i>' +
        '<% } %>' +
      '</a>' +
      '<figcaption class="block-title">' +
        '<b><a href="<%= itemData.link %>" title="<%= itemData.title + "&#13;UP:" + itemData.userName +"&#13;发布于" + itemData.timeUpdateFormat + "&#160;/&#160;点击:" + itemData.views + "&#160;/&#160;评论:" + itemData.comments %>" target="_blank">' +
          '<%= itemData.title %>' +
        '</a></b>' +
        '<p class="clearfix">' +
          '<span class="icon icon-view-player"><%= itemData.viewsFormat %></span>' +
          '<span class="icon icon-danmu"><%= itemData.danmakuSize %></span>' +
        '</p>' +
      '</figcaption>' +
    '</figure>';

  var bangumiTemplate =
    '<div class="block-box block-bangumi">' +
      '<a href="<%= itemData.link%>" target="_blank">' +
        '<img src="<%= itemData.image %>?imageView2/1/w/160/h/216" />' +
      '</a>' +
      '<div class="block-title clearfix">' +
        '<a href="<%= itemData.link%>" target="_blank"><%= itemData.title %></a>' +
        '<span><%= itemData.part %></span>' +
        '<span><%= itemData.parsons %>人在追</span>' +
      '</div>' +
    '</div>'

  var articleTemplate =
    '<div class="block-box block-bangumi">' +
      '<a href="<%= itemData.link%>" target="_blank">' +
        '<img src="<%= itemData.image %>?imageView2/1/w/160/h/216" />' +
      '</a>' +
      '<div class="block-title clearfix">' +
        '<a href="<%= itemData.link%>" target="_blank"><%= itemData.title %></a>' +
        '<span><%= itemData.part %></span>' +
        '<span><%= itemData.parsons %>人在追</span>' +
      '</div>' +
    '</div>'

  // $.ajax({
  //   type:'GET',
  //   url:getNoticeUrl,
  //   dataType: 'json',
  //   xhrFields:{
  //     withCredentials:true
  //   }
  // }).done(function (data) {
  //   var html = "";
  //   data.forEach(function (video, index) {
  //     html += $.template(videoTemplate, video);
  //   });
  //   $('.recom-video').append(html);
  // })

})
