var reportAnalysis = {
    init : function(){
        reportAnalysis.funcs.renderSelector();
    }
    ,funcs: {
        /**渲染下拉框 */
        renderSelector : function(){
            $("#system").on('click',function(){
                var sys = $("#system").val();
                $("#syatem").off('click');
                const here = $("#sample");
                var types =[];
                $.get(home.urls.sample.getAllBySendIdAndNameLike(),{
                    sendId : sys
                },function(result) {
                var samples = result.data.content;
                samples.forEach(function(e){
                    types.push(e.name);
                })
                reportAnalysis.funcs.renderHandler(here, samples);
                })
            //    console.log(types);
                if(sys == 1){
                   // do something ..
                   $("#project").empty();
                   $("#project").append(
                    "<option value=\"" + 1 +"\""+ ">"+ "铅" + "</option>" +
                    "<option value=\"" + 2 +"\""+ ">"+ "锌" + "</option>" +
                    "<option value=\"" + 3 +"\""+ ">"+ "铁" + "</option>" 
                   )   
                } else{
                   // do somthing..
                   $("#project").empty();
                   $("#project").append(
                    "<option value=\"" + 1 +"\""+ ">"+ "铅" + "</option>" +
                    "<option value=\"" + 2 +"\""+ ">"+ "锌" + "</option>" +
                    "<option value=\"" + 3 +"\""+ ">"+ "铁" + "</option>" +
                    "<option value=\"" + 4 +"\""+ ">"+ "硫" + "</option>" 
                   )
                }
                reportAnalysis.funcs.renderChart($("#analysisButton"),types)
            }) 
        }
        /** 下拉框*/
        ,renderHandler : function(here,samples) {    
            here.empty();
            samples.forEach(function(e){
                here.append(
                        "<input type='checkbox' value=\"" + (e.id) +"\""+ "checked >"+ (e.name) + "&nbsp;&nbsp;" 
                )
            })
        }
        /** 绘制曲线图 */
        ,renderChart : function(buttons,types){
            buttons.off('click').on('click',function(){
            //    var data = [];
            //    $ckb = $("#sample").children('input');
            //    $ckb.each(function(){
            //       if($(this).prop('checked')){
            //        data.push($(this).val())
            //       }
            //    })
                var sys = $("#system").val();
                var startDate = $("#startTime").val();               
                var class1 = $("#classType1").val();               
                var endDate = $("#endTime").val();              
                var class2 = $("#classType2").val();
                var project = $("#project").val();
                var times = []
                var tArray = new Array();   //先声明一维
                for(var k = 0; k < types.length; k++){        //一维长度为i,i为变量，可以根据实际情况改变  
                    tArray[k]=new Array();    //声明二维，每一个一维数组里面的一个元素都是一个数组
                }
                if(sys == 1){
                    $.get(home.urls.delegation.getReportAnalysis1(),
                    {
                        startDate : startDate,
                        startClazzId : class1,
                        endDate : endDate,
                        endClazzId : class2
                    },function(result){
                        var details = result.data
                        var 
                        if(details == null){
                            return;
                        } else{
                            for( var i = 0; i < datails[0].length; i++){
                                var d = details[0][i].sampleManageInfo.updateDate;
                                var t = d.substr(0,10);
                                times.push(t)
                            }
                            console.log(times);
                            if(project == 1){
                                for( var i = 0; i < types.length; i++){
                                
                                }
                            }
                            else if(project == 2){
                                
                            }
                            else if(project == 2){
                                
                            }
                            else{

                            }
                            var len = details.length;
                            console.log(len);
                            var times = [];
                            for (var i = 0; i < len; i++){
                                var d = details[i].sampleManageInfo.updateDate;
                                var t = d.substr(0,10);
                                times.push(t)
                            }
                            console.log(times)
                            var tArray = new Array();   //先声明一维
                            for(var k = 0; k < data.length; k++){        //一维长度为i,i为变量，可以根据实际情况改变  
                                tArray[k]=new Array();    //声明二维，每一个一维数组里面的一个元素都是一个数组
                            }
                            for (var i = 0; i < len; i++){
                                var p = details[i].pb*100;
                                tArray[0].push(p)
                                var p = details[i].zn*100;
                                tArray[1].push(p)
                                var p = details[i].fe*100;
                                tArray[2].push(p)
                                if(data.length == 4){
                                    var p = details[i].sf*100;
                                    tArray[3].push(p)
                                } 
                            }   
                        }
                    })
                }else{
                    $.get(home.urls.delegation.getReportAnalysis2(),
                        {   
                            startDate : startDate,
                            startClazzId : class1,
                            endDate : endDate,
                            endClazzId : class2       
                        },function(result){
                            var details = result.data[0].delegationOrderDetails
                            if(details == null){
                                return;
                            } else{
                                var len = details.length;
                                console.log(len);
                                var times = [];
                                for (var i = 0; i < len; i++){
                                    var d = details[i].sampleManageInfo.updateDate;
                                    var t = d.substr(0,10);
                                    times.push(t)
                                }
                                console.log(times)
                                var tArray = new Array();   //先声明一维
                                for(var k = 0; k < data.length; k++){        //一维长度为i,i为变量，可以根据实际情况改变  
                                    tArray[k]=new Array();    //声明二维，每一个一维数组里面的一个元素都是一个数组
                                }
                                for (var i = 0; i < len; i++){
                                    var p = details[i].pb*100;
                                    tArray[0].push(p)
                                    var p = details[i].zn*100;
                                    tArray[1].push(p)
                                    var p = details[i].fe*100;
                                    tArray[2].push(p)
                                    if(data.length == 4){
                                        var p = details[i].sf*100;
                                        tArray[3].push(p)
                                    } 
                                }   
                            }
                    })
                }
                    
            })

        }
        

        /*
        var myChart = echarts.init(document.getElementById("sampleChart"));
                        var option = {
                            // 标题
                            title : {
                                text : '单项目分析'
                            }, 
                            // 图例
                            legend: {
                            //    data: ["铅","锌","硫"]
                                data : types
                            },
                            //鼠标放上去提示文字
                            tooltip: {
                                //    trigger: 'axis'
                                    show : true
                                },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                show : true,
                                feature: {
                                    saveAsImage: {show: true}
                                }
                            },
                            // 横坐标
                            xAxis : {
                                type : 'category',
                                name : "时间（年/月/日）",
                                boundaryGap: true,
                                data : times
                            //    data : ["2018/08/01","2018/08/02","2018/08/03","2018/08/04","2018/08/05","2018/08/06","2018/08/07"]
                            },
                            //纵坐标
                            yAxis : {
                                type : 'value',
                                name : "品味（%）"
                            },
                            // 数据
                            series : [{
                                name: types[0],
                                data : tArray[0],
                                type : 'line'  
                            },{
                                name: types[1],
                                data : tArray[1],
                                type : 'line'
                            },{
                                name: types[2],
                                data : tArray[2],
                                type : 'line'
                            }]
                        };
                        // 图形实例化
                        myChart.setOption(option);
                        // 根据窗口大小变动图标  无需刷新
                        window.onresize = function() {
                            myChart.resize();
                        }

*/


    }
}