var department = {
    init: function() {
        /**获取部门信息分页显示 */
        department.funcs.renderTable();
        department.funcs.renderSelector();
        var out = $("#department_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#department_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs: {
        /**渲染页面 */
        renderTable: function() {
            /**获取所有的记录 */
            $.get(home.urls.department.getAllByPage(), { page : 0 }, function(result) {
                var departments = result.data.content;
                const $tbody = $("#departmentTable").children("tbody");
                department.funcs.renderHandler($tbody, departments , 0);
                department.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "department_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.department.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var departments = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#departmentTable").children("tbody");
                                department.funcs.renderHandler($tbody, departments, page);
                                department.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            department.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
           department.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            department.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定搜索事件 */
           department.funcs.bindSearchEvents($("#searchButton"));
        }

        ,renderSelector : function() {
            /*渲染搜索功能下拉框*/ 
            $.get(home.urls.department.getAll(),{},function(result) {
                var departments = result.data;
                const $selector = $("#searchDepartmentName");
                department.funcs.renderHandler3($selector, departments);
            })
        }
        ,renderAddSelector : function() {
            /*渲染添加功能下拉框*/ 
                const $selector1 = $("#addParentDepartmentName");    
                    $.get(home.urls.department.getAll(),{},function(result) {
                        var departments = result.data;
                        department.funcs.renderHandler1($selector1, departments);
                    })
                
           // })
        }
        ,renderUpdateSelector : function(id) {
            /*渲染编辑功能下拉框*/ 
            $.get(home.urls.department.getById(),{id : id},function(result) {
                var dpts = result.data;
                const $selector2 = $("#updateParentDepartmentName");
                department.funcs.renderHandler2($selector2,dpts);
            //     $("#updateParentDepartmentName").off('click')
                $("#updateParentDepartmentName").on('click',function() {
                    $(this).off('click');
                    $.get(home.urls.department.getAll(),{},function(result) {
                        var departments = result.data;
                        department.funcs.renderHandler1($selector2, departments);
                    })
                   
                })
            })
               
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                department.funcs.renderAddSelector();
                $("#addDptModal").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '增加部门',
                    content: $("#addDptModal"),
                    area: ['380px','300px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                    //    var id = $("#addDepartmentId").val();
                        var name = $("#addDepartmentName").val();
                        var info = $("#addDepartmentInfo").val();
                        var parentDepartmentId = $("#addParentDepartmentName").find("option:selected").val();
                        console.log(parentDepartmentId);
                        if(name===null){
                            layer.msg("部门名称不能为空");
                            return 
                        }
                        $.post(home.urls.department.add() ,
                            {  
                                name : name,
                                info : info,
                                parentId : parentDepartmentId
                            },
                        function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        department.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                        })
                        $("#addDptModal").css("display","none");
                        layer.close(index);
                    },
                    closeBtn : 0,
                    btn2 : function(index) {
                        $("#addDptModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".department-checkBox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else {
                    layer.open({
                        type : 1,
                        title : "批量删除",
                        content : "<h5 style='text-align:center;'>您确定要删除所有数据吗？</h5>",
                        area: ['200px','140px'],
                        offset : ['40%', '55%'],
                        btn: ['确定', '取消'],
                        yes : function(index) {
                            var rolesIdS = [];
                            /**存取所有选中行的id值 */
                            $(".department-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    rolesIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.department.deleteByIds(), {
                                _method : "delete", ids : rolesIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        department.init()
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
         /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
               department.funcs.renderTable();
            })
        }
         /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                
                var departmentName = $("#searchDepartmentName").find("option:selected").text();
                console.log(departmentName)
                var departmentId = $("#searchDepartmentName").find("option:selected").val();
                console.log(departmentId)
                $.get(home.urls.department.getByNameLikeByPage(),
                {
                    name : departmentName, page : 0
                }, function(result){
                    var departments = result.data.content;
                const $tbody = $("#departmentTable").children("tbody");
                department.funcs.renderHandler($tbody, departments , 0);
                department.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "department_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.department.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var departments = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#departmentTable").children("tbody");
                                departmment.funcs.renderHandler($tbody, departments, page);
                                department.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
        ,renderHandler : function($tbody, departments, page) {
            //清空表格
            $tbody.empty() ;
            var i = 1 + page * 10;

            departments.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='department-checkbox'></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.name ? e.name : ' ')+"</td>" +
                    "<td>"+(e.info ? e.info : ' ')+"</td>" +
                    "<td>"+(e.parentDepartment ? e.parentDepartment.id : ' ')+"</td>" +
                    "<td>"+(e.parentDepartment ? e.parentDepartment.name : ' ')+"</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='delete' id='delete-"+(e.id)+"'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>"
                )
            })

            /**实现全选 */
            var checkedBoxLength = $(".department-checkBox:checked").length;
            home.funcs.bindselectAll($("#department-checkBoxAll"), $(".department-checkbox"), checkedBoxLength, $("#departmentTable"));
            /**绑定单条记录删除事件 */
            department.funcs.bindDeleteByIdEvents($(".delete"))
            /**绑定编辑角色事件 */
            department.funcs.bindEditorDepartmentEvents($(".editor"))
            /**绑定成员管理事件 */
            /**绑定编辑权限事件 */
        }
        /**getAll()*/ 
        ,renderHandler1 : function($selector, departments) {    
            $selector.empty() ;
            var v = -1;
            var s = "无父部门";
            $selector.append(
                "<option value=\"" + (v) +"\""+ ">"+ (s) + "</option>"
            )
            departments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /**getById()----parentDepartmentId */
        ,renderHandler2 : function($selector, departments) {
            $selector.empty() ;
                $selector.append(
                        "<option value=\"" + (departments.parentDepartment ? departments.parentDepartment.id : ' ') +"\""+ ">"+ (departments.parentDepartment ? departments.parentDepartment.name : ' ') + "</option>"
                )
        }
        ,renderHandler3 : function($selector, departments) {    
            $selector.empty() ;
            var v = -1;
            var s = "请选择部门";
            $selector.append(
                "<option value=\"" + (v) +"\""+ ">"+ (s) + "</option>"
            )
            departments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        ,bindDeleteByIdEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var _this = $(this);
                layer.open({
                    type: 1,
                    title: '删除部门',
                    content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
                    area: ['200px','140px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var id = parseInt(_this.attr('id').substr(7)) ;
                        console.log(id)
                        $.post(home.urls.department.deleteById() ,{_method:"delete",id : id},function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        department.init()
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
        ,bindEditorDepartmentEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var id = $(this).attr('id').substr(5);
               department.funcs.renderUpdateSelector(id);
               
               $.get(home.urls.department.getById(),{ id:id }, function(result) {
                   var departments = result.data;
                   var id = departments.id;
                   $("#updateDepartmentId").val(departments.id);
                   $("#updateDepartmentName").val(departments.name);
                   $("#updateDepartmentInfo").val(departments.info);
                   $("#updateDptModal").removeClass("hide");
                   layer.open({
                       type: 1,
                       title: '修改部门',
                       content: $("#updateDptModal"),
                       area: ['380px', '300px'],
                       btn: ['确定', '取消'],
                       offset: ['40%','45%'],
                       yes: function(index){
                           var name = $("#updateDepartmentName").val();
                           var info = $("#updateDepartmentInfo").val();
                           var parentDepartmentId = $("#updateParentDepartmentName").find("option:selected").val();
                           if(parentDepartmentId===null){
                               parentDepartmentId = -1;
                           }
                           console.log(parentDepartmentId)
                           if(name===null){
                               layer.msg('部门名称不能为空!');
                               return 
                           }
                           $.post(home.urls.department.update() ,{
                               id : id,
                               name : name,
                               info : info,
                               parentId : parentDepartmentId
                           }, function(result) {
                               layer.msg(result.message, {
                                   offset : ['40%', '55%'],
                                   time : 700
                               })
                               if(result.code === 0) {
                                   var time = setTimeout(function() {
                                       department.init();
                                       clearTimeout(time);
                                   },500)
                               }
                           })
                           $("#updateDptModal").css("display","none");
                           layer.close(index);
                       },
                       closeBtn : 0,
                       btn2 : function(index) {
                           $("#updateDptModal").css("display","none");
                           layer.close(index);
                       }
                       
                   })
               })

            })
        }


    }

}