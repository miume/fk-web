var abnormalIndex = {
    init : function() {
        abnormalIndex.funcs.renderTable();
        abnormalIndex.funcs.renderDropBox();

    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = abnormalIndex.funcs.getPreMonth();
            /**界面显示初值 */
            $("#beginDate").val(preMonthDate);
            $("#endDate").val(currentDate);
            /**获取所有数据 */
            $.get(home.urls.exceptIndexReport.search(),{
                startDate : preMonthDate,
                startClazzId : 3,
                endDate : currentDate,
                endClazzId : 2
            },function(result) {
                var detailDatas = result.data;
                const $tbody = $("#abnormalIndexTbody");
                abnormalIndex.funcs.renderTbodyData($tbody, detailDatas);
            });
            /**绑定搜索事件 */
            abnormalIndex.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            abnormalIndex.funcs.bindExportEvents($("#downloadButton"));
            /**绑定异常指标设置事件 */
            abnormalIndex.funcs.bindAbnormalEvents($("#abnormalButton"));
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
                $.get(home.urls.exceptIndexReport.search(),{
                    startDate : startDate,
                    startClazzId : startClazzId,
                    endDate : endDate,
                    endClazzId : endClazzId
                },function(result) {
                    var detailDatas = result.data;
                    const $tbody = $("#abnormalIndexTbody");
                    abnormalIndex.funcs.renderTbodyData($tbody, detailDatas);
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
                var href = home.urls.exceptIndexReport.export()+"?startDate="+startDate+"&startClazzId="+startClazzId+
                    "&endDate="+endDate+"&endClazzId="+endClazzId;
                $("#downloadA").attr("href",href);
            })
        }
        /**绑定异常指标设置事件 */
        ,bindAbnormalEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                // $.get(home.urls.sampleIndexType.getAll(),{},function(result) {
                //     var sampleIndex = result.data;
                //     const $tbody = $("#setAbnormalIndexTbody");
                //     abnormalIndex.funcs.renderSetAbnormalTbody($tbody,sampleIndex);
                // })

            })
        }
        /**渲染异常指标设置中的数据*/
        ,renderSetAbnormalTbody : function($tbody, sampleIndex) {

        }
        /**渲染数据*/
        ,renderTbodyData : function($tbody, detailDatas) {
            //  page标签只是用来控制序号的，若不需要序号，则可以不使用
            $tbody.empty();
            for(var name in detailDatas) {
                //  其中name为对象名
                var detailData = detailDatas[name];
                console.log(detailData);
                var flag = 0;
                detailData.forEach(function(e) {
                    console.log(e);
                    if(flag === 0){
                        // 1.写类型
                        $tbody.append(
                            "<tr>" +
                            "<td rowspan='"+detailData.length+"'>" + name +"</td>" +
                            "<td>"+ (flag+1) +"</td>" +
                            "<td>"+ detailData[0].time.substring(0,10) +"</td>" +
                            "<td>"+ detailData[0].clazz.name +"</td>" +
                            "<td>"+ detailData[0].team.name +"</td>" +
                            "<td>"+ detailData[0].operator.name +"</td>" +
                            "<td>"+ detailData[0].value +"</td>" +
                            "</tr>"
                        );
                        flag = flag + 1 ;
                    }else{
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ (flag+1) +"</td>" +
                            "<td>"+ detailData[flag].time.substring(0,10) +"</td>" +
                            "<td>"+ detailData[flag].clazz.name +"</td>" +
                            "<td>"+ detailData[flag].team.name +"</td>" +
                            "<td>"+ detailData[flag].operator.name +"</td>" +
                            "<td>"+ detailData[flag].value +"</td>" +
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
            $("#beginTeam").append('<option></option>');
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var beginClazzTypes = result.data;
                beginClazzTypes.forEach(function(e) {
                    $("#beginTeam").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            });
            //  获取结束班次
            $("#endTeam").append('<option></option>');
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var endClazzTypes = result.data;
                endClazzTypes.forEach(function(e) {
                    $("#endTeam").append('<option value='+e.id+'>'+e.name+'</option>')
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