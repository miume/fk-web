var equipmentAnalysis = {
    init : function(){
        equipmentAnalysis.funcs.renderSelectEquipmentParameter();
    }
    ,selectedParameterArrays : []         //存取设备参数选择
    ,xAxis : []                   //用来存x轴数据
    ,data : []                    //用来存取当前年月日数据
    ,data1 : []                   //用来存取同比数据
    ,data2 : []                   //用来存取环比数据
    ,legend1 : ["本月","去年同期"] //用来存柱状图的表头
    ,legend2 : ["本月","上月"]    //用来存柱状图的表头
    ,name11 : "本月"              //横坐标的名字
    ,name12 : "去年同期"          //纵坐标的名字
    ,name21 : ""                 //横坐标的名字
    ,name22 : "上月"             //纵坐标的名字
    ,i : 0
    ,equipment : []             //存取所有设备的data
    ,funcs : {
          /**渲染弹出框 */
          renderSelectEquipmentParameter : function(){
            $.get(home.urls.equipmentLine.getAll(),{},function(result){
                var data = result.data;
                equipmentAnalysis.selectedParameterArrays = [];
                data.forEach(function(e){
                    equipmentAnalysis.selectedParameterArrays.push(e.id);
                })
            const $tbody = $("#selectTable").children("tbody");
            $tbody.empty();
            var arr = Object.keys(data);
            var lengths = arr.length;
            for( var i = 0; i < parseInt(lengths / 4); i++ ) {
                $tbody.append("<tr><td><input type='checkbox' id="+(data[3*i].id)+" checked /><span class='onclick'>"+(data[3*i].name)+"</span></td><td><input type='checkbox' id="+(data[3*i+1].id)+" checked /><span class='onclick'>"+(data[3*i+1].name)+"</span></td><td><input type='checkbox' id="+(data[3*i+2].id)+" checked /><span class='onclick'>"+(data[3*i+2].name)+"</span></td><td><input type='checkbox' id="+(data[3*i+3].id)+" checked /><span class='onclick'>"+(data[3*i+3].name)+"</span></td></tr>")
            }  
            var temp = parseInt(lengths / 4) * 4 ;
            if(lengths % 4 === 3){
                $tbody.append("<tr><td><input type='checkbox' id="+(data[temp].id)+" checked /><span class='onclick'>"+(data[temp].name)+"</span></td><td><input type='checkbox' id="+(data[temp+1].id)+" checked /><span class='onclick'>"+(data[temp+1].name)+"</span></td><td><input type='checkbox' id="+(data[temp+2].id)+" checked /><span class='onclick'>"+(data[temp+2].name)+"</span></td><td></td></tr>")
            }        
            if(lengths % 4 === 2){
                $tbody.append("<tr><td><input type='checkbox' id="+(data[temp].id)+" checked /><span class='onclick'>"+(data[temp].name)+"</span></td><td><input type='checkbox' id="+(data[temp+1].id)+" checked /><span class='onclick'>"+(data[temp+1].name)+"</span></td><td></td><td></td></tr>")
            }  
            if(lengths % 4 === 1){
                $tbody.append("<tr><td><input type='checkbox' id="+(data[temp].id)+" checked /><span class='onclick'>"+(data[temp].name)+"</span></td><td></td><td></td><td></td></tr>")
            }
            equipmentAnalysis.funcs.bindClickEvent($(".onclick"));
            equipmentAnalysis.funcs.bindSelectChangeEvent();
            equipmentAnalysis.funcs.bindDefaultSearchEvent();
            equipmentAnalysis.funcs.bindEquipmentSelect($("#equipmentSelect"));
            equipmentAnalysis.funcs.bindRenderChart();
        })
    }
        /**绑定设备选择，实现点击文字改变checkbox的状态 */
        ,bindClickEvent : function(buttons){
            buttons.off("click").on("click",function(){
                var obj = $(this);
                if(obj.prev().prop("checked")){
                    obj.prev().prop("checked",false);
                }
                else{
                    obj.prev().prop("checked",true);
                }
            })
        }
        /**年月日选择 控件变化 */
        ,bindSelectChangeEvent : function(){
            $("select").change(function() {
                var flag = $("#time").val(); 
                var date0;
                var date = new Date();
                //console.log(flag)
                switch(flag) {
                    case "0" : 
                        $("#date").removeClass("hide");
                        $("#date"+1).addClass("hide");
                        $("#date"+2).addClass("hide");
                        date.setDate(date.getDate() - 1);
                        date0 = new Date(date).Format("yyyy-MM-dd");
                        $("#date").val(date0);
                        
                        break;
                    case "1" : 
                        $("#date"+1).removeClass("hide");
                        $("#date").addClass("hide");
                        $("#date"+2).addClass("hide");
                        date.setMonth(date.getMonth() - 1);
                        var date1 = new Date(date).Format("yyyy-MM");
                        Date1 = new Date(date).Format("yyyy-MM-dd");
                        $("#date1").val(date1);

                        break;
                    case "2" : 
                        $("#date"+2).removeClass("hide");
                        $("#date").addClass("hide");
                        $("#date"+1).addClass("hide");
                        date.setFullYear(date.getFullYear() - 1);
                        var date2 = new Date(date).Format("yyyy");
                        Date1 = new Date(date).Format("yyyy-MM-dd");
                        $("#date2").val(date2);
                        break;
                }
            })
        }
        ,bindDefaultSearchEvent : function(){
            var date1 = new Date();
            date1.setMonth(date1.getMonth() - 1);
            date2 = new Date(date1).Format("yyyy-MM-dd");
            var date = new Date(date1).Format("yyyy-MM");
            $("#date1").val(date);
            equipmentAnalysis.funcs.bindSearchEvent(date2,1);
            equipmentAnalysis.funcs.bindAutoSearchEvent($("#searchButton"));
            equipmentAnalysis.funcs.bindRadioChange(); 
        }
        /**绑定根据时间搜索事件 */
        ,bindSearchEvent : function(date,type){
            $.get(home.urls.equipmentAnalysis.deviceUseEnergyAnalysis(),{
                type: type,
                date: date,
                deviceIds : equipmentAnalysis.selectedParameterArrays.toString()
            },function(result){
                var res = result.data;
                equipmentAnalysis.funcs.renderData(res);
            })
        }
        /**绑定搜索按钮点击事件 */
        ,bindAutoSearchEvent : function(buttons){
            buttons.off("click").on("click",function(){
                if(equipmentAnalysis.selectedParameterArrays.length === 0){
                    layer.msg("请先选择设备",{
                        offset : "auto",
                        time : 1000
                    })
                    return   
                }
                $("#use").prop("checked",true);
                $("#ring").prop("checked",false);
                $("#table").removeClass("hide");
                $("#charts").addClass("hide");
                $("#yearOnyearDiv").removeClass("hide");
                $("#monthOnmonthDiv").addClass("hide");
                var flag = $("#time").val();
                var date;
                equipmentAnalysis.legend1 = [];
                equipmentAnalysis.legend2 = [];
                equipmentAnalysis.name11 = "";
                equipmentAnalysis.name12 = "";
                equipmentAnalysis.name22 = "";
                switch(flag){
                    case "0" :
                        date = $("#date").val();
                        $("#ring").attr("disabled",false);
                        $("#changeName").text("本日");
                        $("#changeName1").text("上月同期");
                        $("#changeName2").text("上日");
                        equipmentAnalysis.legend1 = ["本日","上月同期"];
                        equipmentAnalysis.legend2 = ["本日","上日"];
                        equipmentAnalysis.name11 = "本日";
                        equipmentAnalysis.name12 = "去年同期";
                        equipmentAnalysis.name22 = "上日";
                        $("#radio").removeClass("hide");
                        break;
                    case "1" :
                        date = $("#date1").val()+"-01";
                        $("#ring").attr("disabled",false);
                        $("#changeName").text("本月");
                        $("#changeName1").text("去年同期");
                        $("#changeName2").text("上月");
                        equipmentAnalysis.legend1 = ["本月","去年同期"];
                        equipmentAnalysis.legend2 = ["本月","上月"];
                        equipmentAnalysis.name11 = "本月";
                        equipmentAnalysis.name12 = "去年同期";
                        equipmentAnalysis.name22 = "上月";
                        $("#radio").removeClass("hide");
                        break;
                    case "2" :
                        date = $("#date2").val()+"-01-01";
                        $("#ring").attr("disabled",true);
                        $("#changeName").text("本年");
                        $("#changeName1").text("上年");
                        equipmentAnalysis.legend1 = ["本年","上年用电"];
                        equipmentAnalysis.name11 = "本年";
                        equipmentAnalysis.name12 = "上年";
                        break;
                }
                equipmentAnalysis.funcs.bindSearchEvent(date,flag);
            })
        }
        /**实现年月日加1减1事件 */
        ,bindDateAddOrPlusEvent(date,flag){
            var date = new Date(date);
            var time;
            switch(flag){
                case "1":  //实现日期减一
                    date.setDate(date.getDate()-1);
                    time =  date.Format("yyyy-MM-dd");
                    break;
                case "2":  //实现月份减一
                    date.setDate(date.getMonth()-1);
                    time =  date.Format("yyyy-MM");
                    break;
                case "3":  //实现年份减一
                    date.setDate(date.getFullYear()-1);
                    time =  date.Format("yyyy");
                    break;
            }
            return time;
        }
        /**绑定单选框变换事件，即同比环比转换 */
        ,bindRadioChange : function(){
            $("input[type=radio][name=name]").change(function(){
                if(equipmentAnalysis.i == 0){
                    if(this.value =="同比"){
                    $("#yearOnyearDiv").removeClass("hide");
                    $("#monthOnmonthDiv").addClass("hide");
                }
                else{
                    $("#yearOnyearDiv").addClass("hide");
                    $("#monthOnmonthDiv").removeClass("hide");
                }    
                }
                else{
                    if(this.value =="同比"){
                        $("#bar").removeClass("hide");
                        $("#bar1").addClass("hide");
                    }
                    else{
                        $("#bar").addClass("hide");
                        $("#bar1").removeClass("hide");
                    }
                }       
            })
        }
        /**渲染数据 */
        ,renderData : function(data){
            if(data){
                var curDatas = data.curDatas;
                var monthOnMonthDatas = data.monthOnMonthDatas ;    //同比
                var dayOnDayDatas = data.dayOnDayDatas ;//环比
                const $tbody1 = $("#table1").children("tbody");
                const $tbody2 = $("#table2").children("tbody");
                const $tbody3 = $("#table3").children("tbody");
                $tbody1.empty();
                $tbody2.empty();
                $tbody3.empty();
                equipmentAnalysis.xAxis = [];
                equipmentAnalysis.data = [];
                equipmentAnalysis.data1 = [];
                equipmentAnalysis.data2 = [];
                //console.log(curDatas)
                if(curDatas){
                    curDatas.forEach(function(e){
                        $tbody1.append("<tr><td>"+(e.device.name)+"</td><td>"+(e.totalUseElec)+"</td><td>"+(e.rawOre)+"</td><td>"+(e.unitUseElec)+"</td></tr>")
                        equipmentAnalysis.xAxis.push(e.device.name);
                        equipmentAnalysis.data.push(e.totalUseElec);
                })
                }
                if(monthOnMonthDatas){
                    monthOnMonthDatas.forEach(function(e){
                        $tbody2.append("<tr><td>"+(e.device.name)+"</td><td>"+(e.totalUseElec)+"</td><td>"+(e.rawOre)+"</td><td>"+(e.unitUseElec)+"</td></tr>")
                        equipmentAnalysis.data1.push(e.totalUseElec);
                })
                }
                if(dayOnDayDatas){
                    dayOnDayDatas.forEach(function(e){
                        $tbody3.append("<tr><td>"+(e.device.name)+"</td><td>"+(e.totalUseElec)+"</td><td>"+(e.rawOre)+"</td><td>"+(e.unitUseElec)+"</td></tr>")
                        equipmentAnalysis.data2.push(e.totalUseElec);
                })
                }
                
            }
        }
        /**渲染柱状图数据 */
        ,bindRenderChart : function(){
            $("#chartShow").click(function(){
                if(equipmentAnalysis.i == 0) {
                    $("#use").prop("checked",true);
                    $("#ring").prop("checked",false);
                    $("#bar").removeClass("hide");
                    $("#bar1").addClass("hide");
                    $("#table").addClass("hide");
                    $("#charts").removeClass("hide");
                    $("#chartShow").html("<i class='layui-icon'>&#xe60d;</i>表格分析");
                    var myChart = echarts.init(document.getElementById('bar'));
                    var option = {
                        xAxis : {
                            type : 'category',
                            data : equipmentAnalysis.xAxis
                        },
                        yAxis: {
                            type: 'value'
                        },
                        legend : {
                            data : equipmentAnalysis.legend1,
                            padding: [5, 0]
                        },
                        series : [
                            {
                                name : equipmentAnalysis.name11,
                                type : 'bar',
                                data : equipmentAnalysis.data
                            },
                            {
                                name : equipmentAnalysis.name12,
                                type : 'bar',
                                data : equipmentAnalysis.data1
                            }
                        ]
                      };
                    //console.log(equipmentAnalysis.name11)
                    myChart.setOption(option,notMerge=true);
                    // 根据窗口大小变动图标  无需刷新
                    window.onresize = function() {
                    myChart.resize();
                  }
                  var myChart1 = echarts.init(document.getElementById('bar1'));
                  var option = {
                    xAxis : {
                        type : 'category',
                        data : equipmentAnalysis.xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    legend : {
                        data : equipmentAnalysis.legend2,
                        padding: [5, 0]
                    },
                    series : [
                        {
                            name : equipmentAnalysis.name11,
                            type : 'bar',
                            data : equipmentAnalysis.data
                        },
                        {
                            name : equipmentAnalysis.name22,
                            type : 'bar',
                            data : equipmentAnalysis.data2
                        }
                    ]
                };        
                myChart1.setOption(option,notMerge=true);
                // 根据窗口大小变动图标  无需刷新
                window.onresize = function() {
                    myChart1.resize();
                }    
                      equipmentAnalysis.i = 1;
                 }
                    else{
                        $("#table").removeClass("hide");
                        $("#charts").addClass("hide");
                        $("#use").prop("checked",true);
                        $("#ring").prop("checked",false);
                        $("#yearOnyearDiv").removeClass("hide");
                        $("#monthOnmonthDiv").addClass("hide");
                        $("#chartShow").html("<i class='layui-icon'>&#xe60d;</i>图形分析");
                        equipmentAnalysis.i = 0;
                    }
                })
        }
        /**设备选择 */
        ,bindEquipmentSelect : function(buttons){
            buttons.off("click").on("click",function(){
                $("#selectEquipment").removeClass("hide");
                layer.open({
                    type: 1,
                    title: "设备选择",
                    content: $("#selectEquipment"),
                    area: ["400px","250px"],
                    offset: "auto",
                    btn: ["确定","取消"],
                    closeBtn: 0,
                    yes: function(index){
                        equipmentAnalysis.selectedParameterArrays = [];
                        $("#selectTable input").each(function() {
                            if($(this).prop("checked")){
                                equipmentAnalysis.selectedParameterArrays.push( $(this).attr("id"))
                            }
                        })
                        $("#selectEquipment").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2: function(index){
                        $("#selectEquipment").addClass("hide");
                        layer.close(index);
                    }
                })
                })
        }
}
}