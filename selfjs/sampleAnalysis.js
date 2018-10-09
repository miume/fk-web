var sampleAnalysis = {
    init : function(){
        sampleAnalysis.funcs.renderSelector1();
        sampleAnalysis.funcs.renderSelector();
    }
    ,funcs : {
        /**渲染下拉框 */
        renderSelector : function(){
            const $selector = $("#sample");
                $.get(home.urls.sample.getAllBySendIdAndNameLike(),{
                    sendId : 1
                },function(result) {
                var samples = result.data.content;
                sampleAnalysis.funcs.renderHandler($selector, samples);
                })
            $("#system").on('click',function(){
                var sys = $("#system").val();
                $("#syatem").off('click')
                if(sys == 1){
                //    console.log("1")
                //   $("#sInfo").attr("checked","false")
                    $("#sInfo").checked = false
                } else{
                //    console.log("2")
                    $("#sInfo").attr("checked","true")
                }
                const $selector = $("#sample");
                $.get(home.urls.sample.getAllBySendIdAndNameLike(),{
                    sendId : sys
                },function(result) {
                var samples = result.data.content;
                sampleAnalysis.funcs.renderHandler($selector, samples);
                })
            })
            sampleAnalysis.funcs.renderChart($("#analysisButton"))
        }
        /**渲染下拉框 */
        ,renderSelector1 :function(){
            const $selector1 = $("#classType1");
            $.get(home.urls.clazz.getAll(),{},function(result){
                var clazz1 = result.data;
                sampleAnalysis.funcs.renderHandler($selector1, clazz1);
            })
            const $selector2 = $("#classType2");
            $.get(home.urls.clazz.getAll(),{},function(result){
                var clazz2 = result.data;
                sampleAnalysis.funcs.renderHandler($selector2, clazz2);
            })
            const $selector3 = $("#system");
            $.get(home.urls.check.getAll(),{},function(result){
                var systems = result.data;
                sampleAnalysis.funcs.renderHandler($selector3, systems);
            })

        }
        /** 绘制柱形图 */
        ,renderChart : function(buttons) {
            buttons.off('click').on('click',function(){
                var data = [];
                var sys = $("#system").val();
                if(sys == 1){
                    data = ['铅','锌','铁']
                } else{
                    data = ['铅','锌','铁','硫']
                }
                
                var startDate = $("#startTime").val();               
                var class1 = $("#classType1").val();               
                var endDate = $("#endTime").val();              
                var class2 = $("#classType2").val();
                var sample = $("#sample").val();
                $.get(home.urls.delegation.getSampleAnalysis(),
                {
                    startDate : startDate,
                    startClazzId : class1,
                    endDate : endDate,
                    endClazzId : class2,
                    sendToCheckId : sys,
                    sampleId :sample
                },function(result){
                    if(result.data == null){
                        return ;
                    }
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
                        var myChart = echarts.init(document.getElementById("sampleChart"));
                        var option = {
                            // 标题
                            title : {
                                text : '单样品品味分析'
                            }, 
                            // 图例
                            legend: {
                            //    data: ["铅","锌","硫"]
                                data : data
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
                                name: data[0],
                                data : tArray[0],
                                type : 'bar',
                                barWidth : "auto"
                            },{
                                name: data[1],
                                data : tArray[1],
                                type : 'bar',
                                barWidth : "auto"
                            },{
                                name: data[2],
                                data : tArray[2],
                                type : 'bar',
                                barWidth : "auto"
                            }]
                        };
                        // 图形实例化
                        myChart.setOption(option);
                        // 根据窗口大小变动图标  无需刷新
                        window.onresize = function() {
                            myChart.resize();
                        }
                    }
                })
                
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
        /**绘制图表 */
        


    }
}