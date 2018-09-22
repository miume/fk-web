var groupManagement = {
    init : function() {
        groupManagement.funcs.renderTable();
        groupManagement.funcs.renderDropBox();

        var out = $("#groupManagementPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#groupManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = groupManagement.funcs.getPreMonth();
            /**界面显示初值 */
            $("#beginDate").val(preMonthDate);
            // $("#beginTeam").append('<option value='+3+'>晚班</option>');
            $("#endDate").val(currentDate);
            // $("#endTeam").val("中班");
            /**获取所有数据 */
            $.get(home.urls.teamIndexReport.search(),{
                startDate : preMonthDate,
                startClazzId : 3,
                endDate : currentDate,
                endClazzId : 2
            },function(result) {
                var page = result.data;
                var detailDatas = result.data.content;
                const $tbody = $("#groupManagementTbody");
                groupManagement.funcs.renderTbodyData($tbody, detailDatas, 0);
                /**分页信息---有合计 到底需不需要分页？？ */
                /**分页信息 */
                layui.laypage.render({
                    elem : "groupManagementPage" ,
                    count : page.totalElements,
                    /**页面变换后的逻辑 */
                    jump : function(obj, first) {
                        if(!first) {
                            $.get(home.urls.teamIndexReport.search(),{
                                startDate : preMonthDate,
                                startClazzId : 3,
                                endDate : currentDate,
                                endClazzId : 2,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var detailDatas = result.data.content;
                                const $tbody = $("#groupManagementTbody");
                                groupManagement.funcs.renderTbodyData($tbody, detailDatas, obj.curr-1);
                                groupManagement.pageSize = page.size;
                            })
                        }
                    }
                })
            });
            /**绑定搜索事件 */
            groupManagement.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            groupManagement.funcs.bindExportEvents($("#downloadButton"));

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
                $.get(home.urls.teamIndexReport.search(),{
                    startDate : startDate ,
                    startClazzId : startClazzId ,
                    endDate : endDate ,
                    endClazzId : endClazzId ,
                    // operatorId : operatorId ,
                    // teamId : teamId,
                    // clazzId : clazzId
                },function(result) {
                    var detailDatas = result.data.content;
                    const $tbody = $("#groupManagementTbody");
                    groupManagement.funcs.renderTbodyData($tbody, detailDatas, 0);
                    layer.msg('查询成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    groupManagement.pageSize = result.data.length;
                    var page = result.data;
                    /**分页信息 */
                    layui.laypage.render({
                        elem : "groupManagementPage" ,
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump : function(obj, first) {
                            if(!first) {
                                $.get(home.urls.teamIndexReport.search(),{
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
                                    const $tbody = $("#groupManagementTbody");
                                    groupManagement.funcs.renderTbodyData($tbody, detailDatas, obj.curr-1);
                                    groupManagement.pageSize = page.size;
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
                var href = home.urls.teamIndexReport.export()+"?startDate="+startDate+"&startClazzId="+startClazzId+
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
                    "<td>"+(e.rawOrePb)+"</td>"+
                    "<td>"+(e.rawOreZn)+"</td>"+
                    "<td>"+(e.pbGrad)+"</td>"+
                    "<td>"+(e.znGrad)+"</td>"+
                    "<td>"+(e.pbRecovery)+"</td>"+
                    "<td>"+(e.mixPbRecovery)+"</td>"+
                    "<td>"+(e.sumPbRecovery)+"</td>"+
                    "<td>"+(e.znRecovery)+"</td>"+
                    "<td>"+(e.mixZnRecovery)+"</td>"+
                    "<td>"+(e.sumZnRecovery)+"</td>"+
                    "<td>"+(e.pbZnRecovery)+"</td>"+
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
            // //  获取人员班组
            // $("#team").append('<option ></option>');
            // $.get(home.urls.team.getAll(),{},function(result) {
            //     var teamTypes = result.data;
            //     teamTypes.forEach(function(e) {
            //         $("#team").append("<option value='"+e.id+"' class='setTeam'>"+e.name+"</option>")
            //     });
            // });
            // //  获取班次
            // $("#clazzId").append('<option></option>');
            // $.get(home.urls.clazz.getAll(),{},function(result) {
            //     var ClazzTypes = result.data;
            //     ClazzTypes.forEach(function(e) {
            //         $("#clazzId").append('<option value='+e.id+'>'+e.name+'</option>')
            //     })
            // });
        }
        // /**根据班组 渲染操作员下拉框*/
        // ,renderOptName : function() {
        //     $("#optName").empty();
        //     var id = $("#team").val();
        //     if(id === ""){
        //         layer.msg('请先选择班组,再选操作员!',{
        //             offset : ['40%', '55%'],
        //             time : 700
        //         });
        //         return
        //     }else {
        //         $("#optName").append('<option></option>');
        //         $.get(home.urls.user.getByTeam(),{
        //             teamId : id
        //         },function(result) {
        //             var optName = result.data;
        //             optName.forEach(function(e) {
        //                 $("#optName").append('<option value='+e.id+'>'+e.name+'</option>')
        //             })
        //         });
        //     }
        // }
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