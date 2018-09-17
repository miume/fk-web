productionMonthlyReport = {
    init : function() {
        productionMonthlyReport.funcs.bindSelectRender();
        productionMonthlyReport.funcs.bindDefaultSearchEvent();
        productionMonthlyReport.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,funcs : {
        /**渲染下拉框 */
        bindSelectRender : function(){
            $.get(home.urls.clazz.getAll(), {} , function(result) {
                 var clazz = result.data;
                 $("#startClazz").empty();
                 $("#endClazz").empty();
                 $("#startClazz").html("<option value='-1'>请选择班次</option>");
                 $("#endClazz").html("<option value='-1'>请选择班次</option>");
                 clazz.forEach(function(e) {
                    $("#startClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                    $("#endClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                 })
            })
        }
         /**默认显示最近一个月的数据 */
         ,bindDefaultSearchEvent : function() {
            var date = new Date();
            date.setMonth(date.getMonth() - 1);  //当前日期减1
            var startDate = new Date(date).Format("yyyy-MM-dd");
            var endDate = new Date().Format("yyyy-MM-dd");
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            var startClazz = "-1";
            var endClazz = "-1";
            productionMonthlyReport.funcs.bindSearchEvent(startDate,endDate,startClazz,endClazz);
            productionMonthlyReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**选择任意时间进行搜索 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                if(startDate === "" || endDate === "" ) {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var startClazz = $("#startClazz").val();
                var endClazz = $("#endClazz").val();
                productionMonthlyReport.funcs.bindSearchEvent(startDate,endDate,startClazz,endClazz);
            })
        } 
        /**根据时间进行搜索 */
        ,bindSearchEvent : function(startDate,endDate,startClazz,endClazz) {
            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                startDate : startDate,
                endDate : endDate,
            },function(result) {
                var res = result.data.content;
                productionMonthlyReport.funcs.renderHandler(res);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "productionMonthlyReport_page",
                    count : 10 * data.totalPages,
                    /**页面变换的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                                startDate : date,
                                endDate : date,
                            },function(result) {
                                var res = result.data.content;
                                productionMonthlyReport.funcs.renderHandler(res);
                            })
                        }
                    }
                })
            })
        }
        /**渲染表格数据 */
        ,renderHandler : function(data) {
            const $tbody = $("#monthlyReportTable").children("tbody");
            $tbody.empty();
            console.log(data)
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
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
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                if(startDate === "" || endDate === "" ) {
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