var sectionAnalysis = {
    init : function() {
        sectionAnalysis.funcs.bindSelectChangeEvent();
        //sectionAnalysis.funcs.bindDefaultSearchEvent();
        
    }
    ,xAxis : [] //用来存x轴数据
    ,data1 : []
    ,data2 : []
    ,funcs : {
        bindSelectChangeEvent : function(){
            $("select").change(function() {
                var flag = $("#time").val(); 
                var date;
                console.log(flag)
                layui.use("laydate",function() {
                    var laydate = layui.laydate;
                    switch(flag) {
                        case "1" : 
                            $("#date"+1).removeClass("hide");
                            $("#date"+2).addClass("hide");
                            $("#date"+3).addClass("hide");
                            var date1 = new Date();
                            date1.setFullYear(date1.getFullYear() - 1);
                            date = new Date(date1).Format("yyyy");
                            $("#date1").val(date);
                            break;
                        case "2" : 
                            $("#date"+2).removeClass("hide");
                            $("#date"+1).addClass("hide");
                            $("#date"+3).addClass("hide");
                            date2 = new Date();
                            date2.setMonth(date2.getMonth() - 1);
                            var date = new Date(date2).Format("yyyy-MM");
                            $("#date2").val(date);
                            break;
                        case "3" : 
                            $("#date"+3).removeClass("hide");
                            $("#date"+1).addClass("hide");
                            $("#date"+2).addClass("hide");
                            var date3 = new Date();
                            date3.setDate(date3.getDate() - 1);
                            date = new Date(date3).Format("yyyy-MM-dd");
                            $("#date3").val(date);
                            break;
                    } 
                }) 
                //sectionAnalysis.funcs.bindSearchEvent(date,section);
                sectionAnalysis.funcs.bindAutoSearchEvent($("#searchButton"));
            })
        }
        /**默认上个月搜索 */
        ,bindDefaultSearchEvent : function() {
            var date1 = new Date();
            date1.setMonth(date1.getMonth() - 1);
            date = new Date(date1).Format("yyyy-MM");
            $("#date").val(date)
            var section = $("#section").val();
            //sectionAnalysis.funcs.bindSearchEvent(date,section);
            //sectionAnalysis.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**绑定根据时间和工段进行的搜索事件 */
        ,bindSearchEvent : function(date,section,flag) {
            var urls;
            switch(flag) {
                case "1" :
                    urls = home.urls.sectionAnalysis.getByYearAndSeciton();
                    break;
                case "2" :
                    urls = home.urls.sectionAnalysis.getByMonthAndSeciton();
                    break;
                case "3" :
                    urls = home.urls.sectionAnalysis.getByDateAndSeciton();
                    break;
            }
            $.get(urls, {
                date : date,
                section : section
            },function(result) {
                var res = result.data;
                sectionAnalysis.funcs.bindrenderEvent(res);
            })
        }
        /**绑定搜索按钮 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function(){
                var flag = $("#time").val();
                var date;
                sectionAnalysis.xAxis = [];
                switch(flag) {
                    case "1" :
                        date = $("#date"+1).val();
                        sectionAnalysis.xAxis = [1,2,3,4,5,6,7,8,9,10,11,12];
                        sectionAnalysis.data1 = [1,3,5,7,9,23,12,3,4,12,20,23];
                        sectionAnalysis.data2 = [11,13,6,23,12,3,4,12,20,23,2,5];
                        break;
                    case "2" :
                        date = $("#date"+2).val();
                        var year = date.substr(0,4);
                        var month = date.substr(5);
                        var d = new Date(year, month, 0);
                        var totalDays =  d.getDate();
                        for(var i = 1; i <= totalDays; i++) {
                            sectionAnalysis.xAxis.push(i);
                            sectionAnalysis.data1.push(10);
                            sectionAnalysis.data2.push(20);
                        }
                        break;
                    case "3" :
                        date = $("#date"+3).val();
                        for(var i = 1; i <= 24; i++){
                            sectionAnalysis.xAxis.push(i);
                            sectionAnalysis.data1.push(10);
                            sectionAnalysis.data2.push(20);
                        }
                        break;
                }
                var section = $("section").val();
                //sectionAnalysis.funcs.bindSearchEvent(date,section,flag);
                console.log(sectionAnalysis.xAxis)
                console.log(sectionAnalysis.data1)
                console.log(sectionAnalysis.data2)
                sectionAnalysis.funcs.bindrenderEvent();
            })
        }
        /**绑定渲染数据 table和bar */
        ,bindrenderEvent : function() {
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
                    data : ["本月","去年同期"]
                },
                series : [
                    {
                        name : '本月',
                        type : 'bar',
                        data : sectionAnalysis.data1
                    },
                    {
                        name : '去年同期',
                        type : 'bar',
                        data : sectionAnalysis.data2
                    }
                ]
            };
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
                    data : ["本月","上月"]
                },
                series : [
                    {
                        name : '本月',
                        type : 'bar',
                        data : sectionAnalysis.data1
                    },
                    {
                        name : '上月',
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