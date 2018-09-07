var product = {
    init :function(){
        product.funcs.renderTable();
        var out = $("#productPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#productPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function(){
            /**渲染表头，获取默认数据 */
        }
    }
}