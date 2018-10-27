var reportRecord = {
    init : function(){
        reportRecord.funcs.renderTable();
        var out = $("#report_page").width();
        var time = setTimeout(function(){
             var inside = $(".layui-laypage").width();
             $('#report_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
             clearTimeout(time);
        }, 30);
    }
     /**当前总记录数，用户控制全选逻辑 */
     ,pageSize: 0
    ,funcs : {
        renderTable : function(){
            $.get(home.urls.reportRecordManagement.getAll(),{},function(result){
                var reports = result.data.content
                console.log(reports)
                const $tbody = $("#reportTable").children("tbody")
                reportRecord.funcs.renderHandler(reports,$tbody);
                reportRecord.pageSize = result.data.length;
                var page = result.data.content;
                layui.laypage.render({
                    elem: "report_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.reportRecordManagement.getAll(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                const $tbody = $("#reportTable").children("tbody");
                                reportRecord.funcs.renderHandler($tbody, reports);
                                reportRecord.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            reportRecord.funcs.bindAddReportRecordEvent($("#addButton"));
            /**绑定查询事件 */
            reportRecord.funcs.bindSearchReportRecordEvent($("#searchButton"));
        }
        /**渲染报表 */
        ,renderHandler : function(reports,$tbody){
            $tbody.empty();
            reports.forEach(function(e) {
                var date = e.yearMonth;
                date = date + ""
                var y = date.substr(0,4)
                var m = date.substr(4)
                var d = y + "-" + m;
                $tbody.append(
                    "<tr>" +
                    "<td>" + (d) + "</td>" +
                    "<td>" + (e.wszydl ? e.wszydl : '') + "</td>" +
                    "<td>" + (e.tkl ? e.tkl : '') + "</td>" +
                    "<td>" + (e.bysl ? e.bysl : '') + "</td>" +
                    "<td>" + (e.skys ? e.skys : '') + "</td>" +
                    "<td>" + (e.mfys ? e.mfys : '') + "</td>" +
                    "<td>" + (e.jkys? e.jkys : '') + "</td>" +
                    "<td>" + (e.wsys ? e.wsys : '') + "</td>" +
                    "<td>" + (e.byzm ? e.byzm : '') + "</td>" +
                    "<td>" + (e.bycy ? e.bycy : '') + "</td>" +
                    "<td>" + (e.byqy ? e.byqy : '') + "</td>" +
                    "<td>" + (e.adder ? e.adder.name : '') + "</td>" +
                    "<td>" + (e.addTime ? e.addTime : '') + "</td>" +
                    "<td>" + (e.editor ? e.editor.name : '') + "</td>" +
                    "<td>" + (e.editTime ? e.editTime : '') + "</td>" +
                    "<td><a href='#' class='update' id='update-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            });
            /**绑定编辑报表事件 */
            reportRecord.funcs.bindEditReportRecordEvent($(".update"));
        }
        /**新增报表记录 */
        ,bindAddReportRecordEvent : function(buttons){
            buttons.off('click').on('click',function(){
                $("#addRecordModal").removeClass("hidePage");
                layer.open({
                    type: 1,
                    title: '新增报表参数',
                    content: $("#addRecordModal"),
                    area: ['650px', '330px'],
                    btn: ['确定', '取消'],
                    offset: "auto",
                    yes: function(index){
                        /**收集手动输入数据 */
                        var d = $("#addTime").val();
                            d = d.substr(0,4) + d.substr(5,7)
                        var date = parseInt(d);
                        console.log(date)
                        var wszydl = $("#addWszyd").val();
                        var tkl = $("#addTkl").val();
                        var bysl = $("#addBykl").val();
                        var skys = $("#addSkys").val();
                        var mfys = $("#addMfys").val();
                        var jkys = $("#addJkys").val();
                        var wsys = $("#addWsys").val();
                        var byzm = $("#addByzm").val();
                        var bycy = $('#addBycy').val();
                        var byqy = $("#addByqy").val();
                        $.post(home.urls.reportRecordManagement.add() ,{ 
                           "adder.id" : home.user.id,
                           "yearMonth" : date,
                           "wszydl" : wszydl,
                           "tkl" : tkl,
                           "bysl" : bysl,
                           "skys" : skys,
                           "mfys" : mfys,
                           "jkys" : jkys,
                           "wsys" : wsys,
                           "byzm" : byzm,
                           "bycy" : bycy,
                           "byqy" : byqy
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    reportRecord.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#addRecordModal").css("display","none");
                        layer.close(index);
                    },
                    closeBtn : 0,
                    btn2 : function(index) {
                        $("#addRecordModal").css("display","none");
                        layer.close(index);
                    }  
                })
            })
        }
        /**根据日期查询报表 */
        ,bindSearchReportRecordEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var startDate = $("#startTime").val();
                startDate = startDate.substr(0,4) + d.substr(5,7)
                var date1 = parseInt(startDate);
                var endDate = $("#endTime").val();
                endDate = endDate.substr(0,4) + d.substr(5,7)
                var date2 = parseInt(d);
                $.get(home.urls.reportRecordManagement.getByYearMonth(),{
                    startDate: date1,
                    endDate : date2
                },function(result){
                    var reports = result.data.content
                    const $tbody = $("#reportTable").children("tbody")
                    reportRecord.funcs.renderHandler(reports,$tbody);
                    energySection.pageSize = result.data.length;
                    var page = result.data.content;
                    layui.laypage.render({
                        elem: "report_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.reportRecordManagement.getAll(),{
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    const $tbody = $("#reportTable").children("tbody");
                                    reportRecord.funcs.renderHandler1($tbody, reports);
                                    reportRecord.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**编辑报表 */
        ,bindEditReportRecordEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr("id").substr(7)
                $.get(home.urls.reportRecordManagement.getById(),{id : id},function(result){
                    var report = result.data
                    var adderId = report.adder.id
                    var date = report.yearMonth;
                    date = date + ""
                    var y = date.substr(0,4)
                    var m = date.substr(4)
                    var d = y + "-" + m;
                    $("#updateTime").val(d);
                    $("#updateWszyd").val(report.wszydl);
                    $("#updateTkl").val(report.tkl);
                    $("#updateBysl").val(report.bysl);
                    $("#updateSkys").val(report.skys);
                    $("#updateMfys").val(report.mfys);
                    $("#updateJkys").val(report.jkys);
                    $("#updateWsys").val(report.wsys);
                    $("#updateByzm").val(report.byzm);
                    $("#updateBycy").val(report.bycy);
                    $("#updateByqy").val(report.byqy);
                    $("#updateRecordModal").removeClass("hidePage");
                    layer.open({
                        type: 1,
                        title: '编辑报表参数',
                        content: $("#updateRecordModal"),
                        area: ['650px', '330px'],
                        btn: ['确定', '取消'],
                        offset: "auto",
                        yes: function(index){
                            /**获取数据 */
                            var wszydl = $("#updateWszyd").val();
                            var tkl = $("#updateTkl").val();
                            var bysl = $("#updateBysl").val();
                            var skys = $("#updateSkys").val();
                            var mfys = $("#updateMfys").val();
                            var jkys = $("#updateJkys").val();
                            var wsys = $("#updateWsys").val();
                            var byzm = $("#updateByzm").val();
                            var bycy = $('#updateBycy').val();
                            var byqy = $("#updateByqy").val();
                            $.post(home.urls.reportRecordManagement.update() ,{
                                "id" : id,
                                "adder.id" : adderId,
                                "editor.id" : home.user.id,
                                "yearMonth" : date,
                                "wszydl" : wszydl,
                                "tkl" : tkl,
                                "bysl" : bysl,
                                "skys" : skys,
                                "mfys" : mfys,
                                "jkys" : jkys,
                                "wsys" : wsys,
                                "byzm" : byzm,
                                "bycy" : bycy,
                                "byqy" : byqy
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        reportRecord.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#updateRecordModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#updateRecordModal").css("display","none");
                            layer.close(index);
                        }
                        
                    })
                })
            })
        }



    }
}