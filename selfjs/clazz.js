var clazz = {

    init : function(){
        clazz.funcs.renderTable()
        var out = $("#clazz_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#clazz_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,pageSize : 0
    ,funcs :{
        //渲染页面
        renderTable:function(){
            //获取所有的记录
            $.get(home.urls.clazz.getAllByPage(), { page : 0 }, function(result) {
                var clazzs = result.data.content;
                const $tbody = $("#clazzTable").children("tbody");
                clazz.funcs.renderHandler($tbody, clazzs, 0);
                clazz.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "clazz_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.clazz.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var clazzs = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#clazzTable").children("tbody");
                                clazz.funcs.renderHandler($tbody, clazzs, page);
                                clazz.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定搜索事件 */
            clazz.funcs.bindSearchEvents($("#searchButton"));
            /**绑定新增事件 */
            clazz.funcs.bindAddEvents($("#addButton")); 
            /**绑定批量删除事件 */
            clazz.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定刷新事件 */
            clazz.funcs.bindRefreshEvents($("#refreshButton"));                                               
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
                    clazz.init();
                    $("#searchName").val("");
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".clazz-checkbox:checked").length === 0) {
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
                            var clazzIds = [];
                            /**存取所选中行的id值 */
                            $(".clazz-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    clazzIds.push(parseInt($(this).val()));
                                }
                            })
                            $.post(home.urls.clazz.deleteByIds(), {
                                _method : "delete", ids : clazzIds.toString()
                            },function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function () {
                                        clazz.init()
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
                var clazzName = $("#searchName").val();
                // console.log(typeName);
                $.get(home.urls.clazz.getByNameLikeByPage(),
                {
                    name : clazzName
                }, function(result){
                var clazzs = result.data.content;
                const $tbody = $("#clazzTable").children("tbody");
                clazz.funcs.renderHandler($tbody, clazzs , 0);
                clazz.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "clazz_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.clazz.getByNameLikeByPage(),{
                                name : clazzName,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var clazzs = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#clazzTable").children("tbody");
                                clazz.funcs.renderHandler($tbody, clazzs, page);
                                clazz.pageSize = result.data.length;
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
                $("#clazzName").val("");
                $("#startTime").val("");
                $("#endTime").val("");
                $("#shortName").val("");
                $("#clazzCross").val("");
                $("#statisticCross").val("");
                $("#rank").val("");
                $("#updateModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateModal"),
                    area : ['610px', '250px'],
                    btn : ['确定' , '取消'],
                    offset : "auto",
                    closeBtn: 0,
                    yes : function(index) {
                        var name = $("#clazzName").val();
                        var startTime = $("#startTime").val();
                        var endTime = $("#endTime").val();
                        var shortName = $("#shortName").val();
                        var clazzCross = $("#clazzCross").val();
                        var statisticCross = $("#statisticCross").val();
                        var rank = $("#rank").val();
                        if(name === ""||startTime === ""||endTime === ""||shortName === ""||clazzCross === ""||statisticCross === ""||rank === ""){
                            layer.msg('所填信息不能为空!');
                            return 
                        }
                        $.post(home.urls.clazz.add() , {
                            name : name,
                            startTime : startTime,
                            endTime : endTime,
                            rank : rank,
                            shortName : shortName,
                            clazzCrossFlag : clazzCross,
                            statisticCrossFlag : statisticCross
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    clazz.init();
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
        ,renderHandler : function($tbody, clazzs, page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            clazzs.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='clazz-checkbox'></td>" +
                    "<td>"+(e.rank)+"</td>" +
                    "<td>"+(e.name)+"</td>" +
                    "<td>"+(e.shortName)+"</td>" +
                    "<td>"+(e.startTime)+"</td>" +
                    "<td>"+(e.endTime)+"</td>" +
                    "<td>"+(e.clazzCrossFlag)+"</td>" +
                    "<td>"+(e.statisticCrossFlag)+"</td>" +
                    "<td><a href='#' class='edit' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })

            /**实现全选 */
            var checkedBoxLength = $(".clazz-checkbox:checked").length;
            home.funcs.bindselectAll($("#clazz_checkAll"), $(".clazz-checkbox"), checkedBoxLength, $("#clazzTable"));
            /**绑定单条记录删除事件 */
            clazz.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定编辑事件 */
            clazz.funcs.bindEditEvents($(".edit"));
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
                        $.post(home.urls.clazz.deleteById() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    clazz.init()
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
                $("#clazzName").val("");
                $("#startTime").val("");
                $("#endTime").val("");
                $("#shortName").val("");
                $("#clazzCross").val("");
                $("#statisticCross").val("");
                $("#rank").val("");
                $.get(home.urls.clazz.getById(),{ id:id }, function(result) {
                    var clazzs = result.data;
                    var id = clazzs.id;
                    $("#clazzName").val(clazzs.name);
                    $("#startTime").val(clazzs.startTime);
                    $("#endTime").val(clazzs.endTime);
                    $("#shortName").val(clazzs.shortName);
                    $("#clazzCross").val(clazzs.clazzCrossFlag);
                    $("#statisticCross").val(clazzs.statisticCrossFlag);
                    $("#rank").val(clazzs.rank);
                    $("#updateModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['610px', '250px'],
                        btn: ['确定', '取消'],
                        offset: "auto",
                        closeBtn: 0,
                        yes: function(index){
                            var name = $("#clazzName").val();
                            var startTime = $("#startTime").val();
                            var endTime = $("#endTime").val();
                            var shortName = $("#shortName").val();
                            var clazzCross = $("#clazzCross").val();
                            var statisticCross = $("#statisticCross").val();
                            var rank = $("#rank").val();
                            if(name === ""||startTime === ""||endTime === ""||shortName === ""||clazzCross === ""||statisticCross === ""||rank === ""){
                                layer.msg('所填信息不能为空!');
                                return 
                            }
                            $.post(home.urls.clazz.update() ,{
                                id : id,
                                name : name,
                                startTime : startTime,
                                endTime : endTime,
                                rank : rank,
                                shortName : shortName,
                                clazzCrossFlag : clazzCross,
                                statisticCrossFlag : statisticCross
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        clazz.init();
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