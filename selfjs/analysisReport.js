var analysisReport = {
    init : function(){
        analysisReport.funcs.renderTable();
        analysisReport.funcs.renderSelector();
        var out = $("#report_page").width();
         var time = setTimeout(function(){
             var inside = $(".layui-laypage").width();
             $('#report_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
             clearTimeout(time);
         }, 30);
         /**月报显示 */
    }
     /**当前总记录数，用户控制全选逻辑 */
     ,pageSize: 0
     ,funcs : {
        renderTable : function(){
            var startDate = $("#startTime").val();
            var endDate = $("#endTime").val();
            console.log(startDate);
            console.log(endDate);
            $.get(home.urls.delegation.getByFour(),{
                startDate : startDate,
                endDate: endDate
            },function(result){
                var reports = result.data.content;
                if(reports == null){
                    return;
                }
                const $tbody = $("#reportTable").children("tbody");
                analysisReport.funcs.renderHandler1($tbody,reports);
                analysisReport.pageSize = result.data.length;
                var page = result.data.content;
                /**分页信息 */
                layui.laypage.render({
                    elem: "report_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.delegation.getByFour(),{
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                const $tbody = $("#reportTable").children("tbody");
                                analysisReport.funcs.renderHandler1($tbody, reports);
                                analysisReport.pageSize = result.data.length;
                            })
                        }
                    }
                })

            })
            /** 绑定查询事件*/
            analysisReport.funcs.bindSearchReportEvent($("#searchButton"));
            /** 绑定导出事件*/
            analysisReport.funcs.bindExpertReportEvent($("#expertButton1"));
        }
        /**渲染下拉框 */
        ,renderSelector :function(){
            const $selector1 = $("#operator");
            $.get(home.urls.user.getAll(),{},function(result) {
                var users = result.data;
                analysisReport.funcs.renderHandler3($selector1, users);
            })
            const $selector2 = $("#class");
            $.get(home.urls.clazz.getAll(),{},function(result){
                var clazz = result.data;
                analysisReport.funcs.renderHandler3($selector2, clazz);
            })
            const $selector3 = $("#system");
            $.get(home.urls.check.getAll(),{},function(result){
                var systems = result.data;
                analysisReport.funcs.renderHandler3($selector3, systems);
            })

        }
        /**查询事件 */
        ,bindSearchReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var startDate = $("#startTime").val();
                var endDate = $("#endTime").val();
                var clazz = $("#class").val();
                var sys = $("#system").val();
                var operator = $("#operator").val();
                $.get(home.urls.delegation.getByFour(),{
                    startDate : startDate,
                    endDate: endDate,
                    sendToCheckId : sys,
                    clazzId : clazz,
                    operatorId : operator
                },function(result){
                    var reports = result.data.content;
                    const $tbody = $("#reportTable").children("tbody");
                    analysisReport.funcs.renderHandler1($tbody,reports);
                    analysisReport.pageSize = result.data.length;
                    var page = result.data;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "report_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.delegation.getByFour(),{
                                    startDate : startDate,
                                    endDate : endDate,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    const $tbody = $("#reportTable").children("tbody");
                                    analysisReport.funcs.renderHandler1($tbody, reports);
                                    analysisReport.pageSize = result.data.length;
                                })
                            }
                        }
                    })
    
                })
            })
        }
        /**导出事件 */
        ,bindExpertReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var startDate = $("#startTime").val();
                var endDate = $("#endTime").val();
                var url = home.urls.delegation.download() + "?startDate=" + startDate + "&endDate=" + endDate + "&sendToCheckId=-1&clazzId=-1&operatorId=-1";
               $("#download-id1").attr("href",url);
            })
        }
        /**渲染表格 */
        ,renderHandler1: function($tbody,reports){
            $tbody.empty();
            reports.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td>" + (e.operationDate) + "</td>" +
                    "<td>" + (e.sendToCheckInfo ? e.sendToCheckInfo.name : '') + "</td>" +
                    "<td>" + (e.clazz ? e.clazz.name : '') + "</td>" +
                    "<td>" + (e.operationUser ? e.operationUser.name : '') + "</td>" +
                    "<td>" + (e.team ? e.team.name : '') + "</td>" +
                    "<td>" + (e.mineDeal ? e.mineDeal : '') + "</td>" +
                    "<td>" + (e.coEfficientCode ? e.coEfficientCode : '') + "</td>" +
                    "<td>" + (e.signUser ? e.signUser.name : '') + "</td>" +
                    "<td>" + (e.signDate) + "</td>" +
                    "<td>" + (e.testUser ? e.testUser.name : '') + "</td>" +
                    "<td>" + (e.testDate ? e.testDate : '') + "</td>" +
                    "<td>" + 
                    "<a href='#' class='detail' id='detail-" + (e.id) +"'>明细</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                    "<a href='#' class='update' id='update-" + (e.id) + "'>修改</a>" + "</td>" +
                    "</tr>"
                )
                /**绑定月报表及详情表切换事件 */
                analysisReport.funcs.bindPageSwitch($(".detail"));
                /**绑定重新生成事件 */
            //    analysisReport.funcs.bindReproduce($(".update"));
            })
        }
        /**切换到详情表 */
        ,bindPageSwitch : function(buttons){
            buttons.off('click').on('click',function(){
                $("#block1").addClass("hidePage");
                $("#block2").removeClass("hidePage");
                var id = $(this).attr('id').substr(7);   
                $.get(home.urls.delegation.getById(),{
                    id : id
                },function(result){
                    var details = result.data;
                    const $tbody = $("#detailTable").children("tbody");
                    analysisReport.funcs.renderHandler2($tbody,details);
                }) 
                /**绑定导出事件 */
                 analysisReport.funcs.bindExpertReportEvent2($("#expertButton2"),id);
          })
        }
        /**导出事件 */
        ,bindExpertReportEvent2 : function(buttons,id){
            buttons.off('click').on('click',function(){
                var url = home.urls.delegation.download1() + "?id=" + id ;
               $("#download-id2").attr("href",url);
            })
        }
        /**渲染详情表 */
        ,renderHandler2 : function($tbody,a){
            $tbody.empty();
            var i = 1;
            a.delegationOrderDetails.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.sampleManageInfo ? e.sampleManageInfo.name : '') + "</td>" +
                    "<td>" + (e.sampleManageInfo ? e.sampleManageInfo.sampleCode : '') + "</td>" +
                    "<td>" + (e.pb ? e.pb*100 : '') + "</td>" +
                    "<td>" + (e.zn ? e.zn*100 : '') + "</td>" +
                    "<td>" + (e.sf ? e.sf*100 : '') + "</td>" +
                    "<td>" + (e.fe ? e.fe*100 : '') + "</td>" +
                    "</tr>"
                )
            })
            $tbody.append(
                "<tr style='border : 5px solid black'>" + 
                "<table >" + 
                "<tr>" +
                "<td >" + "委托人" + "</td>" +
                "<td >" + (a.signUser ? a.signUser.name : '') + "</td>" +
                "<td >" + "委托时间" + "</td>" +
                "<td colspan='4'>" + (a.signDate) + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + "化验人" + "</td>" +
                "<td>" + (a.testUser ? a.testUser.name : '') + "</td>" +
                "<td>" + "化验时间" + "</td>" +
                "<td colspan='4'>" + (a.testDate) + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + "操作人" + "</td>" +
                "<td>" + (a.operationUser ? a.operationUser.name : '') + "</td>" +
                "<td>" + "操作时间" + "</td>" +
                "<td colspan='4'>" + (a.operationDate) + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + "时间" + "</td>" +
                "<td>" + (a.testDate) + "</td>" +
                "<td>" + "班次" + "</td>" +
                "<td colspan='4'>" + (a.clazz ? a.clazz.name :  '') + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + "原矿处理量" + "</td>" +
                "<td>" + (a.mineDeal) + "</td>" +
                "<td>" + "比例系数" + "</td>" +
                "<td colspan='4'>" + (a.coEfficientCode) + "</td>" +
                "</tr>" +
                "</table>" +
                "</tr>"
            )
        }
        /** 下拉框*/
        ,renderHandler3 : function($selector, users) {    
            $selector.empty() ;
            $selector.append(
                "<option value= '-1'>"+ "所有" + "</option>"
            )
            users.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }




     }
}