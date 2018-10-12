var alarmMonitor = {
    init : function() {
        alarmMonitor.funcs.renderTable();
        var out = $("#alarmMonitorPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#alarmMonitorPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function(){
            /**渲染表头,获取所有数据 */
            $.get(home.urls.eventAlarm.getByIsResponseByPage(),{},function(result) {
                var alarmDatas = result.data.content;
                var page = result.data;
                const $tbody = $("#alarmMonitorTbody");
                alarmMonitor.funcs.renderHandler($tbody,alarmDatas,0);
                alarmMonitor.pageSize = page.size;
                /**分页信息 */
                layui.laypage.render({
                    elem: "alarmMonitorPage",
                    count: page.totalElements ,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.eventAlarm.getByIsResponseByPage(),{
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var alarmDatas = result.data.content;
                                const $tbody = $("#alarmMonitorTbody");
                                alarmMonitor.funcs.renderHandler($tbody,alarmDatas,obj.curr-1);
                                alarmMonitor.pageSize = page.size;
                            })
                        }
                    }
                })
            })
        }
        ,renderHandler : function ($tbody, alarmDatas, page) {
            $tbody.empty();
            var i = 1 + page * 10;
            var alertResponseStatus;
            alarmDatas.forEach(function(e) {
                if(e.responseStatus === false){
                    alertResponseStatus = "否";
                }
                else{
                    alertResponseStatus = "是";
                }
                $tbody.append(
                    "<tr>"+
                    "<td>"+ (i++) +"</td>" +
                    "<td>" + e.alarmSetting.priority+"</td>" +
                    "<td>" + e.alarmTime+"</td>" +
                    "<td>" + e.dpPoint.dpPoint+"</td>" +
                    "<td>" + e.alarmSetting.info+"</td>" +
                    "<td>" + e.value+"</td>" +
                    "<td>" + e.alarmSetting.upValue+"</td>" +
                    "<td>" + alertResponseStatus+"</td>" +
                    "<td><span><a href='#' class = 'confirmAlarm' id='"+ e.id +"'>确认报警</a></span></td>"+
                    "</tr>"
                )
            });
            /**绑定详情事件 */
            alarmMonitor.funcs.bindConfirmAlarmEvents($(".confirmAlarm"));
        }
        /**绑定详情事件 */
        ,bindConfirmAlarmEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id');
                console.log(id);
                $.post(home.urls.eventAlarm.updateResponseStatusById(),{
                    id : id
                },function(result) {
                    if (result.code === 0) {
                        var time = setTimeout(function () {
                            alarmMonitor.init();
                            clearTimeout(time);
                        }, 500);
                    }
                    layer.msg(result.message, {
                        offset : ['40%', '55%'],
                        time : 700
                    });

                })
            })
        }
    }
};