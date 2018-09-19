productionMonthlyReport = {
    init : function() {
        //productionMonthlyReport.funcs.bindSelectRender();
        productionMonthlyReport.funcs.bindDefaultSearchEvent();
        productionMonthlyReport.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,funcs : {
        // /**渲染下拉框 */
        // bindSelectRender : function(){
        //     $.get(home.urls.clazz.getAll(), {} , function(result) {
        //          var clazz = result.data;
        //          $("#startClazz").empty();
        //          $("#endClazz").empty();
        //          $("#startClazz").html("<option value='-1'>请选择班次</option>");
        //          $("#endClazz").html("<option value='-1'>请选择班次</option>");
        //          clazz.forEach(function(e) {
        //             $("#startClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
        //             $("#endClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
        //          })
        //     })
        // }
         /**默认显示最近一个月的数据 */
         bindDefaultSearchEvent : function() {
            var date = new Date().Format("yyyy-MM");
            // date.setMonth(date.getMonth() - 1);  //当前日期减1
            // var startDate = new Date(date).Format("yyyy-MM-dd");
            // var endDate = new Date().Format("yyyy-MM-dd");
            $("#startDate").val(date);
            // $("#endDate").val(endDate);
            // var startClazz = "-1";
            // var endClazz = "-1";
            productionMonthlyReport.funcs.bindSearchEvent(date);
            productionMonthlyReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**选择任意时间进行搜索 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var date = $("#startDate").val();
                // var endDate = $("#endDate").val();
                if(date === "" ) {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                console.log(date)
                // var startClazz = $("#startClazz").val();
                // var endClazz = $("#endClazz").val();
                //productionMonthlyReport.funcs.bindSearchEvent(startDate,endDate,startClazz,endClazz);
                productionMonthlyReport.funcs.bindSearchEvent(date);
            })
        } 
        /**根据时间进行搜索 */
        ,bindSearchEvent : function(date) {
            $.get(home.urls.productionMonthReport.searchOre(),{
                date : date,
            },function(result) {
                var res = result.data;
                productionMonthlyReport.funcs.renderHandler(res);
                //var data = result.data;
                // /**分页消息 */
                // layui.laypage.render({
                //     elem : "productionMonthlyReport_page",
                //     count : 10 * data.totalPages,
                //     /**页面变换的逻辑 */
                //     jump : function(obj,first) {
                //         if(!first) {
                //             $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                //                 startDate : date,
                //                 endDate : date,
                //             },function(result) {
                //                 var res = result.data.content;
                //                 productionMonthlyReport.funcs.renderHandler(res);
                //             })
                //         }
                //     }
                // })
            })
        }
        /**渲染表格数据 */
        ,renderHandler : function(data) {
            const $tbody = $("#monthlyReportTable").children("tbody");
            $tbody.empty();
            var teamReports = data.teamReports;
            var sumMonthReport = data.sumMonthReport;
            var sumYearReport = data.sumYearReport;
            teamReports.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.team ? e.team.name : '') +"</td>" +
                    "<td>"+ (e.rawOre ? e.rawOre : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbGrad ? e.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreZnGrad ? e.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbZnGrad ? e.rawOrePbZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreSulphurGrad ? e.rawOreSulphurGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalPb ? e.rawOreMetalPb : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalZn ? e.rawOreMetalZn : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalSulphur ? e.rawOreMetalSulphur : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPb ? e.concentrateMetalPb : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalZn ? e.concentrateMetalZn : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPbZn ? e.concentrateMetalPbZn : '0') +"</td>" +
                    "<td>"+ (e.concentratePbGrad ? e.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnGrad ? e.concentrateZnGrad : '0') +"</td>" +
                    "<td>"+ (e.concentratePbRecovery ? e.concentratePbRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnRecovery ? e.concentrateZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateSulphurRecovery ? e.concentrateSulphurRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbRecovery ? e.sumPbRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumZnRecovery ? e.sumZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbZnRecovery ? e.sumPbZnRecovery : '0') +"</td>" +
                    "</tr>"
                )
            })
            if(sumMonthReport) {
                var e = sumMonthReport;
                $tbody.append(
                    "<tr>" +
                    "<td>月累</td>" +
                    "<td>"+ (e.rawOre ? e.rawOre : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbGrad ? e.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreZnGrad ? e.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbZnGrad ? e.rawOrePbZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreSulphurGrad ? e.rawOreSulphurGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalPb ? e.rawOreMetalPb : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalZn ? e.rawOreMetalZn : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalSulphur ? e.rawOreMetalSulphur : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPb ? e.concentrateMetalPb : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalZn ? e.concentrateMetalZn : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPbZn ? e.concentrateMetalPbZn : '0') +"</td>" +
                    "<td>"+ (e.concentratePbGrad ? e.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnGrad ? e.concentrateZnGrad : '0') +"</td>" +
                    "<td>"+ (e.concentratePbRecovery ? e.concentratePbRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnRecovery ? e.concentrateZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateSulphurRecovery ? e.concentrateSulphurRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbRecovery ? e.sumPbRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumZnRecovery ? e.sumZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbZnRecovery ? e.sumPbZnRecovery : '0') +"</td>" +
                    "</tr>"
                )
            }
            if(sumYearReport) {
                var e = sumYearReport;
                $tbody.append(
                    "<tr>" +
                    "<td>年累</td>" +
                    "<td>"+ (e.rawOre ? e.rawOre : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbGrad ? e.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreZnGrad ? e.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbZnGrad ? e.rawOrePbZnGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreSulphurGrad ? e.rawOreSulphurGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalPb ? e.rawOreMetalPb : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalZn ? e.rawOreMetalZn : '0') +"</td>" +
                    "<td>"+ (e.rawOreMetalSulphur ? e.rawOreMetalSulphur : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPb ? e.concentrateMetalPb : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalZn ? e.concentrateMetalZn : '0') +"</td>" +
                    "<td>"+ (e.concentrateMetalPbZn ? e.concentrateMetalPbZn : '0') +"</td>" +
                    "<td>"+ (e.concentratePbGrad ? e.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnGrad ? e.concentrateZnGrad : '0') +"</td>" +
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
                var date = $("#startDate").val();
                // var endDate = $("#endDate").val();
                if(date === "") {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var href = home.urls.productionMonthReport.export() + "?date=" + date;
                /**第一种方法 */
                //$("#downloadA").attr("href",href);
                /**第二种方法 */
                location.href = href;
            })
        }
    }
}