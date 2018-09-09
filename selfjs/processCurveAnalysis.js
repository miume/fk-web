var averageValues = 0;
var maxValues = 0;
var minValues = 0;
var curveAnalysis = {
    init: function() {
        curveAnalysis.funcs.renderLeftOption();
    }
    ,tableName : ""
    ,funcs: {
        /**渲染左边菜单*/
        renderLeftOption : function() {
            $.get(home.urls.group.getAll(),{},function(result) {
                var groups = result.data;
                const $tbody = $("#processItemTbody");
                $tbody.empty();
                groups.forEach(function(e) {
                    $tbody.append(
                        "<tr>"+
                        "<td id='group-"+e.id+"' class='setGroup'>"+e.name+"</td>"+
                        "</tr>"
                    )
                });
                var setGroups = $('.setGroup');
                curveAnalysis.funcs.renderDropData(setGroups); // 选中事件
                /**绑定开始分析事件 */
                curveAnalysis.funcs.bindAnalysisEvents($("#analyButton"));
            })
        }
        /**绑定开始分析事件 */
        ,bindAnalysisEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var parameterId = $("#parameterGroup").val();
                var startDate = $("#beginDate").val();
                var endDate = $("#endDate").val();
                $.get(home.urls.parameterData.getByTableNameAndDate(),{
                    tableName : curveAnalysis.tableName,
                    startDate : startDate,
                    endDate : endDate,
                    parameterId : parameterId
                    // tableName : "parameter_data1",
                    // startDate : "2018-09-04",
                    // endDate : "2018-09-08",
                    // parameterId : 8
                },function(result) {
                    var parameterDatas = result.data;
                    //  获取横坐标
                    var times = parameterDatas&&parameterDatas.times||'';
                    console.log(times);
                    //  获取纵左边
                    var values = parameterDatas&&parameterDatas.values||'';
                    //  渲染右边分析参数部分
                    // curveAnalysis.funcs.renderRightOption(parameterId);
                    curveAnalysis.funcs.renderRightOption(parameterId,times,values);
                    // curveAnalysis.funcs.renderCurveChart(times,values);
                })
            })
        }

        /** 渲染下拉框 */
        ,renderDropData : function(setGroups) {
            setGroups.off('click').on('click',function() {
                var id = $(this).attr('id').substr(6);
                $.get(home.urls.parameter.getByGroup(),{
                    groupId:id
                },function(result) {
                    var parameters = result.data;
                    curveAnalysis.tableName = parameters[0]&&parameters[0].group.tableName||'';
                    $("#parameterGroup").empty();
                    $("#parameterGroup").append('<option></option>');
                    parameters.forEach(function(e) {
                        $("#parameterGroup").append('<option value='+e.id+'>'+e.name+'</option>')
                    });
                });
            });
        }
        /**渲染右边菜单*/
        ,renderRightOption : function(id,times,values) {
            $.get(home.urls.parameter.getById(),{
                id : id
            },function(result) {
                var parameters = result.data;
                averageValues = parameters&&parameters.eps||0;
                maxValues = parameters&&parameters.upValue||0;
                minValues = parameters&&parameters.downValue||0;
                const $tbody = $("#processAnalysisTbody");
                $tbody.empty();
                $tbody.append(
                    "<tr>" +
                    "<td style='width:60%'>平均值</td>"+
                    "<td>"+ (parameters&&parameters.eps||0)+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>合格率</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td style='width:60%'>最大值</td>"+
                    "<td>"+ (parameters&&parameters.upValue||0)+"</td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td style='width:60%'>最小值</td>"+
                    "<td>"+ (parameters&&parameters.downValue||0)+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>最长超上限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>累计超上限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>最长超下限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>累计超下限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"
                );
                curveAnalysis.funcs.renderCurveChart(times,values);
            });
            // console.log("--------")
            // console.log(averageValues);
        }
        /** 绘制曲线图 */
        ,renderCurveChart : function(times,values) {
            var valueLength = values.length;
            var averageValue = [];
            var maxValue = [];
            var minValue = [];
            for(var i=0;i<valueLength;i++){
                averageValue.push(averageValues);
                maxValue.push(maxValues);
                minValue.push(minValues);
                // averageValue.push(2.2);
                // maxValue.push(2.4);
                // minValue.push(1.9);
            };
            var myChart = echarts.init(document.getElementById('parameterChart'));
            var option = {
                title : {
                    text : '参数值分析'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['参数值','平均值','上限','下限']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis : {
                    type : 'category',
                    boundaryGap: false,
                    data : times
                },
                yAxis : {
                    type: 'value'
                },
                series : [{
                    name: '参数值',
                    data : values,
                    type : 'line'
                },{
                    name: '平均值',
                    data : averageValue,
                    type : 'line'
                },{
                    name: '上限',
                    data : maxValue,
                    type : 'line'
                },{
                    name: '下限',
                    data : minValue,
                    type : 'line'
                }]
            };
            myChart.setOption(option);
            // 根据窗口大小变动图标  无需刷新
            window.onresize = function() {
                myChart.resize();
            }
        }
        /**绑定选中事件*/
        // ,changeGroup : function(setGroups) {
        //     setGroups.off('click').on('click',function() {
        //         var id = $(this).attr('id').substr(6);
        //         // console.log(id);
        //
        //     })
        // }
        /**渲染右边事件*/
        // ,renderRight : function() {
        //
        // }
    }
};