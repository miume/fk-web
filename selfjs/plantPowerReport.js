var powerReport = {
    init : function(){
        powerReport.funcs.renderTable();
        var out = $("#report_page").width();
         var time = setTimeout(function(){
             var inside = $(".layui-laypage").width();
             $('#report_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
             clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        renderTable : function(){
            var date = new Date();
            var year = date.getFullYear();
            $.get(home.urls.monthPowerReport.getAll(),{},function(result){
                var reports = result.data.content
                const $tbody = $("#reportTable").children("tbody");
                powerReport.funcs.renderHandler1($tbody,reports);
                powerReport.pageSize = result.data.length;
                var page = result.data.content;
                /**分页信息 */
                layui.laypage.render({
                    elem: "report_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.monthPowerReport.getAll(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                const $tbody = $("#reportTable").children("tbody");
                                powerReport.funcs.renderHandler1($tbody, reports);
                                powerReport.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定查询事件 */
            powerReport.funcs.bindSearchEvent($("#searchButton"));

        }
        /**查询事件 */
        ,bindSearchEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var startDate = $("#startTime").val();
                var endDate = $("#endTime").val();
                console.log(startDate)
                console.log(startDate)
                $.get(home.urls.monthPowerReport.getByYearMonth(),{
                    startDate : startDate,
                    endDate : endDate
                },function(reuslt){
                    var reports = result.data.content
                    const $tbody = $("#reportTable").children("tbody");
                    powerReport.funcs.renderHandler1($tbody,reports);
                    powerReport.pageSize = result.data.length;
                    var page = result.data.content;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "report_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.monthPowerReport.getByYearMonth,{
                                    startDate : startDate,
                                    endDate : endDate,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    const $tbody = $("#reportTable").children("tbody");
                                    powerReport.funcs.renderHandler1($tbody, reports);
                                    powerReport.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**渲染报表 */
        ,renderHandler1 : function($tbody,reports){
            $tbody.empty();
            reports.forEach(function(e){
                var date = e.yearMonth;
                date = date + ""
                var y = date.substr(0,4)
                var m = date.substr(4)
                var d = y + "-" + m;
                $tbody.append(
                    "<tr>" +
                    "<td>" + (d) + "</td>" +
                    "<td>" + (e.timeInterval) + "</td>" +
                    "<td>" + (e.reportType ? e.reportType : ' ') + "</td>" +
                    "<td>" + (e.creator ? e.creator.name : ' ') + "</td>" +
                    "<td>" + (e.createTime) + "</td>" +
                    "<td>" + 
                    "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看报表</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                    "<a href='#' class='reExpert' id='expert-" + (e.id) + "'>重新生成</a>" + "</td>" +
                    "</tr>"
                )
            })
            /**转到详情表 */
            powerReport.funcs.bindChangeToDetail($(".detail"));
            /**绑定重新生成报表事件 */
            powerReport.funcs.bindReprodecuReport($(".reproduce"));
        }
        /**转到详情表 */
        ,bindChangeToDetail : function(buttons){
            buttons.off('click').on('click',function(){
                $("#block1").addClass("hidePage");
                $("#block2").removeClass("hidePage");
                var id = $(this).attr("id").substr(7)
                powerReport.funcs.renderDetailTable(id);
            })
        }
        /**重新生成报表 */
        ,bindReprodecuReport : function(buttons){
            buttons.off('click').on('click',function(){
                
            })
        }
    /**月报表详情 */
    ,renderDetailTable : function(id) {
        $.get(home.urls.monthPowerReport.getById(),{id : id},function(result){
            var detail = result.data.details;
            var data = result.data;
            if(detail.toString() === ""){
                layer.msg("很抱歉，该月没有报表数据 ！")
                return
            } else{
            //    var date = result.data.yearMonth;
            //    date = date + ""
            //    var y = date.substr(0,4)
            //    var m = date.substr(4)
            //    var d = y + "-" + m;
            //    $("#monthTime1").val(d);
            //    const $tbody = $("#monthDetailTable").children("tbody");
            //    crushing.funcs.renderHandler3($tbody,detail,data);
            }
        })
        /**绑定导出事件 */
        crushing.funcs.bindExpertReportEvent($("#expertButton2"));
    }





    }
}