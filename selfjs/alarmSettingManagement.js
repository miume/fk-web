var alarmSetting = {
    init : function() {
        alarmSetting.funcs.renderTable();
        var out = $("#alarmSettingPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#alarmSettingPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,funcs : {
        renderTable : function() {
            $.get(home.urls.alarmSetting.getAllByPage(),{},function (result) {
                var alarmDatas = result.data.content;
                var page = result.data;
                const $tbody = $("#alarmSettingTbody");
                alarmSetting.funcs.renderHandler($tbody,alarmDatas,0);
                alarmSetting.pageSize = page.size;
                /**分页信息 */
                layui.laypage.render({
                    elem: "alarmSettingPage",
                    count: page.totalElements ,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.alarmSetting.getAllByPage(),{
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var alarmDatas = result.data.content;
                                const $tbody = $("#alarmSettingTbody");
                                alarmSetting.funcs.renderHandler($tbody,alarmDatas,page);
                                alarmSetting.pageSize = page.size;
                            })
                        }
                    }
                })
            });
            /**绑定新增事件 */
            // alarmSetting.funcs.bindAddByIdsEvents($("#addButton"));
            /**绑定批量删除事件 */
            // alarmSetting.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定导出事件 */
            // alarmSetting.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定搜索事件 */
            // alarmSetting.funcs.bindSearchEvents($("#searchButton"));
        }
        ,renderHandler : function ($tbody, alarmDatas, page) {
            $tbody.empty();

        }
    }
};