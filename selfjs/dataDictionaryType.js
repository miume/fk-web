var dataTypeManagement = {
    pageSize:0,
    init:function(){
        /**获取数据类别信息分页显示 */
        dataTypeManagement.funcs.renderTable();
        var out = $("#dataType_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#dataType_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,funcs:{
        /**渲染页面 */
        renderTable:function(){
            /**获取所有的记录 */
            $.get(home.urls.dataDictionary.getAllTypesByPage(), { page : 0 }, function(result) {
                var dataTypes = result.data.content;
                const $tbody = $("#dataTypeTable").children("tbody");
                dataTypeManagement.funcs.renderHandler($tbody, dataTypes, 0);
                dataTypeManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "dataType_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.dataDictionary.getAllTypesByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var dataTypes = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#dataTypeTable").children("tbody");
                                dataTypeManagement.funcs.renderHandler($tbody, dataTypes, page);
                                dataTypeManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            dataTypeManagement.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            dataTypeManagement.funcs.bindDeleteTypeById($("#deleteButton"));
            /**绑定刷新事件 */
            dataTypeManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定查询事件 */
            dataTypeManagement.funcs.bindSearchEvents($("#searchButton"));
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
                    dataTypeManagement.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteTypeById : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".dataType-checkbox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else{
                    layer.open({
                        type : 1,
                        title : "批量删除",
                        content : "<h5 style='text-align:center;'>您确定要删除所有数据吗？</h5>",
                        area: ['200px','140px'],
                        offset : ['40%', '55%'],
                        btn: ['确定', '取消'],
                        closeBtn: 0,
                        yes : function(index){
                            var dataTypeIds = [];
                            /**存取所选中行的id值 */
                            $(".dataType-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    dataTypeIds.push(parseInt($(this).val()));
                                }
                            })
                            $.post(home.urls.dataDictionary.deleteTypesByIds(), {
                                _method : "delete", ids : dataTypeIds.toString()
                            },function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function () {
                                        dataTypeManagement.init()
                                        clearTimeout(time)
                                },500)
                            }
                            layer.msg(result.message,{
                                offset: ['40%', '55%'],
                                time: 700
                            })
                        })
                        layer.close(index);
                }
                ,btn2 : function(index){
                    layer.close(index);
                }
            })
        }
    })
    }
        /**绑定查询事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var typeName = $("#dictionaryType").val();
                // console.log(typeName);
                $.get(home.urls.dataDictionary.getAllTypesByNameLikeByPage(),
                {
                    typeName : typeName
                }, function(result){
                var types = result.data.content;
                const $tbody = $("#dataTypeTable").children("tbody");
                dataTypeManagement.funcs.renderHandler($tbody, types , 0);
                dataTypeManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "dataType_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.dataDictionary.getAllTypesByNameLikeByPage(),{
                                typeName : typeName,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var types = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#dataTypeTable").children("tbody");
                                dataTypeManagement.funcs.renderHandler($tbody, types, page);
                                dataTypeManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#dataTypeName").val("");
                $("#dataTypeValue").val("");
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
                        var name = $("#dataTypeName").val();
                        var value = $("#dataTypeValue").val();
                        if(name === ""&&value === ""){
                            layer.msg('所填信息不能为空!');
                            return 
                        }
                        $.post(home.urls.dataDictionary.addType() , {
                            typeName : name,
                            typeValue : value,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    dataTypeManagement.init();
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
        ,renderHandler : function($tbody, dataTypes, page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            dataTypes.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='dataType-checkbox'></td>" +
                    "<td>"+(e&&e.id ? e.id : '')+"</td>" +
                    "<td>"+(e&&e.typeName ? e.typeName : '')+"</td>" +
                    "<td>"+(e&&e.typeValue ? e.typeValue : '')+"</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })

            /**实现全选 */
            var checkedBoxLength = $(".dataType-checkbox:checked").length;
            home.funcs.bindselectAll($("#dataType-checkBoxAll"), $(".dataType-checkbox"), checkedBoxLength, $("#dataTypeTable"));
            /**绑定单条记录删除事件 */
            dataTypeManagement.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定编辑事件 */
            dataTypeManagement.funcs.bindEditorEvents($(".editor"));
        }
        /**绑定单条删除事件 */
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
                    yes: function(index){
                        var id = parseInt(_this.attr('id').substr(7))
                        $.post(home.urls.dataDictionary.deleteTypeById() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    dataTypeManagement.init()
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
        /**绑定编辑事件 */
        ,bindEditorEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(5);
                $("#dataTypeName").val("");
                $("#dataTypeValue").val("");
                $.get(home.urls.dataDictionary.getTypeById(),{ id:id }, function(result) {
                    var dataTypes = result.data;
                    var id = dataTypes.id;
                    $("#dataTypeName").val(dataTypes.typeName);
                    $("#dataTypeValue").val(dataTypes.typeValue);
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
                            var name = $("#dataTypeName").val();
                            var value = $("#dataTypeValue").val();
                            if(name===""){
                                layer.msg('角色名称不能为空!');
                                return 
                            }
                            $.post(home.urls.dataDictionary.updateType() ,{
                                id : id,
                                typeName : name,
                                typeValue : value
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        dataTypeManagement.init();
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