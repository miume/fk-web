var cablewayRecord = {
    init: function() {
        /**分页显示 */
        cablewayRecord.funcs.renderTable();
        var out1 = $("#user_page1").width();
        var time1 = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#user_page1').css('padding-left', 100 * ((out1 - inside) / 2 / out1) > 33 ? 100 * ((out1 - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time1);
        }, 30);
        var out2 = $("#user_page2").width();
        var time2 = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#user_page2').css('padding-left', 100 * ((out2 - inside) / 2 / out2) > 33 ? 100 * ((out2 - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time2);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        /**渲染表格 */
        renderTable : function() {


            cablewayRecord.funcs.bindPageSwitch($("#jumpToRecord"));
        }
        /**转换到运行记录页面 */
        ,bindPageSwitch : function(buttons) {
            buttons.off('click').on('click',function(){
                $("#runRecord").removeClass("hidePage");
                $("#runMonitoring").addClass("hidePage");
            })
            cablewayRecord.funcs.renderRecordTable();
        }
        ,renderRecordTable : function() {
            

        }












    }
}