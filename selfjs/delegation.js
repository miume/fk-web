var delegationManagement = {
    pageSize : 0
    ,init : function(){
        /**获取数据信息分页显示，初始化各下拉框，单选框，复选框 */
        delegationManagement.funcs.renderTable();
        delegationManagement.funcs.renderDropBox();
        delegationManagement.funcs.renderDropBox2();
        delegationManagement.funcs.renderSingleBox();
        delegationManagement.funcs.renderCheckBox();
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
            /**绑定新增事件 */
            delegationManagement.funcs.bindAddEvents($("#addButton"));
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on("click",function(){
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "送检委托单管理",
                    content : $("#addModal"),
                    area : ['80%', '70%'],
                    btn : ['生成委托单' , '返回'],
                    offset : ['10%' , '10%'],
                    closeBtn: 0,
                    yes : function(index){
                        // 实现json格式传数据
                        var userStr = $.session.get('user');
                        var userJson = JSON.parse(userStr);
                        var data = {
                            clazz : {id : $("#clazz").val()},
                            delegationInfo : {id : $("input[name='commi']:checked").attr('id').substr(4)},
                            delegationOrderDetailFlags : [],
                            description : $("#remarks").val(),
                            mineDeal : $("#capacity").val(),
                            operationDate : $("#operationDate").val(),
                            operationUser : {id : $("#operator option:selected").val()},
                            sendToCheckInfo : {id : $("#sampleTypeHide option:selected").val()},
                            signUser : {id : userJson.id},
                            testMethodInfo : {id : $("input[name='met']:checked").attr('id').substr(5)}
                        }
                    }
                    ,btn2: function (index) {
                        $("#addModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        ,/**渲染委托表表头 */
        renderHead : function($tr,vals){
            $tr.empty();
            vals.each(function(e){
                $tr.append("<td>"+ e +"</td>");
            })
        }
        /**渲染常规委托表 */
        ,renderNormal :function($conventionalTbody,vals,samples,sampleCode){
            $conventionalTbody.empty();
            var i = 1;
            
        }
        ,renderHandler : function($tbody,delegations,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            delegations.forEach(function(e){
                // console.log(e.testUser)
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
                    "<td>"+(e.testUser&&e.testUser.name || "")+"</td>" +
                    "<td>"+(e.testDate)+"</td>" +
                    "<td>"+(e.signFlag===0?"<a href='#' class ='deatil' id='deatil-"+(e.id)+"'>委托单</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class ='delete' id='delete-"+(e.id)+"'>删除</a>":"<a href='#' class ='view' id='view-"+(e.id)+"'>化验结果</a>")+"</td>" +
                    "</tr>"
                )
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
            $("#sampleTypeHide").empty();
            $.get(home.urls.check.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#sampleTypeHide").append('<option value='+e.id+'>'+e.name+'</option>')
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
            $("#clazz").empty();
            $("#clazz").append('<option></option>');
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#clazz").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
            $("#operator").empty();
            $("#operator").append('<option></option>');
            $.get(home.urls.user.getByTeam(),{teamId : 1},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#operator").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
            $("#team").empty();
            $("#team").append('<option></option>');
            $.get(home.urls.team.getById(),{id : 1},function(result) {
                var checks = result.data;
                $("#team").append('<option value='+checks.id+'>'+checks.name+'</option>')
            })
        }
        /**渲染单选框 */
        ,renderSingleBox : function(){
            $("#commission").empty();
            $.get(home.urls.delegationInfo.findAll(),{},function(result){
                var checks = result.data;
                checks.forEach(function(e){
                    $("#commission").append("<input type='radio'  name='commi' id='com-"+(e.id)+"'>"+e.name)
                })
            })
            $("#method").empty();
            $.get(home.urls.testMethodInfo.findAll(),{},function(result){
                var checks = result.data;
                checks.forEach(function(e){
                    $("#method").append("<input type='radio' name='met'  id='test-"+(e.id)+"'>"+e.name)
                })
            })
        }
        /**渲染复选框 */
        ,renderCheckBox : function(){    
            $("#sample").empty();
            $.get(home.urls.sample.getAllByPage(),{},function(result){
                var checks = result.data.content;
                checks.forEach(function(e){
                    $("#sample").append("<input class='sample' name='"+e.sampleCode+"' value='"+e.name+"' type='checkbox' id='check-"+(e.id)+"'>"+e.name)
                })
            })
        }
    }
}