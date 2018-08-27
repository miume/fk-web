var dataManagement = {
    init : function(){
        /**获取字典数据分页显示 */
        // dataManagement.funcs.renderTable();
        dataManagement.funcs.renderOption();
        var out = $("#dataPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#dataPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        /**渲染字典类型菜单*/
        renderOption : function(){
            $.get(home.urls.dataDictionary.getAllTypes(),{},function(result) {
                var types = result.data;
                const $ul = $("#dataType").children('ul');
                $ul.empty();
                $ul.append(
                    "<li style='background: #666666; color :white;'>字典类型</li>"
                )
                types.forEach(function (e) {
                    $ul.append(
                        "<li class='setDataType' id='setdata-" + (e.id) + "'>" + (e.typeName) + "</li>"
                    )
                })
                $($('.setDataType')[0]).addClass('selected_data').css('color', ' #ffffff')
                var id_name = $(".selected_data").attr('id')
                var typeId = id_name.substr(8)
                dataManagement.funcs.dataType_set(typeId)
                var set_data = $('.setDataType')
                dataManagement.funcs.changeType(set_data)
            })
        }
        /**选择类型 */
        ,changeType : function(set_data){
            set_data.off('click')
            set_data.on('click',function(){
                $('.setDataType').removeClass('selected_data').css('color','')
                $(this).addClass('selected_data').css('color', ' #ffffff')
                var id_name = $(this).attr('id')
                var typeId = id_name.substr(8)
                dataManagement.funcs.dataType_set(typeId)
            })

            //  dataManagement.funcs.dataType_set(dataTypeId)
        }
        /**渲染 */
        ,dataType_set : function(id){
            $.get(home.urls.dataDictionary.getAllDataByTypeByPage(),{
                id : id,
                page : 0
            },function(result){
                var datas = result.data.content
                const $tbody = $("#dataTable").children('tbody')
                dataManagement.funcs.renderHandler($tbody, datas,0)
                dataManagement.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'dataPage'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.get(home.urls.dataDictionary.getAllDataByTypeByPage(), {
                                id: id,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var datas = result.data.content //获取数据
                                const $tbody = $("#dataTable").children('tbody')
                                dataManagement.funcs.renderHandler($tbody, datas,page)
                                dataManagement.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            dataManagement.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            dataManagement.funcs.bindDeleteTypeById($("#deleteButton"));
            /**绑定刷新事件 */
            dataManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定查询事件 */
            dataManagement.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id_name = $(".selected_data").attr('id')
                var typeId = id_name.substr(8)
                var index = layer.load(2 , { offset : ['40%','58%'] });
                var time = setTimeout(function() {
                    layer.msg('刷新成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                    dataManagement.funcs.dataType_set(typeId);
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#dataId").val("");
                $("#dataName").val("");
                $("#dataValue").val("");
                $("#sequence").val("");
                $("#description").val("");
                $("#updateModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateModal"),
                    area : ['500px', '240px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes : function(index) {
                        var name = $("#dataName").val();
                        var value = $("#dataValue").val();
                        var description = $("#description").val();
                        var id_name = $(".selected_data").attr('id');
                        var typeId = id_name.substr(8)
                        if(name === ""&&value === ""){
                            layer.msg('所填信息不能为空!');
                            return 
                        }
                        $.post(home.urls.dataDictionary.addData() , {
                            "dataDictionaryType.id" : typeId,
                            dicName : name,
                            dicContent : value,
                            dicDescription : description,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    var id_name = $(".selected_data").attr('id')
                                    var typeId = id_name.substr(8)
                                    dataManagement.funcs.dataType_set(typeId);
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
        /**绑定删除事件 */
        ,bindDeleteTypeById : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".data_checkBox:checked").length === 0) {
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
                            var datasIds = [];
                            /**存取所有选中行的id值 */
                            $(".data_checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    datasIds.push(parseInt($(this).val()));
                                }
                            })
                            //console.log(rolesIdS.toString())
                            $.post(home.urls.dataDictionary.deleteDataByIds(), {
                                _method : "delete", ids : datasIds.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        var id_name = $(".selected_data").attr('id')
                                        var typeId = id_name.substr(8)
                                        dataManagement.funcs.dataType_set(typeId);
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
        /**绑定查询事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var dataName = $("#dictionaryData").val();
                var id_name = $(".selected_data").attr('id');
                var typeId = id_name.substr(8)
                // console.log(typeName);
                $.get(home.urls.dataDictionary.getAllDataByPageNameLike(),
                {
                    name : dataName,
                    id : typeId
                }, function(result){
                var datas = result.data.content;
                const $tbody = $("#dataTable").children("tbody");
                dataManagement.funcs.renderHandler($tbody, datas , 0);
                dataManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "dataPage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.dataDictionary.getAllDataByPageNameLike(),{
                                name : dataName,
                                id : typeId,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var datas = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#dataTable").children("tbody");
                                dataManagement.funcs.renderHandler($tbody, datas, page);
                                dataManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
        /**渲染表格 */
        ,renderHandler : function($tbody, datas, page) {
            //清空表格
            $tbody.empty() ;
            var i = 1 + page * 10;
            datas.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='data_checkbox' value='" + (e.id) + "'></td>" +
                    "<td>" + (e.id) + "</td>" +
                    "<td>" + (e.dicName) + "</td>" +
                    "<td>" + (e.dicContent) + "</td>" +
                    "<td>" + (e.dicDescription) + "</td>" +
                    "<td><a href='#' class='edit' id='edit-" + (e.id) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='delete' id='de-" + (e.id) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })

            /**实现全选 */
            var checkedBoxLength = $(".data_checkbox:checked").length;
            home.funcs.bindselectAll($("#data_checkAll"), $(".data_checkbox"), checkedBoxLength, $("#dataTable"));
            /**绑定单条记录删除事件 */
            dataManagement.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定编辑事件 */
            dataManagement.funcs.bindEditorRolesEvents($(".edit"));
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
                        var id = parseInt(_this.attr('id').substr(3))
                        $.post(home.urls.dataDictionary.deleteDataById() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    var id_name = $(".selected_data").attr('id')
                                    var typeId = id_name.substr(8)
                                    dataManagement.funcs.dataType_set(typeId);
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
        ,bindEditorRolesEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(5);
                $("#dataId").val("");
                $("#dataName").val("");
                $("#dataValue").val("");
                $("#sequence").val("");
                $("#description").val("");
                $.get(home.urls.dataDictionary.getDataById(),{ id:id }, function(result) {
                    var datas = result.data;
                    var id = datas.id;
                    var id_name = $(".selected_data").attr('id');
                    var typeId = id_name.substr(8)
                    $("#dataId").val(datas.id);
                    $("#dataName").val(datas.dicName);
                    $("#dataValue").val(datas.dicContent);
                    $("#description").val(datas.dicDescription);
                    $("#updateModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['500px', '240px'],
                        btn: ['确定', '取消'],
                        offset: ['40%','45%'],
                        closeBtn: 0,
                        yes: function(index){
                            var name = $("#dataName").val();
                            var value = $("#dataValue").val();
                            var sequence = $('#sequence').val();
                            var description = $('#description').val();
                            if(name==="" && value===""){
                                layer.msg('所填内容不能为空!');
                                return 
                            }
                            $.post(home.urls.dataDictionary.updateData() ,{
                                "dataDictionaryType.id" : typeId,
                                id : id,
                                dicName : name,
                                dicContent : value,
                                dicDescription : description,
                                rank : sequence
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        var id_name = $(".selected_data").attr('id')
                                        var typeId = id_name.substr(8)
                                        dataManagement.funcs.dataType_set(typeId);
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