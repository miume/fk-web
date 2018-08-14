var department = {
    init: function() {
        /**获取部门信息分页显示 */
        department.funcs.renderTable();
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
                                departmment.funcs.renderHandler($tbody, departments, page);
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
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
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
                        var parentDepartmentId = $("#addParentDepartmentId").val();
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

            })
        }
         /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
               
            })
        }
         /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var departmentName = $("#searchDepartmentName").datalist.val();
                $.get(home.urls.department.getById(),
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
                    "<td><input type='checkbox' value="+e.id+"></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.name ? e.name : ' ')+"</td>" +
                    "<td>"+(e.info ? e.info : ' ')+"</td>" +
                    "<td>"+(e.parentDepartment ? e.parentDepartment.id : ' ')+"</td>" +
                    "<td>"+(e.parentDepartment ? e.parentDepartment.name : ' ')+"</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.id)+"'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })
            /**绑定单条记录删除事件 */
            department.funcs.bindDeleteByIdEvents($(".delete"))
            /**绑定编辑角色事件 */
            department.funcs.bindEditorDepartmentEvents($(".editor"))
            /**绑定成员管理事件 */
            /**绑定编辑权限事件 */
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
                        $.post(home.urls.department.deleteById() ,{_method:"delete",id : 1},function (result) {
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
                    btn2 : function(index){
                        layer.close(index);
                    }
                })
            })
        }
        ,bindEditorDepartmentEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var id = $(this).attr('id').substr(5);
               
               $.get(home.urls.department.getById(),{ id:id }, function(result) {
                   var departments = result.data;
                   var id = departments.id;
                   $("#updateDepartmentId").val(departments.id);
                   $("#updateDepartmentName").val(departments.name);
                   $("#updateDepartmentInfo").val(departments.info);
                   $("#updateParentDepartmentId").val(departments.parentDepartment ? departments.parentDepartment.id : ' ');
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
                           var parentDepartmentId = $("#updateParentDepartmentId").val();
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
                           $("#updateModal").css("display","none");
                           layer.close(index);
                       },
                       btn2 : function(index) {
                           $("#updateModal").css("display","none");
                           layer.close(index);
                       }
                   })
               })

            })
        }


    }

}