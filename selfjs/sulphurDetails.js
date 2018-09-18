var sulphurDetails = {
    init : function() {
        sulphurDetails.funcs.renderTable();
        var out = $("#sulphurDetailPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#sulphurDetailPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,funcs : {
        renderTable : function() {
            /**渲染表头,获取所有数据 */
        }
    }
};