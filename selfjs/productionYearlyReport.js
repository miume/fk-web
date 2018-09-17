productionYearlyReport = {
    init : function() {
        productionYearlyReport.funcs.bindSelectRender();
        productionYearlyReport.funcs.bindDefaultSearchEvent();
        productionYearlyReport.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,funcs : {
        /**渲染下拉框 */
        bindSelectRender : function(){
            $.get(home.urls.clazz.getAll(), {} , function(result) {
                 var clazz = result.data;
                 $("#clazz").empty();
                 $("#clazz").html("<option value='-1'>请选择班次</option>");
                 clazz.forEach(function(e) {
                    $("#clazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                 })
            })
        }
        /**默认显示当年的数据 */
        ,bindDefaultSearchEvent : function() {
            var startYear = new Date().Format("yyyy");
            var endYear = new Date().Format("yyyy");
            $("#startYear").val(startYear);
            $("#endYear").val(endYear);
            var clazz = "-1";
            productionYearlyReport.funcs.bindSearchEvent(startYear,endYear,clazz);
            productionYearlyReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**选择任意时间进行搜索 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startYear = $("#startYear").val();
                var endYear = $("#endYear").val();
                if(startYear === "" || endYear === "" ) {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var clazz = $("#clazz").val();
                productionYearlyReport.funcs.bindSearchEvent(startYear,endYear,clazz);
            })
        } 
        /**根据时间进行搜索 */
        ,bindSearchEvent : function(startYear,endYear,clazz) {
            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                startYear : startYear,
                endYear : endYear,
            },function(result) {
                var res = result.data.content;
                productionYearlyReport.funcs.renderHandler(res);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "productionYearlyReport_page",
                    count : 10 * data.totalPages,
                    /**页面变换的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                                startYear : date,
                                endYear : date,
                            },function(result) {
                                var res = result.data.content;
                                productionYearlyReport.funcs.renderHandler(res);
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
                var startYear = $("#startYear").val();
                var endYear = $("#endYear").val();
                if(startYear === "" || endYear === "" ) {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var href = home.urls.materialConsumptionManagement.exportBystartYearAndendYear() + "?date=" + date;
                /**第一种方法 */
                //$("#downloadA").attr("href",href);
                /**第二种方法 */
                location.href = href;
            })
        }
    }
}