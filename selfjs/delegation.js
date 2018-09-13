var delegationManagement = {
    pageSize : 0
    ,init : function(){
        /**获取数据信息分页显示，初始化各下拉框 */
        delegationManagement.funcs.renderTable();
        delegationManagement.funcs.renderDropBox();
        delegationManagement.funcs.renderDropBox1();
        delegationManagement.funcs.renderDropBox2();
        var out = $("#delegation_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#delegation_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,funcs : {
        /**渲染页面 */
        renderTable : function(){
            /**获取所有的记录 */
            $.get(home.urls.delegation.getAll(),{page : 0},function(result){
                var delegations = result.data;
                const $tbody = $("#delegationTable").children("tbody");
                delegationManagement.funcs.renderHandler($tbody, delegations, 0);
                delegationManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "delegation_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.delegation.getAll(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var delegations = result.data;
                                var page = obj.curr - 1;
                                const $tbody = $("#delegationTable").children("tbody");
                                delegationManagement.funcs.renderHandler($tbody, delegations, page);
                                delegationManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
        }
        ,renderHandler : function($tbody,delegations,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            delegations.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.orderCode)+"</td>" +
                    "<td>"+(e.delegationInfo.name)+"</td>" +
                    "<td>"+(e.operationDate)+"</td>" +
                    "<td>"+(e.clazz.name)+"</td>" +
                    "<td>"+(e.sendToCheckInfo.name)+"</td>" +
                    "<td>"+(e.signUser.name)+"</td>" +
                    "<td>"+(e.signDate)+"</td>" +
                    "<td>"+(e.signFlag===0?"未化验":"已化验")+"</td>" +
                    "<td>"+(e.testMethodInfo ? testMethodInfo : "")+"</td>" +
                    "<td>"+(e.testUser.name ? e.testUser.name : "")+"</td>" +
                    "<td>"+(e.testDate)+"</td>" +
                    "<td>"+(e.signFlag===0?"<a href='#' class ='deatil' id='deatil-"+(e.id)+"'>委托单</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class ='delete' id='delete-"+(e.id)+"'>删除</a>":"<a href='#' class ='view' id='view-"+(e.id)+"'>化验结果</a>")+"</td>" +
                    "</tr>"
                )
            })
            /**绑定新增事件 */
            delegationManagement.funcs.bindAddEvents($("#addButton"));
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').off("click",function(){
                
            })
        }
        /**渲染页面下拉框 */
        ,renderDropBox : function() {
            $(".sampleType").empty();
            $(".sampleType").append('<option></option>');
            $.get(home.urls.check.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $(".sampleType").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        },
        /**渲染页面下拉框 */
        renderDropBox1 : function() {
            $("#assay").empty();
            $("#assay").append('<option></option>');
            $.get(home.urls.testMethodInfo.findAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#assay").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        },
        /**渲染页面下拉框 */
        renderDropBox2 : function() {
            $("#delegationType").empty();
            $("#delegationType").append('<option></option>');
            $.get(home.urls.delegationInfo.findAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#delegationType").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        }
    }
}