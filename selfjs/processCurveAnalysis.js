var averageValues = 0;
var upValues = 0;
var downValues = 0;
var curveAnalysis = {
    init: function() {
        curveAnalysis.funcs.renderLeftOption();
    }
    ,tableName : ""
    ,funcs: {
        /**渲染初始页面*/
        renderTable : function() {
            $.get(home.urls.group.getAll(),{},function(result) {
                var groups = result.data[0];
                console.log(groups);
                var id = groups.id;
                $('#parameterChart').removeClass('hide');
                $('#analysisDiv').removeClass('hide');
                $('#group-'+id).addClass('selected_Item').css('color','#ffffff');
                $('#group-'+id).addClass('selected_BgItem').css('background','rgb(112,118,139)');
                // const $tbody = $("#processItemTbody");
                $.get(home.urls.parameter.getByGroup(),{
                    groupId:id
                },function(result) {
                    var parameters = result.data;
                    //  获取第一个数据的表名
                    var firstTableName  = parameters[0]&&parameters[0].group.tableName||'';
                    //  获取第一个参数id
                    var firstParameterId = parameters[0]&&parameters[0].id;
                    //  获取第一个参数的名字
                    var firstParameterName = parameters[0]&&parameters[0].name;
                    //  获取当时时间和提前2小时时间
                    var nowDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    var day = new Date();
                    var hour = day.getHours() - 2;
                    var preHour = hour>10 ? hour : '0'+hour ;
                    var min = day.getMinutes()>10 ? day.getMinutes() : '0'+day.getMinutes() ;
                    var second = day.getSeconds()>10 ? day.getSeconds() : '0'+day.getSeconds() ;
                    var preDate = day.Format("yyyy-MM-dd")+' ' + preHour + ':' + min + ":" + second;
                    $("#beginDate").val(preDate);
                    $("#endDate").val(nowDate);
                    $("#parameterGroup").append('<option>'+ firstParameterName +'</option>');
                    $.get(home.urls.parameterData.getByTableNameAndDate(),{
                        tableName : firstTableName,
                        startDate : preDate,
                        endDate : nowDate,
                        parameterId : firstParameterId
                    },function(result) {
                        var parameterDatas = result.data;
                        //  获取横坐标
                        var times = parameterDatas&&parameterDatas.times||'';
                        //  获取纵左边
                        var values = parameterDatas&&parameterDatas.values||'';
                        //  渲染右边分析参数部分
                        curveAnalysis.funcs.renderRightOption(firstParameterId,times,values);
                    })
                })

            })
        }
        /**渲染左边菜单*/
        ,renderLeftOption : function() {
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
                /**渲染初始页面 */
                curveAnalysis.funcs.renderTable();
            })
        }
        /**绑定开始分析事件 */
        ,bindAnalysisEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                $('#parameterChart').removeClass('hide');
                $('#analysisDiv').removeClass('hide');
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
                    //  渲染右边分析参数部分
                    curveAnalysis.funcs.renderRightOption(parameterId,parameterDatas);
                })
            })
        }

        /** 渲染下拉框 */
        ,renderDropData : function(setGroups) {
            setGroups.off('click').on('click',function() {
                $('#parameterChart').addClass('hide');
                $('#analysisDiv').addClass('hide');
                $('.setGroup').removeClass('selected_Item').css('color', '');
                $('.setGroup').removeClass('selected_BgItem').css('background', '');
                $(this).addClass('selected_Item').css('color','#ffffff');
                $(this).addClass('selected_BgItem').css('background','rgb(112,118,139)');
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
        ,renderRightOption : function(id,parameterDatas) {
            //  获取横坐标
            var times = parameterDatas&&parameterDatas.times||'';
            //  获取纵左边
            var values = parameterDatas&&parameterDatas.values||'';
            $.get(home.urls.parameter.getById(),{
                id : id
            },function(result) {
                var parameters = result.data;
                averageValues = parameterDatas&&parameterDatas.average.toFixed(0)||0;
                upValues = parameters&&parameters.upValue||0;
                downValues = parameters&&parameters.downValue||0;
                const $tbody = $("#processAnalysisTbody");
                $tbody.empty();
                $tbody.append(
                    "<tr>" +
                    "<td style='width:60%'>期望</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.average.toFixed(0)||0)+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>合格率</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.passPercent.toFixed(2)*100||0)+"%</td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td style='width:60%'>最大值</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.max.toFixed(0)||0)+"</td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td style='width:60%'>最小值</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.min.toFixed(0)||0)+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>最长超上限时间</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.maxOverUp.toFixed(0)||0)+"分钟</td>"+
                    "</tr>"+
                    "<td style='width:60%'>累计超上限时间</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.sumOverUp.toFixed(0)||0)+"分钟</td>"+
                    "</tr>"+
                    "<td style='width:60%'>最长超下限时间</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.maxOverDown.toFixed(0)||0)+"分钟</td>"+
                    "</tr>"+
                    "<td style='width:60%'>累计超下限时间</td>"+
                    "<td>"+ (parameterDatas&&parameterDatas.sumOverDown.toFixed(0)||0)+"分钟</td>"+
                    "</tr>"
                );
                curveAnalysis.funcs.renderCurveChart(times,values);
            });
        }
        /** 绘制曲线图 */
        ,renderCurveChart : function(times,values) {
            var valueLength = values.length;
            var averageValue = [];
            var upValue = [];
            var downValue = [];
            for(var i=0;i<valueLength;i++){
                averageValue.push(averageValues);
                upValue.push(upValues);
                downValue.push(downValues);
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
                    data : upValue,
                    type : 'line'
                },{
                    name: '下限',
                    data : downValue,
                    type : 'line'
                }]
            };
            myChart.setOption(option);
            // 根据窗口大小变动图标  无需刷新
            window.onresize = function() {
                myChart.resize();
            }
        }
    }
};