statisticalReport = {
    $tbody : $("#statisticalReportTable").children("tbody"),
    $thead : $("#statisticalReportTable").children("thead"),
    keyHead : [],           //存取表头的键值
    waterTypeInfo : [],     //存取表头动态的字段
    waterSubjectInfos : [], 
    waterConsumptionInfoDetailList : [],  //用来存取新增和更新时需要传的动态字段
    temp : 0,
    init : function() {
        statisticalReport.funcs.renderTable();
    },
    funcs : {
        renderTable : function() {
            $.get(home.urls.waterConsumption.getAllTypes(),{},function(result) {
                var waterHead = result.data;
                //获取表头的键值对
                statisticalReport.funcs.renderHead(waterHead);
            })
            statisticalReport.funcs.bindDefaultSearchEvent();
        }
        /**动态渲染表头 */
        ,renderHead : function(data) {
            statisticalReport.$thead.empty();
            statisticalReport.keyHead = [];
            statisticalReport.$thead.append("<tr>");
            statisticalReport.$thead.append("<td style='min-width: 75px;'>时间</td>");
            statisticalReport.keyHead.push("date");
            data.forEach(function(e) {
                var waterSubjectInfos = e.waterSubjectInfos;
                waterSubjectInfos.forEach(function(ele) {
                    if(ele.name == "选硫废水表") {
                        statisticalReport.$thead.append("<td>"+ (ele.name) +" 本月开机时间</td>");
                        statisticalReport.waterTypeInfo.push({
                            name : ele.name + "本月开机时间",
                            id : ele.id
                        });
                    }
                    else{
                        statisticalReport.$thead.append("<td>"+ (ele.name) +" 本月表底</td>");
                        statisticalReport.waterTypeInfo.push({
                            name : ele.name + "本月表底",
                            id : ele.id
                        });
                    }
                    statisticalReport.keyHead.push(ele.id);
                    //存取表头动态字段（方便用于动态渲染编辑和新增弹出框）
                   
                })
            })
            statisticalReport.$thead.append("<td style='min-width: 60px;'>录入人</td><td style='min-width: 80px;'>录入时间</td><td style='min-width: 60px;'>修改人</td><td style='min-width: 80px;'>修改时间</td><td style='min-width: 47px;'>编辑</td></tr>");
            statisticalReport.keyHead.push("enterUser");
            statisticalReport.keyHead.push("enterTime");
            statisticalReport.keyHead.push("modifiedUser");
            statisticalReport.keyHead.push("modifiedTime");
            console.log(statisticalReport.keyHead)
            //return statisticalReport.keyHead;
        }
        /**默认搜索当年的数据 */
        ,bindDefaultSearchEvent : function() {
            var date = new Date();
            var nowYear = date.getFullYear();
            var startDate = nowYear + '-01';
            var endDate = nowYear + '-12';
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            statisticalReport.funcs.bindSearchEvent(startDate,endDate);
            statisticalReport.funcs.bindAutoSearchEvent($("#search"));
            statisticalReport.funcs.bindAddEvent($("#addBtn"));
        }
        /**选择起始时间和结束时间进行搜索 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val(startDate);
                var endDate = $("#endDate").val(endDate);
                statisticalReport.funcs.bindSearchEvent(startDate,endDate);
            })
        }
        /**根据起始日期和结束日期搜索事件 */
        ,bindSearchEvent : function(startDate,endDate) {
            $.get(home.urls.waterConsumption.getByDateBetweenByPage(),{
                startDate : startDate,
                endDate : endDate
            }, function(result) {
                var consumption = result.data.content;
                var datas = statisticalReport.funcs.getMapData(consumption);
                statisticalReport.funcs.renderHandler(datas);
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
                                endDate : endDate
                            }, function(result) {
                                var consumption = result.data.content;
                                var datas = statisticalReport.funcs.getMapData(consumption);
                                statisticalReport.funcs.renderHandler(datas);
                            })
                        }
                    }        
                 })
            })   
        }
        /**将数据渲染成键值对的形式 */
        ,getMapData : function(data) {
            var datas = [];
            data.forEach(function(e) {
                var map = {};
                map["id"] = e.id || "" ;
                map["date"] = e.date || "";
                map["enterTime"] = e.enterTime || "";
                map["enterUser"] = e.enterUser && e.enterUser.name || "";
                map["modifiedTime"] = e.modifiedTime || "";
                map["modifiedUser"] = e.modifiedUser && e.modifiedUser.name || "";
                var waterConsumptionInfoDetailList = e.waterConsumptionInfoDetailList;
                waterConsumptionInfoDetailList.forEach(function(ele) {
                    map[ele.waterSubjectInfo.id] = ele.waterValue;
                })
                datas.push(map);
            })
            console.log(datas)
            return datas;
        }
        ,renderHandler : function(data) {
            var $tbody = statisticalReport.$tbody;
            $tbody.empty();
            //console.log(statisticalReport.keyHead)
            data.forEach(function(e) {
                //console.log(e)
                $tbody.append("<tr>");
                statisticalReport.keyHead.forEach(function(ele) {
                    $tbody.append("<td>" + (e[ele] || '') + "</td>");
                })
                $tbody.append(
                    "<td><a href='#' class = 'editor' id='editor-"+e["id"]+"'><i class='layui-icon'>&#xe642;</i></a></td>");
                $tbody.append("</tr>");
            })
            statisticalReport.funcs.bindEditorEvent($(".editor"));
        }
        /**绑定编辑事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                statisticalReport.funcs.bindLayerTable();
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.waterConsumption.getById(), {
                    id : id
                }, function(result) {
                    var res = result.data.waterConsumptionInfoDetailList;
                    res.forEach(function(e) {
                        $("#edit-"+e.waterSubjectInfo.id).attr("value",e.waterValue);
                    })
                    $("#inputDate").val(result.data.date);
                    $("#inputDate").attr("disabled","disable");
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑用水统计管理参数",
                    content : $("#addModal"),
                    area : ["500px", "470px"],
                    offset : ["20%", "35%"],
                    btn : ["确定", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        statisticalReport.funcs.bindEditorUpdateData(id,index);
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
                            // if(e.keyCode == 13) {
                            //     statisticalReport.funcs.bindEditorUpdateData(id,index);
                            // }
                        })
                    }
                })
             })
          })
        }
        /**动态渲染弹出框的表格样式 */
        ,bindLayerTable : function() {
            /**先渲染表格样式 */
            const $tbody = $("#addTable").children("tbody");
            $tbody.empty();
            statisticalReport.waterConsumptionInfoDetailList = [];
            statisticalReport.waterTypeInfo.forEach(function(e) {
                $tbody.append("<tr><td style='text-align:right;background-color:#f2f2f2;'>"+ (e.name) +"：</td><td><input type='text' id='edit-"+ (e.id) +"' /></td></tr>");
                statisticalReport.waterConsumptionInfoDetailList.push({
                    waterSubjectInfo : { id : e.id },
                    waterValue : 0
                })
            })
        }
        ,bindEditorUpdateData : function(id,index) {
            /**通过session获取当前用户 */
            var userStr = $.session.get('user');
            var userJson = JSON.parse(userStr);
            var modifiedUser = userJson.id;
            var flag = 0;
            statisticalReport.waterConsumptionInfoDetailList.forEach(function(e) {
                e.waterValue = $("#edit-"+e.waterSubjectInfo.id).val();
                if(e.waterValue === ""){
                    flag = 1;
                    
                }
            })
            if(flag === 1) {
                layer.msg("还有数据未填！",{
                    offset : ["40%", "55%"],
                    time : 700
                })
                return 
            }
            var data = {
                id : id,
                modifiedUser : { id : modifiedUser },
                waterConsumptionInfoDetailList : statisticalReport.waterConsumptionInfoDetailList
            }
            //console.log(data)
            $.ajax({
                url : home.urls.waterConsumption.update(),
                contentType : "application/json",
                data : JSON.stringify(data),
                dataType : "json",
                type : "post",
                success : function(result) {
                    if(result.code === 0) {
                        var time = setTimeout(function() {
                            var startDate = $("#startDate").val();
                            var endDate = $("#endDate").val();
                            statisticalReport.funcs.bindSearchEvent(startDate,endDate);
                            clearTimeout(time);
                        },500);
                    }
                    layer.msg(result.message, {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    $("#addModal").css("display","none");
                    layer.close(index);
                }
            })
        }
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#addModal").removeClass("hide");
                statisticalReport.funcs.bindLayerTable();
                $("#inputDate").val("")
                $("#inputDate").removeAttr("disabled");
                layer.open({
                    type : 1,
                    title : "用水统计管理参数录入",
                    content : $("#addModal"),
                    area : ["500px", "470px"],
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
                            // if(e.keyCode == 13) {
                            //     statisticalReport.funcs.bindAddData(index);
                            // }
                        })
                    }
                })
            })
        }
        ,bindAddData :function(index) {
            var date = $("#inputDate").val();
            if(date === "") {
                layer.msg("日期不能为空！",{
                    offset : ["40%", "55%"],
                    time : 700
                })
                return 
            }
            /**通过session获取当前用户 */
            var userStr = $.session.get('user');
            var userJson = JSON.parse(userStr);
            var enterUser = userJson.id;
            var flag = 0;
            statisticalReport.waterConsumptionInfoDetailList.forEach(function(e) {
                e.waterValue = $("#edit-"+e.waterSubjectInfo.id).val();
                if(e.waterValue === ""){
                    flag = 1;
                }
            })
            if(flag === 1) {
                layer.msg("还有数据未填！",{
                    offset : ["40%", "55%"],
                    time : 700
                })
                return 
            }
            var data = {
                date : date,
                enterUser : { id : enterUser },
                waterConsumptionInfoDetailList : statisticalReport.waterConsumptionInfoDetailList
            }
            $.ajax({
                url : home.urls.waterConsumption.add(),
                contentType : "application/json",
                data : JSON.stringify(data),
                dataType : "json",
                type : "post",
                success : function(result) {
                    if(result.code === 0) {
                        var time = setTimeout(function() {
                            var startDate = $("#startDate").val();
                            var endDate = $("#endDate").val();
                            statisticalReport.funcs.bindSearchEvent(startDate,endDate);
                            clearTimeout(time);
                        },500);
                    }
                    layer.msg(result.message, {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    $("#addModal").css("display","none");
                    layer.close(index);
                }
            })
        }
    }
}