var sectionAnalysis = {
    init : function() {
        sectionAnalysis.funcs.bindSelectRenderEvent();
        sectionAnalysis.funcs.bindSelectChangeEvent();
        sectionAnalysis.funcs.bindDefaultSearchEvent();
        
    }
    ,xAxis : []                   //用来存x轴数据
    ,data : []                    //用来存取当前年月日数据
    ,data1 : []                   //用来存取同比数据
    ,data2 : []                   //用来存取环比数据
    ,flag : 1                     // 0表示日 1表示月 2表示年
    ,legend1 : ["本月","去年同期"] //用来存柱状图的表头
    ,legend2 : ["本月","上月"]    //用来存柱状图的表头
    ,name11 : "本月"              //横坐标的名字
    ,name12 : "去年同期"          //纵坐标的名字
    ,name21 : ""                 //横坐标的名字
    ,name22 : "上月"             //纵坐标的名字
    ,funcs : {
        bindSelectRenderEvent : function(){
            var urls,option;
            if(type == 1){
                urls = home.urls.sectionName.getAll();
                option = "<option value='-1'>请选择工段</option>";
            }
            else{
                urls = home.urls.processName.getAll();
                option = "<option value='-1'>请选择工序</option>";
            }
            $.get(urls,{},function(result){
                var section = result.data;
                $("#section").empty();
                $("#section").html(option);
                section.forEach(function(e){
                    $("#section").append("<option value="+(e.id)+">"+(e.name)+"</option>")
                })
            })
        }
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
        /**默认上个月搜索 */
        ,bindDefaultSearchEvent : function() {
            var date1 = new Date();
            date1.setMonth(date1.getMonth() - 1);
            data2 = new Date(date1).Format("yyyy-MM-dd");
            var date = new Date(date1).Format("yyyy-MM");
            $("#date1").val(date)
            // var section = $("#section").val();
            sectionAnalysis.funcs.bindSearchEvent(data2,-1,1);
            sectionAnalysis.funcs.bindAutoSearchEvent($("#searchButton"));
            sectionAnalysis.funcs.bindRadioChange();
        }
        /**绑定根据时间和工段进行的搜索事件 */
        ,bindSearchEvent : function(date,section,flag) { 
            if(type == 1){
                $.get(home.urls.sectionAnalysis.sectionStatistic(), {
                    type : flag,
                    date : date,
                    sectionId : parseInt(section) 
                },function(result) {
                    var res = result.data;
                    sectionAnalysis.funcs.bindrenderEvent(res,flag);
                })
            }
            else{
                $.get(home.urls.sectionAnalysis.procedureStatistic(), {
                    type : flag,
                    date : date,
                    procedureId : parseInt(section) 
                },function(result) {
                    var res = result.data;
                    sectionAnalysis.funcs.bindrenderEvent(res,flag);
                })
            }
            
        }
        /**绑定搜索按钮 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function(){
                $("#use").prop("checked",true);
                $("#ring").prop("checked",false);
                $("#yearOnyearDiv").removeClass("hide");
                $("#monthOnmonthDiv").addClass("hide");
                var flag = $("#time").val();
                var section = $("#section").val();
                var date;
                sectionAnalysis.legend1 = [];
                sectionAnalysis.legend2 = [];
                sectionAnalysis.name11 = "";
                sectionAnalysis.name12 = "";
                sectionAnalysis.name22 = "";
                switch(flag){
                    case "0" :
                        date = $("#date").val();
                        $("#ring").attr("disabled",false);
                        $(".curText").text("本日用电(kwh)");
                        $("#monthOnMonthSumTd").text("上日用电(kwh)");
                        sectionAnalysis.legend1 = ["本日","上月同期"];
                        sectionAnalysis.legend2 = ["本日","上日"];
                        sectionAnalysis.name11 = "本日";
                        sectionAnalysis.name12 = "上月同期";
                        sectionAnalysis.name22 = "上日";
                        $("#radio").removeClass("hide");
                        break;
                    case "1" :
                        date = $("#date1").val()+"-01";
                        $("#ring").attr("disabled",false);
                        $(".curText").text("本月用电(kwh)");
                        $("#monthOnMonthSumTd").text("上月用电(kwh)");
                        sectionAnalysis.legend1 = ["本月","去年同期"];
                        sectionAnalysis.legend2 = ["本月","上月"];
                        sectionAnalysis.name11 = "本月";
                        sectionAnalysis.name12 = "去年同期";
                        sectionAnalysis.name22 = "上月";
                        $("#radio").removeClass("hide");
                        break;
                    case "2" :
                        date = $("#date2").val()+"-01-01";
                        $("#ring").attr("disabled",true);
                        $(".curText").text("本年用电(kwh)");
                        $("#yearOnYearSumTd").text("上年用电(kwh)");
                        sectionAnalysis.legend1 = ["本年","上年用电"];
                        sectionAnalysis.name11 = "本年";
                        sectionAnalysis.name12 = "上年";
                        break;
                }
            
                sectionAnalysis.funcs.bindSearchEvent(date,section,flag);
            })
        }
        /**绑定单选框变换事件，即同比环比转换 */
        ,bindRadioChange : function(){
            $("input[type=radio][name=name]").change(function(){
                if(this.value =="同比"){
                    $("#yearOnyearDiv").removeClass("hide");
                    $("#monthOnmonthDiv").addClass("hide");
                }
                else{
                    $("#yearOnyearDiv").addClass("hide");
                    $("#monthOnmonthDiv").removeClass("hide");
                }            })
        }
        /**绑定渲染数据 table和bar */
        ,bindrenderEvent : function(res,flag) {
            if(res && res.curData){
                //console.log(res)
                $(".curSum").text(res.curSum?res.curSum:'0');
                $("#yearOnYearSum").text(res.yearOnYearSum?res.yearOnYearSum:'0');
                $("#yearOnYear").text(res.yearOnYear?res.yearOnYear:'0');
                $("#monthOnMonthSum").text(res.monthOnMonthSum?res.monthOnMonthSum:'0');
                $("#monthOnMonth").text(res.monthOnMonth?res.monthOnMonth:'0');
                var curData = res.curData;
                var monthOnMonthData = res.monthOnMonthData;
                var yearOnYearData = res.yearOnYearData;
                sectionAnalysis.xAxis = [];
                sectionAnalysis.data = [];
                sectionAnalysis.data1 = [];
                sectionAnalysis.data2 = [];
                if(flag=="1"){
                    for(var j = 1; j <= 31; j++){
                        sectionAnalysis.xAxis.push(j);
                    }
                    for(var i in curData) {
                        sectionAnalysis.data.push(curData[i]);
                    }
                }
                else{
                    for(var i in curData) {
                        sectionAnalysis.xAxis.push(i);
                        sectionAnalysis.data.push(curData[i]);
                    }
                }
                
                for(var i in yearOnYearData) {
                    sectionAnalysis.data1.push(yearOnYearData[i]);
                }
                for(var i in monthOnMonthData) {
                    sectionAnalysis.data2.push(monthOnMonthData[i]);
                }
    
                sectionAnalysis.funcs.bindRenderChart();
                
            }               
        }  
        /**绑柱状图渲染 */
        ,bindRenderChart : function(){
            //console.log(sectionAnalysis.data2)
            var myChart = echarts.init(document.getElementById('bar'));
            var option = {
                xAxis : {
                    type : 'category',
                    data : sectionAnalysis.xAxis
                },
                yAxis: {
                    type: 'value'
                },
                legend : {
                    data : sectionAnalysis.legend1,
                    padding: [5, 0]
                },
                series : [
                    {
                        name : sectionAnalysis.name11,
                        type : 'bar',
                        data : sectionAnalysis.data
                    },
                    {
                        name : sectionAnalysis.name12,
                        type : 'bar',
                        data : sectionAnalysis.data1
                    }
                ]
            };
            //console.log(sectionAnalysis.name11)
            myChart.setOption(option,notMerge=true);
            // 根据窗口大小变动图标  无需刷新
            window.onresize = function() {
                myChart.resize();
            }
            var myChart1 = echarts.init(document.getElementById('bar1'));
            var option = {
                xAxis : {
                    type : 'category',
                    data : sectionAnalysis.xAxis
                },
                yAxis: {
                    type: 'value'
                },
                legend : {
                    data : sectionAnalysis.legend2,
                    padding: [5, 0]
                },
                series : [
                    {
                        name : sectionAnalysis.name11,
                        type : 'bar',
                        data : sectionAnalysis.data
                    },
                    {
                        name : sectionAnalysis.name22,
                        type : 'bar',
                        data : sectionAnalysis.data2
                    }
                ]
            };        
            myChart1.setOption(option,notMerge=true);
            // 根据窗口大小变动图标  无需刷新
            window.onresize = function() {
                myChart1.resize();
            }    
        }
    }
}