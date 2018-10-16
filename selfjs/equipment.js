var equipment = {
    init : function(){
        equipment.funcs.renderTable();
        equipment.funcs.renderCheckbox();
    }
    ,funcs : {
        /**渲染左右两个表格 */
        renderTable : function(){
            $("#leftDiv").removeClass("hide")
            $("#rightDiv").removeClass("hide")
            $("#parameterChart").addClass("hide")
            $("#monthTime").removeClass("hide");
            $("#timeType").val(2)
            
            var date1 = new Date();
            date1.setMonth(date1.getMonth()-1);
            var year1=date1.getFullYear(); 
            var month1=date1.getMonth()+2;
            month1 =(month1<10 ? "0"+month1:month1); 
            sDate = (year1.toString()+'-'+month1.toString());
            $("#monthT").val(sDate)
            var deviceId = [];
            $.get(home.urls.equipmentLine.getAll(),{},function(result){
                var checks = result.data
                checks.forEach(function(e){
                    deviceId.push(parseInt(e.id))
                })
            $.get(home.urls.powerConsumptionDay.realAndPlan(),{date:sDate,deviceIds:deviceId.toString()},function(result){
                var data = result.data
                const $useBody = $("#useTbody")
                const $planBody = $("#planTbody")
                equipment.funcs.renderHandler($useBody,$planBody,data)
            })
        })
            /**选择时间事件 */
            equipment.funcs.bindSelectTime($("#timeType"))
            /**设备选择事件 */
            equipment.funcs.bindSelectDevice($("#selectButton"))
            /**绑定查询事件 */
            equipment.funcs.bindSearchEvents($("#searchButton"));
            /**绑定图表事件 */
            equipment.funcs.bindGraphEvents($("#graphButton"))
        }
        /**绑定图表事件 */
        ,bindGraphEvents :function(buttons){
            buttons.off("click").on("click",function(){
                var tiemId = $("#timeType").val()
                if(tiemId==1){
                    $("#leftDiv").addClass("hide")
                    $("#rightDiv").addClass("hide")
                    $("#parameterChart").removeClass("hide")
                    var yearValue = $("#yearT").val()
                    var year = (yearValue+'-'+1)
                    var devId = []
                    var device = $("input[name='sample']:checked")
                    device.each(function(e){
                        devId.push($(this).attr("id").substr(6))
                    })
                    $.get(home.urls.powerConsumptionDay.realAndPlan(),{date:year,deviceIds:devId.toString(),type:1},function(result){
                        var data = result.data
                        var myChart = echarts.init(document.getElementById('parameterChart'));
                        var name=[];
                        for(var i in data.yearRealUsed){
                            name.push(i)
                        }
                        var ser=[];
                        var realData = []
                        var planData = []
                        for(var i in data.yearRealUsed){
                            realData.push(data.yearRealUsed[i])
                        }
                        for(var i in data.yearPlanUsed){
                            planData.push(data.yearPlanUsed[i])
                        }
                        ser.push({
                            type : 'bar',
                            name : '实际',
                            data : realData
                        })
                        ser.push({
                            type : 'bar',
                            name : '计划',
                            data : planData
                        })
                        var option = {
                            title : {
                                text : '用电量/单耗对比图表分析'
                            },
                            xAxis: {
                                type: 'category',
                                data: name
                            },
                            yAxis: {
                                type: 'value'
                            },
                            legend:{
                                data: ["实际","计划"]
                            },
                            series:ser
                        };
                        myChart.setOption(option,notMerge=true);
                        // 根据窗口大小变动图标  无需刷新
                        window.onresize = function() {
                            myChart.resize();
                        }
                    })
                }else if(tiemId==2){
                    $("#leftDiv").addClass("hide")
                    $("#rightDiv").addClass("hide")
                    $("#parameterChart").removeClass("hide")
                    var monthValue = $("#monthT").val()
                    var devId = []
                    var device = $("input[name='sample']:checked")
                    device.each(function(e){
                        devId.push($(this).attr("id").substr(6))
                    })
                    $.get(home.urls.powerConsumptionDay.realAndPlan(),{date:monthValue,deviceIds:devId.toString(),type:0},function(result){
                        var data = result.data
                        var myChart = echarts.init(document.getElementById('parameterChart'));
                        var name=[];
                        for(var i in data.monthRealUsed){
                            name.push(i)
                        }
                        var ser=[];
                        var realData = []
                        var planData = []
                        for(var i in data.monthRealUsed){
                            realData.push(data.monthRealUsed[i])
                        }
                        for(var i in data.monthPlanUsed){
                            planData.push(data.monthPlanUsed[i])
                        }
                        ser.push({
                            type : 'bar',
                            name : '实际',
                            data : realData
                        })
                        ser.push({
                            type : 'bar',
                            name : '计划',
                            data : planData
                        })
                        var option = {
                            title : {
                                text : '用电量/单耗对比图表分析'
                            },
                            xAxis: {
                                type: 'category',
                                data: name
                            },
                            yAxis: {
                                type: 'value'
                            },
                            legend:{
                                data: ["实际","计划"]
                            },
                            series:ser
                        };
                        myChart.setOption(option,notMerge=true);
                        // 根据窗口大小变动图标  无需刷新
                        window.onresize = function() {
                            myChart.resize();
                        }
                    })
                }
            })
        }
        /**绑定查询 */
        ,bindSearchEvents : function(buttons){
            buttons.off("click").on("click",function(){
                $("#leftDiv").removeClass("hide")
                $("#rightDiv").removeClass("hide")
                $("#parameterChart").addClass("hide")
                var tiemId = $("#timeType").val()
                if(tiemId==1){
                    var yearValue = $("#yearT").val()
                    var year = (yearValue+'-'+1)
                    var devId = []
                    var device = $("input[name='sample']:checked")
                    device.each(function(e){
                        devId.push($(this).attr("id").substr(6))
                    })
                    $.get(home.urls.powerConsumptionDay.realAndPlan(),{date:year,deviceIds:devId.toString(),type:1},function(result){
                        var data = result.data
                        const $useBody = $("#useTbody")
                        const $planBody = $("#planTbody")
                        equipment.funcs.renderHandler1($useBody,$planBody,data)
                    })
                }else if(tiemId==2){
                    var monthValue = $("#monthT").val()
                    var devId = []
                    var device = $("input[name='sample']:checked")
                    device.each(function(e){
                        devId.push($(this).attr("id").substr(6))
                    })
                    $.get(home.urls.powerConsumptionDay.realAndPlan(),{date:monthValue,deviceIds:devId.toString(),type:0},function(result){
                        var data = result.data
                        const $useBody = $("#useTbody")
                        const $planBody = $("#planTbody")
                        equipment.funcs.renderHandler($useBody,$planBody,data)
                    })
                }
            })
        }
        /**渲染默认数据 */
        ,renderHandler : function($useBody,$planBody,data){
            $useBody.empty()
            $planBody.empty()
            for(var i in data.monthRealUsed){
                $useBody.append(
                    "<tr>" + 
                    "<td>" + (i) + "</td>" + 
                    "<td>" + (data.monthRealUsed[i]) + "</td>" + 
                    "<td>"+(0)+"</td>" +
                    "<td>"+(0)+"</td>" + 
                    "<tr>"
                )
            }
            for(var i in data.monthPlanUsed){
                $planBody.append(
                    "<tr>" + 
                    "<td>" + (i) + "</td>" + 
                    "<td>" + (data.monthPlanUsed[i]) + "</td>" + 
                    "<td>"+(0)+"</td>" +
                    "<td>"+(0)+"</td>" + 
                    "<tr>"
                )
            }
        }
        /**渲染年数据 */
        ,renderHandler1 : function($useBody,$planBody,data){
            $useBody.empty()
            $planBody.empty()
            for(var i in data.yearRealUsed){
                $useBody.append(
                    "<tr>" + 
                    "<td>" + (i) + "</td>" + 
                    "<td>" + (data.yearRealUsed[i]) + "</td>" + 
                    "<td>"+(0)+"</td>" +
                    "<td>"+(0)+"</td>" + 
                    "<tr>"
                )
            }
            for(var i in data.yearPlanUsed){
                $planBody.append(
                    "<tr>" + 
                    "<td>" + (i) + "</td>" + 
                    "<td>" + (data.yearPlanUsed[i]) + "</td>" + 
                    "<td>"+(0)+"</td>" +
                    "<td>"+(0)+"</td>" + 
                    "<tr>"
                )
            }
        }
        /**设备选择事件 */
        ,bindSelectDevice : function(buttons){
            buttons.off("click").on("click",function(){
                // $("input:checkbox[name='sample']").prop("checked", false);
                $("#selectDevice").removeClass("hide")
                layer.open({
                    type : 1,
                    title : "设备选择",
                    content : $("#selectDevice"),
                    area: ['800px', '200px'],
                    btn : ['确定' , '返回'],
                    offset : ['10%' , '10%'],
                    closeBtn: 0,
                    yes : function(index){
                        $("#selectDevice").css("display","none");
                        layer.close(index);
                    }
                    ,btn2 : function(index){
                        $("#selectDevice").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**时间选择事件 */
        ,bindSelectTime : function(select){
            select.change(function(){
                var value = $(this).children("option:selected").val();
                if(value == 1){
                    $("#monthTime").addClass("hide");
                    $("#yearTime").removeClass("hide");
                }else if(value==2){
                    $("#yearTime").addClass("hide");
                    $("#monthTime").removeClass("hide");
                }
            })
        }
        /**渲染复选框 */
        ,renderCheckbox : function(){
            $("#sample").empty();
            $.get(home.urls.equipmentLine.getAll(),{},function(result){
                var checks = result.data
                checks.forEach(function(e){
                    $("#sample").append("<input type='checkbox' checked='checked' name='sample' id='check-"+(e.id)+"'><a class='onclick'><span style='padding-right:30px;'>"+(e.name)+"</span></a>")
                })
                equipment.funcs.clickEvents($(".onclick"))
            })
        }
        ,/**点击文字选中事件 */
        clickEvents : function(buttons){
            buttons.off("click").on("click",function(){
                obj = $(this)
                if(obj.prev().prop("checked")){
                    obj.prev().prop("checked",false);
                }else{
                    obj.prev().prop("checked",true);
                }
            }) 
        }
    }
}