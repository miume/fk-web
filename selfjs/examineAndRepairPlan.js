var plan = {
    init: function() {
        /**获取检修信息分页显示 */
        plan.funcs.renderTable();
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
            $.get(home.urls.maintenanceSchedule.getNotCompleteByPage(),{},function(result) {
                var equipments = result.data.content;
                var $tbody =  $("#equipmentTable").children("tbody");
                plan.funcs.renderHandler($tbody,equipments,0);
                plan.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "user_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.maintenanceSchedule.getNotCompleteByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var equipments = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#equipmentTable").children("tbody");
                                plan.funcs.renderHandler($tbody, equipments, page);
                                plan.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            plan.funcs.bindAddEvents($("#addButton"));
             /**绑定导出事件 */
            plan.funcs.bindExpertEvents($("#expertButton"));
             /**绑定刷新事件 */
            plan.funcs.bindRefreshEvents($("#refreshButton"));
              /**绑定查询事件 */
            plan.funcs.bindSearchEvents($("#searchButton"));
        }
        /**渲染下拉框 */
        ,renderSelector : function() { 
            const $selector1 = $("#addEquipmentName");    
                $.get(home.urls.dataDictionary.getAllDataByTypeId(),{id : 3},function(result) {
                    var equipments = result.data;
                    plan.funcs.renderHandler2($selector1, equipments);
                })
        }
        /*渲染编辑功能下拉框*/ 
        ,renderUpdateSelector : function(id) {     
            $.get(home.urls.maintenanceSchedule.getById(),{id : id},function(result) {
                var equipments = result.data;
                const $selector2 = $("#updateEquipmentName");
                $selector2.empty();
                $selector2.append(
                    "<option value=\"" + (equipments.equipmentInfoId.id) +"\""+ ">"+ (equipments.equipmentInfoId.dicName) + "</option>"
                )
                $("#updateEquipmentName").on('click',function() {
                    $(this).off('click');
                    $.get(home.urls.dataDictionary.getAllDataByTypeId(),{id : 3},function(result) {
                        var equipments = result.data;
                        plan.funcs.renderHandler2($selector2, equipments);
                    })  
                })
            })    
        }
        /**渲染回填工单下拉框 */
        ,renderBackSelector : function() { 
            const $selector = $("#backRepairMan");    
                $.get(home.urls.user.getAll(),{},function(result) {
                    var users = result.data;
                    plan.funcs.renderHandler1($selector, users);
                })
        }
        /**新增检修计划 */
        ,bindAddEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var userId = home.user.id;
            //    console.log(name);
                plan.funcs.renderSelector();
                $("#addPlanModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增检修计划",
                    content : $("#addPlanModal"),
                    area : ['400px','330px'],
                    btn : ['确定','取消'],
                    offset: ['40%', '45%'],
                    closeBtn : 0,
                    yes : function(index){
                        var dptId = $("#addEquipmentName").find("option:selected").val();
                    //    console.log(dptId)
                        var description = $("#addDescription").val();
                    //    console.log(description)
                        var note = $("#addNote").val();
                    //    console.log(note)
                        $.post(home.urls.maintenanceSchedule.add(),{
                            "enter.id" : userId,
                            "equipmentInfoId.id" : dptId,
                            "description" : description,
                            "remarks" : note,
                            "flag" : 0
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    plan.init();
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '45%'],
                                time: 700
                            })
                        })
                        $("#addPlanModal").css("display","none");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#addPlanModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**导出事件 */
        ,bindExpertEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var url = home.urls.maintenanceSchedule.download();
                $("#download-id").attr("href",url);
            })
        }
        /**刷新事件 */
        ,bindRefreshEvents : function(buttons) {
            buttons.off('click').on('click',function() {  
               var index = layer.load(2 , { offset : ['40%','58%'] });
                var time = setTimeout(function() {
                    layer.msg('刷新成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                    plan.init(); 
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**查询事件 */
        ,bindSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var equipmentName = $("#checkEquipment").val();
                var description = $("#problemDescription").val();
                if(equipmentName === null){
                    layer.msg('设备名称不能为空！');
                    return
                } else {
                    $.get(home.urls.maintenanceSchedule.getByNameLikeByPage(),{
                        name : equipmentName,
                        description : description
                    },function(result){
                        var plans = result.data.content
                        var $tbody =  $("#equipmentTable").children("tbody");
                plan.funcs.renderHandler($tbody,plans,0);
                plan.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "user_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.maintenanceSchedule.getByNameLikeByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var plans = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#equipmentTable").children("tbody");
                                plan.funcs.renderHandler($tbody, plans, page);
                                plan.pageSize = result.data.length;
                            })
                        }
                    }
                })
                    })
                }
            })
        }
        /**数据渲染 */
        ,renderHandler : function($tbody,equipments,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            equipments.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.equipmentInfoId.dicName) + "</td>" +
                    "<td>" + (e.enter ? e.enter.name : ' ') + "</td>" +
                    "<td>" + (e.enteringTime) + "</td>" +
                    "<td>" + (e.description ? e.description : ' ') + "</td>" +
                    "<td>" + (e.remarks ? e.remarks : ' ') + "</td>" +
                    "<td>" + (e.flag) + "</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class ='delete' id='delete-"+(e.id)+"'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "<td><a href='#' class ='back' id='back-"+(e.id)+"'>回填工单</i></a></td>" +
                    "</tr>"
                )
            })
            /** 绑定编辑事件*/
            plan.funcs.bindEditEvents($('.editor'));
            /** 绑定删除事件*/
            plan.funcs.bindDeleteEvents($('.delete'));
            /** 绑定回填工单事件*/
            plan.funcs.bindBackEvents($('.back'));
        }
        /**getAllequipments , 获取所有部门，以下拉框形式呈现*/ 
        ,renderHandler1 : function($selector, equipments) {    
            $selector.empty() ;
            equipments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        ,renderHandler2 : function($selector, equipments) {    
            $selector.empty() ;
            equipments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.dicName) + "</option>"
                )
            })
        }
        /**编辑检修计划 */
        ,bindEditEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(5)
                plan.funcs.renderUpdateSelector(id);
            //    console.log(id)
                $.get(home.urls.maintenanceSchedule.getById(),{id : id},function(result) {
                    var plan = result.data
                    $("#updateDescription").val(plan.description);
                    $("#updateNote").val(plan.remarks);
                })    
                $("#updatePlanModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑检修计划",
                    content : $("#updatePlanModal"),
                    area : ['400px','350px'],
                    btn : ['确定','取消'],
                    offset: ['40%', '45%'],
                    closeBtn : 0,
                    yes : function(index){
                        var dptId = $("#updateEquipmentName").find("option:selected").val();
                        var description = $("#updateDescription").val();
                        var note = $("#updateNote").val();
                    
                        $.post(home.urls.maintenanceSchedule.update(),{
                            "enter.id" : home.user.id,
                            "id" : id,
                            "equipmentInfoId.id" : dptId,
                            "description" : description,
                            "remarks" : note,
                            "flag" : 0
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    plan.init();
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                        })
                        $("#updatePlanModal").css("display","none");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#updatePlanModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**删除检修计划 */
        ,bindDeleteEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(7);
                layer.open({
                    type: 1,
                    title: '删除检修计划',
                    content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
                    area: ['200px','140px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                    //    var id = parseInt(_this.attr('id').substr(7)) ;
                    //    console.log(id)
                        $.post(home.urls.maintenanceSchedule.deleteByIds() ,{_method:"delete",ids : id},function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        plan.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                        })
                        layer.close(index)
                    },
                    closeBtn : 0,
                    btn2 : function(index){
                        layer.close(index);
                    }
                }) 
            })
        }
        /**回填工单 */
        ,bindBackEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(5);
                plan.funcs.renderBackSelector();
                    $("#backModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "回填工单",
                    content : $("#backModal"),
                    area : ['400px','300px'],
                    btn : ['确定','取消'],
                    offset: ['40%', '45%'],
                    closeBtn : 0,
                    yes : function(index){
                        var backenterId = $("#backRepairMan").find("option:selected").val();  
                        var startTime = $("#backStartTime").val();
                        var reason = $("#backProblemReason").val();
                        var result = $("#backHandleResult").val();
                        var endTime = $("#backEndTime").val();
                        var backNote = $("#backNote").val();
                        $.post(home.urls.checkRecord.add(),{
                            "maintenanceSchedule.id" : id ,
                            "backEnter.id" : backenterId,
                            arriveTime : startTime,
                            cause : reason,
                            result : result,
                            finishTime : endTime,
                            remarks : backNote
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    plan.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                        })
                        $("#backModal").css("display","none");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#backModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
    }

}