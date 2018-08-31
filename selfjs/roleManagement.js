var roleManagement = {
    pageSize: 0,
    navigationOperations : [],
    init: function() {
        /**获取角色信息分页显示 */
        roleManagement.funcs.renderTable();
        var out = $("#rolManagement_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#rolManagement_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
          /**获取所有可分配操作*/
         $.get(servers.backup() + 'navigation/getAllNavigationOperations', { } ,function(result) {
            roleManagement.navigationOperations = result.data
        })
    }
    /**当前总记录数，用户控制全选逻辑 */
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
                    closeBtn: 0,
                    yes : function(index) {
                        var name = $("#roleNames").val();
                        var description = $("#roledescription").val();
                        if(name === ""){
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
                if($(".role-checkbox:checked").length === 0) {
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
                        closeBtn: 0,
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
                var index = layer.load(2 , { offset : ['40%','58%'] });
                var time = setTimeout(function() {
                    layer.msg('刷新成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                    roleManagement.init();
                    $("#inputRoleNames").val("");
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
         /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var roleName = $("#inputRoleNames").val();
                $.get(home.urls.role.getByNameLikeByPage(), { name : roleName }, function(result) {
                    var roles = result.data.content;
                    const $tbody = $("#roleManagementTable").children("tbody");
                    roleManagement.funcs.renderHandler($tbody, roles, 0);
                    roleManagement.pageSize = result.data.length;
                    var page = result.data;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "rolManagement_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.role.getByNameLikeByPage(),{
                                    name : roleName,
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
                    "<td><a href='#' class = 'editor' id='edit-"+(e.id)+"'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class = 'assignRoleToUsers' id = 'editPeople-"+(e.id)+"'><i class='fa fa-user-circle' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class = 'editRolesPermission' id='editRoles-"+(e.id)+"'><i class='fa fa-key fa-rotate-90' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
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
            roleManagement.funcs.bindAssignRoleToUsers($(".assignRoleToUsers"));
            /**绑定编辑权限事件 */
            roleManagement.funcs.bindEditRolesPermissions($(".editRolesPermission"))
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
                    closeBtn: 0,
                    yes: function (index) {
                        var id = parseInt(_this.attr('id').substr(7))
                        //console.log(id)
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
                       closeBtn: 0,
                       yes: function(index){
                           var name = $("#roleNames").val();
                           var description = $("#roledescription").val();
                           if(name===""){
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
        /**绑定编辑权限事件 */
        ,bindEditRolesPermissions : function(buttons) {
            buttons.off('click').on('click', function() {
                $("#rolesPermissiomTable").removeClass("hide");
                var $tbody = $("#tableTbody").children('tbody');
                $tbody.empty();
                /**获取当前角色分配的权限 */
                var roleId = $(this).attr('id').substr(10);
                $.get(home.urls.role.getPermissionsById(), { id : roleId } , function(result) {
                    var res = result.data;
                    var roleSecondPermissons = [];
                    res.forEach(function(e) {
                        var firstLevelMenus = e.firstLevelMenus;
                        firstLevelMenus.forEach(function(ele){
                            ele.secondLevelMenus.forEach(function(element){
                                var id = parseInt(element.id) ;
                                roleSecondPermissons.push(id);
                            })
                        })
                    })
                /**获取所有可分配操作*/
                var navigationIds = [];
                var menu1Ids = [];
                var menu2Ids = [];
                var navigations = [];
                var menu1s = [];
                var menu2s = [];
                navigations = roleManagement.navigationOperations;
                navigations.sort(function(a, b){
                    return a.rank -b.rank;
                })
                //console.log(roleManagement.navigationOperations);
                //console.log(navigations);
                navigations.forEach(function(e){
                    /**添加导航菜单 */
                    $tbody.append(
                        "<tr id='navigations-"+ (e.id) +"'>" +
                        "<td><i class='layui-icon'>&#xe7a0;<span>"+ (e.name) +"</span></i></td>" +
                        "<td style='min-width:23px;'></td><td></td>" +
                        "</tr>"
                    )
                    /**导航菜单后面添加一级菜单 */
                    menu1s = e.firstLevelMenus;
                    //console.log(menu1s)
                    menu1s.sort(function(a,b){
                        return b.rank - a.rank;
                    })
                    menu1s.forEach(function(ele){
                        var menu1Row = $(".navigations-"+ (e.id) +"-sub");
                        var menu1RowLen = menu1Row.length;
                        var menu1Bar = ( menu1RowLen == 0 ? $("#navigations-"+ (e.id) +"") : $(menu1Row[menu1RowLen - 1]) )
                        //console.log(menu1RowLen)
                        //console.log(ele)
                        $("#navigations-"+ (e.id) +"").after(
                            "<tr class='navigations-"+ (e.id) +"-sub'  id='menu1-"+ (ele.id) +"'>" +
                            "<td><i class='layui-icon' style='margin-left:15px'>&#xe625;</i><span>"+ (ele.name) +"</span></td>" +
                            "<td style='min-width:23px;'></td><td></td>" +
                            "</tr>"
                         )

                         menu2s = ele.secondLevelMenus;
                         /**遍历所有二级菜单，把二级菜单添加到一级菜单后面 */
                         menu2s.forEach(function(element){
                             //console.log(element)
                            /** 获取当前二级菜单的id  */
                             var menu2Id = element.id;
                             var subs = $(".menu1-"+ (ele.id) +"-sub");
                             var subLen = subs.length;
                             //console.log(subLen)
                             var menu2Bar = ( subLen == 0 ? $("#menu1-"+ (ele.id) +"") : $(subs[subLen - 1]) )
                             //console.log("menu2Bar:",menu2Bar.attr('id'))
                             /**如果当前角色所包含的二级菜单包含当前二级菜单 */
                             //console.log(roleSecondPermissons.indexOf(menu2Id))
                             if(roleSecondPermissons.indexOf(menu2Id) > -1){
                                menu2Bar.after(
                                     "<tr class='menu1-"+ (ele.id) +"-sub' id='menu2-"+ (element.id) +"'>" +
                                     "<td><i class='layui-icon' style='margin-left:30px'>&#xe623;</i><span>"+ (element.name) +"</span></td>" +
                                     "<td style='text-align: center'><input class='allOperations' id='allOperations-"+ (element.id) +"'  value='" + (element.id) + "' type='checkbox' checked /></td>" +
                                     "<td id='addOperations-"+ (element.id) +"'></td>"+
                                     "</tr>"
                                 )
                                  /**添加当前二级菜单下所有操作 */
                                var operations = element.operations;
                                operations.forEach(function(elem){
                                    $("#addOperations-"+ (element.id) +"").append(
                                       "&nbsp;&nbsp;&nbsp;<input class='operationbox' type='checkbox' value='"+(elem.id)+"' checked />"+ (elem.name) +""
                                    )
                                 })
                             }
                             /**如果当前角色所包含的二级菜单不包含当前的二级菜单 */
                             else{
                                menu2Bar.after(
                                    "<tr class='menu1-"+ (ele.id) +"-sub' id='menu2-"+ (element.id) +"'>" +
                                    "<td><i class='layui-icon' style='margin-left:30px'>&#xe623;</i><span>"+ (element.name) +"</span></td>" +
                                    "<td style='text-align: center'><input class='allOperations' id='allOperations-"+ (element.id) +"'  value='" + (element.id) + "' type='checkbox' /></td>" +
                                    "<td id='addOperations-"+ (element.id) +"'></td>"+
                                    "</tr>"
                                )
                                 /**添加当前二级菜单下所有操作 */
                                var operations = element.operations;
                                operations.forEach(function(elem){
                                    $("#addOperations-"+ (element.id) +"").append(
                                        "&nbsp;&nbsp;&nbsp;<input class='operationbox' type='checkbox' value='"+(elem.id)+"' />"+ (elem.name) +""
                                    )
                                })
                             }
                             /**实现全选 */
                             $(".allOperations").off("change").on("change", function(){
                                 var statusNow = $(this).prop('checked');
                                 var modalId = $(this).val();
                                 $("#addOperations-"+modalId).children('.operationbox').prop('checked', statusNow);
                             })
                             /**单选权限框 */
                             $('.operationbox').off('change').on('change', function() {
                                 var statusNow = $(this).prop('checked');
                                 var modalId = $(this).parent().attr('id').substr(14);
                                 if(statusNow) {
                                    $("#allOperations-"+modalId).prop('checked',true);
                                 } else if( $(this).parent().children('.operationbox:checked').length === 0 ){
                                    $("#allOperations-"+modalId).prop('checked',false);
                                 }
                             })
                            
                         })
                    })
                    
                })
            })
                layer.open({
                    type : 1,
                    title : '权限分配',
                    content : $('#rolesPermissiomTable'),
                    area : ['750px', '658px'],
                    btn : ['确定', '取消'],
                    offset : 'auto',
                    closeBtn : 0,
                    yes : function(index) {
                        var roleModalOperations = [];
                        var container = [];
                        $(".allOperations:checked").each(function(){
                            container.push($(this).parent('td').next('td'));
                        })
                        //console.log(container.length)
                        container.forEach(function(ele){
                            var secondLevelMenuId = ele.attr('id').substr(14)   //二级菜单
                            var subCheckbox = ele.children('.operationbox:checked');
                            subCheckbox.each(function() {
                                roleModalOperations.push({
                                    operationId : $(this).val(),
                                    roleId : roleId,
                                    secondLevelMenuId : secondLevelMenuId
                                })
                            })
                        })
                        //console.log(roleModalOperations)
                        $.ajax({
                            url: home.urls.role.assignPermissions(),
                            contentType : 'application/json',
                            data : JSON.stringify(roleModalOperations),
                            dataType : 'json',
                            type : 'post',
                            success : function(result) {
                                if(result.code === 0) {
                                    layer.msg(result.message,{
                                        offset : ['40%', '55%'],
                                        time : 700
                                    })
                                }
                            }
                        })
                        $("#rolesPermissiomTable").addClass("hide");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#rolesPermissiomTable").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定成员管理事件 */
        ,bindAssignRoleToUsers : function(buttons) {
            buttons.off('click').on('click', function() {
                console.log(1)
                $("#assignRole").removeClass('hide');
                var roleId = $(this).attr('id').substr(11);
                $.get(home.urls.role.getAssignUsersById(), { id : roleId }, function(result) {
                    var res = result.data;
                    var assignUsers = res.assignUsers;
                    var unassignUsers = res.unassignUsers;
                    $("#unsignedRoles").empty();
                    $("#signedRoles").empty();
                    unassignUsers.forEach(function(e) {
                        $("#unsignedRoles").append(
                            "<li class='roles' id='leftRoles-"+ (e.id) +"'>"+ (e.name) +"&nbsp;&nbsp;&nbsp;<input type='checkbox' class='leftRoles' value="+ (e.id) +" /></li>"
                        )
                    })
                    assignUsers.forEach(function(e) {
                        $("#signedRoles").append(
                            "<li class='roles' id='rightRoles-"+ (e.id) +"'>"+ (e.name) +"&nbsp;&nbsp;&nbsp;<input class='rightRoles' type='checkbox' value="+ (e.id) +" /></li>"
                        )
                    })
                    layer.open({
                        type : 1,
                        title : "设置角色",
                        content : $("#assignRole"), 
                        area : ['620px', '500px'],
                        btn : ['确定' , '取消'],
                        offset: ['20%', '35%'],
                        closeBtn : 0,
                        yes : function(index) {
                            /**分配角色给用户 */
                            var userIds = new Array();
                            $(".rightRoles").each(function() {
                                userIds.push($(this).val());
                            })
                            console.log(userIds);
                            $.post(home.urls.role.assignRoleToUsers() , {
                                roleId : roleId,
                                userIds : userIds.toString()
                            }, function(result){
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        roleManagement.init();
                                        clearTimeout(time);
                                    }, 500);
                                }
                                layer.msg(result.message,{
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                            })
                            $("#assignRole").addClass('hide');
                            layer.close(index);
                        },
                        btn2 : function(index) {
                            $("#assignRole").addClass('hide');
                            layer.close(index);
                        }
                    })
                    roleManagement.funcs.bindrightMoveEvents($("#add_roles"));
                    roleManagement.funcs.bindleftMoveEvents($("#delete_roles"));
                })
            })
        }
        /**绑定设置角色里面 右移事件 */
        ,bindrightMoveEvents : function(buttons) {
            buttons.off('click').on('click', function() {
                $(".leftRoles").each(function() {
                    if($(this).prop("checked")){
                        var id = $(this).val();
                        var name = $(this).parent().text();
                        $("#signedRoles").append(
                            "<li class='roles' id='rightRoles-"+ (id) +"'>"+ (name) +"&nbsp;&nbsp;&nbsp;<input class='rightRoles' type='checkbox' value="+ (id) +" /></li>"
                        )  
                        $("#leftRoles-"+id).remove();
                    } 
                })
            })
        }
        ,bindleftMoveEvents : function(buttons) {
            buttons.off('click').on('click', function() {
                $(".rightRoles").each(function() {
                    if($(this).prop("checked")) {
                        var id = $(this).val();
                        var name = $(this).parent().text();
                        $("#unsignedRoles").append(
                            "<li class='roles' id='leftRoles-"+ (id) +"'>"+ (name) +"&nbsp;&nbsp;&nbsp;<input class='leftRoles' type='checkbox' value="+ (id) +" /></li>"
                        )
                        $("#rightRoles-"+id).remove();
                    }
                })
            })
        }
    }
}