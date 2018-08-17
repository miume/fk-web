var materialManagement = {
    init: function() {
        /**获取物料管理信息分页显示 */
        materialManagement.funcs.renderTable();

        var out = $("#materialManagementPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#materialManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs: {
        /**渲染页面 */
        renderTable: function() {
            /**获取所有的记录 */
            $.get(home.urls.materialManagement.getAllByPage(),{ page : 0}, function(result) {
                var materials = result.data.content;
                const $tbody = $("#materialManagementTable").children("tbody");
                materialManagement.funcs.renderHandler($tbody, materials, 0);
                materialManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "materialManagementPage",
                    count: 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.materialManagement.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            },function (result) {
                                var materials = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#materialManagementTable").children("tbody");
                                materialManagement.funcs.renderHandler($tbody, materials, page);
                                materialManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定搜索事件 */
            materialManagement.funcs.bingSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            materialManagement.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定刷新事件 */
            materialManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定数据录入事件 */
            operationLog.funcs.bindDeleteByIdsEvents($("#addButton"));
        }
        /**绑定搜索事件 */
        ,bingSearchEvents : function (buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endData').val();
                if(beginDates === "" && endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                $.post(home.urls.materialManagement.getByDate(),{startDate: beginDates, endDate: endDates},function(result) {
                    var page = result.data;
                    var materials = result.data.content;//获取数据
                    const $tbody = $("#materialManagementTable").children("tbody");
                    materialManagement.funcs.renderHandler($tbody, materials, 0);
                    materialManagement.pageSize = result.data.length;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialManagementPage",
                        count: 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.post(home.urls.materialManagement.getByDate(),{
                                    startDate: beginDates,
                                    endDate: endDates,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                },function(result) {
                                    var materials = result.data.content;
                                    var page = obj.curr - 1;
                                    const $tbody = $("#materialManagementTable").children("tbody");
                                    materialManagement.funcs.renderHandler($tbody, materials, page);
                                    materialManagement.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**绑定导出事件 */
        ,bingDownloadEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endData').val();
                if(beginDates === "" && endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                var href = home.urls.materialManagement.getByDateToExcel()+"?startDate="+ beginDates + "&endDate=" + endDates;
                $("#downloadA").attr("href",href);
            })
        }
        /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var index = layer.load(2, { offset : ['40%','50%']});
                var time = setTimeout(function(){
                    layer.msg('刷新成功', {
                        offset : ['40%','50%'],
                        time : 700
                    })
                    materialManagement.init();
                    $("#beginDate").val("");
                    $("#endData").val("");
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        ,renderHandler : function ($tbody, materials, page) {
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            materials.forEach(function(e) {
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='material-checkbox' /></td>" +
                    // "<td>"+(i++)+"</td>" +
                    // "<td>"+(e.user ? e.user : ' ')+"</td>" +
                    // "<td>"+(e.id)+"</td>" +
                    // "<td>"+(e.object ? e.object : ' ')+"</td>" +
                    // "<td>"+(e.type ? e.type : ' ')+"</td>" +
                    // "<td>"+"<div>"+"<abbr title=\""+(e.description ? e.description : '无')+"\" style=\"cursor:pointer\">"+(shortDescription)+"</abbr>"+"</div>"+"</td>"+
                    // "<td>"+(e.time ? e.time : ' ')+"</td>" +
                    "</tr>"
                )
            })
             /**实现全选 */
             var checkedBoxLength = $(".material-checkbox:checked").length;
             home.funcs.bindselectAll($("#materialManagement-checkBoxAll"), $(".material-checkbox"), checkedBoxLength, $("#materialManagementTable"));
        }
    }
}