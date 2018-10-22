var reportAlysis = {
    init : function(){
        reportAlysis.funcs.renderSelector1();
        reportAlysis.funcs.renderSelector();
    },
    funcs : {
        /**渲染下拉框 */
        renderSelector : function(){
            const $selector = $("#sample");
                var projects = [];
                var len;
                $.get(home.urls.sample.getAllBySendIdAndNameLike(),{
                    sendId : 1
                },function(result) {
                var samples = result.data.content;
                reportAlysis.funcs.renderHandler1($selector,samples)
                })
                $("#project").empty();
                   $("#project").append(
                    "<option value=\"" + 1 +"\""+ ">"+ "铅" + "</option>" +
                    "<option value=\"" + 2 +"\""+ ">"+ "锌" + "</option>" +
                    "<option value=\"" + 3 +"\""+ ">"+ "铁" + "</option>" 
                   )   
            $("#system").off('click').on('click',function(){
                var sys = $("#system").val();
                if(sys == 1){
                    $("#project").empty();
                    $("#project").append(
                     "<option value=\"" + 1 +"\""+ ">"+ "铅" + "</option>" +
                     "<option value=\"" + 2 +"\""+ ">"+ "锌" + "</option>" +
                     "<option value=\"" + 3 +"\""+ ">"+ "铁" + "</option>" 
                    )   
                } else{
                    $("#project").empty();
                    $("#project").append(
                     "<option value=\"" + 1 +"\""+ ">"+ "铅" + "</option>" +
                     "<option value=\"" + 2 +"\""+ ">"+ "锌" + "</option>" +
                     "<option value=\"" + 3 +"\""+ ">"+ "铁" + "</option>" +
                     "<option value=\"" + 4 +"\""+ ">"+ "硫" + "</option>" 
                    )
                }
                $.get(home.urls.sample.getAllBySendIdAndNameLike(),{
                    sendId : sys
                },function(result) {
                var samples = result.data.content;
                projects.splice(0,projects.length);
                samples.forEach(function(e){
                    projects.push(e.name)
                })
                len = samples.length;
            //    console.log(len)
            //    console.log(projects)
                reportAlysis.funcs.renderHandler1($selector, samples);
                })
            })
            reportAlysis.funcs.renderChart($("#analysisButton"),projects,len)
        }
        /**渲染下拉框 */
        ,renderSelector1 :function(){
            const $selector1 = $("#classType1");
            $.get(home.urls.clazz.getAll(),{},function(result){
                var clazz1 = result.data;
                reportAlysis.funcs.renderHandler($selector1, clazz1);
            })
            const $selector2 = $("#classType2");
            $.get(home.urls.clazz.getAll(),{},function(result){
                var clazz2 = result.data;
                reportAlysis.funcs.renderHandler($selector2, clazz2);
            })
            const $selector3 = $("#system");
            $.get(home.urls.check.getAll(),{},function(result){
                var systems = result.data;
                reportAlysis.funcs.renderHandler($selector3, systems);
            })
        }
        /** 下拉框*/
        ,renderHandler : function($selector,samples) {    
            $selector.empty();
            samples.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /** 下拉框*/
        ,renderHandler1 : function($selector,samples) {    
            $selector.empty();
            samples.forEach(function(e){
                $selector.append(
                        "<input type='checkbox' value=\"" + (e.id) +"\""+ "checked >"+ (e.name) + "&nbsp;&nbsp;" 
                )
            })
        }
        /** 绘制曲线图 */
        ,renderChart : function(buttons,projects,len){
            buttons.off('click').on('click',function(){
                var sys = $("#system").val();
                var startDate = $("#startTime").val();               
                var class1 = $("#classType1").val();               
                var endDate = $("#endTime").val();              
                var class2 = $("#classType2").val();
                var project = $("#project").val();
                var datas = [];
                var times = [];
                var tArray = new Array();
                for( var i = 0; i < len; i++){
                    tArray[i] = new Array();
                }
                var series = [];
                if(sys == 1){
                    $.get(home.urls.delegation.getReportAnalysis1(),
                    {
                        startDate : startDate,
                        startClazzId : class1,
                        endDate : endDate,
                        endClazzId : class2
                    },function(result){
                        var details = result.data
                        console.log(details)
                        console.log(details.dqcp)
                        var len = details.length;
                        console.log(len);
                        if(details == null){
                            return;
                        } else{
                            if(project == 1){
                                details.dqcp.forEach(function(e){
                                    datas.push(e.pb)
                                })
                            }else if(project == 2){
                                details.dqcp.forEach(function(e){
                                    datas.push(e.zn)
                                })
                            }else if(project == 3){
                                details.dqcp.forEach(function(e){
                                    datas.push(e.fe)
                                })
                            }else if(project == 4){
                                details.dqcp.forEach(function(e){
                                    datas.push(e.sf)
                                })
                            }
                            
                            for( var i = 0; i < details.dqcp.length; i++){
                                var t = details.dqcp[i].sampleManageInfo.addDate.substr(0,10);
                                times.push(t)
                            }
                            console.log(datas)
                            console.log(times)
                        }
                    })
                } else{
                    $.get(home.urls.delegation.getReportAnalysis2(),
                        {   
                            startDate : startDate,
                            startClazzId : class1,
                            endDate : endDate,
                            endClazzId : class2       
                        },function(result){
                            var details = result.data
                            if(details == null){
                                return;
                            } else{
                               
                            }
                    })
                }      
                var myChart = echarts.init(document.getElementById("sampleChart"));
                var option = {
                    // 标题
                    title : {
                        text : '单项目品味分析'
                    }, 
                    // 图例
                    legend: {
                        data: ["原矿","低铅粗泡","铅精"]
                    //    data : projects
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
                    //    data : times
                        data : ["2018/08/01","2018/08/02","2018/08/03"]
                    },
                    //纵坐标
                    yAxis : {
                        type : 'value',
                        name : "品味（%）"
                    },
                    // 数据
                //    series : [{
                //        name: projects[0],
                //        data : datas,
                //        type : 'line'  
                //    }]
                //  series : series
                    series : [{
                        name: "原矿",
                        data : [123,23,145],
                        type : 'line'  
                    },
                    {
                        name: "低铅粗泡",
                        data : [13,232,100],
                        type : 'line'  
                    },
                    {
                        name: "铅精",
                        data : [63,145,165],
                        type : 'line'  
                    }]
                };
                // 图形实例化
                myChart.setOption(option);
                // 根据窗口大小变动图标  无需刷新
                window.onresize = function() {
                    myChart.resize();
                }

            })
        }



    }
}