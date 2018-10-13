var alarmHistory = {
    init : function() {
        alarmHistory.funcs.renderDropBox();
        alarmHistory.funcs.renderTable();
        var out = $("#alarmHistoryPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#alarmHistoryPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        /**渲染页面 */
        renderTable : function() {
            var dpPointID = $("#dpPoint").val();
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
            /**获取前一周日期 */
            var preWeekDate = alarmHistory.funcs.getPreWeek();
            $("#beginDate").val(preWeekDate);
            $("#endDate").val(currentDate);
            /**获取所有的记录 */
            $.get(home.urls.eventAlarm.getByDpPointAndTimeByPage(),{
                dpPointId : dpPointID,
                startTime : preWeekDate ,
                endTime : currentDate
            },function(result) {
                var alarmDatas = result.data.content;
                var page = result.data;
                const $tbody = $("#alarmHistoryTbody");
                alarmHistory.funcs.renderHandler($tbody,alarmDatas);
                alarmHistory.pageSize = page.size;
                /**分页信息 */
                layui.laypage.render({
                    elem: "alarmMonitorPage",
                    count: page.totalElements ,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.eventAlarm.getByDpPointAndTimeByPage(),{
                                dpPointId : dpPointID,
                                startTime : preWeekDate ,
                                endTime : currentDate ,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var alarmDatas = result.data.content;
                                const $tbody = $("#alarmHistoryTbody");
                                alarmHistory.funcs.renderHandler($tbody,alarmDatas);
                                alarmHistory.pageSize = page.size;
                            })
                        }
                    }
                })
            });
            /**绑定批量删除事件 */
            alarmHistory.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定导出事件 */
            alarmHistory.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定搜索事件 */
            alarmHistory.funcs.bindSearchEvents($("#searchButton"));
        }
        ,renderHandler : function ($tbody, alarmDatas) {
            $tbody.empty();
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
                    "<td><input type='checkbox' value="+e.id+" class='alarm-checkBox' /></td>" +
                    "<td>" + e.alarmSetting.priority+"</td>" +
                    "<td>" + e.alarmTime+"</td>" +
                    "<td>" + e.dpPoint.dpPoint+"</td>" +
                    "<td>" + e.alarmSetting.info+"</td>" +
                    "<td>" + e.value+"</td>" +
                    "<td>" + e.alarmSetting.upValue+"</td>" +
                    "<td>" + alertResponseStatus+"</td>" +
                    "<td>" + (e.confirmUser ? e.confirmUser.name : '' )+ "</td>" +
                    "<td>" + (e.responseTime ? e.responseTime : '' )+ "</td>" +
                    "</tr>"
                )
            });
            var checkedBoxLength = $(".alarm-checkBox:checked").length;
            home.funcs.bindselectAll($("#alarm-checkBoxAll"), $(".alarm-checkbox"), checkedBoxLength, $("#alarmHistoryTable"));
        }
        /**渲染下拉框 */
        ,renderDropBox : function() {
            $("#dpPoint").empty();
            $.get(home.urls.energyDpPoint.getAll(),{},function(result) {
                var dpDatas = result.data;
                $("#dpPoint").append('<option selected="selected" value="-1">所有电表</option>');
                dpDatas.forEach(function(e) {
                    $("#dpPoint").append('<option value='+e.id+'>'+e.dpPoint+'</option>')
                })
            })
        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function (buttons) {
            buttons.off('click').on('click',function() {
                var dpPointId = $('#dpPoint').val();
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                $.get(home.urls.eventAlarm.getByDpPointAndTimeByPage(),{
                    dpPointId : dpPointId,
                    startTime : beginDates ,
                    endTime : endDates
                },function(result) {
                    var alarmDatas = result.data.content;
                    var page = result.data;
                    const $tbody = $("#alarmHistoryTbody");
                    alarmHistory.funcs.renderHandler($tbody,alarmDatas,0);
                    alarmHistory.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "alarmMonitorPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.eventAlarm.getByDpPointAndTimeByPage(),{
                                    dpPointId : dpPointId,
                                    startTime : beginDates ,
                                    endTime : endDates ,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var alarmDatas = result.data.content;
                                    const $tbody = $("#alarmHistoryTbody");
                                    alarmHistory.funcs.renderHandler($tbody,alarmDatas);
                                    alarmHistory.pageSize = page.size;
                                })
                            }
                        }
                    })
                });
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents: function(buttons) {
            buttons.off('click').on('click',function() {
                if($(".alarm-checkbox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else{
                    layer.open({
                        type : 1,
                        title : "删除",
                        content : "<h5 style='text-align:center;'>您确定要删除选中数据吗？</h5>",
                        area: ['200px','140px'],
                        offset : 'auto',
                        btn: ['确定', '取消'],
                        closeBtn: 0,
                        yes : function(index) {
                            var alarmIdS = [];
                            /**存取所有选中行的id值 */
                            $(".alarm-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    alarmIdS.push(parseInt($(this).val()));
                                }
                            });
                            $.post(home.urls.eventAlarm.deleteByIds(), {
                                _method : "delete", ids : alarmIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        alarmHistory.init();
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                            });
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            layer.close(index);
                        }
                    })
                }
            })
        }
        /**绑定导出事件 */
        ,bingDownloadEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var dpPointId = $('#dpPoint').val();
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                if(beginDates === "" || endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                var href = home.urls.eventAlarm.exportByDpPointLike()+"?dpPointId="+ dpPointId +"&startTime="+ beginDates + "&endTime=" + endDates;
                $("#downloadA").attr("href",href);

            })
        }
        /**获取前一周日期 */
        ,getPreWeek : function() {
            var curDate = new Date();
            var oneweekdate = new Date(curDate-7*24*3600*1000).Format('yyyy-MM-dd hh:mm:ss');
            return oneweekdate;
        }
    }
};
