var crushing = {
    init : function () {
         /**日报分页显示 */
         crushing.funcs.renderDayTable();
         var out = $("#day_page").width();
         var time = setTimeout(function(){
             var inside = $(".layui-laypage").width();
             $('#day_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
             clearTimeout(time);
         }, 30);
         /**月报显示 */
        crushing.funcs.renderMonthTable();
        setInterval(function(){
            crushing.funcs.renderMonthTable();
        },10000);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        renderDayTable : function(){
            var month = $("#monthTime").val();
            //console.log(month);
            $.post(home.urls.dayreport.getByDate(),{date : month},function(result){
                var reports = result.data;
                const $tbody = $("#dayReportTable").children("tbody");
                crushing.funcs.renderHandler1($tbody,reports,month);
                crushing.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "day_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.post(home.urls.dayreport.getByDate(),{
                                date : month,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data;
                                const $tbody = $("#dayReportTable").children("tbody");
                                crushing.funcs.renderHandler1($tbody, reports, month);
                                crushing.pageSize = result.data.length;
                            })
                        }
                    }
                })

            })
            /** 绑定添加日报事件*/
            crushing.funcs.bindAddDayReportEvent($("#addButton"));
            /** 绑定导出日报事件*/
            crushing.funcs.bindExpertDayReportEvent($("#expertButton1"));
            /** 绑定根据日期重新生成日报事件*/
           // crushing.funcs.bindProduceReport()
        }
        /**新增事件 */
        ,bindAddDayReportEvent : function(buttons) {
            buttons.off('click').on('click',function(){
                $("#addDayModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '新增日报',
                        content: $("#addDayModal"),
                        area: ['800px', '350px'],
                        btn: ['确定', '取消'],
                        offset: "auto",
                        yes: function(index){
                            /**收集手动输入数据 */
                            var adder = home.user.id
                            var date = $("#dayTime").val();
                            if(date === ""){
                                layer.msg("日期不能为空 ！")
                                return 
                            }
                            var crushingRunningTime = $("#dayRunTime").val();
                            if(isNaN(crushingRunningTime)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(crushingRunningTime === ""){
                                crushingRunningTime = 0;
                            }
                            var crushingCauseTime = $("#dayStopTime").val();
                            if(isNaN(crushingCauseTime)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(crushingCauseTime === ""){
                                crushingCauseTime = 0;
                            }
                            var zj = $("#dayWeekCheck").val();
                            if(isNaN(zj)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(zj === ""){
                                zj = 0;
                            }
                            var ck = $("#dayChanKuang").val();
                            if(isNaN(ck)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(ck === ""){
                                ck = 0;
                            }
                            var dp = $("#dayDiaoPeng").val();
                            if(isNaN(dp)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(dp === ""){
                                dp = 0;
                            }
                            var bl = $("#dayBiLei").val();
                            if(isNaN(bl)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(bl === ""){
                                bl = 0;
                            }
                            var ek = $("#dayEkuang").val();
                            if(isNaN(ek)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(ek === ""){
                                ek = 0;
                            }
                            var ddx = $("#dayDiaoDouXiang").val();
                            if(isNaN(ddx)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(ddx === ""){
                                ddx = 0;
                            }
                            var kcm = $("#dayKuangCangMan").val();
                            if(isNaN(kcm)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(kcm === ""){
                                kcm = 0;
                            }
                            var remark = $("#dayRemark").val();
                            /**收集系统计算数据 */
                         //   var ropeWayRunningTime
                         //   var ropeWayCauseTime
                        //    var ropeWayJxgz
                        //    var ropeWayDqgz
                        //    var ropeWayZj 
                        //    var ropeWayWk
                        //    var ropeWayJd
                        //    var ropeWayDp
                        //    var ropeWayWs
                        //    var ropeWayQt
                            
                            $.post(home.urls.dayreport.add() ,{ 
                                "adder.id" : adder,
                                produceDate : date,
                                crushingRunningTime :  crushingRunningTime,
                                crushingCauseTime : crushingCauseTime,
                                zj : zj,
                                ck : ck,
                                dp : dp,
                                bl : bl,
                                ek : ek,
                                ddx : ddx,
                                kcm : kcm,
                                remarks : remark,
                            //    ropeWayRunningTime : ropeWayRunningTime,
                           //     ropeWayCauseTime : ropeWayCauseTime,
                            //    ropeWayJxgz : ropeWayJxgz,
                            //    ropeWayDqgz : ropeWayDqgz,
                            //    ropeWayZj : ropeWayZj,
                            //    ropeWayWk : ropeWayWk,
                            //    ropeWayJd : ropeWayJd,
                            //    ropeWayDp : ropeWayDp,
                            //    ropeWayWs : ropeWayWs,
                            //    ropeWayQt : ropeWayQt
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        crushing.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#addDayModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#addDayModal").css("display","none");
                            layer.close(index);
                        }  
                    })
            })
        }
        /**导出事件 */   
        ,bindExpertDayReportEvent : function(buttons) {
            buttons.off('click').on('click',function(){
                var time = $("#monthTime").val();
                var url = home.urls.dayreport.download() + "?date=" + time;
                $("#download-id").attr("href",url);
            })
        }
        /**查询事件 日期改变时触发 */
        ,bindProduceReport : function(value) {
            $.post(home.urls.dayreport.getByDate(),{date : value},function(result){
                var reports = result.data;
                const $tbody = $("#dayReportTable").children("tbody");
                crushing.funcs.renderHandler1($tbody,reports,value);
                crushing.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "day_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.post(home.urls.dayreport.getByDate(),{
                                date : value,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data;
                            //    var page = obj.curr - 1;
                                const $tbody = $("#dayReportTable").children("tbody");
                                crushing.funcs.renderHandler1($tbody, reports, value);
                                crushing.pageSize = result.data.length;
                            })
                        }
                    }
                })

            })
        }
       
        
        ,renderHandler1 : function($tbody,reports,month){
            function numberOfMonth(month){
                var y = month.substr(0,4)
                var m = month.substr(5)
                var a = ((new Date(y, m, 0).getDate()));
                return a;
            }
            function getMonthDay(month,i){
                var y = month.substr(0,4)
                var m = month.substr(5)
                var a = new Date(y, m, i);
                var b = a.getFullYear();
                var c = a.getMonth();
                var d = a.getDate();
                if(c < 10){
                    c = "0" + c;
                }
                if(d < 10){
                    d = "0" + d;
                }
                var e = b + "-" + c + "-" + d ;
                return e;
            }
            $tbody.empty();
            for(var i = 1; i <= numberOfMonth(month); i ++){
                var flag = 0
                for( var j = 0; j < reports .numberOfElements; j++){
                    if(reports.content[j].produceDate === getMonthDay(month,i)){
                        flag = 1;
                    }
                    if(flag){
                        $tbody.append(
                            "<tr>" +
                            "<td>" + (getMonthDay(month,i)) + "</td>" +
                            "<td>" + (reports.content[j].crushingRunningTime ? reports.content[j].crushingRunningTime : ' ') + "</td>" +
                            "<td>" + (reports.content[j].crushingCauseTime ? reports.content[j].crushingCauseTime : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayRunningTime ? reports.content[j].ropeWayRunningTime : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayCauseTime ? reports.content[j].ropeWayCauseTime : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayJxgz ? reports.content[j].ropeWayJxgz : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayDqgz ? reports.content[j].ropeWayDqgz : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayZj ? reports.content[j].ropeWayZj : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayWk ? reports.content[j].ropeWayWk : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayJd ? reports.content[j].ropeWayJd : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayDp ? reports.content[j].ropeWayDp : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayWs ? reports.content[j].ropeWayWs : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ropeWayQt ? reports.content[j].ropeWayQt : ' ') + "</td>" +
                            "<td>" + (reports.content[j].zj ? reports.content[j].zj : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ck ? reports.content[j].ck : ' ') + "</td>" +
                            "<td>" + (reports.content[j].dp ? reports.content[j].dp : ' ') + "</td>" +
                            "<td>" + (reports.content[j].bl ? reports.content[j].bl : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ek ? reports.content[j].ek : ' ') + "</td>" +
                            "<td>" + (reports.content[j].ddx ? reports.content[j].ddx : ' ') + "</td>" +
                            "<td>" + (reports.content[j].kcm ? reports.content[j].kcm : ' ') + "</td>" +
                            "<td>" + (reports.content[j].remarks ? reports.content[j].remarks : ' ') + "</td>" +
                            "<td><a href='#' class='editday' id='edit-"+(reports.content[j].id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                            "</tr>"
                        )
                        flag = 0
                    } 
                }
            }
            /**绑定编辑日报事件 */
            crushing.funcs.bindEditDayReport($(".editday"));
        }

        /**编辑日报 */
        ,bindEditDayReport : function(buttons) {
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(5)
                // console.log(id)
                $.get(home.urls.dayreport.getById(),{id : id},function(result){
                    var report = result.data
                    var ropeWayRunningTime = (report.ropeWayRunningTime ? report.ropeWayRunningTime : 0);                          
                    var ropeWayCauseTime = (report.ropeWayCauseTime ? report.ropeWayCauseTime : 0);                           
                    var ropeWayJxgz = (report.ropeWayJxgz ? report.ropeWayJxgz : 0);                           
                    var ropeWayDqgz = (report.ropeWayDqgz ? report.ropeWayDqgz : 0);                           
                    var ropeWayZj = (report.ropeWayZj ? report.ropeWayZj : 0);                           
                    var ropeWayWk = (report.ropeWayWk ? report.ropeWayWk : 0);                           
                    var ropeWayJd = (report.ropeWayJd ? report.ropeWayJd : 0);                           
                    var ropeWayDp = (report.ropeWayDp ? report.ropeWayDp : 0);                         
                    var ropeWayWs = (report.ropeWayWs ? report.ropeWayWs : 0);                          
                    var ropeWayQt = (report.ropeWayQt ? report.ropeWayQt : 0);

                    $("#dayTime1").val(report.produceDate);
                    $("#dayRunTime1").val(report.crushingRunningTime ? report.crushingRunningTime : ' ');
                    $("#dayStopTime1").val(report.crushingCauseTime ? report.crushingCauseTime : ' ');
                    $("#dayWeekCheck1").val(report.zj ? report.zj : ' ');
                    $("#dayChanKuang1").val(report.ck ? report.ck : ' ');
                    $("#dayDiaoPeng1").val(report.dp ? report.dp : ' ');
                    $("#dayBiLei1").val(report.bl ? report.bl : ' ');
                    $("#dayEkuang1").val(report.ek ? report.ek : ' ');
                    $("#dayDiaoDouXiang1").val(report.ddx ? report.ddx : ' ');
                    $("#dayKuangCangMan1").val(report.kcm ? report.kcm : ' ');
                    $("#dayRemark1").val(report.remarks ? report.remarks : ' ');
                    //const $td = $("#updateDay").children('tbody').children('tr').children('td');
                    //$td.eq[0].append(report.ropeWayRunningTime);
                    $("#ropeWayRunningTime").empty();
                    $("#ropeWayCauseTime").empty();
                    $("#ropeWayJxgz").empty();
                    $("#ropeWayDqgz").empty();
                    $("#ropeWayZj").empty();
                    $("#ropeWayWk").empty();
                    $("#ropeWayJd").empty();
                    $("#ropeWayDp").empty();
                    $("#ropeWayWs").empty();
                    $("#ropeWayQt").empty();
                    $("#ropeWayRunningTime").append(report.ropeWayRunningTime ? report.ropeWayRunningTime : ' ');
                    $("#ropeWayCauseTime").append(report.ropeWayCauseTime ? report.ropeWayCauseTime : ' ');
                    $("#ropeWayJxgz").append(report.ropeWayJxgz ? report.ropeWayJxgz : ' ');
                    $("#ropeWayDqgz").append(report.ropeWayDqgz ? report.ropeWayDqgz : ' ');
                    $("#ropeWayZj").append(report.ropeWayZj ? report.ropeWayZj : ' ');
                    $("#ropeWayWk").append(report.ropeWayWk ? report.ropeWayWk : ' ');
                    $("#ropeWayJd").append(report.ropeWayJd ? report.ropeWayJd : ' ');
                    $("#ropeWayDp").append(report.ropeWayDp ? report.ropeWayDp : ' ');
                    $("#ropeWayWs").append(report.ropeWayWs ? report.ropeWayWs : ' ');
                    $("#ropeWayQt").append(report.ropeWayQt ? report.ropeWayQt : ' ');

                    $("#updateDayModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑日报',
                        content: $("#updateDayModal"),
                        area: ['800px', '350px'],
                        btn: ['确定', '取消'],
                        offset: "auto",
                        yes: function(index){
                            /**收集手动输入数据 */
                            var adder = home.user.id
                            var date = $("#dayTime1").val();
                            var crushingRunningTime = $("#dayRunTime1").val();
                            if(isNaN(crushingRunningTime)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(crushingRunningTime === " "){
                                crushingRunningTime = 0;
                            }
                            var crushingCauseTime = $("#dayStopTime1").val();
                            if(isNaN(crushingCauseTime)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(crushingCauseTime === " "){
                                crushingCauseTime = 0;
                            }
                            var zj = $("#dayWeekCheck1").val();
                            if(isNaN(zj)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(zj === " "){
                                zj = 0;
                            }
                            var ck = $("#dayChanKuang1").val();
                            if(isNaN(ck)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(ck === " "){
                                ck = 0;
                            }
                            var dp = $("#dayDiaoPeng1").val();
                            if(isNaN(dp)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(dp === " "){
                                dp = 0;
                            }
                            var bl = $("#dayBiLei1").val();
                            if(isNaN(bl)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(bl === " "){
                                bl = 0;
                            }
                            var ek = $("#dayEkuang1").val();
                            if(isNaN(ek)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(ek === " "){
                                ek = 0;
                            }
                            var ddx = $("#dayDiaoDouXiang1").val();
                            if(isNaN(ddx)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(ddx === " "){
                                ddx = 0;
                            }
                            var kcm = $("#dayKuangCangMan1").val();
                            if(isNaN(kcm)){
                                layer.msg("此处应该填数字")
                                return 
                            }
                            if(kcm === " "){
                                kcm = 0;
                            }
                            var remark = $("#dayRemark1").val();
                            $.post(home.urls.dayreport.update() ,{ 
                                id : id,
                                "adder.id" : adder,
                                produceDate : date,
                                crushingRunningTime :  crushingRunningTime,
                                crushingCauseTime : crushingCauseTime,
                                zj : zj,
                                ck : ck,
                                dp : dp,
                                bl : bl,
                                ek : ek,
                                ddx : ddx,
                                kcm : kcm,
                                remarks : remark,
                                ropeWayRunningTime : ropeWayRunningTime,
                                ropeWayCauseTime : ropeWayCauseTime,
                                ropeWayJxgz : ropeWayJxgz,
                                ropeWayDqgz : ropeWayDqgz,
                                ropeWayZj : ropeWayZj,
                                ropeWayWk : ropeWayWk,
                                ropeWayJd : ropeWayJd,
                                ropeWayDp : ropeWayDp,
                                ropeWayWs : ropeWayWs,
                                ropeWayQt : ropeWayQt
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        crushing.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#updateDayModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#updateDayModal").css("display","none");
                            layer.close(index);
                        }  
                    })
                })
                

            })
        }
        
        /**月报表 */
        ,renderMonthTable : function(){
            var date = new Date();
            var year = date.getFullYear();
            $.get(home.urls.monthreport.getAll(),{year : year},function(result) {
                var reports = result.data;
                const $tbody = $("#monthReportTable").children("tbody");
                crushing.funcs.renderHandler2($tbody,reports);
            })
            /**根据日期查询已生成的报表 */
            crushing.funcs.bindSearchReportEvent($("#searchButton"));
            /**绑定生成报表事件 */
            crushing.funcs.bindExpertMonthReport($("#expertButton2"));
        }
        /**根据选定的日期查询已生成的报表 */
        ,bindSearchReportEvent : function(buttons) {
            buttons.off('click').on('click',function(){
                var startDate = $("#startTime").val();
                var endDate = $("#endTime").val();
                if((startDate === "")||(endDate === "")){
                    layer.msg("日期不能为空 ！")
                    return
                }
                $.get(home.urls.monthreport.getByDate(),{
                    startDate : startDate,
                    endDate : endDate
                },function(result){
                    var reports = result.data;
                    const $tbody = $("#monthReportTable").children("tbody");
                    crushing.funcs.renderHandler2($tbody,reports);
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
                            $.get(home.urls.monthreport.generateByYearMonth() ,{ 
                                date : month
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        crushing.init();
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
        /**渲染月报表 */
        ,renderHandler2 :function($tbody,reports){
            $tbody.empty();
            reports.forEach(function(e){
                var date = e.yearMonth;
                date = date + ""
                var y = date.substr(0,4)
                var m = date.substr(4)
                var d = y + "-" + m;
                $.get(home.urls.monthreport.able(),{id : e.id},function(result){
                    var able = result.code;
                    console.log(able)
                    if(able === 0){
                        $tbody.append(
                            "<tr>" +
                            "<td>" + (d) + "</td>" +
                            "<td>" + (e.temporalInterval) + "</td>" +
                            "<td>" + (e.counter ? e.counter : ' ') + "</td>" +
                            "<td>" + (e.maker ? e.maker : ' ') + "</td>" +
                            "<td>" + (e.produceDate) + "</td>" +
                            "<td>" + 
                            "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看报表</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                            "<a href='#' class='reExpert' id='expert-" + (e.id) + "'>重新生成</a>" + "</td>" +
                            "</tr>"
                        )
                    }else {
                        $tbody.append(
                            "<tr>" +
                            "<td>" + (d) + "</td>" +
                            "<td>" + (e.temporalInterval) + "</td>" +
                            "<td>" + (e.counter ? e.counter : ' ') + "</td>" +
                            "<td>" + (e.maker ? e.maker : ' ') + "</td>" +
                            "<td>" + (e.produceDate) + "</td>" +
                            "<td>" + 
                            "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看报表</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                            "<a style='color: gray' id='expert-" + (e.id) + "'>重新生成</a>" + "</td>" +
                            "</tr>"
                        )
                    }
                /**绑定月报表及详情表切换事件 */
                crushing.funcs.bindPageSwitch($(".detail"));
                /**绑定重新生成事件 */
                crushing.funcs.bindReproduce($(".reExpert"));
                })         
            })    
        }
        /**切换到详情表 */
      ,bindPageSwitch : function(buttons){
          buttons.off('click').on('click',function(){
                $("#monthTable").addClass("hidePage")
                $("#monthHead").addClass("hidePage")
                $("#detailTable").removeClass("hidePage")
                $("#monthHead1").removeClass("hidePage")
                var id = $(this).attr('id').substr(7)
                crushing.funcs.renderDetailTable(id);
            })
        }
        /**重新生成 */
        ,bindReproduce : function(buttons) {
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(7);
                $.get(home.urls.monthreport.getDetailById(),{id : id},function(result){
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
                            $.get(home.urls.monthreport.generateByYearMonth(),{
                                date : d
                            },function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        crushing.init();
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
            $.get(home.urls.monthreport.getDetailById(),{id : id},function(result){
                var detail = result.data.details;
                var data = result.data;
                if(detail.toString() === ""){
                    layer.msg("很抱歉，该月没有报表数据 ！")
                    return
                } else{
                    var date = result.data.yearMonth;
                    date = date + ""
                    var y = date.substr(0,4)
                    var m = date.substr(4)
                    var d = y + "-" + m;
                    $("#monthTime1").val(d);
                    const $tbody = $("#monthDetailTable").children("tbody");
                    crushing.funcs.renderHandler3($tbody,detail,data);
                }
            })
            /**绑定导出事件 */
            crushing.funcs.bindExpertReportEvent($("#expertButton3"));
        }
        /**导出事件 */
        ,bindExpertReportEvent : function(buttons) {
            buttons.off('click').on('click',function(){
                var date = $("#monthTime1").val();
                var y = date.substr(0,4)
                var m = date.substr(5)
                var d = y + "" + m
                var url = home.urls.monthreport.download() + "?yearMonth=" + d;
                $("#download-id1").attr("href",url);
            })
        }
        /**渲染月报详情表 */
        ,renderHandler3 : function($tbody, detail,data) {
            $tbody.empty();
            detail.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td>" + (e.produceDate ? e.produceDate : ' ') + "</td>" +
                    "<td>" + (e.crushingRunningTime ? e.crushingRunningTime  : ' ') + "</td>" +
                    "<td>" + (e.crushingCauseTime ? e.crushingCauseTime : ' ') + "</td>" +
                    "<td>" + (e.ropeWayRunningTime ? e.ropeWayRunningTime : ' ' ) + "</td>" +
                    "<td>" + (e.ropeWayCauseTime ? e.ropeWayCauseTime : ' ') + "</td>" +
                    "<td>" + (e.ropeWayJxgz ? e.ropeWayJxgz : ' ') + "</td>" +
                    "<td>" + (e.ropeWayDqgz ? e.ropeWayDqgz : ' ') + "</td>" +
                    "<td>" + (e.ropeWayZj ? e.ropeWayZj : ' ') + "</td>" +
                    "<td>" + (e.ropeWayWk ? e.ropeWayWk : ' ') + "</td>" +
                    "<td>" + (e.ropeWayJd ? e.ropeWayJd : ' ') + "</td>" +
                    "<td>" + (e.ropeWayDp ? e.ropeWayDp : ' ') + "</td>" +
                    "<td>" + (e.ropeWayWs ? e.ropeWayWs : ' ') + "</td>" +
                    "<td>" + (e.ropeWayQt ? e.ropeWayQt : ' ') + "</td>" +
                    "<td>" + (e.zj ? e.zj : ' ') + "</td>" +
                    "<td>" + (e.ck ? e.ck : ' ') + "</td>" +
                    "<td>" + (e.dp ? e.dp : ' ') + "</td>" +
                    "<td>" + (e.bl ? e.bl : ' ') + "</td>" +
                    "<td>" + (e.ek ? e.ek : ' ') + "</td>" +
                    "<td>" + (e.ddx ? e.ddx : ' ') + "</td>" +
                    "<td>" + (e.kcm ? e.kcm : ' ') + "</td>" +
                    "<td>" + (e.remarks ? e.remarks : ' ') + "</td>" +
                    "</tr>"
                )
            })
            $tbody.append(
                "<tr>" +
                "<td colspan='2'>" + "月度索道系统运矿能力" + "</td>" +
                "<td colspan='2'>" + (data.transport) + " (t/h)" + "</td>" +
                "<td colspan='2'>" + "月度碎矿系统破矿能力" + "</td>" +
                "<td colspan='3'>" + (data.crush) + " (t/h)" + "</td>" +
                "<td colspan='3'>" + "月度索道系统可开动率" + "</td>" +
                "<td colspan='3'>" + (data.runnable)*100 + "%" +"</td>" +
                "<td colspan='3'>" + "月度索道运转率" + "</td>" +
                "<td colspan='3'>" + (data.runningRate)*100 + "%" +"</td>" +
                "</tr>"
            )
            /**绑定编辑详情事件 */
            crushing.funcs.bindEditDetail($(".editDetail"));
        }
        /**编辑详情 */
        ,bindEditDetail : function(buttons) {
            buttons.off('click').on('click',function() {

            })
        }



    }  
}