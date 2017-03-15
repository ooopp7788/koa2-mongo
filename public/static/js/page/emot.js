
// Created on 2016/11/3.

$(function(){

  // 全局变量
  $detail = $('.emot-detail-top');
  $em = $('.emot-show');
  $eb = $('.emot-big');
  $ed = $('.emot-detail');
  $bigBox = $('.big-box');
  $mask = $('#mask');
  $confirm = $('#confirm');
  $efc = $('#emot-f-c');

  if($.user.isLogin()){
    $('.user-avatar').css('display','inline-block');
  }
  

  // 鼠标移出详情图关闭
  $ed.on('mouseleave',function(){
    $bigBox.hide();
  });


  //移动端浏览弹窗提示 
  $('.download-btn').click(function(e){
    $t = $(this);
    var evt = e || window.event;
    if(/(iPhone|iPad|iPod|iOS|Android|MicroMessenger)/gi.test(window.navigator.userAgent)){
      evt.preventDefault();
      $('#emot-ok').attr('href',$t.attr('href'));
      if(!$t.hasClass('btn-margin')){
        $efc.html('手机端QQ是无法导入eif格式表情的喔，\<br\>建议您使用电脑下载并导入表情包。\<br\>是否继续下载该表情包？');
      }else{
        $efc.html('手机端用户下载表情包需自行解压缩才能看\<br\>到图片喔。\<br\>是否继续下载该表情包？');
      };
      $mask.show();
      $confirm.show();
    }
  });


  // 鼠标移入后展示详情图
  $em.mouseenter(function(){
    if(/(iPhone|iPad|iPod|iOS|Android|MicroMessenger)/gi.test(window.navigator.userAgent)){
      return false;
    }else{
      $(this).siblings('.emot-detail').css('display','block');
    };
  });

  $('#emot-no').click(function(){
    $confirm.hide();
    $mask.hide();
  });

  // 详情图预览
  $detail.on('mouseover mouseout','li',function(e){
    $self = $(this);
    var evt = e || window.event;
    switch (evt.type){
      case "mouseover":
        if(($self.attr('data-num')/3)%2 <= 1 && ($self.attr('data-num')/3)%2 !== 0 ){
          $eb.removeClass().addClass('emot-big big-right');
        }else{
          $eb.removeClass().addClass('emot-big big-left');
        }
        $eb.find('img').attr('src',$self.attr('data-url'));
        $eb.css('display','block');
        break;
      case "mouseout":
        $eb.css('display','none');
        break;
    }
  });
});