var user_manage = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        user_manage.funcs.renderOption()
        user_manage.funcs.renderTable()
        var out = $('#user_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#user_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }//$init end$
    , departmentCode: '001'
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染左侧选择 */
        renderOption: function () {
            $.get(home.urls.department.getTop(), function (result) {
                var departments = result.data
                var test= "abcd"
                const $ul = $("#user_department").children('ul')
                $ul.append(
                    "<li style='background: #666666; color :white;'>部门</li>"
                )

                departments.forEach(function (e) {
                    $ul.append(
                        "<li class='setdepartment' id='setdepart-" + (e.id) + "'>" + (e.name) + "</li>"+
                        "<li id='menu1-li-hide-" + (e.id) + "'>"+"<ul></ul>" +"</li>"
                    ) 
                })
                $($('.setdepartment')[0]).addClass('selected_department').css('color', ' #ffffff')
                var set_department = $('.setdepartment')
                user_manage.funcs.changeDepart(set_department)
            })
        }
        /** 选择部门 */
        , changeDepart: function (set_department) {
            set_department.off('click')
            set_department.on('click', function () {
                var _self = $(this)
                $('.setdepartment').removeClass('selected_department').css('color', '')
                _self.addClass('selected_department').css('color', '#ffffff')
                var id_name = $(this).attr('id')
                user_manage.departmentCode = id_name.substr(10)
                var new_id = '#menu1-li-hide-' + user_manage.departmentCode
                console.log(new_id)
                $.get(home.urls.department.getSonByParent(),{
                    id : user_manage.departmentCode
                },function(result){
                    var dpts=result.data
                //    const $ul = $("#user_department").children('ul')
                    const $ul1= $("new_id").children('ul')
                    console.log($ul1)
                    if(dpts===null){
                        return
                    }else{
                        dpts.forEach(function(e) {
                            $ul1.append(
                                "<li class='setdepartment' id='setdepart-" + (e.id) + "'>" + (e.name) + "</li>"
                            )
                        })    
                    }
                })
            //    user_manage.funcs.department_Set()
            })
         //   user_manage.funcs.department_Set()
        }
        /** 渲染 */
        , department_Set: function () {
            $.post(home.urls.user.getByDepartment(), {
                departmentId: user_manage.departmentCode,
                page : 0
            }, function (result) {
                var users = result.data.content //获取数据
                const $tbody = $("#user_table").children('tbody')
            //    user_manage.funcs.renderHandler($tbody, users)
                user_manage.pageSize = result.data.content.length
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
                                departmentCode: user_manage.departmentCode,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var users = result.data.content //获取数据
                                const $tbody = $("#user_table").children('tbody')
                        //        user_manage.funcs.renderHandler($tbody, users)
                                user_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            /** 追加添加事件 */
           // var addBtn = $("#model-li-hide-add-78")
           // user_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 追加刷新事件 */
            user_manage.funcs.bindRefreshEvents('#refreshButton')//追加刷新事件
            /** 追加搜索事件 */
            user_manage.funcs.bindSearchEvents('#searchButton')
            /** 追加重置密码事件 */
           // var resetBtn = $('#model-li-hide-reset-78')
            //user_manage.funcs.bindResetEventListener(resetBtn)
            /** 追加修改密码事件 */
            //var modifyBtn = $('#model-li-hide-modify-78')
            //user_manage.funcs.bindModifyEventListener(modifyBtn)
        }    
         /**绑定刷新事件 */
         ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
               user_manage.funcs.renderTable();
            })
        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                
                var userName = $("#inputUserName").val();
                console.log(userName)
                $.get(home.urls.user.getByNameLikeByPage(),
                {
                    name : userName, page : 0
                }, function(result){
                    var users = result.data.content;
                const $tbody = $("#user_table").children("tbody");
                user_manage.funcs.renderHandler($tbody,users , 0);
                user_manage.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "department_page",
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
        /**渲染表格 */
        ,renderTable: function() {
            $.get(home.urls.user.getAll(),{},function(result) {
                var users = result.data //获取数据
                const $tbody = $("#user_table").children('tbody')
                user_manage.funcs.renderHandler($tbody, users)
            })
        }
        /** 渲染 */
        , renderHandler: function ($tbody, users) {
            $tbody.empty() //清空表格
            users.forEach(function (e) {
                $('#user_checkAll').prop('checked', false)
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
                    "<td>" + (e.description) + "</td>" +
                    "<td>" + (e.department) + "</td>" +
                    "<td>" + (e.contact) + "</td>" +
                    "<td>" + (e.sex) + "</td>" +
                    "<td><input type='radio' class='if_checkbox'" + str + " value='" + (e.id) + "'></td>" +
                    "<td><a href='#' class='editdepart' id='depart-" + (e.id) + "'><i class='fa fa-window-restore' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='editrole' id='role-" + (e.id) + "'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='edituser' id='edit-" + (e.id) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteuser' id='de-" + (e.id) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
        //    var departBtns = $('.editdepart')
        //    var roleBtns = $('.editrole')
        //    var editBtns = $('.edituser')
        //    var deleteBtns = $('.deleteuser')
            user_manage.funcs.bindDepartEventListener('.editdepart')
            user_manage.funcs.bindRoleEventListener('.editrole')
            user_manage.funcs.bindDeleteEventListener('.deleteuser')
            user_manage.funcs.bindEditEventListener('.edituser')
        //    var selectAllBox = $('#user_checkAll')
            user_manage.funcs.bindSelectAll('#user_checkAll')
        //    var deleteBatchBtn = $('#model-li-hide-delete-78')
            user_manage.funcs.bindDeleteBatchEventListener('#model-li-hide-delete-78')
        //    var user_checkboxes = $('.user_checkbox')
            user_manage.funcs.disselectAll('.user_checkbox', '#user_checkAll')
        //    var if_checkboxes = $('.if_checkbox')
            user_manage.funcs.selectIf('.if_checkbox')
        }
    }
}

