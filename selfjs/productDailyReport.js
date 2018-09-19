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
                console.log(date)
                productDailyReport.funcs.bindSearchEvent(date);
            })
        } 
        /**根据时间进行搜索 */
        ,bindSearchEvent : function(date) {
            $.get(home.urls.productionDayReport.searchOre(),{
                date : date
            },function(result) {
                var res = result.data;
                productDailyReport.funcs.renderHandler(res);
                //var data = result.data;
                // /**分页消息 */
                // layui.laypage.render({
                //     elem : "productDailyReport_page",
                //     count : 10 * data.totalPages,
                //     /**页面变换的逻辑 */
                //     jump : function(obj,first) {
                //         if(!first) {
                //             $.get(home.urls.productionDayReport.searchOre(),{
                //                 date : date
                //             },function(result) {
                //                 var res = result.data;
                //                 productDailyReport.funcs.renderHandler(res);
                //             })
                //         }
                //     }
                // })
            })
        }
        /**渲染表格数据 */
        ,renderHandler : function(data) {
            const $tbody = $("#dailyReportTable").children("tbody");
            $tbody.empty();
            var classReports = data.classReports;
            var sumDayReport = data.sumDayReport;
            var sumMonthReport = data.sumMonthReport;
            classReports.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.clazz ? e.clazz.name : '') +"</td>" +
                    "<td>"+ (e.team ? e.team.name : '') +"</td>" +
                    "<td>"+ (e.rawOre ? e.rawOre : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbGrad ? e.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbZnGrad ? e.rawOrePbZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreZnGrad ? e.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalPb ? e.rawOreMetalPb : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalZn ? e.rawOreMetalZn : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalSulphur ? e.rawOreMetalSulphur : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPb ? e.concentrateMetalPb : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalZn ? e.concentrateMetalZn : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPbZn ? e.concentrateMetalPbZn : '0') +"</td>" +
                    "<td>"+ (e.discountSulphurWeight ? e.discountSulphurWeight : '0') +"</td>" +
                    "<td>"+ (e.concentratePbGrad ? e.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnGrad ? e.concentrateZnGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateSulphurGrad ? e.concentrateSulphurGrad : '0') +"</td>" +
                    "<td>"+ (e.concentratePbRecovery ? e.concentratePbRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnRecovery ? e.concentrateZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateSulphurRecovery ? e.concentrateSulphurRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbRecovery ? e.sumPbRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumZnRecovery ? e.sumZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbZnRecovery ? e.sumPbZnRecovery : '0') +"</td>" +
                    "</tr>"
                )
            })
            if(sumDayReport) {
                $tbody.append(
                    "<tr>" +
                    "<td colspan='2'>日累</td>" +
                    "<td>"+ (sumDayReport.rawOre ? sumDayReport.rawOre : '0') +"</td>" +
                    "<td>"+ (sumDayReport.rawOrePbGrad ? sumDayReport.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (sumDayReport.rawOrePbZnGrad ? sumDayReport.rawOrePbZnGrad : '0') +"</td>" +
                    "<td>"+ (sumDayReport.rawOreZnGrad ? sumDayReport.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (sumDayReport.rawOreMetalPb ? sumDayReport.rawOreMetalPb : '0') +"</td>" +
                    "<td>"+ (sumDayReport.rawOreMetalZn ? sumDayReport.rawOreMetalZn : '0') +"</td>" +
                    "<td>"+ (sumDayReport.rawOreMetalSulphur ? sumDayReport.rawOreMetalSulphur : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateMetalPb ? sumDayReport.concentrateMetalPb : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateMetalZn ? sumDayReport.concentrateMetalZn : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateMetalPbZn ? sumDayReport.concentrateMetalPbZn : '0') +"</td>" +
                    "<td>"+ (sumDayReport.discountSulphurWeight ? sumDayReport.discountSulphurWeight : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentratePbGrad ? sumDayReport.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateZnGrad ? sumDayReport.concentrateZnGrad : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateSulphurGrad ? sumDayReport.concentrateSulphurGrad : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentratePbRecovery ? sumDayReport.concentratePbRecovery : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateZnRecovery ? sumDayReport.concentrateZnRecovery : '0') +"</td>" +
                    "<td>"+ (sumDayReport.concentrateSulphurRecovery ? sumDayReport.concentrateSulphurRecovery : '0') +"</td>" +
                    "<td>"+ (sumDayReport.sumPbRecovery ? sumDayReport.sumPbRecovery : '0') +"</td>" +
                    "<td>"+ (sumDayReport.sumZnRecovery ? sumDayReport.sumZnRecovery : '0') +"</td>" +
                    "<td>"+ (sumDayReport.sumPbZnRecovery ? sumDayReport.sumPbZnRecovery : '0') +"</td>" +
                    "</tr>"
                )
            }
            if(sumMonthReport)  {
                var e = sumMonthReport;
                $tbody.append(
                    "<tr>" +
                    "<td colspan='2'>月累</td>" +
                    "<td>"+ (e.rawOre ? e.rawOre : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbGrad ? e.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbZnGrad ? e.rawOrePbZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreZnGrad ? e.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalPb ? e.rawOreMetalPb : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalZn ? e.rawOreMetalZn : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalSulphur ? e.rawOreMetalSulphur : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPb ? e.concentrateMetalPb : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalZn ? e.concentrateMetalZn : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPbZn ? e.concentrateMetalPbZn : '0') +"</td>" +
                    "<td>"+ (e.discountSulphurWeight ? e.discountSulphurWeight : '0') +"</td>" +
                    "<td>"+ (e.concentratePbGrad ? e.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnGrad ? e.concentrateZnGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateSulphurGrad ? e.concentrateSulphurGrad : '0') +"</td>" +
                    "<td>"+ (e.concentratePbRecovery ? e.concentratePbRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnRecovery ? e.concentrateZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateSulphurRecovery ? e.concentrateSulphurRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbRecovery ? e.sumPbRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumZnRecovery ? e.sumZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbZnRecovery ? e.sumPbZnRecovery : '0') +"</td>" +
                    "</tr>"
                )
            }
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
                var href = home.urls.productionDayReport.export() + "?date=" + date;
                /**第一种方法 */
                //$("#downloadA").attr("href",href);
                /**第二种方法 */
                location.href = href;
            })
        }
    }
}