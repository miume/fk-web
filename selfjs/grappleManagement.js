var grapple = {
    init :function(){
        grapple.funcs.renderTable();
        var out = $("#grapplepage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#grapplepage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable:function(){
            /**渲染表头，获取当天数据 */
            var startDate = $('#startTime').val()
            var endDate = $('#endTime').val()
            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                startDate : startDate,
                endDate : endDate,
            },function(result){
                var grapples = result.data;
                const $tbody = $('#grappleTable').children('tbody');
                grapple.funcs.renderHandler($tbody,grapples,0);
                grapple.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "grapplepage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var grapples = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#grappleTable").children("tbody");
                                grapple.funcs.renderHandler($tbody, grapples, page);
                                grapple.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
        }
        ,renderHandler : function($tbody,grapples,page){
            //清空表格
            $tbody.empty();
            grapples.forEach(function(e){
                $tbody.append(
                    "<tr>"+
                    "<td><input type='checkbox' value="+e.id+" class='grapple-checkbox'></td>" +
                    "<td>"+(e.id)+"</td>" +
                    "<td>"+(e.code)+"</td>" +
                    "<td>"+(e&&e.typeValue ? e.typeValue : '')+"</td>" +
                    "<td><a href='#' class='editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>"
                )
            })
        }
    }
}