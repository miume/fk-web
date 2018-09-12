var sampleManagement = {
    pageSize : 0
    ,init : function(){
        /**获取数据类别信息分页显示 */
        sampleManagement.funcs.renderTable();
        sampleManagement.funcs.renderDropBox();
        sampleManagement.funcs.renderDropBox1();
        var out = $("#sample_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#sample_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,funcs : {
        /**渲染页面 */
        renderTable : function(){
            /**获取所有的记录 */
            $.get(home.urls.sample.getAllByPage(), { page : 0 }, function(result) {
                var samples = result.data.content;
                const $tbody = $("#sampleTable").children("tbody");
                sampleManagement.funcs.renderHandler($tbody, samples, 0);
                sampleManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "sample_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.sample.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var samples = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#sampleTable").children("tbody");
                                sampleManagement.funcs.renderHandler($tbody, samples, page);
                                sampleManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            sampleManagement.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            sampleManagement.funcs.bindDeleteTypeById($("#deleteButton"));
            /**绑定刷新事件 */
            sampleManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定查询事件 */
            sampleManagement.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            sampleManagement.funcs.binddownloadEvents($("#downloadButton"));
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
                    sampleManagement.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#hideSampleType").val("");
                $("#hideSampleName").val("");
                $("#sampleNum").val("");
                $("#sampleDes").val("");
                $("#updateModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateModal"),
                    area : ['380px', '230px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes : function(index) {
                        var hideSampleType = $("#hideSampleType").val();
                        var hideSampleName = $("#hideSampleName").val();
                        var sampleNum = $("#sampleNum").val();
                        var sampleDes = $("#sampleDes").val();
                        $.post(home.urls.sample.add() , {
                            sampleCode : sampleNum,
                            name : hideSampleName,
                            description : sampleDes,
                            "sendToCheckInfo.id" : hideSampleType,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    sampleManagement.init();
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
        /**绑定批量删除事件 */
        ,bindDeleteTypeById : function(buttons){
            buttons.off('click').on('click',function(){
                if($(".sample-checkbox:checked").length === 0) {
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
                            var sampleIds = [];
                            /**存取所选中行的id值 */
                            $(".sample-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    sampleIds.push(parseInt($(this).val()));
                                }
                            })
                            $.post(home.urls.sample.deleteByBatch(), {
                                _method : "delete", ids : sampleIds.toString()
                            },function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function () {
                                        sampleManagement.init()
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
        /**绑定导出事件 */
        ,binddownloadEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var sampleType = $("#sampleType").val();
                var sampleName = $("#sampleName").val();
                var href = home.urls.sample.exportByGet()+"?sendId=" + sampleType + "&name=" +sampleName;
                location.href = href;
            })
        }
        /**绑定查询事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var sampleType = $("#sampleType").val();
                var sampleName = $("#sampleName").val();
                // console.log(typeName);
                $.get(home.urls.sample.getAllBySendIdAndNameLike(),
                {
                    sendId : sampleType,
                    name : sampleName
                }, function(result){
                var types = result.data.content;
                const $tbody = $("#sampleTable").children("tbody");
                sampleManagement.funcs.renderHandler($tbody, types , 0);
                sampleManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "sample_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.sample.getAllBySendIdAndNameLike(),{
                                sendId : sampleType,
                                name : sampleName,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var types = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#sampleTable").children("tbody");
                                sampleManagement.funcs.renderHandler($tbody, types, page);
                                sampleManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
        ,renderHandler : function($tbody,samples,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            samples.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='sample-checkbox'></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.sampleCode)+"</td>" +
                    "<td>"+(e.name)+"</td>" +
                    "<td>"+(e.sendToCheckInfo.name)+"</td>" +
                    "<td>"+(e.description)+"</td>" +
                    "<td>"+(e.addDate)+"</td>" +
                    "<td><a href='#' class='edit' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })
            /**实现全选 */
            var checkedBoxLength = $(".sample-checkbox:checked").length;
            home.funcs.bindselectAll($("#sample-checkBoxAll"), $(".sample-checkbox"), checkedBoxLength, $("#sampleTable"));
            /**绑定单条记录删除事件 */
            sampleManagement.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定编辑事件 */
            sampleManagement.funcs.bindEditEvents($(".edit"));
        }
        /**绑定单条记录删除事件 */
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
                        $.post(home.urls.sample.delete() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    sampleManagement.init()
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
                $("#hideSampleType").val('');
                $("#hideSampleName").val("");
                $("#sampleNum").val("");
                $("#sampleDes").val("");
                $.get(home.urls.sample.getOneById(),{ id:id }, function(result) {
                    var dataTypes = result.data;
                    var id = dataTypes.id;
                    $("#hideSampleType").val(dataTypes.sendToCheckInfo.id);
                    $("#hideSampleName").val(dataTypes.name);
                    $("#sampleNum").val(dataTypes.sampleCode);
                    $("#sampleDes").val(dataTypes.description);
                    $("#updateModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['380px', '230px'],
                        btn: ['确定', '取消'],
                        offset: ['40%','45%'],
                        closeBtn: 0,
                        yes: function(index){
                            var hideSampleType = $("#hideSampleType").val();
                            var hideSampleName = $("#hideSampleName").val();
                            var sampleNum = $("#sampleNum").val();
                            var sampleDes = $("#sampleDes").val();
                            $.post(home.urls.sample.update() ,{
                                id : id,
                                sampleCode : sampleNum,
                                name : hideSampleName,
                                description : sampleDes,
                                "sendToCheckInfo.id" : hideSampleType,
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        sampleManagement.init();
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
        /**渲染页面下拉框 */
        ,renderDropBox : function() {
            $("#sampleType").empty();

            $("#sampleType").append('<option></option>');
            $.get(home.urls.check.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#sampleType").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        }
        /**渲染新增，编辑页面下拉框 */
        ,renderDropBox1 : function() {
            $("#hideSampleType").empty();

            $("#hideSampleType").append('<option></option>');
            $.get(home.urls.check.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#hideSampleType").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        }
    }
}