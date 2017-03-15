/**
 * Created by yang on 17/3/13.
 */
$Prime.ready(['Slider', 'Lazyload', 'Gotop'], function(Slider, Lazyload, Gotop){
    var Gotop = new Gotop({
        container: $("#J_go_top")
    });

    var Slider = new Slider({
        container: $("#J_slider")
    });




    var Lazyload = new Lazyload({
        elements: $(".J_mod"),
        sectionLoad: true,
        afterAppear: function(dom){

            var Go = $.ajax({
                url: $Config.action.sectionModule,
                type: "GET",
                beforeSend: function(){}
            })
            .done(function(res){
                var tid = 3;
                var tpl = $Config.tpl["tpl_"+tid];
                res["data"]["init"] = 1;

                var html = $Prime.tplRender(tpl, res["data"][0])
                dom.html(html)

            })
            .fail(function(){

            });
        }
    });

});
