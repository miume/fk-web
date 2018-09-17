productDailyReport = {
    init : function() {
        productDailyReport.funcs.bindDefaultSearchEvent();
        productDailyReport.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,funcs : {
        /**默认显示当前日期的前一天 */
        bindDefaultSearchEvent : function() {
            var date = new Date();
            date.setDate(date.getDate() - 1);  //当前日期减1
            var formerDate = new Date(date).Format("yyyy-MM-dd");
            $("#date").val(formerDate);
            productDailyReport.funcs.bindSearchEvent(formerDate);
            productDailyReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**选择任意时间进行搜索 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var date = $("#date").val();
                if(date === "") {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                productDailyReport.funcs.bindSearchEvent(date);
            })
        } 
        /**根据时间进行搜索 */
        ,bindSearchEvent : function(date) {
            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                startDate : date,
                endDate : date,
            },function(result) {
                var res = result.data.content;
                productDailyReport.funcs.renderHandler(res);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "productDailyReport_page",
                    count : 10 * data.totalPages,
                    /**页面变换的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                                startDate : date,
                                endDate : date,
                            },function(result) {
                                var res = result.data.content;
                                productDailyReport.funcs.renderHandler(res);
                            })
                        }
                    }
                })
            })
        }
        /**渲染表格数据 */
        ,renderHandler : function(data) {
            const $tbody = $("#dailyReportTable").children("tbody");
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.date ? e.date : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "<td>"+ (e.id ? e.id : '') +"</td>" +
                    "</tr>"
                )
            })
        }
        /**绑定根据日期导出表格事件 */
        ,bindExportTableEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var date = $("#date").val();
                if(date === "") {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var href = home.urls.materialConsumptionManagement.exportByStartDateAndEndDate() + "?date=" + date;
                /**第一种方法 */
                //$("#downloadA").attr("href",href);
                /**第二种方法 */
                location.href = href;
            })
        }
    }
}