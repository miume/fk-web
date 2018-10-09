var team = {
    departmentData : [] ,
    init : function() {
        team.funcs.renderTable();
    }
    ,funcs : {
        renderTable : function() {
            $.get(home.urls.team.getAllByPage(), {} , function(result) {
                var teams = result.data.content;
                //console.log(teams)
                const $tbody = $("#teamTable").children("tbody");
                team.funcs.renderHandler($tbody, teams, 0);
                var data = result.data;
                /**分页 */
                layui.laypage.render({
                    elem : "teamPage",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.team.getAllByPage(), {
                                page : obj.curr - 1 ,
                                size : obj.limit
                            } , function(result) {
                                var teams = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#teamTable").children("tbody");
                                team.funcs.renderHandler($tbody,teams,page);
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            team.funcs.bindAddEvent($("#addButton"));
            /**绑定批量删除事件 */
            team.funcs.bindDeleteByIdsEvent($("#deleteButton"));
            /**绑定搜索事件 */
            team.funcs.bindSearchByNameEvent($("#searchButton"));
            /**绑定刷新事件 */
            team.funcs.bindRefreshEvent($("#refreshButton"));
        }
        ,renderHandler : function($tbody,data,page) {
            var i = page * 10 + 1;
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='teamCheckbox' id="+ (e.id) +" /></td>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>"+ (e.name) +"</td>" +
                    "<td>"+ (e.department?e.department.name:'') +"</td>" +
                    "<td><a href='#' class='edit' id='edit-"+ (e.id) +"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='delete' id='delete-"+ (e.id) +"'><i class='fa fa-times-circle-o' aria-hidden='true''></i></a></td>" +
                    "</tr>"
                )
            })
            /**实现全选 */
            var checkedBox = $(".teamCheckbox checked");
            home.funcs.bindselectAll($("#checkboxAll"),$(".teamCheckbox"),checkedBox,$("#teamTable"));
            /**绑定编辑事件 */
            team.funcs.bindEditEvent($(".edit"));
            /**绑定单条记录删除事件 */
            team.funcs.bindDeleteByIdEvent($(".delete"));
        }
         /**绑定新增事件 */
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#layerModal").removeClass("hide");
                $("#team").val("");
                $("#department").empty();
                $.get(home.urls.department.getAll(), {}, function(result) {
                    var res = result.data;
                    res.forEach(function(e) {
                        $("#department").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                     })
                })
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#layerModal"),
                    area : ["300px","200px"],
                    btn : ["保存","取消"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        var name = $("#team").val();
                        var department = $("#department").val();
                        if(name === "" && department === "") {
                            layer.msg("班组和部门不能为空！",{
                                offset : ["40%","55%"],
                                time : 700
                            })
                            return 
                        }
                        $.post(home.urls.team.add(), {
                            name : name,
                            'department.id' : department
                        },function(result) {
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    team.init();
                                    clearTimeout(time);
                                },700)
                            }
                            layer.msg(result.message,{
                                offset : ["40%","55%"],
                                time : 700
                            })
                        })
                        $("#layerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#layerModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                if($(".teamCheckbox:checked").length === 0) {
                    layer.msg("您还没选择任何数据！",{
                        offset : ["40%","55%"],
                        time : 700
                    })
                }
                else {
                    layer.open({
                        type : 1,
                        title : "批量删除",
                        content : "<h5 style='text-align:center;'>您确定要删除所有数据吗？</h5>",
                        area : ["250px","140px"],
                        offset : "auto",
                        btn : ["确定","取消"],
                        yes : function(index) {
                            var ids = [];
                            $(".teamCheckbox").each(function() {
                                if($(this).prop("checked")) {
                                    //console.log($(this).attr("id"));
                                    ids.push(parseInt($(this).attr("id")));
                                }
                            })
                            //.log(ids)
                            $.post(home.urls.team.deleteByIds(),{
                                _method : "delete",ids : ids.toString()
                            },function(result){
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        team.init();
                                        clearTimeout(time);
                                    },700)
                                }
                                layer.msg(result.message,{
                                    offset : ["40%","55%"],
                                    time : 700
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
        /**搜索事件 */
        ,bindSearchByNameEvent :function(buttons){
            buttons.off('click').on('click',function(){
                var name = $("#teamName").val();
                $.get(home.urls.team.getByNameLikeByPage(),{name : name},function(result){
                    var teams = result.data.content;
                //console.log(teams)
                const $tbody = $("#teamTable").children("tbody");
                team.funcs.renderHandler($tbody, teams, 0);
                var data = result.data;
                /**分页 */
                layui.laypage.render({
                    elem : "teamPage",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.team.getAllByPage(), {
                                page : obj.curr - 1 ,
                                size : obj.limit
                            } , function(result) {
                                var teams = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#teamTable").children("tbody");
                                team.funcs.renderHandler($tbody,teams,page);
                            })
                        }
                    }
                })
                })
            })
        }
        /**刷新事件 */
        ,bindRefreshEvent :function(buttons){
            buttons.off('click').on('click',function(){
                team.funcs.renderTable();
            })
        }
        /**绑定编辑事件 */
        ,bindEditEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(5);
                //console.log(id)
                $.get(home.urls.team.getById(), {
                    id : id
                },function(result) {
                    var res = result.data;
                    $("#layerModal").removeClass("hide");
                    team.funcs.renderEdtiData(res);
                    layer.open({
                        type : 1,
                        title : "编辑",
                        content : $("#layerModal"),
                        area : ["300px","200px"],
                        btn : ["保存","取消"],
                        offset : "auto",
                        closeBtn : 0,
                        yes : function(index) {
                            var name = $("#team").val();
                            var department = $("#department").val();
                            if(name === "" && department === "") {
                                layer.msg("班组和部门不能为空！",{
                                    offset : ["40%","55%"],
                                    time : 700
                                })
                                return 
                            }
                            $.post(home.urls.team.update(), {
                                id : id,
                                name : name,
                                'department.id' : department
                            },function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        team.init();
                                        clearTimeout(time);
                                    },700)
                                }
                                layer.msg(result.message,{
                                    offset : ["40%","55%"],
                                    time : 700
                                })
                            })
                            $("#layerModal").addClass("hide");
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            $("#layerModal").addClass("hide");
                            layer.close(index);
                        }
                    })
                })
            })
        }
         /**绑定单条记录删除事件 */
        ,bindDeleteByIdEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(7);
                layer.open({
                    type : 1,
                    title : "批量删除",
                    content : "<h5 style='text-align:center;'>您确定要删除该数据吗？</h5>",
                    area : ["250px","140px"],
                    offset : "auto",
                    btn : ["确定","取消"],
                    yes : function(index) {
                        $.post(home.urls.team.deleteById(),{
                            _method : "delete" ,id : id
                        },function(result) {
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    team.init();
                                    clearTimeout(time);
                                },700)
                            }
                            layer.msg(result.message,{
                                offset : ["40%","55%"],
                                time : 700
                            })
                        })
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                })
            })
        }
        /**渲染编辑弹出框数据 */
        ,renderEdtiData : function(data) {
            //console.log(data)
            $("#team").val(data.name);
            $("#department").empty();
            $.get(home.urls.department.getAll(), {}, function(result) {
                var res = result.data;
                if(data.department) {
                    $("#department").append("<option value="+ (data.department.id) +">"+ (data.department.name) +"</option>");
                    res.forEach(function(e) {
                        if( data.department.id != e.id) {
                            $("#department").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                         }
                    })
                }
                else {
                     res.forEach(function(e) {
                        $("#department").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                     })
                }
               
            })
        }
    }
}