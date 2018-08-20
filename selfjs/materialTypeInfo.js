var materialTypeInfo = {
    init: function() {
        /**获取物料类型信息分页显示 */
        materialTypeInfo.funcs.renderTable();
        var out = $("#materialTypeInfoPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#rolManagement-page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs:{
        /**渲染页面 */
        renderTable: function() { 
            /**获取所有的记录 */
            $.get(home.urls.materialTypeInfo.getAllByPage(),{ page : 0}, function(result) {
                var materialTypes = result.data.content;
                const $tbody = $("#materialTypeInfoTable").children("tbody");
                materialTypeInfo.funcs.renderHandler($tbody, materialTypes, 0);
                materialTypeInfo.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "materialTypeInfoPage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.materialTypeInfo.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            },function (result) {
                                var materialTypes = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#materialTypeInfoTable").children("tbody");
                                materialTypes.funcs.renderHandler($tbody, materialTypes, page);
                                materialTypes.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            materialTypeInfo.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            materialTypeInfo.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            materialTypeInfo.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定搜索事件 */
            materialTypeInfo.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons) {
            buttons.off('click').on('click',function(){
                $("#materialNames").val("");
                layer.open({
                    type: 1,
                    title: "新增",
                    content: $("#updateModal"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes: function(index) {
                        var name = $("#materialNames").val();
                        if(name === ""){
                            layer.msg('物料名称不能为空');
                            return
                        }
                        $.post(home.urls.materialTypeInfo.add(),{
                            name: name,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset: ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    materialTypeInfo.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#updateModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#updateModal").addClass("hide");
                        layer,close(index);
                    }
                })
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents: function(buttons) {
            buttons.off('click').on('click',function(){
                if($(".material-checkbox:checked").length === 0) {
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
                            $(".material-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    rolesIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.materialTypeInfo.deleteByIds(), {
                                _method : "delete", ids : rolesIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        materialTypeInfo.init()
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
        // ,bindRefreshEvents
        ,renderHandler : function($tbody, materials, page) {
             //清空表格
             $tbody.empty() ;
             var i = 1 + page * 10;
            materials.forEach(function(e) {
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='material-checkBox' /></td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.name ? e.name : ' ')+"</td>" +
                    "<td><a href='#' class = 'editor' id='edit-"+(e.id)+"'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })
            var checkedBoxLength = $(".role-checkBox:checked").length;
            home.funcs.bindselectAll($("#role-checkBoxAll"), $(".role-checkbox"), checkedBoxLength, $("#roleManagementTable"));

        }
    }
}