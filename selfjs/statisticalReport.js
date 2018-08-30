statisticalReport = {
    $tbody : $("#statisticalReportTable").children("tbody"),
    init : function() {
        //statisticalReport.funcs.bindDefaultSearchEvent();
        statisticalReport.funcs.bindAddEvent($("#addBtn"));
        statisticalReport.funcs.bindEditorEvent($(".editor"));
    },
    funcs : {
        bindDefaultSearchEvent : function() {
            var date = new Date();
            var nowYear = date.getFullYear();
            var startDate = nowYear + '-01';
            var endDate = nowYear + '-12';
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            $.get(home.urls.statisticalReport.getByDate(),{
                startDate : startDate,
                endDate : endDate
            }, function(result) {
                var consumption = result.data.content;
                statisticalReport.funcs.renderHandler($tbody,consumption);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "statisticalReport_page",
                    count : 10 * data.totalPages,
                    /**页面变换后的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.statisticalReport.getByDate(),{
                                startDate : startDate,
                                endDate : endDate
                            }, function(result) {
                                var consumption = result.data.content;
                                statisticalReport.funcs.renderHandler($tbody,consumption);
                            })
                        }
                    }        
                 })
            })
            statisticalReport.funcs.bindSearchEvent($("#search"));
            statisticalReport.funcs.bindAddEvent($("#addBtn"));
        }
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
            statisticalReport.funcs.bindEditorEvent($(".editor"));
        }
        /**绑定编辑事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑用水统计管理参数",
                    content : $("#addModal"),
                    area : ["500px", "400px"],
                    offset : ["20%", "35%"],
                    btn : ["确定", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $("#addModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#addModal").addClass("hide");
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                $("#addModal").addClass("hide");
                                layer.close(index);
                                //让按钮失去焦点
                                $(':focus').blur();
                            }
                        })
                    }
                })
            })
        }
        ,bindSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val(startDate);
                var endDate = $("#endDate").val(endDate);
                $.get(home.urls.statisticalReport.getByDate(),{
                    startDate : startDate,
                    endDate : endDate
                }, function(result) {
                    var consumption = result.data.content;
                    statisticalReport.funcs.renderHandler($tbody,consumption);
                    var data = result.data;
                    /**分页消息 */
                    layui.laypage.render({
                        elem : "statisticalReport_page",
                        count : 10 * data.totalPages,
                        /**页面变换后的逻辑 */
                        jump : function(obj,first) {
                            if(!first) {
                                $.get(home.urls.statisticalReport.getByDate(),{
                                    startDate : startDate,
                                    endDate : endDate
                                }, function(result) {
                                    var consumption = result.data.content;
                                    statisticalReport.funcs.renderHandler($tbody,consumption);
                                })
                            }
                        }        
                     })
                })
            })
        }
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                console.log(111)
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "用水统计管理参数录入",
                    content : $("#addModal"),
                    area : ["500px", "400px"],
                    offset : ["20%", "35%"],
                    btn : ["保存", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $("#addModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#addModal").addClass("hide");
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                $("#addModal").addClass("hide");
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