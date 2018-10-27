var energySection = {
    init : function(){
        energySection.funcs.renderTable();
        var out = $("#report_page1").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#report_page1").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
       }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        renderTable : function(){
            $.get(home.urls.sectionWaterAndElec.getAll(),{sortFieldName : "yearMonth", asc : 1},function(result){
                var reports = result.data.content
                const $tbody = $("#reportTable").children("tbody");
                energySection.funcs.renderHandler1($tbody,reports);
                energySection.pageSize = result.data.length;
                var page = result.data.content;
                /**分页信息 */
                layui.laypage.render({
                    elem: "report_page1",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.sectionWaterAndElec.getAll(),{
                                sortFieldName : "yearMonth", 
                                asc : 1,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                const $tbody = $("#reportTable").children("tbody");
                                energySection.funcs.renderHandler1($tbody, reports);
                                energySection.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定查询事件 */
            energySection.funcs.bindSearchEvent($("#searchButton"));
            /**绑定生成报表事件 */
            energySection.funcs.bindExpertMonthReport($("#expertButton1"));
        }
        /**查询事件 */
        ,bindSearchEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var startDate = $("#startTime").val();
                var startDate1 = startDate.substr(0,4) + startDate.substr(5,6)
                startDate1 = parseInt(startDate1)
                var endDate = $("#endTime").val();
                var endDate1 = endDate.substr(0,4) + endDate.substr(5,6)
                endDate1 = parseInt(endDate1)
                $.get(home.urls.sectionWaterAndElec.getByYearMonth(),{
                    sortFieldName : "yearMonth", 
                    asc : 1,
                    startDate : startDate1,
                    endDate : endDate1
                },function(result){
                    if (result.data == null){
                        alert("该时间段内没有数据！")
                        return;
                    }
                    var reports = result.data.content
                    const $tbody = $("#reportTable").children("tbody");
                    energySection.funcs.renderHandler1($tbody,reports);
                    energySection.pageSize = result.data.length;
                    var page = result.data.content;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "report_page1",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.sectionWaterAndElec.getByYearMonth(),{
                                    sortFieldName : "yearMonth", 
                                    asc : 1,
                                    startDate : startDate,
                                    endDate : endDate,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    const $tbody = $("#reportTable").children("tbody");
                                    energySection.funcs.renderHandler1($tbody, reports);
                                    energySection.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**渲染报表 */
        ,renderHandler1 : function($tbody,reports){
            $tbody.empty();
            reports.forEach(function(e){
                var date = e.yearMonth;
                date = date + ""
                var y = date.substr(0,4)
                var m = date.substr(4)
                var d = y + "-" + m;
                $.get(home.urls.sectionWaterAndElec.reproduceReport(),{id : e.id},function(result){
                    var able = result.code
                    if(able === 1){
                        $tbody.append(
                            "<tr>" +
                            "<td>" + (d) + "</td>" +
                            "<td>" + (e.timeInterval) + "</td>" +
                            "<td>" + (e.reportType ? e.reportType : ' ') + "</td>" +
                            "<td>" + (e.creator ? e.creator.name : ' ') + "</td>" +
                            "<td>" + (e.createTime) + "</td>" +
                            "<td>" + 
                            "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看报表</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                            "<a href='#' class='reExpert' id='expert-" + (e.id) + "'>重新生成</a>" + "</td>" +
                            "</tr>"
                        )
                    } else{
                        $tbody.append(
                            "<tr>" +
                            "<td>" + (d) + "</td>" +
                            "<td>" + (e.timeInterval) + "</td>" +
                            "<td>" + (e.reportType ? e.reportType : ' ') + "</td>" +
                            "<td>" + (e.creator ? e.creator.name : ' ') + "</td>" +
                            "<td>" + (e.createTime) + "</td>" +
                            "<td>" + 
                            "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看报表</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                            "<a style='color: gray' id='expert-" + (e.id) + "'>重新生成</a>" + "</td>" +
                            "</tr>"
                        )
                    }
                    /**转到详情表 */
                    energySection.funcs.bindChangeToDetail($(".detail"));
                    /**绑定重新生成报表事件 */
                    energySection.funcs.bindReprodecuReport($(".reproduce"));
                })   
            })    
        }
        /**转到详情表 */
        ,bindChangeToDetail : function(buttons){
            buttons.off('click').on('click',function(){
                $("#block1").addClass("hidePage");
                $("#block2").removeClass("hidePage");
                var id = $(this).attr("id").substr(7)
                energySection.funcs.renderDetailTable(id);
            })
        }
        /**重新生成报表 */
        ,bindReprodecuReport : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(7);
                $.get(home.urls.sectionWaterAndElec.getById(),{id : id},function(result){
                    var date = result.data.yearMonth;
                    date = date + ""
                    var y = date.substr(0,4)
                    var m = date.substr(4)
                    var d = y + "-" + m;
                    layer.open({
                        type: 1,
                        title: '报表生成',
                        content : "&nbsp;&nbsp;&nbsp;确定要重新生成报表吗 ？",
                        area : ['300px', '120px'],
                        btn: ['确定','取消'],
                        offset: "auto",
                        closeBtn : 0,
                        yes: function(index){
                            $.post(home.urls.sectionWaterAndElec.produceReport(),{
                                yearMonth : d
                            },function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        energySection.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                        layer.close(index);
                        },
                        btn2 : function(index) {
                            layer.close(index);
                        }  
                    })
                }) 
            })
        }
        /**月报表详情 */
        ,renderDetailTable : function(id) {
            $.get(home.urls.sectionWaterAndElec.getById(),{id : id},function(result){
                var detail = result.data;
                var data = result.data;
                if(detail.toString() === ""){
                    layer.msg("很抱歉，该月没有报表数据 ！")
                    return
                } else{
                $("#skyd").val(data.skyd);
                $("#skydlj").val(data.skydlj);
                $("#skydbz").val(data.skydbz ? data.skydbz : '');
                $("#skys").val(data.skys);
                $("#skyslj").val(data.skyslj);
                $("#skysbz").val(data.skysbz ? data.skysbz : '');
                $("#mfyd").val(data.mfyd);
                $("#mfydlj").val(data.mfydlj);
                $("#mfydbz").val(data.mfydbz ? data.mfydbz : '');
                $("#mfys").val(data.mfys);
                $("#mfyslj").val(data.mfyslj);
                $("#mfysbz").val(data.mfysbz ? data.mfysbz : '');
                $("#jkyd").val(data.jkyd);
                $("#jkydlj").val(data.jkydlj);
                $("#jkydbz").val(data.jkydbz ? data.jkydbz : '');
                $("#jkys").val(data.jkys);
                $("#jkyslj").val(data.jkyslj);
                $("#jkysbz").val(data.jkysbz ? data.jkysbz : '');
                $("#wsyd").val(data.wsyd);
                $("#wsydlj").val(data.wsydlj);
                $("#wsydbz").val(data.wsydbz ? data.wsydbz : '');
                $("#wsys").val(data.wsys);
                $("#wsyslj").val(data.wsyslj);
                $("#wsysbz").val(data.wsysbz ? data.wsysbz : '');
                $("#wszyd").val(data.wszyd);
                $("#wszydlj").val(data.wszydlj);
                $("#wszydbz").val(data.wszydbz ? data.wszydbz : '');
                $("#hjyd").val(data.hjyd);
                $("#hjydlj").val(data.hjydlj);
                $("#hjydbz").val(data.hjydbz ? data.hjydbz : '');
                $("#hjys").val(data.hjys);
                $("#hjyslj").val(data.hjyslj);
                $("#hjysbz").val(data.hjysbz ? data.hjysbz : '');
                }
            })
            /**绑定导出事件 */
            energySection.funcs.bindExpertReportEvent($("#expertButton2"),id);
        }
        /**导出详情表*/
        ,bindExpertReportEvent : function(buttons,id){
            buttons.off('click').on('click',function(){
                $.get(home.urls.sectionWaterAndElec.getById(),{id : id},function(result){
                    var date = result.data.yearMonth
                    var url = home.urls.sectionWaterAndElec.exportByDate() + "?startDate=" + date + "&endDate=" + date
                    console.log(url)
                    $("#download-id1").attr("href",url);
                })
            })
        }
         /**生成报表 */
        ,bindExpertMonthReport : function(buttons) {
            buttons.off('click').on('click',function(){
                $("#produceMonthReportModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '新增月报',
                        content: $("#produceMonthReportModal"),
                        area: ['300px', '150px'],
                        btn: ['生成报表', '取消'],
                        offset: "30%",
                        yes: function(index){
                            /**收集数据 */
                            var month = $("#produceMonthTime").val();
                            console.log(month)
                            month = month.substr(0,4) + month.substr(5,7)
                            var date = parseInt(month)
                            console.log(date)
                            $.post(home.urls.sectionWaterAndElec.produceReport() ,{ 
                                yearMonth : month
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        energySection.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#produceMonthReportModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#produceMonthReportModal").css("display","none");
                            layer.close(index);
                        }  
                    })
            })
        }



    }
}