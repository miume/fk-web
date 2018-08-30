waterConsumption = {
    $tbody : $("#waterTable").children("tbody"),
    init : function() {
       // waterConsumption.funcs.bindDefaultSearchEvent();
        waterConsumption.funcs.bindProductReportEvent($("#save"));
        waterConsumption.funcs.bindDetailEvent($(".detail"));
        waterConsumption.funcs.bindEditorEvent($(".editor"));
    },
    funcs : {
        /***默认搜索当年的数据 */
        bindDefaultSearchEvent : function() {
            var date = new Date();
            var nowYear = date.getFullYear();
            var startDate = nowYear + '-01';
            var endDate = nowYear + '-12';
            $.get(home.urls.dispatchAccount.getByDateAndScheduleByPage(),{
                startDate : startDate,
                endDate : endDate,
                scheduleId : -1
            }, function(result) {
                var consumption = result.data.content;
                waterConsumption.funcs.renderHandler($tbody,consumption);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "waterConsumption_page",
                    count : 10 * data.totalPages,
                    /**页面变换后的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.dispatchAccount.getByDateAndScheduleByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                                scheduleId : -1
                            }, function(result) {
                                var consumption = result.data.content;
                                waterConsumption.funcs.renderHandler($tbody,consumption);
                            })
                        }
                    }        
                 })
            })
            waterConsumption.funcs.bindSearchEvent($("#search"));
        }
        /**渲染数据 */
        ,renderHandler : function($tbody,data) {
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.month) +"</td>" +
                    "<td>"+ (e.dateRange) +"</td>" +
                    "<td>"+ (e.month) +"</td>" +
                    "<td>"+ (e.dateRange) +"</td>" +
                    "<td>"+ (e.date) +"</td>" +
                    "<td><a href='#' class='detail' id='detail-"+ (e.id) +"'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "<td><a href='#' class='editor' id='editor-"+ (e.id) +"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<tr>"
                )
            })
             waterConsumption.funcs.bindDetailEvent($(".detail"));
             waterConsumption.funcs.bindEditorEvent($(".editor"));
        } 
        /**绑定详情事件 */
        ,bindDetailEvent : function(buttons) {
            buttons.off("click").on("click", function() {
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
        /**绑定重新生产报表事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                layer.open({
                    type : 1,
                    title : "重新生成报表",
                    content : "<h5 style='text-align:center;'>确定重新生成报表?</h5>",
                    area : ["250px", "140px"],
                    offset : "auto",
                    btn : ["确定", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
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
                layer.open({
                    type : 1,
                    title : "生成报表",
                    content : $("#productReport"),
                    area : ["280px", "160px"],
                    offset : "auto",
                    btn : ["生成报表", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $("#layerProductReport").removeClass("hide");
                        layer.open({
                            type : 1,
                            title : "用水统计月报表",
                            content : $("#layerProductReport"),
                            area : ["1100px", "540px"],
                            offset : "auto",
                            btn : ["导出", "返回"],
                            closeBtn : 0,
                            yes : function(index) {
                                $("#layerProductReport").addClass("hide");
                                layer.close(index);
                            }
                            ,btn2 : function(index) {
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
                        $("#productReport").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#productReport").addClass("hide");
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                $("#productReport").addClass("hide");
                                layer.close(index);
                                //让按钮失去焦点
                                $(':focus').blur();
                            }
                        })
                    }
                })
            })
        }
    }
}