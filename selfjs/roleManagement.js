var roleManagement = {
    init: function() {
        /**获取角色信息分页显示 */
        roleManagement.funcs.renderTable();
        var out = $("#rolManagement-page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#rolManagement-page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
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
                roleManagement.funcs.renderHandler($tbody, roles, 0);
                roleManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "rolManagement-page",
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
                                roleManagement.funcs.renderHandler($tbody, roles, page);
                                roleManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            roleManagement.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            roleManagement.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            roleManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定搜索事件 */
            roleManagement.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#roleNames").val("");
                $("#roledescription").val("");
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
                                    roleManagement.init();
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
                if($(".role-checkBox:checked").length === 0) {
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
                            $(".role-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    rolesIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.role.deleteByIds(), {
                                _method : "delete", ids : rolesIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        roleManagement.init()
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
                    "<td><input type='checkbox' value="+e.id+" class='role-checkbox' /></td>" +
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
           
            /**实现全选 */
            var checkedBoxLength = $(".role-checkBox:checked").length;
            home.funcs.bindselectAll($("#role-checkBoxAll"), $(".role-checkbox"), checkedBoxLength, $("#roleManagementTable"));
            /**绑定单条记录删除事件 */
            roleManagement.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定编辑角色事件 */
            roleManagement.funcs.bindEditorRolesEvents($(".editor"));
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
                        var id = parseInt(_this.attr('id').substr(7))
                        console.log(id)
                        $.post(home.urls.role.deleteById() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    roleManagement.init()
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
        ,bindEditorRolesEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var id = $(this).attr('id').substr(5);
               $("#roleNames").val("");
               $("#roledescription").val("");
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
                                       roleManagement.init();
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