var userManage = {
    init: function() {
        /**获取部门信息分页显示 */
        userManage.funcs.renderTable();
        userManage.funcs.renderOption();
        var out = $("#user_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#user_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,departId : '001'
    ,funcs: {
        /**渲染父部门菜单*/
        renderOption : function() {
            $.get(home.urls.department.getTop(),{},function(result) {
                var dpts = result.data;
                const $ul = $("#user_department").children('ul');
                $ul.empty();
                $ul.append(
                    "<li style='background: #666666; color :white;'>部门</li>"
                ) 
                dpts.forEach(function (e) {
                    $ul.append(
                    "<div id='setdepart-" + (e.id) + "' class='setdepartment'>" +
                    "<li >" + e.name +"</li>" +
                    "</div>" +
                    "<div id='menu1-li-hide-" + (e.id) + "'class='hide models'>" +
                    "<ul></ul>" +
                    "</div>"
                    )
                })
            //    $($('.setdepartment')[0]).addClass('selected_department').css('color', ' #ffffff')
                var set_department = $('.setdepartment')
                userManage.funcs.changeDepart(set_department) // 选中父部门事件
            })
        }
        /** 选择父部门 */
        , changeDepart: function (set_department) {
            set_department.off('click')
            set_department.on('click', function () {
                var _self = $(this)
                $(this).next().addClass("hide")
                $('.setdepartment').removeClass('selected_department').css('color', '')
                $('.sondepartment').removeClass('selected_department').css('color', '')
                _self.addClass('selected_department').css('color', '#ffffff')

                var id_name = $(this).attr('id')   
                var the_departmentId = id_name.substr(10)   // 获取父部门 ID
                var $sul = $(this).next().children('ul')    // 获取子部门的 <ul></ul>
                $(this).next().removeClass("hide")    // 移除子部门的 hide 样式
               userManage.funcs.department_Set(the_departmentId,$sul)  // 渲染
            })
        //    userManage.funcs.department_Set()
        }
        /** 渲染子部门左侧菜单及父部门右侧表格 */
        , department_Set: function (id,$sul) {
            $.get(home.urls.department.getSonByParent(), { // 渲染子部门菜单
                id : id
            }, function (result) {
                var users = result.data //获取数据
                if(result.data.length >= 1) {
                    $sul.empty()
                    users.forEach(function(e){
                        $sul.append(
                            "<li class='sondepartment' id='setdepart-" + (e.id) + "'>" + (e.name) + "</li>"
                        )    
                    })
                    var son_department = $('.sondepartment')
                    userManage.funcs.changeDepart1(son_department) // 绑定选中子部门事件
                }  
            })

            $.get(home.urls.user.getByDepartment(),{   // 渲染选中的父部门下用户表格
                departmentId : id,
                page : 0
            },function(result) {
             var users = result.data.content
             $tbody = $("#userTable").children('tbody')
             userManage.funcs.renderHandler($tbody, users, page)
             userManage.pageSize = result.data.content.length
             var page = result.data
                 /** @namespace page.totalPages 这是返回数据的总页码数 */
                 /** 分页信息 */
                 layui.laypage.render({
                     elem: 'user_page'
                     , count: 10 * page.totalPages//数据总数
                     /** 页面变化后的逻辑 */
                     , jump: function (obj, first) {
                         if (!first) {
                             $.get(home.urls.user.getByDepartment(), {
                                 departmentId: id,
                                 page: obj.curr - 1,
                                 size: obj.limit
                             }, function (result) {
                                 var users = result.data.content //获取数据
                                 const $tbody = $("#userTable").children('tbody')
                                 userManage.funcs.renderHandler($tbody, users , page)
                                 userManage.pageSize = result.data.content.length
                             })
                         }
                     }
                 })
            })
        }
        /** 选择子部门 */
        , changeDepart1: function (son_department) {
            son_department.off('click')
            son_department.on('click', function () {
            $('.sondepartment').removeClass('selected_department').css('color', '')
            $('.setdepartment').removeClass('selected_department').css('color', '')
                $(this).addClass('selected_department').css('color', '#ffffff')

                var id_name = $(this).attr('id')
                var new_id = '#' + id_name
                var the_departmentId = id_name.substr(10)  // 获取子部门 ID
            //    console.log(the_departmentId)
               userManage.funcs.department_Set1(the_departmentId)
            })
        //    userManage.funcs.department_Set()
        }
        /** 渲染子部门 */
        , department_Set1: function (id) {
            $.get(home.urls.user.getByDepartment(), {
                departmentId: id,
                page: 0
            }, function (result) {
                var users = result.data.content //获取数据
                const $tbody = $("#userTable").children('tbody')
                userManage.funcs.renderHandler($tbody, users,page)
                userManage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'user_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.user.getByDepartment(), {
                                departmentId: id,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var users = result.data.content //获取数据
                                const $tbody = $("#userTable").children('tbody')
                                userManage.funcs.renderHandler($tbody, users,page)
                                userManage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
           
        }

        /**渲染表格 */
        ,renderTable: function() {
            /**获取所有的记录 */
            $.get(home.urls.user.getAllByPage(), { page : 0 }, function(result) {
                var departments = result.data.content;
                const $tbody = $("#userTable").children("tbody");
                userManage.funcs.renderHandler($tbody, departments , 0);
                userManage.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "user_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.user.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var departments = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#userTable").children("tbody");
                                userManage.funcs.renderHandler($tbody, departments, page);
                                userManage.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            userManage.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            userManage.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            userManage.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定搜索事件 */
            userManage.funcs.bindSearchEvents($("#searchButton"));
            /**绑定重置密码事件 */
            userManage.funcs.bindResetPasswordEvents($("#initPasswordButton"));
            /**绑定修改密码事件 */
            userManage.funcs.bindUpdatePasswordEvents($("#editPasswordButton"));
        }
        /**渲染下拉框 */
        ,renderSelector : function() { 
                const $selector1 = $("#addUserDepartmentName");    
                    $.get(home.urls.department.getAll(),{},function(result) {
                        var departments = result.data;
                        userManage.funcs.renderHandler1($selector1, departments);
                    })
                
           // })
        }
        ,renderUpdateSelector : function(id) {
            /*渲染编辑功能下拉框*/ 
            $.get(home.urls.user.getById(),{id : id},function(result) {
                var dpts = result.data;
                const $selector2 = $("#updateUserDepartmentName");
                userManage.funcs.renderHandler2($selector2,dpts);
            //     $("#updateParentDepartmentName").off('click')
                $("#updateUserDepartmentName").on('click',function() {
                    $(this).off('click');
                    $.get(home.urls.department.getAll(),{},function(result) {
                        var departments = result.data;
                        userManage.funcs.renderHandler1($selector2, departments);
                    })
                   
                })
            })
               
        }
        ,renderDptSelector : function(id) {
            /*渲染设置部门功能下拉框*/ 
            $.get(home.urls.user.getById(),{id : id},function(result) {
                var dpts = result.data;
                const $selector3 = $("#setDepart");
                userManage.funcs.renderHandler2($selector3,dpts);
                $("#setDepart").on('click',function() {
                    $(this).off('click');
                    $.get(home.urls.department.getAll(),{},function(result) {
                        var departments = result.data;
                        userManage.funcs.renderHandler1($selector3, departments);
                    })
                   
                })
            })
               
        }
        /**新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                userManage.funcs.renderSelector();
                $("#addUserModal").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '添加用户',
                    content: $("#addUserModal"),
                    area: ['540px','300px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                    //    var id = $("#addDepartmentId").val();
                        var name = $("#addUserName").val();
                        var address = $("#addUserAddress").val();
                        var tel = $("#addUserTel").val();
                        var sex = $("input[name='sex']:checked").val();
                        var enable = $("input[name='enable']:checked").val();
                        var dptId = $("#addUserDepartmentName").find("option:selected").val();
                        if(name===null){
                            layer.msg("用户名不能为空");
                            return 
                        }
                        $.post(home.urls.user.add() ,
                            {  
                                "department.id" : dptId,
                                name : name,
                                address : address,
                                contact : tel,
                                sex : sex,
                                enable : enable    
                            },
                        function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        userManage.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                        })
                        $("#addUserModal").css("display","none");
                        layer.close(index);
                    },
                    closeBtn : 0,
                    btn2 : function(index) {
                        $("#addUserModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".user_checkBox:checked").length === 0) {
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
                            $(".user_checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    rolesIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.user.deleteByIds(), {
                                _method : "delete", ids : rolesIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        userManage.init()
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
                userManage.funcs.renderTable();
                userManage.init();
            })
        }
         /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                
                var departmentName = $("#searchDepartmentName").val();
                $.get(home.urls.user.getByNameLikeByPage(),
                {
                    name : departmentName
                }, function(result){
                    var departments = result.data.content;
                const $tbody = $("#userTable").children("tbody");
                userManage.funcs.renderHandler($tbody, departments , 0);
                userManage.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "user_page",
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
                                const $tbody = $("#userTable").children("tbody");
                                userManage.funcs.renderHandler($tbody, departments, page);
                                userManage.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
         /**绑定重置密码事件 */
        ,bindResetPasswordEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".user_checkBox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else if($(".user_checkBox:checked").length > 1) {
                    layer.msg('您一次只能选中一个用户!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else {
                    layer.open({
                        type : 1,
                        title : "重置密码",
                        content : "<h5 style='text-align:center;'>您确定要重置该用户的密码吗？</h5>",
                        area: ['200px','140px'],
                        offset : ['40%', '55%'],
                        btn: ['确定', '取消'],
                        yes : function(index) {
                            var rolesIdS = [];
                            /**存取所有选中行的id值 */
                            $(".user_checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    rolesIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.get(home.urls.user.resetPassword() ,
                            {  
                                id : rolesIdS.toString()
                            },
                        function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        userManage.init()
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
         /**修改密码事件 */
        ,bindUpdatePasswordEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".user_checkBox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else if($(".user_checkBox:checked").length > 1) {
                    layer.msg('您一次只能选中一个用户!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else {
                    $("#updatePasswordModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '修改',
                        content: $("#updatePasswordModal"),
                        area: ['300px','250px'],
                        btn: ['确定', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var roleId = [];
                            /**存取所有选中行的id值 */
                            $(".user_checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    roleId.push(parseInt($(this).val()));
                                }
                            })
                            var oldpsw = $("#oldPassword").val();
                            var newpsw = $("#newPassword").val();
                            var doublepsw = $("#doublePassword").val();
                            $.post(home.urls.user.updatePassword() ,
                                {  
                                    id : roleId.toString(),
                                    oldPassword : oldpsw,
                                    newPassword : newpsw,
                                    reNewPassword : doublepsw
                                },
                            function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            userManage.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 9000
                                    })
                            })
                            $("#updatePasswordModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#updatePasswordModal").css("display","none");
                            layer.close(index);
                        }
                    })     
                }   
            })
        }


        ,renderHandler : function($tbody, departments, page) {
            //清空表格
            $tbody.empty() ;
            var i = 1 + page * 10;

            departments.forEach(function(e){
                var str
                if (e.enable == 1)
                //    str = "checked='checked'"
                str = 'checked'
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='user_checkbox' value='" + (e.id) + "'></td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.id) + "</td>" +
                    "<td>" + (e.address) + "</td>" +
                    "<td>" + (e.department ? e.department.name : ' ') + "</td>" +
                    "<td>" + (e.contact) + "</td>" +
                    "<td>" + (e.sex) + "</td>" +
                    "<td><input type='radio' class='if_checkbox' id='enable-" + (e.id) + "'" + str + " value='" + (e.enable) + "'></td>" +
                    "<td><a href='#' class='editdepart' id='depart-" + (e.id) + "'><i class='fa fa-window-restore' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='editrole' id='role-" + (e.id) + "'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='edituser' id='edit-" + (e.id) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteuser' id='de-" + (e.id) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })

            /**实现全选 */
            var checkedBoxLength = $(".user_checkbox:checked").length;
            home.funcs.bindselectAll($("#user_checkAll"), $(".user_checkbox"), checkedBoxLength, $("#userTable"));
            /**绑定录用事件 */
            userManage.funcs.bindSetEnableEvents($(".if_checkbox"))
            /**绑定设置部门事件 */
            userManage.funcs.bindSetDepartmentEvents($(".editdepart"))
            /**绑定设置角色事件 */
            userManage.funcs.bindSetRolesEvents($(".editrole"))
            /**绑定单条记录删除事件 */
            userManage.funcs.bindDeleteByIdEvents($(".deleteuser"))
            /**绑定编辑用户事件 */
            userManage.funcs.bindEditorUserEvents($(".edituser"))
            
        }
        /**getAllDepartment , 获取所有部门，以下拉框形式呈现*/ 
        ,renderHandler1 : function($selector, departments) {    
            $selector.empty() ;
            departments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /**getById()----parentDepartmentId */
        ,renderHandler2 : function($selector, users) {
            $selector.empty() ;
                $selector.append(
                        "<option value=\"" + (users.department ? users.department.id : ' ') +"\""+ ">"+ (users.department ? users.department.name : ' ') + "</option>"
                )
        }
        /**设置录用与否 */
        ,bindSetEnableEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var flag = $(this).attr('value');
            //    console.log(flag)
               var uid = $(this).attr('id').substr(7);
            //    console.log(uid)
                   layer.open({
                       type: 1,
                       title: '设置是否启用',
                       content: "<h5 style='text-align:center;'>确定修改该项设置吗？</h5>",
                       area: ['200px', '150px'],
                       btn: ['确定', '取消'],
                       offset: ['40%','45%'],
                       yes: function(index){
                           /**收集数据 */  
                           enable = 1 - flag;
                        //   console.log(enable)
                           $.post(home.urls.user.updateEnableById() ,{ 
                               id : uid,
                               enable : enable
                           }, function(result) {
                               layer.msg(result.message, {
                                   offset : ['40%', '55%'],
                                   time : 700
                               })
                               if(result.code === 0) {
                                   var time = setTimeout(function() {
                                       userManage.init();
                                       clearTimeout(time);
                                   },500)
                               }
                           })
                        //   $("#setEnableModal").css("display","none");
                           layer.close(index);
                       },
                       closeBtn : 0,
                       btn2 : function(index) {
                         //  $("#setEnableModal").css("display","none");
                           layer.close(index);
                       }  
                   })
            })
        }
        /**设置部门事件 */
        ,bindSetDepartmentEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var id = $(this).attr('id').substr(7);
               userManage.funcs.renderDptSelector(id);
               $("#setDepartModal").removeClass("hide");
                   layer.open({
                       type: 1,
                       title: '设置部门',
                       content: $("#setDepartModal"),
                       area: ['300px', '150px'],
                       btn: ['确定', '取消'],
                       offset: ['40%','45%'],
                       yes: function(index){
                           /**收集数据 */
                           var dptId = $("#setDepart").find("option:selected").val();
                           $.post(home.urls.user.updateDepartmentById() ,{ 
                               id : id,
                               departmentId :dptId
                           }, function(result) {
                               layer.msg(result.message, {
                                   offset : ['40%', '55%'],
                                   time : 700
                               })
                               if(result.code === 0) {
                                   var time = setTimeout(function() {
                                       userManage.init();
                                       clearTimeout(time);
                                   },500)
                               }
                           })
                           $("#setDepartModal").css("display","none");
                           layer.close(index);
                       },
                       closeBtn : 0,
                       btn2 : function(index) {
                           $("#setDepartModal").css("display","none");
                           layer.close(index);
                       }  
                   })
            })
        }
        /**设置角色 */
        ,bindSetRolesEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var id = $(this).attr('id').substr(5);
               $.get(home.urls.user.getById(),{id : id},function(result) {
                   var info = result.data
                   var name = info.name
                //   console.log(name)
                     $("#assignUserName").innerHTML = name  
               }) 
               
               $("#setRoleModal").removeClass("hide");
                   layer.open({
                       type: 1,
                       title: '设置角色',
                       content: $("#setRoleModal"),
                       area: ['620px', '500px'],
                       btn: ['确定', '取消'],
                       offset: ['20%','35%'],
                       yes: function(index){
                           /**收集数据 */
                           var rolecodes = new Array()
                           $('.right_role').each(function () {
                               rolecodes.push($(this).val())
                           })
                           $.post(home.urls.user.assignRolesToUsers() ,{
                               userIds : id,
                               roleIds : rolecodes.toString()
                           }, function(result) {
                               layer.msg(result.message, {
                                   offset : ['40%', '55%'],
                                   time : 700
                               })
                               if(result.code === 0) {
                                   var time = setTimeout(function() {
                                       userManage.init();
                                       clearTimeout(time);
                                   },500)
                               }
                           })
                           $("#setRoleModal").css("display","none");
                           layer.close(index);
                       },
                       closeBtn : 0,
                       btn2 : function(index) {
                           $("#setRoleModal").css("display","none");
                           layer.close(index);
                       }  
                   })
                   $.get(home.urls.user.getRolesById(),{ id:id }, function(result) {
                    var roles = result.data;
                    var roles_code = [];
                    const $ul = $("#signedRoles");
                    $ul.empty();
                    roles.forEach(function(e) {
                         $ul.append(
                             "<li id='right_role_" + (e.id) + "' class='roles'>" + (e.name) + 
                             "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='right_role' value='" + (e.id) + "' type='checkbox' /></li>"
                         )
                         roles_code.push(e.id)
                    })
                    $.get(home.urls.role.getAll(),{},function(result) {
                     var roles = result.data;
                     const $ul= $("#unsignedRoles");
                     $ul.empty();
                     roles.forEach(function(e) {
                         $ul.append(
                             "<li id='left_role_" + (e.id) + "' class='roles'>" + (e.name) + 
                             "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='left_role' value='" + (e.id) + "' type='checkbox' /></li>"
                         )     
                     })
                     for (var i = 0; i < roles_code.length; i++) {
                         $('#' + 'left_role_' + roles_code[i]).remove()
                     }
                 })
                })
                userManage.funcs.bindAddRolesListener($("#add_roles")) //追加增加角色事件
                userManage.funcs.bindDeleteRolesListener($("#delete_roles")) //追加删除角色事件
            })
        }
        , bindAddRolesListener: function (addRolesBtn) {
            addRolesBtn.off('click')
            addRolesBtn.on('click', function () {
                $('.left_role').each(function () {
                    if ($(this).prop('checked')) {
                        var the_value = $(this).val()
                        var the_name = $('#left_role_' + the_value).text()
                        $('#signedRoles').append(
                            "<li id='right_role_" + the_value + "' class='roles'>" + the_name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='right_role' value='" + the_value + "' type='checkbox' /></li>"
                        )
                        $('#left_role_' + the_value).remove()
                    }
                })
            })
        }
        , bindDeleteRolesListener: function (deleteRolesBtn) {
            deleteRolesBtn.off('click')
            deleteRolesBtn.on('click', function () {
                $('.right_role').each(function () {
                    if ($(this).prop('checked')) {
                        var the_value = $(this).val()
                        var the_name = $('#right_role_' + the_value).text()
                        $('#unsignedRoles').append(
                            "<li id='left_role_" + the_value + "' class='roles'>" + the_name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='left_role' value='" + the_value + "' type='checkbox' /></li>"
                        )
                        $('#right_role_' + the_value).remove()
                    }
                })
            })
        }

        /**通过ID删除 */
        ,bindDeleteByIdEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var _this = $(this);
                layer.open({
                    type: 1,
                    title: '删除用户',
                    content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
                    area: ['200px','140px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var id = parseInt(_this.attr('id').substr(3)) ;
                    //    console.log(id)
                        $.post(home.urls.user.deleteById() ,{_method:"delete",id : id},function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        userManage.init()
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
        /**编辑用户 */
        ,bindEditorUserEvents : function(buttons) {
            buttons.off('click').on('click',function() {
               var uid = $(this).attr('id').substr(5);
               userManage.funcs.renderUpdateSelector(uid);
               
               $.get(home.urls.user.getById(),{ id:uid }, function(result) {
                   var users = result.data;
                //   var id = departments.id;
            //    $("input[name='upSex']").attr('checked', 'false');
            //    $("input[name='upEnable']").attr('checked', 'false');
                   $("#updateUserId").val(users.id);
                   $("#updateUserName").val(users.name);
                   $("#updateUserTel").val(users.contact);
                   $("#updateUserAddress").val(users.address);
                   if(users.sex === "男"){
                    $("input[name='upSex']:first").attr('checked', 'true');
                   }else {
                    $("input[name='upSex']:last").attr('checked', 'true');
                   }
                   if(users.enable){
                    $("input[name='upEnable']:first").attr('checked', 'true');
                    }else {
                    $("input[name='upEnable']:last").attr('checked', 'true');
                    }
                   $("#updateUserModal").removeClass("hide");
                   layer.open({
                       type: 1,
                       title: '编辑用户',
                       content: $("#updateUserModal"),
                       area: ['540px', '300px'],
                       btn: ['确定', '取消'],
                       offset: ['40%','45%'],
                       yes: function(index){
                           var name = $("#updateUserName").val();
                           var address = $("#updateUserAddress").val();
                           var tel = $("#updateUserTel").val();
                           var sex = $("input[name='upSex']:checked").val();
                           var enable = $("input[name='upEnable']:checked").val();
                           var departId = $("#updateUserDepartmentName").find("option:selected").val();
                        //  console.log(departId)
                           if(name===null){
                               layer.msg('用户名不能为空!');
                               return 
                           }
                           $.post(home.urls.user.update() ,{
                               "department.id" : departId,
                               id : uid,
                               name : name,
                               address : address,
                               contact : tel,
                               sex : sex,
                               enable : enable
                               
                           }, function(result) {
                               layer.msg(result.message, {
                                   offset : ['40%', '55%'],
                                   time : 700
                               })
                               if(result.code === 0) {
                                   var time = setTimeout(function() {
                                       userManage.init();
                                       clearTimeout(time);
                                   },500)
                               }
                           })
                           $("#updateUserModal").css("display","none");
                           layer.close(index);
                       },
                       closeBtn : 0,
                       btn2 : function(index) {
                           $("#updateUserModal").css("display","none");
                           layer.close(index);
                       }  
                   })
               })
            })
        }


    }

}