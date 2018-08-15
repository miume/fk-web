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
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var dateStart = new Date($(startTime-login).val()).Format('yyyy/MM/dd')
                var dateEnd = new Date($(endTime-login).val()).Format('yyyy/MM/dd')
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($('.loginLog-checkbox:checked').length === 0){
                    layer.msg('亲，您还没有选中任何数据!',{
                        offset:['%40','55%'],
                        time:700
                    })
                }else{
                    layer.open({
                        type:1,
                        title:'批量删除',
                        content:"<h5 style='text-align:center;'>您确定要删除所有数据吗？</h5>",
                        area: ['200px','140px'],
                        offset : ['40%', '55%'],
                        btn: ['确定', '取消'],
                        yes : function(index) {
                            var loginsIds = [];
                            /**存取所有选中行的id值 */
                            $(".loginLog-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    loginsIds.push(parseInt($(this).val()));
                                }
                            })
                            console.log(loginsIds)
                            $.post(home.urls.loginLog.deleteByIds(), {
                                _method : "delete", ids : loginsIds.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        login_log_management.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                }) 
                            })
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            layer.close(index);
                        }
                    })
                }
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
                    "<td><input type='checkbox' value="+e.id+" class='loginLog-checkbox'></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.user.name ? e.user.name : ' ')+"</td>" +
                    "<td>"+(e.user.id)+"</td>" +
                    "<td>"+(e.ipAddress)+"</td>" +
                    "<td>"+(e.address ? e.address : ' ')+"</td>" +
                    "<td>"+(e.time ? new Date(e.time).Format('yyyy-MM-dd') : ' ')+"</td>" +
                    "</tr>"
                )
            })
            
            /**实现全选 */
            var checkedBoxLength = $(".loginLog-checkbox:checked").length;
            home.funcs.bindselectAll($("#loginLog-checkBoxAll"), $(".loginLog-checkbox"), checkedBoxLength, $("#loginLogManagementTable"));
        }        
    }
}