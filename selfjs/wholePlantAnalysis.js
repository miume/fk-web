var wholePlant = {
    init : function(){
        wholePlant.funcs.renderTable();
    }
    ,funcs : {
        renderTable:function(){
            /**获取当前月份 */
            var date=new Date;
            var year=date.getFullYear(); 
            var month=date.getMonth()+1;
            month =(month<10 ? "0"+month:month);
            mon = "0" + 1
            var nowDate = (year.toString()+'-'+month.toString());
            var startDate = (year.toString()+'-'+mon.toString());
            $("#startTime").val(startDate)
            $("#endTime").val(nowDate)
            $.get(home.urls.powerConsumptionMonthTotal.getByDateBetween(),{
                startDate:startDate,
                endDate:nowDate
            },function(result){
                var datas = result.data;
                const $tbody = $("#useTbody")
                wholePlant.funcs.renderHandler($tbody,datas)
            })
            /**绑定搜索事件 */
            wholePlant.funcs.bindSearchEvents($("#searchButton"))
            /**绑定导出事件 */
            wholePlant.funcs.bindDownloadEvents($("#downloadButton"))
            /**绑定图表事件 */
            wholePlant.funcs.bindGraphEvents($("#graphButton"))
        }
        ,/**绑定图表事件 */
        bindGraphEvents : function(buttons){
            buttons.off("click").on("click",function(){
                $("#parameterChart").removeClass("hide")
                $("#table").addClass("hide")
                var startDate = $("#startTime").val()
                var endTime = $("#endTime").val()
                $.get(home.urls.powerConsumptionMonthTotal.getByDateBetween(),{
                    startDate:startDate,
                    endDate:endTime
                },function(result){
                    var datas = result.data;
                    var myChart = echarts.init(document.getElementById('parameterChart'));
                    var option = {
                        title : {
                            text : '全厂单耗分析'
                        },
                        xAxis: {
                            type: 'category',
                            data: datas.dates
                        },
                        yAxis: {
                            type: 'value'
                        },
                        legend:{
                            data: ["去年","当年"]
                        },
                        series:[
                            {
                                name:"去年",
                                data:datas.lastUnitUseElecs,
                                type:"bar"
                            },
                            {
                                name:"当年",
                                data:datas.curUnitUseElecs,
                                type:"bar"
                            },
                        ]
                    };
                    myChart.setOption(option,notMerge=true);
                    // 根据窗口大小变动图标  无需刷新
                    window.onresize = function() {
                        myChart.resize();
                    }
                })
            })
        }
        /**导出事件 */
        ,bindDownloadEvents : function(buttons){
            buttons.off("click").on("click",function(){
                var startDate = $("#startTime").val()
                var endTime = $("#endTime").val()
                var href = home.urls.powerConsumptionMonthTotal.export()+"?startDate=" + startDate + "&endDate=" + endTime;
                location.href = href;
                
            })
        }
        /**搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off("click").on("click",function(){
                $("#parameterChart").addClass("hide")
                $("#table").removeClass("hide")
                var startDate = $("#startTime").val()
                var endTime = $("#endTime").val()
                $.get(home.urls.powerConsumptionMonthTotal.getByDateBetween(),{
                    startDate:startDate,
                    endDate:endTime
                },function(result){
                    var datas = result.data;
                    const $tbody = $("#useTbody")
                    wholePlant.funcs.renderHandler($tbody,datas)
                })
            })
        }
        ,renderHandler : function($tbody,datas){
            $tbody.empty();
            var length = datas.dates.length;
            for(var i=0;i<length;i++){
                $tbody.append(
                    "<tr>" + 
                    "<td>" + (datas.dates[i]) + "</td>"+
                    "<td>" + (datas.curUnitUseElecs[i]) + "</td>"+
                    "<td>" + (datas.lastUnitUseElecs[i]) + "</td>"+
                    "</tr>"
                )
            }
        }
    }
}