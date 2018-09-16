var sulphurDetails = {
    init : function() {
        // processDetails.funcs.renderTable();
        var out = $("#sulphurDetailPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#sulphurDetailPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,funcs : {

    }
};