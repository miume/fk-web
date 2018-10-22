var singleDeviceAnalysis = {
    init : function(){
        singleDeviceAnalysis.funcs.bindSelectRenderEvent();
    }
    ,xAxis : []
    ,data : []
    ,data1 : []
    ,i : 0
    ,funcs : {
        bindSelectRenderEvent : function(){
            $.get(home.urls.equipmentLine.getAll(),{},function(result){
                var equipment = result.data;
                $("#equipmentSelect").empty();
                equipment.forEach(function(e){
                    $("#equipmentSelect").append("<option value="+e.id+">"+e.name+"</option>")
                })
                singleDeviceAnalysis.funcs.bindDefaultSearchEvent();
                singleDeviceAnalysis.funcs.bindAutoSearchEvent($("#searchButton"));
                singleDeviceAnalysis.funcs.bindRenderChartAnalysis();
            })
        }
        /**绑定默认搜索事件  默认选择本年1月到1月 */
        ,bindDefaultSearchEvent : function(){
            var date = new Date().Format("yyyy-")+"01";
            var startDate = date;
            var endDate = date;
            $("#startDate").val(date);
            $("#endDate").val(date);
            var deviceId = $("#equipmentSelect").val();
            var text = $("#equipmentSelect").find("option:selected").text();
            $("#selectedName").text(text);
            singleDeviceAnalysis.funcs.bindSearchEvent(startDate,endDate,deviceId);
        }
        /**绑定搜索按钮 */
        ,bindAutoSearchEvent : function(buttons){
            buttons.off("click").on("click",function(){
                $("#table").removeClass("hide");
                $("#charts").addClass("hide");
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var deviceId = $("#equipmentSelect").val();
                var text = $("#equipmentSelect").find("option:selected").text();
                $("#selectedName").text(text);
                singleDeviceAnalysis.funcs.bindSearchEvent(startDate,endDate,deviceId);
            })
        }
        /**绑定根据时间和设备搜索事件 */
        ,bindSearchEvent : function(startDate,endDate,deviceId){
            $.get(home.urls.equipmentAnalysis.singleDeviceUseEnergyAnalysis(),{
                startDate : startDate,
                endDate : endDate,
                deviceId : deviceId
            },function(result){
                var res = result.data;
                singleDeviceAnalysis.funcs.bindRenderTableData(res);
                singleDeviceAnalysis.funcs.bindDownloadEvent($("#download"));
            })
        }
        /**渲染表格数据 */
        ,bindRenderTableData : function(data){
            const $tbody = $("#singleDeviceTable").children("tbody");
            $tbody.empty();
            data.forEach(function(e){
                singleDeviceAnalysis.xAxis.push(e.date);
                singleDeviceAnalysis.data.push(e.totalUseElec);
                singleDeviceAnalysis.data1.push(e.unitUseElec);
                $tbody.append(
                    "<tr>"+
                    "<td>"+(e.date)+"</td>"+
                    "<td>"+(e.totalUseElec)+"</td>"+
                    "<td>"+(e.rawOre)+"</td>"+
                    "<td>"+(e.unitUseElec)+"</td>"+
                    "</tr>"
                )
            })
        }
        /**实现乒乓键 渲染柱状图*/
        ,bindRenderChartAnalysis : function(){
            $("#chartShow").click(function(){
                if(singleDeviceAnalysis.i == 0){
                    $("#table").addClass("hide");
                    $("#charts").removeClass("hide");
                    $("#chartShow").html('<i class="layui-icon">&#xe60d;</i> 表格分析');
                    var myChart = echarts.init(document.getElementById('bar'));
                    var option = {
                        xAxis : {
                            type : 'category',
                            data : singleDeviceAnalysis.xAxis
                        },
                        yAxis: {
                            type: 'value'
                        },
                        legend : {
                            data : ["用电量","单耗"],
                            padding: [5, 0]
                        },
                        series : [
                            {
                                name : "用电量",
                                type : 'bar',
                                data : singleDeviceAnalysis.data
                            },
                            {
                                name : "单耗",
                                type : 'bar',
                                data : singleDeviceAnalysis.data1
                            }
                        ]
                        };
                    myChart.setOption(option,notMerge=true);
                    // 根据窗口大小变动图标  无需刷新
                    window.onresize = function() {
                    myChart.resize();
                    }
                    singleDeviceAnalysis.i = 1;
                }
                else{
                    $("#table").removeClass("hide");
                    $("#charts").addClass("hide");
                    $("#chartShow").html('<i class="layui-icon">&#xe60d;</i> 图形分析');
                    singleDeviceAnalysis.i = 0;
                }
            })
        }
        /**绑定导出事件 */
        ,bindDownloadEvent : function(buttons){
            buttons.off("click").on("click",function(){
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var deviceId = $("#equipmentSelect").val();
                var href = home.urls.equipmentAnalysis.export()+ "?startDate="+(startDate)+"&endDate="+endDate+"&deviceId="+deviceId;
                location.href = href;
            })
        }
    }
}