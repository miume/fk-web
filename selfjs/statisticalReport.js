statisticalReport = {
    $tbody : $("#statisticalReportTable").children("tbody"),
    temp : 0,
    init : function() {
        statisticalReport.funcs.bindDefaultSearchEvent();
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
            $.get(home.urls.waterConsumption.getByDateBetweenByPage(),{
                startDate : startDate,
                endDate : endDate
            }, function(result) {
                var consumption = result.data.content;
                statisticalReport.funcs.renderHandler(statisticalReport.$tbody,consumption);
                var data = result.data;
                /**分页消息 */
                layui.laypage.render({
                    elem : "statisticalReport_page",
                    count : 10 * data.totalPages,
                    /**页面变换后的逻辑 */
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.waterConsumption.getByDateBetweenByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1,
                                size : obj.limit
                            }, function(result) {
                                var consumption = result.data.content;
                                statisticalReport.funcs.renderHandler(statisticalReport.$tbody,consumption);
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
                    "<td>"+ (e.date) +"</td>" +
                    "<td>"+ (e.waterPool1500Meter ? e.waterPool1500Meter : '') +"</td>" +
                    "<td>"+ (e.waterPool300Meter1 ? e.waterPool300Meter1 : '') +"</td>" +
                    "<td>"+ (e.waterPool300Meter2 ? e.waterPool300Meter2 : '') +"</td>" +
                    "<td>"+ (e.washRoomMeter ? e.washRoomMeter : '') +"</td>" +

                    "<td>"+ (e.tgMeter ? e.tgMeter : '') +"</td>" +
                    "<td>"+ (e.mineWasteWaterMeter1 ? e.mineWasteWaterMeter1 : '') +"</td>" +
                    "<td>"+ (e.mineWasteWaterMeter2 ? e.mineWasteWaterMeter2 : '') +"</td>" +
                    "<td>"+ (e.siWasterWaterTime ? e.siWasterWaterTime : '') +"</td>" +

                    "<td>"+ (e.enterUser ? e.enterUser.name : '') +"</td>" +
                    "<td>"+ (e.enterTime ? e.enterTime : '') +"</td>" +
                    "<td>"+ (e.modifiedUser ? e.modifiedUser.name : '') +"</td>" +
                    "<td>"+ (e.modifiedTime ? e.modifiedTime : '') +"</td>" +
                    "<td><a href='#' class='editor' id='editor-"+ (e.id) +"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<tr>"
                )
            })
            statisticalReport.funcs.bindEditorEvent($(".editor"));
        }
        /**绑定编辑事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.waterConsumption.getById(), {
                    id : id
                }, function(result) {
                    var res = result.data;
                    statisticalReport.funcs.bindEditorData(res);
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑用水统计管理参数",
                    content : $("#addModal"),
                    area : ["500px", "430px"],
                    offset : ["20%", "35%"],
                    btn : ["确定", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        statisticalReport.funcs.bindEditorUpdateData(res,index);
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
                            }
                            if(e.keyCode == 13) {
                                statisticalReport.funcs.bindEditorUpdateData(res,index);
                            }
                        })
                    }
                })
             })
          })
        }
        ,bindEditorData : function(data) {
            $("#chooseDate").val(data.date);
            $("#chooseDate").attr("disabled","disabled")
            $("#waterPool1500Meter").val(data.waterPool1500Meter ? data.waterPool1500Meter : '');
            $("#waterPool300Meter1").val(data.waterPool300Meter1 ? data.waterPool300Meter1 : '');
            $("#waterPool300Meter2").val(data.waterPool300Meter2 ? data.waterPool300Meter2 : '');
            $("#washRoomMeter").val(data.washRoomMeter ? data.washRoomMeter : '');
            $("#tgMeter").val(data.tgMeter ? data.tgMeter : '');
            $("#mineWasteWaterMeter1").val(data.mineWasteWaterMeter1 ? data.mineWasteWaterMeter1 : '');
            $("#mineWasteWaterMeter2").val(data.mineWasteWaterMeter2 ? data.mineWasteWaterMeter2 : '');
            $("#siWasterWaterTime").val(data.siWasterWaterTime ? data.siWasterWaterTime : '');
        }
        ,bindEditorUpdateData : function(data,index) {
            var date = $("#chooseDate").val();
            var waterPool1500Meter = $("#waterPool1500Meter").val();
            var waterPool300Meter1 = $("#waterPool300Meter1").val();
            var waterPool300Meter2 = $("#waterPool300Meter2").val();
            var washRoomMeter = $("#washRoomMeter").val();
            var tgMeter = $("#tgMeter").val();
            var mineWasteWaterMeter1 = $("#mineWasteWaterMeter1").val();
            var mineWasteWaterMeter2 = $("#mineWasteWaterMeter2").val();
            var siWasterWaterTime = $("#siWasterWaterTime").val();
            /**通过session获取当前用户 */
            var userStr = $.session.get('user');
            var userJson = JSON.parse(userStr);
            var modifiedUser = userJson.id;
            if(!date || !waterPool1500Meter || !waterPool300Meter1 || !waterPool300Meter2 || !washRoomMeter || !tgMeter || !mineWasteWaterMeter1 || !mineWasteWaterMeter2 || !siWasterWaterTime) {
                layer.msg("还有数据未填！",{
                    offset : ["40%", "55%"],
                    time : 700
                })
                return 
            }
            $.post(home.urls.waterConsumption.update(), {
                id : data.id,
                date : date,
                waterPool1500Meter : waterPool1500Meter,
                waterPool300Meter1 : waterPool300Meter1,
                waterPool300Meter2 : waterPool300Meter2,
                washRoomMeter : washRoomMeter,
                tgMeter : tgMeter,
                mineWasteWaterMeter1 : mineWasteWaterMeter1,
                mineWasteWaterMeter2 : mineWasteWaterMeter2,
                siWasterWaterTime : siWasterWaterTime,
                'enterUser.id' : data.enterUser.id,
                'modifiedUser.id' : modifiedUser,
                modifiedTime : new Date().Format("yyyy-MM-dd")
            }, function(result) {
                layer.msg(result.message, {
                    offset : ["40%", "55%"],
                    time : 700
                })
                if(result.code === 0) {
                    var time = setTimeout(function() {
                        if(statisticalReport.temp === 0) {
                            statisticalReport.funcs.bindDefaultSearchEvent();
                        }
                        else {
                            statisticalReport.funcs.bindSearchEvent($("#search"));
                        }
                        clearTimeout(time);
                    },500)
                }
                $("#addModal").addClass("hide");
                layer.close(index);
            })

        }
        ,bindSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                statisticalReport.temp = 1;
                var startDate = $("#startDate").val(startDate);
                var endDate = $("#endDate").val(endDate);
                $.get(home.urls.statisticalReport.getByDate(),{
                    startDate : startDate,
                    endDate : endDate
                }, function(result) {
                    var consumption = result.data.content;
                    statisticalReport.funcs.renderHandler(statisticalReport.$tbody,consumption);
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
                                    statisticalReport.funcs.renderHandler(statisticalReport.$tbody,consumption);
                                })
                            }
                        }        
                     })
                })
            })
        }
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#addModal").removeClass("hide");
                $("#chooseDate").val('');
                $("#chooseDate").removeAttr("disabled");//去除input元素的disabled属性
                $("#waterPool1500Meter").val('');
                $("#waterPool300Meter1").val('');
                $("#waterPool300Meter2").val('');
                $("#washRoomMeter").val('');
                $("#tgMeter").val('');
                $("#mineWasteWaterMeter1").val('');
                $("#mineWasteWaterMeter2").val('');
                $("#siWasterWaterTime").val('');
                layer.open({
                    type : 1,
                    title : "用水统计管理参数录入",
                    content : $("#addModal"),
                    area : ["500px", "430px"],
                    offset : ["20%", "35%"],
                    btn : ["保存", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        statisticalReport.funcs.bindAddData(index);
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
                            if(e.keyCode == 13) {
                                statisticalReport.funcs.bindAddData();
                            }
                        })
                    }
                })
            })
        }
        ,bindAddData :function(index) {
            var date = $("#chooseDate").val();
            var waterPool1500Meter = $("#waterPool1500Meter").val();
            var waterPool300Meter1 = $("#waterPool300Meter1").val();
            var waterPool300Meter2 = $("#waterPool300Meter2").val();
            var washRoomMeter = $("#washRoomMeter").val();
            var tgMeter = $("#tgMeter").val();
            var mineWasteWaterMeter1 = $("#mineWasteWaterMeter1").val();
            var mineWasteWaterMeter2 = $("#mineWasteWaterMeter2").val();
            var siWasterWaterTime = $("#siWasterWaterTime").val();
            /**通过session获取当前用户 */
            var userStr = $.session.get('user');
            var userJson = JSON.parse(userStr);
            var enterUser = userJson.id;
            var siWasterWaterTime = $("#siWasterWaterTime").val();
            if(!date || !waterPool1500Meter || !waterPool300Meter1 || !waterPool300Meter2 || !washRoomMeter || !tgMeter || !mineWasteWaterMeter1 || !mineWasteWaterMeter2 || !siWasterWaterTime) {
                layer.msg("还有数据未填！",{
                    offset : ["40%", "55%"],
                    time : 700
                })
                return 
            }
            $.post(home.urls.waterConsumption.add(), {
                date : date,
                waterPool1500Meter : waterPool1500Meter,
                waterPool300Meter1 : waterPool300Meter1,
                waterPool300Meter2 : waterPool300Meter2,
                washRoomMeter : washRoomMeter,
                tgMeter : tgMeter,
                mineWasteWaterMeter1 : mineWasteWaterMeter1,
                mineWasteWaterMeter2 : mineWasteWaterMeter2,
                siWasterWaterTime : siWasterWaterTime,
                'enterUser.id' : enterUser,
                enterTime : new Date().Format("yyyy-MM-dd")
            }, function(result) {
                if(result.message == "录入失败, 已存在") {
                    layer.msg("该月份数据已录入，不要重复录入")
                    return
                }
                if(result.code === 0) {
                    layer.msg(result.message, {
                        offset : ["40%", "55%"],
                        time : 700
                    })
                    var time = setTimeout(function() {
                        if(statisticalReport.temp === 0) {
                            statisticalReport.funcs.bindDefaultSearchEvent();
                        }
                        else {
                            statisticalReport.funcs.bindSearchEvent($("#search"));
                        }
                        clearTimeout(time);
                    },500)
                }
                $("#addModal").addClass("hide");
                layer.close(index);
            })
            
        }
    }
}