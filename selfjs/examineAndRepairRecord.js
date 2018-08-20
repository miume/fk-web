var record = {
    init: function() {
        /**获取部门信息分页显示 */
        userManage.funcs.renderTable();
        userManage.funcs.renderOption();
        var out = $("#user_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#user_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,departId : '001'
    ,funcs: {
        
        
       
       
        
       
    
    }

}