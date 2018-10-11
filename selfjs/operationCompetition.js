var operationCompetition = {
    init : function() {
        operationCompetition.funcs.renderTable();
        operationCompetition.funcs.renderDropBox();

    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = operationCompetition.funcs.getPreMonth();
            /**界面显示初值 */
            $("#beginDate").val(preMonthDate);
            // $("#beginTeam").append('<option value='+3+'>晚班</option>');
            $("#endDate").val(currentDate);
            // $("#endTeam").val("中班");
            /**获取所有数据 */
            $.get(home.urls.operatorCompetitionReport.search(),{
                startDate : preMonthDate,
                startClazzId : 3,
                endDate : currentDate,
                endClazzId : 2
            },function(result) {
                var detailDatas = result.data;
                const $tbody = $("#operationCompetitionTbody");
                operationCompetition.funcs.renderTbodyData($tbody, detailDatas);
            });
            /**绑定搜索事件 */
            operationCompetition.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            operationCompetition.funcs.bindExportEvents($("#downloadButton"));

        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#beginDate").val();
                var startClazzId = $("#beginTeam").val();
                var endDate = $("#endDate").val();
                var endClazzId = $("#endTeam").val();
                if(startDate === "" || endDate === "" || startClazzId === "" || endClazzId === ""){
                    layer.msg('日期选择不能为空！',{
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                $.get(home.urls.operatorCompetitionReport.search(),{
                    startDate : startDate,
                    startClazzId : startClazzId,
                    endDate : endDate,
                    endClazzId : endClazzId
                },function(result) {
                    var detailDatas = result.data;
                    const $tbody = $("#operationCompetitionTbody");
                    operationCompetition.funcs.renderTbodyData($tbody, detailDatas);
                    layer.msg('查询成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                });
            })
        }
        /**绑定导出事件 */
        ,bindExportEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#beginDate").val();
                var startClazzId = $("#beginTeam").val();
                var endDate = $("#endDate").val();
                var endClazzId = $("#endTeam").val();
                if(startDate === "" || endDate === "" || startClazzId === "" || endClazzId === ""){
                    layer.msg('日期选择不能为空！', {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                var href = home.urls.operatorCompetitionReport.export()+"?startDate="+startDate+"&startClazzId="+startClazzId+
                    "&endDate="+endDate+"&endClazzId="+endClazzId;
                $("#downloadA").attr("href",href);
            })
        }
        /**渲染数据*/
        ,renderTbodyData : function($tbody, detailDatas) {
            //  page标签只是用来控制序号的，若不需要序号，则可以不使用
            $tbody.empty();
            console.log(detailDatas);
            for(var name in detailDatas) {
                //  其中name为对象名
                var detailData = detailDatas[name];
                var flag = 0;
                detailData.forEach(function(e) {
                    if(flag === 0){
                        flag = flag +1 ;
                        // 1.写类型
                        $tbody.append(
                            "<tr>" +
                            "<td rowspan='"+detailData.length+"'>" + name +"</td>" +
                            "<td>"+ detailData[0].operator.name +"</td>" +
                            "<td>"+ detailData[0].teamNum +"</td>" +
                            "<td>"+ detailData[0].rawOre +"</td>" +
                            "<td>"+ detailData[0].pbMetal +"</td>" +
                            "<td>"+ detailData[0].pbGrade +"</td>" +
                            "<td>"+ detailData[0].pbRecovery +"</td>" +
                            "<td>"+ detailData[0].znMetal +"</td>" +
                            "<td>"+ detailData[0].znGrade +"</td>" +
                            "<td>"+ detailData[0].znRecovery +"</td>" +
                            "<td>"+ detailData[0].qualityEfficiency +"</td>" +
                            "<td>"+ detailData[0].totalEfficiency +"</td>" +
                            "<td>"+ detailData[0].pbTotalRecovery +"</td>" +
                            "<td>"+ detailData[0].znTotalRecovery +"</td>" +
                            "</tr>"
                        );
                    }else{
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ detailData[flag].operator.name +"</td>" +
                            "<td>"+ detailData[flag].teamNum +"</td>" +
                            "<td>"+ detailData[flag].rawOre +"</td>" +
                            "<td>"+ detailData[flag].pbMetal +"</td>" +
                            "<td>"+ detailData[flag].pbGrade +"</td>" +
                            "<td>"+ detailData[flag].pbRecovery +"</td>" +
                            "<td>"+ detailData[flag].znMetal +"</td>" +
                            "<td>"+ detailData[flag].znGrade +"</td>" +
                            "<td>"+ detailData[flag].znRecovery +"</td>" +
                            "<td>"+ detailData[flag].qualityEfficiency +"</td>" +
                            "<td>"+ detailData[flag].totalEfficiency +"</td>" +
                            "<td>"+ detailData[flag].pbTotalRecovery +"</td>" +
                            "<td>"+ detailData[flag].znTotalRecovery +"</td>" +
                            "</tr>"
                        );
                        flag++;
                    }
                })
            }
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