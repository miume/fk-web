var operationLog = {
    init: function () {
        /**获取操作日志信息分页显示 */
        operationLog.funcs.renderTable();
        var out = $("operationLogPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#operationLogPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs:{
        /**渲染页面 */
        renderTable: function() { 
            /**获取所有的记录 */
            $.get(home.urls.operation.getAllByPage(),{ page : 0}, function(result) {
                var operations = result.data.content;
                const $tbody = $("#operationLogTable").children("tbody");
                operationLog.funcs.renderHandler($tbody, operations, 0);
                operationLog.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "operationLogPage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.operation.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            },function (result) {
                                var operations = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#operationLogTable").children("tbody");
                                operationLog.funcs.renderHandler($tbody, operations, page);
                                operationLog.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定搜索事件 */
            operationLog.funcs.bingSearchEvents($("#searchButton"));
            /**绑定下载事件 */
            operationLog.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定批量删除事件 */
            operationLog.funcs.bindDeleteByIdsEvents($("#deleteButton"))
        }
        /**绑定搜索事件 */
        ,bingSearchEvents : function (buttons) {
            buttons.off('click').on('click',function(){
                var beginDate = $('#beginDate').val();
                var endDate = $('#endData').val();
                $.get(home.urls.operation.getByDate(),{startDate: beginDate, endDate: endDate},function(result){
                    var page = result.data;
                    var operations = result.data.content; //获取数据
                    const $tbody = $("#operationLogTable").children("tbody");
                    operationLog.funcs.renderHandler($tbody, operations, 0);
                    operationLog.pageSize = result.data.length;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "operationLogPage",
                        count: 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.operation.getByDate(),{
                                    startDate: beginDate,
                                    endDate: endDate,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                },function(result) {
                                    var operations = result.data.content;
                                    var page = obj.curr - 1;
                                    const $tbody = $("#operationLogTable").children("tbody");
                                    operationLog.funcs.renderHandler($tbody, operations, page);
                                    operationLog.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })

            })
        }
        /**绑定下载事件 */
        ,bingDownloadEvents : function(buttons){
            buttons.off('click').on('click',function(){

            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents : function(buttons){
            buttons.off('click').on('click',function(){
                if($('.checkbox:checked').length == 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
						offset: ['40%', '55%'],
						time: 700
					})
                }else {
                    layer.open({
                        type: 1,
						title: '批量删除',
						content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除选中记录吗?</h5>",
						area: ['190px', '130px'],
						btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function(index) {
                            var operationLogIds = [];
                            $('.checkbox').each(function(){
                                if($(this).prop('checked')) {
                                    operationLogIds.push({
                                        id: $(this).val()
                                    })
                                }
                            })
                            $.ajax({
                                // url:home.urls.operation.
                            })
                        }
                    })
                }
            })
        }
        ,renderHandler : function ($tbody, operations, page) {
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            operations.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+"></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.user ? e.user : ' ')+"</td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.object ? e.object : ' ')+"</td>" +
                    "<td>"+(e.type ? e.type : ' ')+"</td>" +
                    "<td>"+(e.description ? e.description : ' ')+"</td>" +
                    "<td>"+(e.time ? e.time : ' ')+"</td>" +
                    "</tr>"
                )
            })
        }
        // ,bindDeleteByIdsEvents : function(buttons){
        //     buttons.off('click').on('click',function(){
        //         var _this = $(this);
        //         layer.open({
        //             type: 1,
        //             title: '删除',
        //             content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
        //             area: ['200px','140px'],
        //             btn: ['确定','取消'],
        //             offset: ['40%','55%'],
        //             yes: function(index) {
        //                 var id = _this.attr('id').substr(7);
        //                 $.post(home.urls.operation.deleteById(), {
        //                     _method:"delete",id:id
        //                 }, function(result){
        //                     layer.msg(result.message, {
        //                         offset: ['40%', '55%'],
        //                         time: 700
        //                     })
        //                     if(result.code == 0){
        //                         var time = setTimeout(function(){
        //                             operationLog.init();
        //                             clearTimeout(time)
        //                         },500)
        //                     }
        //                     layer.close(index);
        //                 })
        //             },
        //             btn2 : function(index){
        //                 layer.close(index);
        //             }
        //         })
        //     })
        // }
    }
}