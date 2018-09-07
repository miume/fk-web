var MaterialItem = {

    init : function(){
        MaterialItem.funcs.renderTable()
        var out = $("#MaterialItem_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#MaterialItem_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,pageSize : 0
    ,funcs :{
        //渲染页面
        renderTable:function(){
            //获取所有的记录
            $.get(home.urls.MaterialItem.getAllByPage(), { page : 0 }, function(result) {
                var MaterialItems = result.data.content;
                const $tbody = $("#MaterialItemTable").children("tbody");
                MaterialItem.funcs.renderHandler($tbody, MaterialItems, 0);
                MaterialItem.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "MaterialItem_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.MaterialItem.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var MaterialItems = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#MaterialItemTable").children("tbody");
                                MaterialItem.funcs.renderHandler($tbody, MaterialItems, page);
                                MaterialItem.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定搜索事件 */
            MaterialItem.funcs.bindSearchEvents($("#searchButton"));
            /**绑定新增事件 */
            MaterialItem.funcs.bindAddEvents($("#addButton")); 
            /**绑定批量删除事件 */
            MaterialItem.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            MaterialItem.funcs.bindRefreshEvents($("#refreshButton"));                                               
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
                    MaterialItem.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".MaterialItem-checkbox:checked").length === 0) {
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
                            var MaterialItemIds = [];
                            /**存取所选中行的id值 */
                            $(".MaterialItem-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    MaterialItemIds.push(parseInt($(this).val()));
                                }
                            })
                            $.post(home.urls.MaterialItem.deleteByIds(), {
                                _method : "delete", ids : MaterialItemIds.toString()
                            },function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function () {
                                        MaterialItem.init()
                                        clearTimeout(time)
                                },500)
                            }
                            layer.msg(result.message,{
                                offset: ['40%', '55%'],
                                time: 700
                            })
                        });
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
                var MaterialItemName = $("#searchName").val();
                // console.log(typeName);
                $.get(home.urls.MaterialItem.getByNameLikeByPage(),
                {
                    name : MaterialItemName
                }, function(result){
                var MaterialItems = result.data.content;
                const $tbody = $("#MaterialItemTable").children("tbody");
                MaterialItem.funcs.renderHandler($tbody, MaterialItems , 0);
                MaterialItem.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "MaterialItem_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.MaterialItem.getByNameLikeByPage(),{
                                name : MaterialItemName,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var MaterialItems = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#MaterialItemTable").children("tbody");
                                MaterialItem.funcs.renderHandler($tbody, MaterialItems, page);
                                MaterialItem.pageSize = result.data.length;
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
                $("#MaterialItemName").val("");
                $("#updateModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateModal"),
                    area : ['300px', '150px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes : function(index) {
                        var name = $("#MaterialItemName").val();
                        if(name === ""){
                            layer.msg('所填信息不能为空!');
                            return 
                        }
                        $.post(home.urls.MaterialItem.add() , {
                            name : name,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    MaterialItem.init();
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
        ,renderHandler : function($tbody, MaterialItems, page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            MaterialItems.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='MaterialItem-checkbox'></td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.name)+"</td>" +
                    "<td><a href='#' class='edit' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })

            /**实现全选 */
            var checkedBoxLength = $(".MaterialItem-checkbox:checked").length;
            home.funcs.bindselectAll($("#MaterialItem_checkAll"), $(".MaterialItem-checkbox"), checkedBoxLength, $("#MaterialItemTable"));
            /**绑定单条记录删除事件 */
            MaterialItem.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定编辑事件 */
            MaterialItem.funcs.bindEditEvents($(".edit"));
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
                        $.post(home.urls.MaterialItem.deleteById() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    MaterialItem.init()
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
        ,bindEditEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(5);
                $("#MaterialItemName").val("");
                $.get(home.urls.MaterialItem.getById(),{ id:id }, function(result) {
                    var MaterialItems = result.data;
                    var id = MaterialItems.id;
                    $("#MaterialItemName").val(MaterialItems.name);
                    $("#updateModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['300px', '150px'],
                        btn: ['确定', '取消'],
                        offset: ['40%','45%'],
                        closeBtn: 0,
                        yes: function(index){
                            var name = $("#MaterialItemName").val();
                            if(name === ""){
                                layer.msg('所填信息不能为空!');
                                return 
                            }
                            $.post(home.urls.MaterialItem.update() ,{
                                id : id,
                                name : name,
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        MaterialItem.init();
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