var materialConsumptionItem = {
    materialItemResult: [],
    init: function() {
        /**获取物料消耗项目信息分页显示 */
        materialConsumptionItem.funcs.renderTable();
        materialConsumptionItem.funcs.renderDropBox();
        var out = $("#materialConsumptionItemPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#materialConsumptionItemPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs:{
        /**渲染页面 */
        renderTable: function() { 
            /**获取所有的记录 */
            $.get(home.urls.materialConsumptionItem.getAllByPage(),{ page : 0}, function(result) {
                var materialConsumptions = result.data.content;
                const $tbody = $("#materialConsumptionItemTable").children("tbody");
                materialConsumptionItem.funcs.renderHandler($tbody, materialConsumptions, 0);
                materialConsumptionItem.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "materialConsumptionItemPage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.materialConsumptionItem.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            },function (result) {
                                var materialConsumptions = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#materialConsumptionItemTable").children("tbody");
                                materialConsumptionItem.funcs.renderHandler($tbody, materialConsumptions, page);
                                materialConsumptionItem.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            materialConsumptionItem.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            materialConsumptionItem.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            materialConsumptionItem.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定搜索事件 */
            materialConsumptionItem.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons) {
            buttons.off('click').on('click',function(){
                // 清空操作
                $("#materialTypeName").empty();
                $("#materialItemNames").val("");
                // 下拉框初始化操作
                $.get(home.urls.materialTypeInfo.getAll(),{},function(result) {
                    $("#updateModal").removeClass("hide");
                    var materialTypes = result.data;
                    materialTypes.forEach(function(e) {
                    $("#materialTypeName").append('<option value='+e.id+'>'+e.name+'</option>');
                    })
                })
                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#updateModal"),
                    area: ['350px', '250px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    closeBtn: 0,
                    yes: function(index) {
                        var materialItemNames = $("#materialItemNames").val();
                        var materialTypeId = $('#materialTypeName').val();
                        $.post(home.urls.materialConsumptionItem.add(),{
                            name : materialItemNames,
                            'materialType.id' : materialTypeId,
                        },function(result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    materialConsumptionItem.init();
                                    clearTimeout(time);
                                }, 500)
                            }
                            $("#updateModal").css("display","none");
                            layer.close(index);
                        })
                    }
                    ,btn2: function (index) {
                        $("#updateModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents: function(buttons) {
            buttons.off('click').on('click',function(){
                if($(".materialItem-checkbox:checked").length === 0) {
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
                            var materialItemIdS = [];
                            /**存取所有选中行的id值 */
                            $(".materialItem-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    materialItemIdS.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.materialConsumptionItem.deleteByIds(), {
                                _method : "delete", ids : materialItemIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        materialConsumptionItem.init()
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
                    materialConsumptionItem.init();
                    $("#inputmaterialItemNames").val("");
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var materialItemName = $("#inputmaterialItemNames").val();
                var materialTypesId = $("#mtn").val();
                if(materialTypesId === ""){
                    materialTypesId = "-1";
                }
                $.get(home.urls.materialConsumptionItem.getByMaterialTypeAndNameLikeByPage(), { 
                    name : materialItemName ,
                    'materialTypeId' : materialTypesId
                }, function(result) {
                    var materialItems = result.data.content;
                    const $tbody = $("#materialConsumptionItemTable").children("tbody");
                    materialConsumptionItem.funcs.renderHandler($tbody, materialItems, 0);
                    materialConsumptionItem.pageSize = result.data.length;
                    var page = result.data;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialConsumptionItemPage",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.materialConsumptionItem.getByMaterialTypeAndNameLikeByPage(),{
                                    name : materialItemName,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var materialItems = result.data.content;
                                    var page = obj.curr - 1;
                                    const $tbody = $("#materialConsumptionItemTable").children("tbody");
                                    materialConsumptionItem.funcs.renderHandler($tbody, materialItems, page);
                                    materialConsumptionItem.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                    // $("#mtn").empty();
                })
            })
        }
        ,renderHandler : function($tbody, materialItems, page) {
            //清空表格
           $tbody.empty() ;
           // var i = 1 + page * 10;
            materialItems.forEach(function(e) {
                $tbody.append(
                   "<tr>" + 
                   "<td><input type='checkbox' value="+e.id+" class='materialItem-checkBox' /></td>" +
                   "<td>"+(e.id)+"</td>" +
                   "<td>"+(e.materialType ? e.materialType.name : ' ')+"</td>" +
                   "<td>"+(e.name ? e.name : ' ')+"</td>" +
                   "<td><a href='#' class = 'editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                   "</tr>"
                )
            })
            var checkedBoxLength = $(".materialItem-checkBox:checked").length;
            home.funcs.bindselectAll($("#materialItem-checkBoxAll"), $(".materialItem-checkbox"), checkedBoxLength, $("#materialConsumptionItemTable"));
            /**绑定编辑操作名称事件 */
            materialConsumptionItem.funcs.bindEditorMaterialItemEvents($(".editor"));
        }
        ,bindEditorMaterialItemEvents: function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(5);
                // 清空操作
                $("#materialTypeName").empty();
                $("#materialItemNames").val("");
                $.get(home.urls.materialConsumptionItem.getById(),{ id:id }, function(result) {
                    var materialItems = result.data;
                    var id = materialItems.id;
                    $("#materialItemNames").val(materialItems.name);
                    $("#updateModal").removeClass("hide");
                    if(materialItems.materialType === null)
                    {
                        $.get(home.urls.materialTypeInfo.getAll(),{},function(result) {
                            var materialTypes = result.data;
                            materialTypes.forEach(function(e) {
                                $("#materialTypeName").append('<option value='+e.id+'>'+e.name+'</option>')
                            })
                        })
                    }else{
                        $("#materialTypeName").append('<option value='+id+'>'+ materialItems.materialType.name +'</option>');
                        $.get(home.urls.materialTypeInfo.getAll(),{},function(result) {
                            var materialTypes = result.data;
                            materialTypes.forEach(function(e) {
                                if(materialItems.materialType.id != e.id) 
                                {
                                    $("#materialTypeName").append('<option value='+e.id+'>'+e.name+'</option>')
                                }
                            })
                        })
                    }
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['350px', '250px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        closeBtn: 0,
                        yes: function(index) {
                            var materialItemNames = $("#materialItemNames").val();
                            var materialTypeId = $('#materialTypeName').val();
                            $.post(home.urls.materialConsumptionItem.update(), {
                                name : materialItemNames ,
                                id : id,
                                'materialType.id' : materialTypeId
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        materialConsumptionItem.init();
                                        clearTimeout(time);
                                    }, 500)
                                }
                                $("#updateModal").css("display","none");
                                layer.close(index);
                            })
                        }
                        ,btn2: function (index) {
                            $("#updateModal").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        /**渲染页面下拉框 */
        ,renderDropBox : function() {
            $("#mtn").append('<option></option>');
            $.get(home.urls.materialTypeInfo.getAll(),{},function(result) {
                var materialTypes = result.data;
                materialTypes.forEach(function(e) {
                    $("#mtn").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        }
    }
}