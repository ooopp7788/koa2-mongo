//- 判断是否登录
$(function()
{
    if ( $.user.isLogin() )
    {
        $( ".user-avatar").show();
    }
});