waterConsumption = {
    $tbody : $("#waterTable").children("tbody"),
    waterTypeTotalInfo : [],     //存取动态字段
    init : function() {
        waterConsumption.funcs.bindDefaultSearchEvent();
        waterConsumption.funcs.bindProductReportEvent($("#save"));
    },
    funcs : {
        /***默认搜索当年的数据 */
        bindDefaultSearchEvent : function() {
            var date = new Date();
            var nowYear = date.getFullYear();
            var startDate = nowYear + '-01';
            var endDate = nowYear + '-12';
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            waterConsumption.funcs.bindSearchEvent(startDate,endDate);
            waterConsumption.funcs.bindAutoSearchEvent($("#search"));
        }
        ,bindSearchEvent : function(startDate,endDate){
            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                startDate : startDate,
                endDate : endDate,
            }, function(result) {
                var consumption = result.data.content;
                waterConsumption.funcs.renderHandler(consumption);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "waterConsumption_page",
                    count : 10 * data.totalPages,
                    /**页面变换后的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.waterConsumption.findByDateBetweenByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                            }, function(result) {
                                var consumption = result.data.content;
                                waterConsumption.funcs.renderHandler(consumption);
                            })
                        }
                    }        
                 })
            })
        }
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                waterConsumption.funcs.bindSearchEvent(startDate,endDate);
            })
        }
        /**渲染数据 */
        ,renderHandler : function(data) {
            waterConsumption.$tbody.empty();
            data.forEach(function(e) {
                waterConsumption.$tbody.append(
                    "<tr>" +
                    "<td>"+ (e.date ? e.date : '') +"</td>" +
                    "<td>"+ (e.sumTimePeriod ? e.sumTimePeriod : '') +"</td>" +
                    "<td>"+ (e.tjDepartment ? e.tjDepartment.name : '') +"</td>" +
                    "<td>"+ (e.enterUser ? e.enterUser.name : '') +"</td>" +
                    "<td>"+ (e.enterTime ? e.enterTime : '') +"</td>" +
                    "<td><a href='#' class='detail' id='detail-"+ (e.id) +"'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "<td><a href='#' class='editor' id='editor-"+ (e.id) +"'>重新生成</a></td>" +
                    "<tr>"
                )
            })
             waterConsumption.funcs.bindDetailEvent($(".detail"));
             waterConsumption.funcs.bindEditorEvent($(".editor"));
        } 
        /**绑定详情事件 */
        ,bindDetailEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                waterConsumption.funcs.bindLayerTable();
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.waterConsumption.findById(), { id : id }, function(result) {
                    var res = result.data;
                    waterConsumption.funcs.bindDetailData(res);
                    $("#layerProductReport").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "报表详情",
                    content : $("#layerProductReport"),
                    area : ["1100px", "540px"],
                    offset : "auto",
                    btn : ["取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $("#layerProductReport").addClass("hide");
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                $("#layerProductReport").addClass("hide");
                                layer.close(index);
                                //让按钮失去焦点
                                $(':focus').blur();
                            }
                        })
                    }
                })
            })
        })
        }
        /**动态渲染弹出表格样式 */
        ,bindLayerTable : function() {
            /**先渲染表格样式 */
            console.log("table")
            const $tbody = $("#productReportTable").children("tbody");
            $tbody.empty()
            $.get(home.urls.waterConsumption.getAllTypes(),{},function(result) {
                var waterHead = result.data;
                var rows = 0;
                waterHead.forEach(function(e) {
                    rows += e.waterSubjectInfos.length
                })
                var flag1 = 0; 
                var flag = 0 ;
                waterHead.forEach(function(e) {
                    var waterSubjectInfos = e.waterSubjectInfos;
                    // $tbody.append("<tr>");
                    // $tbody.append("<td rowspan="+ (waterSubjectInfos.length) +">"+ (e.name) +"</td>")
                    waterSubjectInfos.forEach(function(ele) {   
                        if(flag == 0 && flag1 == 0) {
                            $tbody.append("<tr><td rowspan="+ (waterSubjectInfos.length) +" class='grey'>"+ (e.name) +"</td><td class='grey'>"+ (ele.name) +"</td><td id='lastMonthMeter"+ (ele.id) +"'></td><td id='thisMonthMeter"+ (ele.id) +"'></td><td id='thisMonthUsed"+ (ele.id) +"'></td><td id='thisYearUsed"+ (ele.id) +"'></td><td id='mineralDealSum' rowspan="+ (rows) + "></td><td id='liveWater' rowspan="+(rows)+"></td><td id='tonWater' rowspan="+(rows)+"></td><td id='waterUsedRate' rowspan="+(rows)+"></td></tr>");
                            flag1 = 1;
                        }
                        else {
                            if(flag == 1){
                                $tbody.append("<tr><td rowspan="+ (waterSubjectInfos.length) +" class='grey'>"+ (e.name) +"</td><td class='grey'>"+ (ele.name) +"</td><td id='lastMonthMeter"+ (ele.id) +"'></td><td id='thisMonthMeter"+ (ele.id) +"'></td><td id='thisMonthUsed"+ (ele.id) +"'></td><td id='thisYearUsed"+ (ele.id) +"'></td></tr>");
                                flag = 0;
                            }
                            else {
                                if(ele.name === "选硫废水表") {
                                    $tbody.append("<tr><td class='grey'>"+ (ele.name) +"</td><td class='grey'>开机时间</td><td id='thisMonthMeter"+ (ele.id) +"'></td><td id='thisMonthUsed"+ (ele.id) +"'></td><td id='thisYearUsed"+ (ele.id) +"'></td></tr>");
                                }
                                else{
                                    $tbody.append("<tr><td class='grey'>"+ (ele.name) +"</td><td id='lastMonthMeter"+ (ele.id) +"'></td><td id='thisMonthMeter"+ (ele.id) +"'></td><td id='thisMonthUsed"+ (ele.id) +"'></td><td id='thisYearUsed"+ (ele.id) +"'></td></tr>");
                                }
                            }
                        }
                        
                    })
                    flag = 1;
                })
                $tbody.append("<tr><td class='grey'>300吨水池合计</td><td id='total-1'></td><td class='grey'>生产用水量</td><td id='total-2'></td><td>选矿废水合计</td><td id='total-3'></td><td class='grey'>清水总量</td><td id='total-4'></td><td class='grey'>废水总量</td><td id='total-5'></td></tr>");
            })
        }
        /**绑定详情数据 */
        ,bindDetailData : function(data) {
            console.log(data)
            $("#liveWater").text(data.liveWater);
            $("#tonWater").text(data.tonWater);
            $("#waterUsedRate").text(data.waterUsedRate);
            $("#mineralDealSum").text(data.mineralDealSum);
            var waterConsumptionReportDetails = data.waterConsumptionReportDetails;
            var waterConsumptionReportTotals = data.waterConsumptionReportTotals;
            waterConsumptionReportDetails.forEach(function(e) {
                var id = e.waterSubjectInfo.id;
                $("#lastMonthMeter"+id).text(e.lastMonthMeter ? e.lastMonthMeter : '0');
                $("#thisMonthMeter"+id).text(e.thisMonthMeter ? e.thisMonthMeter : '0'); 
                $("#thisMonthUsed"+id).text(e.thisMonthUsed ? e.thisMonthUsed : '0');
                $("#thisYearUsed"+id).text(e.thisYearUsed ? e.thisYearUsed : '0');
            })
            waterConsumptionReportTotals.forEach(function(e) {
                var id = e.waterTypeTotalInfo.id;
                $("#total-"+id).text(e.totalSum);
            })

        }
        /**绑定重新生产报表事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                var id = $(this).attr("id").substr(7);
                layer.open({
                    type : 1,
                    title : "重新生成报表",
                    content : "<h5 style='text-align:center;'>确定重新生成报表?</h5>",
                    area : ["250px", "140px"],
                    offset : "auto",
                    btn : ["确定", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $.get(home.urls.waterConsumption.reGenerateWaterMonth(), { id : id }, function(result) {
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    var startDate = $("#startDate").val();
                                    var endDate = $("#endDate").val();
                                    waterConsumption.funcs.bindSearchEvent(startDate,endDate);
                                    clearTimeout(time);
                                },500);
                            }
                            layer.msg(result.message, {
                                offset : ["40%","55%"],
                                time : 700
                            });
                        })
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                console.log("e.keyCode="+e.keyCode)
                                $("#layerProductReport").addClass("hide");
                                layer.close(index);
                                //让按钮失去焦点
                                $(':focus').blur();
                            }
                        })
                    }
                })
            })
        } 
        /**绑定生成报表事件 */
        ,bindProductReportEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                $("#productReport").removeClass("hide");
                $("#productDate").val('')
                layer.open({
                    type : 1,
                    title : "生成报表",
                    content : $("#productReport"),
                    area : ["280px", "160px"],
                    offset : "auto",
                    btn : ["生成报表", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        // $("#layerProductReport").removeClass("hide");
                        var date = $("#productDate").val();
                        var userStr = $.session.get('user');
                        var userJson = JSON.parse(userStr);
                        var userId = userJson.id;
                        if(date === ""){
                            layer.msg("日期不能为空",{
                                offset : ["40%","55%"],
                                time : 700
                            })
                            return 
                        }
                        $.get(home.urls.waterConsumption.generateWaterMonth(), {
                            date : date,
                            userId : userId
                        },function(result) {
                            //console.log(result.message)
                            layer.msg(result.message, {
                                offset : ["40%","55%"],
                                time : 1000
                            })
                            // if(result.code === 0) {
                            //     waterConsumption.funcs.bindLayerTable();
                            //     $("#layerProductReport").removeClass("hide");
                            //     layer.open({
                            //         type : 1,
                            //         title : "用水统计月报表",
                            //         content : $("#layerProductReport"),
                            //         area : ["1100px", "540px"],
                            //         offset : "auto",
                            //         btn : ["导出", "返回"],
                            //         closeBtn : 0,
                            //         yes : function(index) {
                            //             $("#layerProductReport").addClass("hide");
                            //             layer.close(index);
                            //         }
                            //         ,btn2 : function(index) {
                            //             $("#layerProductReport").addClass("hide");
                            //             layer.close(index);
                            //         }
                            //     })
                            // }
                        })
                        
                        $("#productReport").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#productReport").addClass("hide");
                        layer.close(index);
                    }
                    // ,success : function(layero, index){
                    //     /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                    //     $(document).on("keydown", function(e) {
                    //         if(e.keyCode == 27) {
                    //             $("#productReport").addClass("hide");
                    //             layer.close(index);
                    //             //让按钮失去焦点
                    //             $(':focus').blur();
                    //         }
                    //     })
                    // }
                })
            })
        }
    }
}