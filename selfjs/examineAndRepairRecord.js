var record = {
    init: function() {
        /**获取部门信息分页显示 */
        record.funcs.renderTable();
        record.funcs.renderSelector();
        var out = $("#user_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#user_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs: {
        /**渲染表格 */
        renderTable : function(){
            var nowdate = new Date();
            var endYear = nowdate.getFullYear();
            var endMonth = nowdate.getMonth()+1;
            var endDay = nowdate.getDate();
            if(endMonth<10) {
                endMonth="0"+endMonth;
            }
            if(endDay<10) {
                endDay="0"+endDay;
            }
            var endTime = endYear+'-'+endMonth+'-'+endDay;
            //获取系统前一个月的时间
            nowdate.setMonth(nowdate.getMonth()-1);
            var startYear = nowdate.getFullYear();
            var startMonth = nowdate.getMonth()+1;
            var startDay = nowdate.getDate();
            if(startMonth<10) {
                startMonth="0"+startMonth;
            }
            if(startDay<10) {
                startDay="0"+startDay;
            }
            var startTime = startYear+'-'+startMonth+'-'+startDay;
            $.get(home.urls.checkRecord.getByEquipmentAndDate(),{
                startDate : startTime,
                endDate : endTime
            },function(result) {
                var records = result.data.content;
                var $tbody =  $("#recordTable").children("tbody");
                record.funcs.renderHandler($tbody,records,0);
                record.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "user_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.checkRecord.getByEquipmentAndDate(),{
                                startDate : startTime,
                                endDate : endTime
                            }, function (result) {
                                var records = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#recordTable").children("tbody");
                                record.funcs.renderHandler($tbody, records, page);
                                record.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定修改事件 */
            record.funcs.bindEditEvents($("#updateButton"));
            /**绑定批量删除事件 */
            record.funcs.bindDeleteByIdsEvents($("#deleteButton"));
             /**绑定导出事件 */
            record.funcs.bindExpertEvents($("#expertButton"));
             /**绑定刷新事件 */
            record.funcs.bindRefreshEvents($("#refreshButton"));
              /**绑定查询事件 */
            record.funcs.bindSearchEvents($("#searchButton"));
        }
         /**渲染下拉框 */
         ,renderSelector : function() { 
                const $selector1 = $("#checkEquipment");    
                $.get(home.urls.equipment.getAllByPage(),{},function(result) {
                    var equipments = result.data.content;
                    record.funcs.renderHandler1($selector1, equipments);
                })
        }
        /**渲染回填工单下拉框 */
        ,renderUpdateSelector : function() { 
            const $selector = $("#updateRepairMan");    
                $.get(home.urls.user.getAll(),{},function(result) {
                    var users = result.data;
                    record.funcs.renderHandler2($selector, users);
                })
        }
        /**修改记录 */
        ,bindEditEvents : function(buttons) {
            buttons.off('click').on('click',function() {
            //    record.funcs.renderUpdateSelector();
                if($(".record-checkBox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                } else if($(".record-checkBox:checked").length >1){
                    layer.msg('您一次只能修改一条数据 ！',{
                        offset : ['40%', '55%'],
                        time : 700
                    })   
                } else {
                    // 获取当前记录的ID
                    var recordId=[]
                    $(".record-checkbox").each(function() {
                        if($(this).prop("checked")) {
                            recordId.push(parseInt($(this).val()));
                        }
                    })
                    // 查询当前记录下的所有信息
                    $.get(home.urls.checkRecord.getById(),{id : recordId.toString()},function(result){
                        var record = result.data
                        var scheduleId = record.maintenanceSchedule.id  // 获取检修计划的ID
                        $selector = $("#updateRepairMan")
                        $selector.empty();
                        $selector.append(
                            "<option value=\"" + (record.backEnter ? record.backEnter.id : ' ') +"\""+ ">"+ (record.backEnter ? record.backEnter.name : ' ') + "</option>"
                        )
                        $("#updateRepairMan").on('click',function(){
                            $(this).off('click');
                            $.get(home.urls.user.getAll(),{},function(result) {
                                var users = result.data;
                            //    record.funcs.renderHandler2($selector, users);
                                $selector.empty() ;
                                users.forEach(function(e){
                                    $selector.append(
                                    "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                                    )
                                })
                            })
                        })
                        $("#updateStartTime").val(record.arriveTime)
                        $("#updateProblemReason").val(record.cause)
                        $("#updateHandleResult").val(record.result)
                        $("#updateEndTime").val(record.finishTime)
                        $("#updateNote").val(record.remarks)

                        $("#updateRecordModal").removeClass("hide");
                        layer.open({
                            type : 1,
                            title : "修改检修记录",
                            content : $("#updateRecordModal"),
                            area : ['400px','300px'],
                            btn : ['确定','取消'],
                            offset: ['40%', '45%'],
                            closeBtn : 0,
                            yes : function(index){
                                var recordId = [];
                                $(".record-checkbox").each(function() {
                                    if($(this).prop("checked")) {
                                        recordId.push(parseInt($(this).val()));
                                    }
                                })
                                console.log(recordId.toString())
                                var backenterId = $("#updateRepairMan").find("option:selected").val();  
                                var startTime = $("#updateStartTime").val();
                                var reason = $("#updateProblemReason").val();
                                var result = $("#updateHandleResult").val();
                                var endTime = $("#updateEndTime").val();
                                var backNote = $("#updateNote").val();
                                $.post(home.urls.checkRecord.update(),{
                                    "maintenanceSchedule.id" : scheduleId ,
                                    "backEnter.id" : backenterId,
                                    "id" : recordId.toString(),
                                    "arriveTime" : startTime,
                                    "cause" : reason,
                                    "result" : result,
                                    "finishTime" : endTime,
                                    "remarks" : backNote
                                },function(result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                        record.init()
                                        clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                            })
                        })
                        $("#updateRecordModal").css("display","none");
                        layer.close(index);
                    },
                        btn2 : function(index) {
                        $("#updateRecordModal").css("display","none");
                        layer.close(index);
                        }
                        })
                    })   
                }
            })
        }
        /**批量删除 */
        ,bindDeleteByIdsEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                if($(".record-checkBox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else {
                    layer.open({
                        type : 1,
                        title : "批量删除",
                        content : "<h5 style='text-align:center;'>您确定要删除所有选中数据吗？</h5>",
                        area: ['200px','140px'],
                        offset : ['40%', '55%'],
                        btn: ['确定', '取消'],
                        yes : function(index) {
                            var rolesIdS = [];
                            /**存取所有选中行的id值 */
                            $(".record-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    rolesIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.checkRecord.deleteByIds(), {
                                _method : "delete", ids : rolesIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        record.init();
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                }) 
                            })
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            layer.close(index);
                        }
                    })
                }
            })
        }
        /**导出Excel */
        ,bindExpertEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var equipmentId = $("#checkEquipment").find("option:selected").val();
                var startTime = $("#startTime").val();
                var endTime = $("#endTime").val();
                if((startTime === "") && (endTime === "")){
                    layer.msg('日期选择不能为空！');
                    return
                }
                var url = home.urls.checkRecord.download() + "?startDate=" + startTime + "&endDate=" + endTime + "&equipmentCode=" + equipmentId;
                $("#download-id").attr("href",url);
            })
        } 
        /**刷新界面 */
        ,bindRefreshEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               record.init();
            })
        }
        /**查询 */
        ,bindSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var equipmentId = $("#checkEquipment").find("option:selected").val();
                var startTime = $("#startTime").val();
                var endTime = $("#endTime").val();
                if((startTime === "") && (endTime === "")){
                    layer.msg('日期选择不能为空！');
                    return
                }
                $.get(home.urls.checkRecord.getByEquipmentAndDate(),{
                    startDate: startTime,
                    endDate : endTime,
                    equipmentCode : equipmentId
                },function(result){
                    var records = result.data.content;
                var $tbody =  $("#recordTable").children("tbody");
                record.funcs.renderHandler($tbody,records,0);
                record.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "user_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.checkRecord.getByEquipmentAndDate(),{
                                startDate: startTime,
                                endDate : endTime,
                                equipmentCode : equipmentId
                            }, function (result) {
                                var records = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#recordTable").children("tbody");
                                record.funcs.renderHandler($tbody, records, page);
                                record.pageSize = result.data.length;
                            })
                        }
                    }
                })

                })
            })
        }
        /**渲染表格 */
        ,renderHandler : function($tbody,records,page) {
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            records.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='record-checkbox'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.id) + "</td>" +
                    "<td>" + (e.maintenanceSchedule.id) + "</td>" +
                    "<td>" + (e.maintenanceSchedule.equipmentInfoId.name) +"</td>" +
                    "<td>" + (e.maintenanceSchedule.enter ? e.maintenanceSchedule.enter.name : ' ') +"</td>" +
                    "<td>" + (e.maintenanceSchedule.enteringTime) +"</td>" +
                    "<td>" + (e.maintenanceSchedule.description) +"</td>" +
                    "<td>" + (e.backEnter ? e.backEnter.name : ' ') +"</td>" +
                    "<td>" + (e.arriveTime) +"</td>" +
                    "<td>" + (e.cause) +"</td>" +
                    "<td>" + (e.result) +"</td>" +
                    "<td>" + (e.finishTime) +"</td>" +
                    "<td>" + (e.remarks) +"</td>" +
                    "</tr>"
                )
            })
            /**实现全选 */
            var checkedBoxLength = $(".record-checkBox:checked").length;
            home.funcs.bindselectAll($("#record_checkBoxAll"), $(".record-checkbox"), checkedBoxLength, $("#recordTable"));
        }
        /**getAllequipments , 获取所有设备，以下拉框形式呈现*/ 
        ,renderHandler1 : function($selector, equipments) {    
            $selector.empty() ;
            var str = "所有设备"
            $selector.append(
                "<option value=''" + ">"+ (str) + "</option>"
            )
            equipments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /**getAllequipments , 获取所有用户，以下拉框形式呈现*/ 
        ,renderHandler2 : function($selector, users) {    
            $selector.empty() ;
            s.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }


       
       
        
       
    
    }

}