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
            $.get(home.urls.dataDictionary.getAllByPage(), { page : 0 }, function(result) {
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
                            $.get(home.urls.dataDictionary.getAllByPage(),{
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
            dataTypeManagement.funcs.bindDeleteByIdsEvents($("#deleteButton"));
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
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){

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
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e&&e.content&&e.content.dicId ? e.content.dicId : '')+"</td>" +
                    "<td>"+(e&&e.content&&e.content.dicName ? e.content.dicName : '')+"</td>" +
                    "<td>"+(e&&e.content&&e.content.dicContent ? e.content.dicContent : '')+"</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.content.dicId)+"'><i class='fa fa-user' aria-hidden='true'></i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.content.dicId)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })
        }
    }
}