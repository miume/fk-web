var laborCompetition = {
    init : function() {
        laborCompetition.funcs.renderTable();
        laborCompetition.funcs.renderDropBox();

        var out = $("#laborCompetitionPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#laborCompetitionPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = laborCompetition.funcs.getPreMonth();
            /**界面显示初值 */
            $("#beginDate").val(preMonthDate);
            // $("#beginTeam").append('<option value='+3+'>晚班</option>');
            $("#endDate").val(currentDate);
            // $("#endTeam").val("中班");
            /**获取所有数据 */
            $.get(home.urls.workingCompetitionReport.search(),{
                startDate : preMonthDate,
                startClazzId : 3,
                endDate : currentDate,
                endClazzId : 2
            },function(result) {
                var page = result.data;
                var detailDatas = result.data.content;
                const $tbody = $("#laborCompetitionTbody");
                laborCompetition.funcs.renderTbodyData($tbody, detailDatas, 0);
                /**分页信息---有合计 到底需不需要分页？？ */
                /**分页信息 */
                layui.laypage.render({
                    elem : "laborCompetitionPage" ,
                    count : page.totalElements,
                    /**页面变换后的逻辑 */
                    jump : function(obj, first) {
                        if(!first) {
                            $.get(home.urls.workingCompetitionReport.search(),{
                                startDate : preMonthDate,
                                startClazzId : 3,
                                endDate : currentDate,
                                endClazzId : 2,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var detailDatas = result.data.content;
                                const $tbody = $("#laborCompetitionTbody");
                                laborCompetition.funcs.renderTbodyData($tbody, detailDatas, obj.curr-1);
                                laborCompetition.pageSize = page.size;
                            })
                        }
                    }
                })
            });
            /**绑定搜索事件 */
            laborCompetition.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            laborCompetition.funcs.bindExportEvents($("#downloadButton"));

        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#beginDate").val();
                var startClazzId = $("#beginTeam").val();
                var endDate = $("#endDate").val();
                var endClazzId = $("#endTeam").val();
                // var operatorId = $("#optName").val();
                // if(operatorId === ""){
                //     operatorId = -1;
                // }
                // var teamId = $("#team").val();
                // if(teamId === ""){
                //     teamId = -1;
                // }
                // var clazzId = $("#clazzId").val();
                // if(clazzId === ""){
                //     clazzId = -1;
                // }
                if(startDate === "" || endDate === "" || startClazzId === "" || endClazzId === ""){
                    layer.msg('日期选择不能为空！',{
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                $.get(home.urls.workingCompetitionReport.search(),{
                    startDate : startDate ,
                    startClazzId : startClazzId ,
                    endDate : endDate ,
                    endClazzId : endClazzId ,
                    // operatorId : operatorId ,
                    // teamId : teamId,
                    // clazzId : clazzId
                },function(result) {
                    var detailDatas = result.data.content;
                    const $tbody = $("#laborCompetitionTbody");
                    laborCompetition.funcs.renderTbodyData($tbody, detailDatas, 0);
                    layer.msg('查询成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    laborCompetition.pageSize = result.data.length;
                    var page = result.data;
                    /**分页信息 */
                    layui.laypage.render({
                        elem : "laborCompetitionPage" ,
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump : function(obj, first) {
                            if(!first) {
                                $.get(home.urls.workingCompetitionReport.search(),{
                                    startDate : startDate ,
                                    startClazzId : startClazzId ,
                                    endDate : endDate ,
                                    endClazzId : endClazzId ,
                                    // operatorId : operatorId ,
                                    // teamId : teamId,
                                    // clazzId : clazzId ,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var detailDatas = result.data.content;
                                    const $tbody = $("#laborCompetitionTbody");
                                    laborCompetition.funcs.renderTbodyData($tbody, detailDatas, obj.curr-1);
                                    laborCompetition.pageSize = page.size;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**绑定导出事件 */
        ,bindExportEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#beginDate").val();
                var startClazzId = $("#beginTeam").val();
                var endDate = $("#endDate").val();
                var endClazzId = $("#endTeam").val();
                // var operatorId = $("#optName").val();
                // if(operatorId === null){
                //     operatorId = -1;
                // }
                // var teamId = $("#team").val();
                // if(teamId === ""){
                //     teamId = -1;
                // }
                // var clazzId = $("#clazzId").val();
                // if(clazzId === ""){
                //     clazzId = -1;
                // }
                if(startDate === "" || endDate === "" || startClazzId === "" || endClazzId === ""){
                    layer.msg('日期选择不能为空！', {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                var href = home.urls.workingCompetitionReport.export()+"?startDate="+startDate+"&startClazzId="+startClazzId+
                    "&endDate="+endDate+"&endClazzId="+endClazzId;
                $("#downloadA").attr("href",href);
            })
        }
        /**渲染数据*/
        ,renderTbodyData : function($tbody, detailDatas, page) {
            //  page标签只是用来控制序号的，若不需要序号，则可以不使用
            $tbody.empty();
            // var i = 1 + page * 10;
            detailDatas.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    // "<td>"+(i++)+"</td>" +
                    "<td>"+(e.team.name)+"</td>"+
                    "<td>"+(e.startUpNum)+"</td>"+
                    "<td>"+(e.operator.name)+"</td>"+
                    "<td>"+(e.teamNum)+"</td>"+
                    "<td>"+(e.rawOre)+"</td>"+
                    "<td>"+(e.pbMetal)+"</td>"+
                    "<td>"+(e.pbGrade)+"</td>"+
                    "<td>"+(e.pbRecovery)+"</td>"+
                    "<td>"+(e.znMetal)+"</td>"+
                    "<td>"+(e.znGrade)+"</td>"+
                    "<td>"+(e.znRecovery)+"</td>"+
                    "<td>"+(e.qualityEfficiency)+"</td>"+
                    "<td>"+(e.pbZnTotalRecovery)+"</td>"+
                    "<td>"+(e.pbTotalRecovery)+"</td>"+
                    "<td>"+(e.znTotalRecovery)+"</td>"+
                    "<td>"+(e.reachStandardRate)+"</td>"+
                    "<td>"+(e.totalScore)+"</td>"+
                    "<td>"+(e.attendanceRate)+"</td>"+
                    "</tr>"
                )
            })
        }
        /**渲染页面下拉框*/
        ,renderDropBox : function() {
            $("#beginTeam").empty();
            $("#endTeam").empty();
            $("#team").empty();
            $("#shift").empty();
            // $("#optName").empty();
            //  获取开始班次
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var beginClazzTypes = result.data;
                beginClazzTypes.forEach(function(e) {
                    if(e.id===3){
                        $("#beginTeam").append('<option selected="selected" value='+e.id+'>'+e.name+'</option>')
                    }
                    else{
                        $("#beginTeam").append('<option value='+e.id+'>'+e.name+'</option>')
                    }
                })
            });
            //  获取结束班次
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var endClazzTypes = result.data;
                endClazzTypes.forEach(function(e) {
                    if(e.id===2){
                        $("#endTeam").append('<option selected="selected" value='+e.id+'>'+e.name+'</option>')
                    }
                    else{
                        $("#endTeam").append('<option value='+e.id+'>'+e.name+'</option>')
                    }
                })
            });
        }
        /**得到当前日期的前一个月 */
        ,getPreMonth : function() {
            var preDate = new Date();
            preDate.setMonth(preDate.getMonth()-1);
            var frontDate = preDate.toLocaleDateString();
            var arr = frontDate.split('/');
            var year = arr[0];
            var month = (arr[1]<10 ? "0"+arr[1] : arr[1]);
            var day = (arr[2]<10 ? "0"+arr[2] : arr[2]);
            var startDate = year + "-" + month + "-" + day;
            return startDate;
        }
    }
};