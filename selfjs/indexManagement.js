var index = {
    init: function() {
        /**获取部门信息分页显示 */
        //index.funcs.renderTable();
        index.funcs.renderOption();
        var out = $("#index_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#index_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,pageSize: 0
    ,funcs : {
        /**渲染工艺组别菜单*/
        renderOption : function() {
            $.get(home.urls.indexManage.getAllGroups(),{},function(result) {
                var groups = result.data;
                const $ul = $("#process_group").children('ul');
                $ul.empty();
                $ul.append(
                    "<li style='background: #666666; color :white;'>工艺组别</li>"
                ) 
                groups.forEach(function (e) {
                    $ul.append(
                        "<li class='setgroup' id='group-" + (e.id) + "'>" + (e.name) + "</li>"
                    )
                })
            //    $($('.setgroup')[0]).addClass('selected_group').css('color', ' #ffffff')
            //    var startId = $ (".selected_group").attr('id').substr(6)
                index.funcs.renderTable()
                index.funcs.changeGroup($('.setgroup')) // 选中组别事件
            })
        }
        /** 选择组别 */
        , changeGroup: function (set_group) {
            set_group.off('click')
            set_group.on('click', function () {
                $('.setgroup').removeClass('selected_group').css('color', '')
                $(this).addClass('selected_group').css('color', '#ffffff')
                var id = $(this).attr('id').substr(6)
                index.funcs.group_Set(id)
            })
        }
        /**getAll */
        ,renderTable : function(){
            $.get(home.urls.indexManage.getAll(),{},function(result){
                var datas = result.data.content //获取数据
                const $tbody = $("#indexTable").children('tbody')
                index.funcs.renderHandler($tbody, datas,0)
                index.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'index_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.get(home.urls.indexManage.getAll(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var datas = result.data.content //获取数据
                                const $tbody = $("#indexTable").children('tbody')
                                var page = obj.curr - 1;
                                index.funcs.renderHandler($tbody, datas, page)
                                index.pageSize = result.data.content.length
                            })
                        }
                    }
                })

            })
        }
        /** 渲染 */
        , group_Set: function (groupId) {
            $.get(home.urls.indexManage.getByGroupAndParamByPage(), {
                group : groupId,
                page : 0
            }, function (result) {
                var datas = result.data.content //获取数据
                const $tbody = $("#indexTable").children('tbody')
                index.funcs.renderHandler($tbody, datas,0)
                index.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'index_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.get(home.urls.indexManage.getByGroupAndParamByPage(), {
                                group : groupId,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var datas = result.data.content //获取数据
                                const $tbody = $("#indexTable").children('tbody')
                                var page = obj.curr - 1;
                                index.funcs.renderHandler($tbody, datas, page)
                                index.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            /** 追加添加事件 */
            index.funcs.bindAddEvent($("#addButton")) 
            /** 追加搜索事件 */
            index.funcs.bindSearchEvent($("#searchButton"),groupId)
            /** 追加批量删除事件 */
            index.funcs.bindDeleteByIdsEvent($("#deleteButton"))
            /** 追加导出Excel事件 */
            index.funcs.bindDownloadEvent($("#expertButton"),groupId)
             /** 追加刷新事件 */
            index.funcs.bindRefreshEvent($("#refreshButton"),groupId)
        }
        /**新增指标下拉框，展示所有可选工艺组别 */
        ,renderAddGroupSelector: function() {
            $.get(home.urls.indexManage.getAllGroups(),{},function(result) {
                var groups = result.data
                const $selector = $("#addProcessGroup")
                index.funcs.renderHandler1($selector, groups);
            }) 
        }
        /**编辑指标下拉框，继承当前项的工艺组别，点击后，展示所有工艺组别 */
        ,renderUpdateGroupSelector: function(id) {
            $.get(home.urls.indexManage.getById(),{id : id},function(result) {
                var group = result.data;
                const $selector = $("#updateProcessGroup");
                index.funcs.renderHandler2($selector,group);
                $("#updateProcessGroup").on('click',function() {
                    $(this).off('click');
                    $.get(home.urls.dataDictionary.getAllDataByTypeId(),{id : 11},function(result) {
                        var groups = result.data
                        index.funcs.renderHandler1($selector, groups);
                    })  
                })
            })        
        }
        /**添加事件 */
        ,bindAddEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                index.funcs.renderAddGroupSelector();
            //    index.funcs.renderAddParameterSelector();
                $("#addIndexModal").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '添加用户',
                    content: $("#addIndexModal"),
                    area: ['300px','290px'],
                    btn: ['确定', '取消'],
                    offset: "auto",
                    yes: function (index) {
                        var groupId = $("#addProcessGroup").find("option:selected").val();
                        var parameter = $("#addProcessParameter").val();
                        var expect = $("#addExpectedValue").val();
                        var max = $("#addMaxValue").val();
                        var min = $("#addMinValue").val();
                        if(name===null){
                            layer.msg("用户名不能为空");
                            return 
                        }
                        $.post(home.urls.indexManage.add() ,{  
                            "group.id" : groupId,
                            name : parameter,
                            eps : expect,
                            upValue : max,
                            downValue : min
                        },
                        function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        index.funcs.group_Set(groupId)
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                        })
                        $("#addIndexModal").css("display","none");
                        layer.close(index);
                    },
                    closeBtn : 0,
                    btn2 : function(index) {
                        $("#addIndexModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**查询事件 */
        ,bindSearchEvent : function(buttons,groupId) {
            buttons.off('click').on('click',function() {
                var param = $("#parameterName").val()
                $.get(home.urls.indexManage.getByGroupAndParamByPage(),{
                    group : groupId,
                    param : param
                },function(result){
                    var datas = result.data.content
                    const $tbody = $("#indexTable").children('tbody')
                    index.funcs.renderHandler($tbody, datas,0)
                    index.pageSize = result.data.content.length
                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'index_page'
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj, first) {
                            if (!first) {
                                $.get(home.urls.indexManage.getByGroupAndParamByPage(), {
                                    group : groupId,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var datas = result.data.content //获取数据
                                    const $tbody = $("#indexTable").children('tbody')
                                    var page = obj.curr - 1;
                                    index.funcs.renderHandler($tbody, datas, page)
                                    index.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })     
            })
        }
        /**批量删除事件 */
        ,bindDeleteByIdsEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                if($(".index_checkBox:checked").length === 0) {
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
                            var indexIds = [];
                            /**存取所有选中行的id值 */
                            $(".index_checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    indexIds.push(parseInt($(this).val()));
                                }
                            })
                            $.post(home.urls.indexManage.deleteByIds(), {
                                _method : "delete", ids : indexIds.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        index.funcs.group_Set(groupId);
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
        /**导出事件 */
        ,bindDownloadEvent : function(buttons,groupId) {
            buttons.off('click').on('click',function() {
                console.log(groupId)
                var url = home.urls.indexManage.download() + "?group=" + groupId
                $("#download-id").attr("href",url);
            })
        }
        /**刷新 */
        ,bindRefreshEvent : function(buttons,groupId) {
            buttons.off('click').on('click',function(){
                index.funcs.renderTable();
            })
        }
        /**渲染表格 */
        ,renderHandler : function($tbody,datas,page) {
            $tbody.empty();
            var i = page * 10 + 1
            datas.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='index_checkbox' value='" + (e.id) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.group.name) + "</td>" +
                    "<td>" + (e.eps) + "</td>" +
                    "<td>" + (e.upValue) + "</td>" +
                    "<td>" + (e.downValue) + "</td>" +
                    "<td>" + (e.modifyUser ? e.modifyUser : '') + "</td>" +
                    "<td>" + (e.modifyTime ? e.modifyTime : '') + "</td>" +
                    "<td><a href='#' class='editindex' id='edit-" + (e.id) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteindex' id='delete-" + (e.id) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>"
                )
            })
            /**实现全选 */
            var checkedBoxLength = $(".index_checkbox:checked").length;
            home.funcs.bindselectAll($("#index_checkAll"), $(".index_checkbox"), checkedBoxLength, $("#indexTable"));
             /**绑定编辑用户事件 */
            index.funcs.bindEditorIndexEvents($(".editindex"))
             /**绑定单条记录删除事件 */
            index.funcs.bindDeleteByIdEvents($(".deleteindex"))
        }
        /**获取所有*/ 
        ,renderHandler1 : function($selector, datas) {    
            $selector.empty() ;
            datas.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /**继承当前选项的值 */
        ,renderHandler2 : function($selector, data) {
            $selector.empty() ;
                $selector.append(
                        "<option value=\"" + (data.group.id) +"\""+ ">"+ (data.group.name) + "</option>"
                )
        }
        /**编辑指标 */
        ,bindEditorIndexEvents : function(buttons) {
            buttons.off('click').on('click',function(){
                var id =$(this).attr('id').substr(5)
                index.funcs.renderUpdateGroupSelector(id)
                $.get(home.urls.indexManage.getById(),{id : id},function(result){
                    var data = result.data
                    $("#updateProcessParameter").val(data.name)
                    $("#updateExpectedValue").val(data.eps)
                    $("#updateMaxValue").val(data.upValue)
                    $("#updateMinValue").val(data.downValue)

                })
                $("#updateIndexModal").removeClass("hide")
                layer.open({
                    type : 1,
                    title : "编辑生产指标",
                    content : $("#updateIndexModal"),
                    area : ['300px','290px'],
                    btn : ['确定','取消'],
                    offset: ['40%', '45%'],
                    closeBtn : 0,
                    yes : function(index){
                        console.log(id)    
                        var expect = $("#updateExpectedValue").val()
                        var max = $("#updateMaxValue").val()
                        var min = $("#updateMinValue").val()
                        $.post(home.urls.indexManage.updateIndexById(),{
                            id : id,
                            eps : expect,
                            upValue : max,
                            downValue : min
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                   index.funcs.group_Set(groupId);
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                        })
                        $("#updateIndexModal").css("display","none");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#updateIndexModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**删除指标 */
        ,bindDeleteByIdEvents : function(buttons) {
            buttons.off('click').on('click',function(){
                var id =$(this).attr('id').substr(7)
                layer.open({
                    type: 1,
                    title: '删除指标',
                    content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
                    area: ['200px','140px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        $.post(home.urls.indexManage.deleteByIds() ,{_method:"delete",ids : id},function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        console.log(groupId)
                                        index.funcs.group_Set(groupId)
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
    }
}