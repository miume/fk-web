var assayManage = {
    init : function(){
        assayManage.funcs.renderTable();
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
            var sys = $("#system").val();
            var type = $("#type").val();
            var orderCode = $("#number").val();
            $.get(home.urls.delegation.getAssayManage(),{
                sendToCheckId : sys,
                delegationId : type,
                orderCode : orderCode
            },function(result){
                var reports = result.data.content;
                if(reports == null){
                    return;
                }
                const $tbody = $("#reportTable").children("tbody");
                assayManage.funcs.renderHandler1($tbody,reports,0);
                assayManage.pageSize = result.data.length;
                var page = result.data.content;
                /**分页信息 */
                layui.laypage.render({
                    elem: "report_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.delegation.getByFour(),{
                                sendToCheckId : sys,
                                delegationId : type,
                                orderCode : orderCode,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                const $tbody = $("#reportTable").children("tbody");
                                assayManage.funcs.renderHandler1($tbody, reports,page);
                                assayManage.pageSize = result.data.length;
                            })
                        }
                    }
                })

            })
            /** 绑定查询事件*/
            assayManage.funcs.bindSearchReportEvent($("#searchButton"));
            /** 绑定导出事件*/
            assayManage.funcs.bindExpertReportEvent($("#expertButton1"));
        }
        /**查询事件 */
        ,bindSearchReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var sys = $("#system").val();
                var type = $("#type").val();
                var orderCode = $("#number").val();
                $.get(home.urls.delegation.getAssayManage(),{
                    sendToCheckId : sys,
                    delegationId : type,
                    orderCode : orderCode
                },function(result){
                    var reports = result.data.content;
                    if(reports == null){
                        return;
                    }
                    const $tbody = $("#reportTable").children("tbody");
                    assayManage.funcs.renderHandler1($tbody,reports,0);
                    assayManage.pageSize = result.data.length;
                    var page = result.data.content;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "report_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.delegation.getByFour(),{
                                    sendToCheckId : sys,
                                    delegationId : type,
                                    orderCode : orderCode,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    const $tbody = $("#reportTable").children("tbody");
                                    assayManage.funcs.renderHandler1($tbody, reports,page);
                                    assayManage.pageSize = result.data.length;
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
                var sys = $("#system").val();
                var type = $("#type").val();
                var orderCode = $("#number").val();
                var url = home.urls.delegation.download2() + "?sendToCheckId=" + sys + "&delegationId=" + type + "&orderCode=" + orderCode;
               $("#download-id1").attr("href",url);
            })
        }
        /**渲染表格 */
        ,renderHandler1: function($tbody,reports,page){
            $tbody.empty();
            var i = page * 10 + 1;
            reports.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.orderCode) + "</td>" +
                    "<td>" + (e.delegationInfo ? e.delegationInfo.name : '') + "</td>" +
                    "<td>" + (e.testMethodInfo ? e.testMethodInfo.name : '') + "</td>" +
                    "<td>" + (e.operationDate) + "</td>" +
                    "<td>" + (e.clazz ? e.clazz.name : '') + "</td>" +
                    "<td>" + (e.sendToCheckInfo ? e.sendToCheckInfo.name : '') + "</td>" +
                    "<td>" + (e.signUser ? e.signUser.name : '') + "</td>" +
                    "<td>" + (e.signDate) + "</td>" +
                    "<td>" + 
                    "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看委托单</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                    "<a href='#' class='update' id='update-" + (e.id) + "'>录入化验结果</a>" + "</td>" +
                    "</tr>"
                )
                /**绑定月报表及详情表切换事件 */
                assayManage.funcs.bindPageSwitch($(".detail"));
                /**绑定录入事件 */
                assayManage.funcs.bindEntryEvent($(".update"));
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
                    assayManage.funcs.renderHandler2($tbody,details);
                }) 
                /**绑定导出事件 */
                assayManage.funcs.bindExpertReportEvent2($("#expertButton2"),id);
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
            var i = 0;
            a.delegationOrderDetailFlags.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.sampleManageInfo ? e.sampleManageInfo.name : '') + "</td>" +
                    "<td>" + (e.sampleManageInfo ? e.sampleManageInfo.sampleCode : '') + "</td>" +
                    "<td>" + (e.pbFlag ? e.pbFlag : '') + "</td>" +
                    "<td>" + (e.znFlag ? e.znFlag : '') + "</td>" +
                    "<td>" + (e.sflag ? e.sflag : '') + "</td>" +
                    "<td>" + (e.feFlag ? e.feFlag : '') + "</td>" +
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
        /**录入事件 */
        ,bindEntryEvent : function(buttons){
            buttons.off('click').on('click',function(){
                $("#block1").addClass("hidePage");
                $("#block3").removeClass("hidePage");
                var id = $(this).attr('id').substr(7);   
                $.get(home.urls.delegation.getById(),{
                    id : id
                },function(result){
                    var details = result.data;
                    const $tbody = $("#editTable").children("tbody");
                    assayManage.funcs.renderHandler3($tbody,details);
                }) 
                assayManage.funcs.bindUpdateEvent($("#submitButton"),id);
          })
        }
        /**提交委托单 */
        ,bindUpdateEvent : function(buttons,id){
            buttons.off('click').on('click',function(){
                $.get(home.urls.delegation.getById(),{
                    id : id
                },function(result){
                    var details = result.data;
                    var delegationId = details.delegationInfo.id;
                    var testUser = (details.testUser ? testUser.id : '');

                    var header = {
                        "id": id,
                        "delegationInfo": {
                          "id": delegationId
                        },
                        "delegationOrderDetails": [
                          {
                            "fe": 0.1,
                            "id": 0.2,
                            "pb": 0.3,
                            "sampleManageInfo": {
                              "id": 2
                            },
                            "sampleName": "原矿",
                            "sf": 3.4,
                            "zn": 3.5
                          },
                          {
                            "fe": 0.1,
                            "id": 0.2,
                            "pb": 0.3,
                            "sampleManageInfo": {
                              "id": 3
                            },
                            "sampleName": "铅精",
                            "sf": 3.4,
                            "zn": 3.5
                          }
                        ],
                        "testUser": {
                          "id": testUser
                        }
                      }
                    $.post(home.urls.delegation.update(),{
                        delegationOrderHeader : header
                    },function(result){
                        if (result.code === 0) {
                            var time = setTimeout(function () {
                                plan.init();
                                clearTimeout(time)
                            }, 500)
                        }
                        layer.msg(result.message, {
                            offset: ['40%', '55%'],
                            time: 700
                        })
                    })
                }) 
                
            })
        }
        /**渲染详情表 */
        ,renderHandler3 : function($tbody,a){
            $tbody.empty();
            var i = 0;
            a.delegationOrderDetailFlags.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.sampleManageInfo ? e.sampleManageInfo.name : '') + "</td>" +
                    "<td>" + (e.sampleManageInfo ? e.sampleManageInfo.sampleCode : '') + "</td>" +
                    "<td>" + (e.pbFlag ? e.pbFlag : '') + "</td>" +
                    "<td>" + (e.znFlag ? e.znFlag : '') + "</td>" +
                    "<td>" + (e.sflag ? e.sflag : '') + "</td>" +
                    "<td>" + (e.feFlag ? e.feFlag : '') + "</td>" +
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

     }
}