var login_log_management = {

    init:function(){
        login_log_management.funcs.renderTable()
        var out = $("#loginLogManagement_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#loginLogManagement_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,pageSize:0
    ,funcs:{
        //渲染页面
        renderTable:function(){
            //获取所有的记录
            $.get(home.urls.loginLog.getAllByPage(), { page : 0 }, function(result) {
                var loginLogs = result.data.content;
                const $tbody = $("#loginLogManagementTable").children("tbody");
                login_log_management.funcs.renderHandler($tbody, loginLogs, 0);
                login_log_management.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "loginLogManagement_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.loginLog.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var loginLogs = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#loginLogManagementTable").children("tbody");
                                login_log_management.funcs.renderHandler($tbody, loginLogs, page);
                                login_log_management.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定搜索事件 */
            login_log_management.funcs.bindSearchEvents($("#searchButton-login"));
            /**绑定下载事件 */
            login_log_management.funcs.bindDownloadEvents($("#downloadButton-login")); 
            /**绑定批量删除事件 */
            login_log_management.funcs.bindDeleteByIdsEvents($("#deleteButton-login"));                                               
        }
        /**绑定搜索事件 */
        ,bindSearchEvents:function(buttons){
            buttons.off('click').on('click',function(){

            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){

            })
        }
         /**绑定下载事件 */
        ,bindDownloadEvents : function(buttons){
            buttons.off('click').on('click',function(){

            })
        }
        ,renderHandler : function($tbody, loginLogs, page){
            //清空表格
            $tbody.empty() ;
            var i = 1 + page * 10;
            loginLogs.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+"></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.user.name ? e.user.name : ' ')+"</td>" +
                    "<td>"+(e.user.id)+"</td>" +
                    "<td>"+(e.ipAddress)+"</td>" +
                    "<td>"+(e.address ? e.address : ' ')+"</td>" +
                    "<td>"+(e.time ? new Date(e.time).Format('yyyy-MM-dd') : ' ')+"</td>" +
                    "</tr>"
                )
            })            
        }        
    }
}