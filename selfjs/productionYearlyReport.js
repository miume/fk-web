productionYearlyReport = {
    init : function() {
        productionYearlyReport.funcs.bindSelectRender();
        productionYearlyReport.funcs.bindDefaultSearchEvent();
        productionYearlyReport.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,funcs : {
        /**渲染下拉框 */
        bindSelectRender : function(){
            $.get(home.urls.team.getAll(), {} , function(result) {
                 var team = result.data;
                 $("#team").empty();
                 $("#team").html("<option value='-1'>所有班组</option>");
                 team.forEach(function(e) {
                    $("#team").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                 })
            })
        }
        /**默认显示当年的数据 */
        ,bindDefaultSearchEvent : function() {
            var startYear = new Date().Format("yyyy");
            var endYear = new Date().Format("yyyy");
            $("#startYear").val(startYear);
            $("#endYear").val(endYear);
            var teamId = "-1";
            productionYearlyReport.funcs.bindSearchEvent(startYear,endYear,teamId);
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
                var teamId = $("#team").val();
                productionYearlyReport.funcs.bindSearchEvent(startYear,endYear,teamId);
            })
        } 
        /**根据时间进行搜索 */
        ,bindSearchEvent : function(startYear,endYear,teamId) {
            $.get(home.urls.productionYearReport.searchOre(),{
                startYear : startYear,
                endYear : endYear,
                teamId : teamId
            },function(result) {
                var res = result.data;
                console.log(res)
                productionYearlyReport.funcs.renderHandler(res);
        })
    }
        /**渲染表格数据 */
        ,renderHandler : function(data) {
            const $tbody = $("#yearlyReportTable").children("tbody");
            $tbody.empty();
            var startYear = parseInt($("#startYear").val());
            var endYear = parseInt($("#endYear").val()); 
            console.log("startYear="+startYear)
            console.log("endYear="+endYear)
            while( startYear <= endYear ) {
                console.log(data[startYear.toString()])
                if(data[startYear]) {
                    var lens = data[startYear.toString()].length;
                    console.log(lens)
                    var flag = 0; //用来标记渲染的第一条数据
                    data[startYear.toString()].forEach(function(e) {
                        if(flag === 0) {
                            $tbody.append(
                                "<tr>" +
                                "<td rowspan="+ (lens) +">"+ (startYear) +"</td>" +
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
                            flag = 1;
                        }
                        else {
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
                        }   
                    })
                }
                startYear += 1;
            }
            
        }
        /**绑定根据日期导出表格事件 */
        ,bindExportTableEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startYear = $("#startYear").val();
                var endYear = $("#endYear").val();
                var teamId = $("#team").val();
                if(startYear === "" || endYear === "" ) {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var href = home.urls.productionYearReport.export() + "?startYear=" + startYear + "&endYear=" + endYear + "&teamId=" + teamId ;
                /**第一种方法 */
                //$("#downloadA").attr("href",href);
                /**第二种方法 */
                location.href = href;
            })
        }
    }
}