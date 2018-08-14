var role_management = {
    init: function() {
        /**获取角色信息分页显示 */
        role_management.funcs.renderTable();
        var out = $("#rolManagement_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#rolManagement_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs: {
        /**渲染页面 */
        renderTable: function() {
            /**获取所有的记录 */
            $.get(home.urls.role.getAllByPage(), { page : 0 }, function(result) {
                var roles = result.data.content;
                const $tbody = $("#roleManagementTable").children("tbody");
                role_management.funcs.renderHandler($tbody, roles, 0);
                role_management.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "rolManagement_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.role.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var roles = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#roleManagementTable").children("tbody");
                                role_management.funcs.renderHandler($tbody, roles, page);
                                role_management.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            role_management.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            role_management.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            role_management.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定搜索事件 */
            role_management.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#updateModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateModal"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    yes : function(index) {
                        var name = $("#roleNames").val();
                        var description = $("#roledescription").val();
                        if(name===null){
                            layer.msg('角色名称不能为空!');
                            return 
                        }
                        $.post(home.urls.role.add() , {
                            name : name,
                            description : description
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    role_management.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#updateModal").addClass("hide");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#updateModal").addClass("hide");
                        layer,close(index);
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

            })
        }
        ,renderHandler : function($tbody, roles, page) {
            //清空表格
            $tbody.empty() ;
            var i = 1 + page * 10;
            roles.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+"></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.name ? e.name : ' ')+"</td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.description ? e.description : ' ')+"</td>" +
                    "<td>"+(e.createTime ? new Date(e.createTime).Format('yyyy-MM-dd hh:mm:ss') : ' ')+"</td>" +
                    "<td>"+(e.updateTime ? new Date(e.updateTime).Format('yyyy-MM-dd hh:mm:ss') : ' ')+"</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.id)+"'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' id='editPeople-"+(e.id)+"'><i class='fa fa-user-circle' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' id='editRoles-"+(e.id)+"'><i class='fa fa-key fa-rotate-90' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })
            /**绑定单条记录删除事件 */
            role_management.funcs.bindDeleteByIdEvents($(".delete"))
            /**绑定编辑角色事件 */
            role_management.funcs.bindEditorRolesEvents($(".editor"))
            /**绑定成员管理事件 */
            /**绑定编辑权限事件 */
        }
        ,bindDeleteByIdEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var _this = $(this);
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
                    area: ['200px','140px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var id = parseInt(_this.attr('id').substr(7)) ;
                        console.log(id)
                        $.ajax({
                            type : "DELETE",
                            url : home.urls.role.deleteById() ,
                            data : {"id" : id},
                            success: function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        role_management.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                            }
                        })
                        layer.close(index)
                    },
                    btn2 : function(index){
                        layer.close(index);
                    }
                })
            })
        }
        ,bindEditorRolesEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var id = $(this).attr('id').substr(5);
               
               $.get(home.urls.role.getById(),{ id:id }, function(result) {
                   var roles = result.data;
                   var id = roles.id;
                   $("#roleNames").val(roles.name);
                   $("#roledescription").val(roles.description);
                   $("#updateModal").removeClass("hide");
                   layer.open({
                       type: 1,
                       title: '编辑',
                       content: $("#updateModal"),
                       area: ['380px', '200px'],
                       btn: ['确定', '取消'],
                       offset: ['40%','45%'],
                       yes: function(index){
                           var name = $("#roleNames").val();
                           var description = $("#roledescription").val();
                           if(name===null){
                               layer.msg('角色名称不能为空!');
                               return 
                           }
                           $.post(home.urls.role.update() ,{
                               id : id,
                               name : name,
                               description : description
                           }, function(result) {
                               layer.msg(result.message, {
                                   offset : ['40%', '55%'],
                                   time : 700
                               })
                               if(result.code === 0) {
                                   var time = setTimeout(function() {
                                       role_management.init();
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