var equipmentAnalysis = {
    init : function(){
        equipmentAnalysis.funcs.bindSelectChangeEvent();
        equipmentAnalysis.funcs.bindDefaultSearchEvent();
    }
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
    ,funcs : {
        bindSelectChangeEvent : function(){
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
            $("#date1").val(date)
            equipmentAnalysis.funcs.bindSearchEvent(date2,1);
            equipmentAnalysis.funcs.bindAutoSearchEvent($("#searchButton"));
            equipmentAnalysis.funcs.bindRadioChange();
        }
        /**绑定根据时间搜索事件 */
        ,bindSearchEvent : function(date,type){
            $.get(home.urls.equipmentAnalysis.statistic(),{
                type: type,
                date: date
            },function(result){
                var res = result.data;
                equipmentAnalysis.funcs.renderData(res);
            })
        }
        /**绑定搜索按钮点击事件 */
        ,bindAutoSearchEvent : function(buttons){
            buttons.off("click").on("click",function(){
                $("#use").prop("checked",true);
                $("#ring").prop("checked",false);
                $("#yearOnyearDiv").removeClass("hide");
                $("#monthOnmonthDiv").addClass("hide");
                var flag = $("#time").val();
                var date;
                sectionAnalysis.legend1 = [];
                sectionAnalysis.legend2 = [];
                sectionAnalysis.name11 = "";
                sectionAnalysis.name12 = "";
                sectionAnalysis.name22 = "";
                switch(flag){
                    case "0" :
                        date = $("#date").val();
                        $("#changeName").text("本日用电(kwh)");
                        $("#changeName1").text("上日用电(kwh)");
                        sectionAnalysis.legend1 = ["本日","去年同期"];
                        sectionAnalysis.legend2 = ["本日","上日"];
                        sectionAnalysis.name11 = "本日";
                        sectionAnalysis.name12 = "去年同期";
                        sectionAnalysis.name22 = "上日";
                        $("#radio").removeClass("hide");
                        break;
                    case "1" :
                        date = $("#date1").val()+"-01";
                        $("#changeName").text("本月用电(kwh)");
                        $("#changeName1").text("上月用电(kwh)");
                        sectionAnalysis.legend1 = ["本月","去年同期"];
                        sectionAnalysis.legend2 = ["本月","上月"];
                        sectionAnalysis.name11 = "本月";
                        sectionAnalysis.name12 = "去年同期";
                        sectionAnalysis.name22 = "上月";
                        $("#radio").removeClass("hide");
                        break;
                    case "2" :
                        date = $("#date2").val()+"-01-01";
                        $("#radio").addClass("hide");
                        $("#changeName").text("本年用电(kwh)");
                        $("#changeName1").text("上年用电(kwh)");
                        sectionAnalysis.legend1 = ["本年","上年用电"];
                        sectionAnalysis.name11 = "本年";
                        sectionAnalysis.name12 = "上年";
                        break;
                }
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
                }            
            })
        }
        /**渲染数据 */
        ,renderData : function(data){
            if(data && data.curData){
                var curData = data.curData;
                var yearOnYearData = data.yearOnYearData;
                var monthOnMonthData = data.monthOnMonthData;
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
                curData.forEach(function(e){
                    $tbody1.append("<tr><td>"+(e.name)+"</td><td>"+(e.name)+"</td><td>"+(e.name)+"</td><td>"+(e.name)+"</td></tr>")
                    equipmentAnalysis.xAxis.push(e.name);
                    equipmentAnalysis.data.push(e.sum);
                })
                yearOnYearData.forEach(function(e){
                    $tbody2.append("<tr><td>"+(e.name)+"</td><td>"+(e.name)+"</td><td>"+(e.name)+"</td><td>"+(e.name)+"</td></tr>")
                    equipmentAnalysis.data1.push(e.sum);
                })
                monthOnMonthData.forEach(function(e){
                    $tbody3.append("<tr><td>"+(e.name)+"</td><td>"+(e.name)+"</td><td>"+(e.name)+"</td><td>"+(e.name)+"</td></tr>")
                    equipmentAnalysis.data2.push(e.sum);
                })
                equipmentAnalysis.funcs.bindRenderChart();
            }
        }
        /**渲染柱状图数据 */
        ,bindRenderChart : function(){

        }
    }
}