var process = {
    init : function(){
        //section.funcs.dropBox();
        $.get(home.urls.processName.getAll(),{},function(result) {
               
            var checks = result.data; 
            $("#process").empty();
            checks.forEach(function(e) {
                $("#process").append('<option value='+e.id+' id='+e.id+'>'+e.name+'</option>')
            })
            process.funcs.renderTable();})
    }
    ,funcs : {
        renderTable : function(){
           // $("#section").find("option").eq(0).prop("selected",true)
            var date = new Date();
            var year = date.getFullYear();
            $("#year").val(year);
            $.get(home.urls.procedureUseElec.realAndPlan(),{
                date : year,
                procedureId : $("#process").val()
            },function(result){
                var data = result.data
                $("#yearUse").val(data.thisYearUsedSum)
                $("#yearPlanUse").val(data.thisYearPlanSum)
                $("#difference").val(data.thisMinus)
                $('#useChart').removeClass('hide');
                var planUse = []
                var month = []
                for(var i in data.thisYearPlan){
                    month.push(i)
                    planUse.push(data.thisYearPlan[i])
                }
                var use = []
                for(var i in data.thisYearUsed){
                    use.push(data.thisYearUsed[i])
                }
                var myChart = echarts.init(document.getElementById('useChart'));
                var option = {
                    title : {
                        text : '用电对比'
                    },
                    xAxis: {
                        type: 'category',
                        data: month
                    },
                    yAxis: {
                        type: 'value'
                    },
                    legend:{
                        data: ["计划使用","本月使用"]
                    },
                    series:[
                        {
                            name:"计划使用",
                            data:planUse,
                            type:"bar"
                        },
                        {
                            name:"本月使用",
                            data:use,
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
            /**绑定查找区间事件 */
            process.funcs.bindFindEvents($("#searchButton"));
        }
        ,bindFindEvents : function(buttons){
            buttons.off("click").on('click',function(){
                var year = $("#year").val();
                var procedureId = $("#process").val()
                $.get(home.urls.procedureUseElec.realAndPlan(),{
                    date : year,
                    procedureId : procedureId
                },function(result){
                    var data = result.data
                    if(data == null){
                        layer.msg(result.message)
                    }else{
                        $("#yearUse").val(data.thisYearUsedSum)
                        $("#yearPlanUse").val(data.thisYearPlanSum)
                        $("#difference").val(data.thisMinus)
                        $('#useChart').removeClass('hide');
                        var planUse = []
                        var month = []
                        for(var i in data.thisYearPlan){
                            month.push(i)
                            planUse.push(data.thisYearPlan[i])
                        }
                        var use = []
                        for(var i in data.thisYearUsed){
                            use.push(data.thisYearUsed[i])
                        }
                        var myChart = echarts.init(document.getElementById('useChart'));
                        var option = {
                            title : {
                                text : '用电对比'
                            },
                            xAxis: {
                                type: 'category',
                                data: month
                            },
                            yAxis: {
                                type: 'value'
                            },
                            legend:{
                                data: ["计划使用","本月使用"]
                            },
                            series:[
                                {
                                    name:"计划使用",
                                    data:planUse,
                                    type:"bar"
                                },
                                {
                                    name:"本月使用",
                                    data:use,
                                    type:"bar"
                                },
                            ]
                        };
                        myChart.setOption(option,notMerge=true);
                        // 根据窗口大小变动图标  无需刷新
                        window.onresize = function() {
                            myChart.resize();
                        }
                    }
                })
            })
        }
    }
}