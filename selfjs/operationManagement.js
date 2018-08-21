var operationManagement = {
    init: function() {
         /**获取操作管理信息分页显示 */
         operationManagement.funcs.renderTable();
         var out = $('#operationManagementPage');
         var time = setTimeout(function() {
             var inside = $(".layui-laypage").width();
             $("#operationManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
             clearTimeout(time);
         },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs: {
        /**渲染页面 */
        renderTable() {
            /**获取所有的记录 */
            $.get(home.urls.operationManagement.getAllByPage(),{ page : 0 }, function(result) {
                var operations = result.data.content;
                const $tbody = $("#operationManagementTable").children("tbody");
                operationManagement.funcs.renderHandler($tbody, operations, 0);
                operationManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem : "operationManagementPage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.operationManagement.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function(result) {
                                var operations = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#operationManagementTable").children("tbody");
                                operationManagement.funcs.renderHandler($tbody, operations, page);
                                operationManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
        }
    ,renderHandler : function ($tbody, operations, page) {
        //清空表格
        $tbody.empty();
        var i = 1 + page * 10;
        operations.forEach(function(e) {
            $tbody.append(
                "<tr>" + 
                "<td>"+(e.id)+"</td>" +
                "<td>"+(e.name ? e.name : '无')+"</td>" +
                "<td><a href='#' class = 'editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                "</tr>"
            )
        })
        /**绑定编辑操作事件 */
        operationManagement.funcs.bindEditorOperationsEvents($(".editor"));
    }
    ,bindEditorOperationsEvents : function(buttons) {
        buttons.off('click').on('click',function() {
            var id = $(this).attr('id').substr(5);
            $("#operationNames").val("");
            $.get(home.urls.operationManagement.getById(),{id:id}, function(result) {
                var operations = result.data;
                var id = operations.id;
                $("#operationNames").val(operations.name);
                $("#updateModal").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#updateModal"),
                    area: ['380px', '200px'],
                    btn: ['确定', '取消'],
                    offset: ['40%','45%'],
                    closeBtn: 0,
                    yes: function(index) {
                        var name = $("#operationNames").val();
                        if(name === "") {
                            layer.msg('操作名称不能为空！');
                            return
                        }
                        $.post(home.urls.operationManagement.update(), {
                            id : id,
                            name : name,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%','55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    operationManagement.init();
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