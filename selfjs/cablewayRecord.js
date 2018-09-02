var cablewayRecord = {
    init: function() {
        /**分页显示 */
        cablewayRecord.funcs.renderTable();
        setInterval(function(){
            cablewayRecord.funcs.renderTable();
        },10000);
        var out1 = $("#rope_page1").width();
        var time1 = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#rope_page1').css('padding-left', 100 * ((out1 - inside) / 2 / out1) > 33 ? 100 * ((out1 - inside) / 2 / out1) + '%' : '35.5%');
            clearTimeout(time1);
        }, 30);
        var out2 = $("#rope_page2").width();
        var time2 = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#rope_page2').css('padding-left', 100 * ((out2 - inside) / 2 / out2) > 33 ? 100 * ((out2 - inside) / 2 / out2) + '%' : '35.5%');
            clearTimeout(time2);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        /**渲染表格 */
        renderTable : function() {
            $.get(home.urls.ropeWayRunningRecord.getAllByPage(),{},function(result){
                var records = result.data.content;
                var $tbody =  $("#runMonitoringTable").children("tbody");
                cablewayRecord.funcs.renderHandler($tbody,records,0);
                cablewayRecord.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "rope_page1",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.ropeWayRunningRecord.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var records = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#runMonitoringTable").children("tbody");
                                cablewayRecord.funcs.renderHandler($tbody, records, page);
                                cablewayRecord.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            cablewayRecord.funcs.bindPageSwitch1($("#jumpToRecord"));
        }
        ,renderHandler : function($tbody, records, page) {
            /**清空表格 */
            $tbody.empty();
            var i = page * 10 + 1 ;
            records.forEach(function(e){
                if(e.ropeWayState === 1){
                    var stopLength = e.stateLength
                }else{
                    var runningLength = e.stateLength
                }
                if(home.user.navigations[1].firstLevelMenus[3].secondLevelMenus[0].operations[2].name ==="编辑"){
                    $tbody.append(
                        "<tr>" + 
                        "<td>" + (i++) + "</td>" +
                        "<td>" + (e.runningTime) + "</td>" +
                        "<td>" + (e.ssbz ? e.ssbz.name : ' ') + "</td>" + 
                        "<td>" + (e.ropeWayState ? '停机' : '运行') + "</td>" +
                        "<td>" + (runningLength ? runningLength : ' ') + "</td>" +
                        "<td>" + (stopLength ? stopLength : ' ') + "</td>" + 
                        "<td>" + (e.cause ? e.cause.dicName : ' ') + "</td>" +
                        "<td>" + (e.remarks ? e.remarks : ' ') + "</td>" +
                        "<td>" + 
                        "<a href='#'  class='editorcause' id='editCause-"+(e.id)+"'>停止原因</a>&nbsp;&nbsp;|&nbsp;&nbsp;" + 
                        "<a href='#'  class='editorremark' id='editRemark-"+(e.id)+"'>添加备注</a>" +
                        "</td>" +
                        "</tr>"
                    )  
                } else {
                    $tbody.append(
                        "<tr>" + 
                        "<td>" + (i++) + "</td>" +
                        "<td>" + (e.runningTime) + "</td>" +
                        "<td>" + (e.ssbz ? e.ssbz.name : ' ') + "</td>" + 
                        "<td>" + (e.ropeWayState) + "</td>" +
                        "<td>" + (runningLength ? runningLength : ' ') + "</td>" +
                        "<td>" + (stopLength ? stopLength : ' ') + "</td>" + 
                        "<td>" + (e.cause ? e.cause.dicName : ' ') + "</td>" +
                        "<td>" + (e.remarks ? e.remarks : ' ') + "</td>" +
                        "<td>" + 
                        "<a href='#'  style = 'text-decoration : none;color: gray'  id='editCause-"+(e.id)+"'>停止原因</a>&nbsp;&nbsp;|&nbsp;&nbsp;" + 
                        "<a href='#'  style = 'text-decoration : none;color: gray'  id='editRemark-"+(e.id)+"'>添加备注</a>" +
                        "</td>" +
                        "</tr>"
                    )
                }
                
                
            })
            /**绑定添加原因事件 */
            cablewayRecord.funcs.bindAddCause($(".editorcause"));
            /**绑定添加备注事件 */
            cablewayRecord.funcs.bindAddRemark($(".editorremark"));
        }
        ,renderCauseSelector : function(id) {
            /*渲染添加原因功能下拉框*/ 
            $.get(home.urls.ropeWayRunningRecord.getById(),{id : id},function(result) {
                var record = result.data;
                const $selector3 = $("#editStopReason");
                cablewayRecord.funcs.renderHandler2($selector3,record);
                $("#editStopReason").on('click',function() {
                    $(this).off('click');
                    $.get(home.urls.dataDictionary.getAllDataByTypeId(),{id : 10},function(result) {
                        var causes = result.data;
                        cablewayRecord.funcs.renderHandler1($selector3, causes);
                    })
                   
                })
            })
               
        }
        /**getAllCauses , 获取所有停机原因，以下拉框形式呈现*/ 
        ,renderHandler1 : function($selector, causes) {    
            $selector.empty() ;
            causes.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.dicName) + "</option>"
                )
            })
        }
        /**getById()----recordId */
        ,renderHandler2 : function($selector, record) {
            $selector.empty() ;
                $selector.append(
                        "<option value=\"" + (record.cause ? record.cause.id : ' ') +"\""+ ">"+ (record.cause ? record.cause.dicName : ' ') + "</option>"
                )
        }
        /**添加原因 */
        ,bindAddCause : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(10);
               
                cablewayRecord.funcs.renderCauseSelector(id);
                $("#stopReasonModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '停机原因',
                        content: $("#stopReasonModal"),
                        area: ['300px', '150px'],
                        btn: ['确定', '取消'],
                        offset: ['40%','45%'],
                        yes: function(index){
                            /**收集数据 */
                            var causeId = $("#editStopReason").find("option:selected").val();
                            $.post(home.urls.ropeWayRunningRecord.addCause() ,{ 
                                id : id,
                                cause :causeId
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        cablewayRecord.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#stopReasonModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#stopReasonModal").css("display","none");
                            layer.close(index);
                        }  
                    })
             })
        }
        /**添加备注 */
        ,bindAddRemark : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(11);
                $.get(home.urls.ropeWayRunningRecord.getById(),{id : id}, function(result){
                    var record = result.data
                    $("#editRemark").val(record.remarks)
                })
                $("#remarkModal").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '停机原因',
                    content: $("#remarkModal"),
                    area: ['280px', '230px'],
                    btn: ['确定', '取消'],
                    offset: ['40%','45%'],
                    yes: function(index){
                    /**收集数据 */
                    var remark = $("#editRemark").val();
                    $.post(home.urls.ropeWayRunningRecord.addRemark() ,{ 
                            id : id,
                            remarks : remark
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    cablewayRecord.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#remarkModal").css("display","none");
                        layer.close(index);
                    },
                        closeBtn : 0,
                    btn2 : function(index) {
                        $("#remarkModal").css("display","none");
                        layer.close(index);
                    }  
                })
            })
        }
        /**转换到运行记录页面 */
        ,bindPageSwitch1 : function(buttons) {
            buttons.off('click').on('click',function(){
                $("#runRecord").removeClass("hidePage");
                $("#runMonitoring").addClass("hidePage");
            })
            cablewayRecord.funcs.renderRecordTable();
            cablewayRecord.funcs.bindPageSwitch2($("#jumpToMonitoring"));
        }
        /**转到运行监视页面 */
        ,bindPageSwitch2 : function(buttons) {
            buttons.off('click').on('click',function(){
                $("#runRecord").addClass("hidePage");
                $("#runMonitoring").removeClass("hidePage");
            })
        }
        /**渲染索道运行记录表 */
        ,renderRecordTable : function() {
            $.get(home.urls.ropeWayRunningRecord.getAllByPage(),{},function(result){
                var records = result.data.content;
                var $tbody =  $("#runRecordTable").children("tbody");
                cablewayRecord.funcs.renderHandler($tbody,records,0);
                cablewayRecord.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "rope_page2",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.ropeWayRunningRecord.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var records = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#runRecordTable").children("tbody");
                                cablewayRecord.funcs.renderHandler($tbody, records, page);
                                cablewayRecord.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            cablewayRecord.funcs.renderClassSelector1();
            cablewayRecord.funcs.renderClassSelector2();
            /**绑定查询记录事件 */
           cablewayRecord.funcs.bindSearchRecordEvent($("#searchButton"));
           /** 绑定导出事件*/
           cablewayRecord.funcs.bindExpertEvent($("#expertButton"));
        }
        /**渲染起始班次下拉框 */
        ,renderClassSelector1 : function(){
            const  $selector1 = $("#classType1");
            $.get(home.urls.dataDictionary.getAllDataByTypeId(),{id : 1},function(result){
                var classes = result.data
                $selector1.empty();
                classes.forEach(function(e){
                    $selector1.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.dicName) + "</option>"
                    )
                })
            })
        }
        /**渲染结束班次下拉框 */
        ,renderClassSelector2 : function(){
            const  $selector2 = $("#classType2");
            $.get(home.urls.dataDictionary.getAllDataByTypeId(),{id : 1},function(result){
                var classes = result.data
                $selector2.empty();
                classes.forEach(function(e){
                    $selector2.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.dicName) + "</option>"
                    )
                })
            })
        }
        /**查询记录事件 */
        ,bindSearchRecordEvent : function(buttons) {
            buttons.off('click').on('click',function(){
                var startClass = $("#classType1").find("option:selected").val();
                var endClass = $("#classType2").find("option:selected").val();
                var startTime = $("#startTime").val();
                var endTime = $("#endTime").val();
                if((startTime === "")||(endTime === "")){
                    layer.msg("日期不能为空 ！")
                    return 
                } else{
                    $.post(home.urls.ropeWayRunningRecord.getByDate(),{
                        startDate : startTime,
                        startClazz : startClass,
                        endDate : endTime,
                        endClazz : endClass
                    },function(result) {
                        var records = result.data.content;
                        var $tbody =  $("#runRecordTable").children("tbody");
                        cablewayRecord.funcs.renderHandler($tbody,records,0);
                        cablewayRecord.pageSize = result.data.length;
                        var page = result.data;
                        /**分页信息 */
                        layui.laypage.render({
                            elem: "rope_page2",
                            count : 10 * page.totalPages,
                            /**页面变换后的逻辑 */
                            jump: function(obj, first) {
                                if(!first) {
                                    $.post(home.urls.ropeWayRunningRecord.getByDate(),{
                                        page : obj.curr - 1 ,
                                        size : obj.limit
                                    }, function (result) {
                                        var records = result.data.content
                                        var page = obj.curr - 1;
                                        const $tbody = $("#runRecordTable").children("tbody");
                                        cablewayRecord.funcs.renderHandler($tbody, records, page);
                                        cablewayRecord.pageSize = result.data.length;
                                    })
                                }
                            }
                        })
                    })
                }
            })
        }

        /**导出 */
        ,bindExpertEvent : function(buttons) {
            buttons.off('click').on('click',function(){
                var startClass = $("#classType1").find("option:selected").val();
                var endClass = $("#classType2").find("option:selected").val();
                var startTime = $("#startTime").val();
                var endTime = $("#endTime").val();
                if((startTime === "") && (endTime === "")){
                    layer.msg('日期选择不能为空！');
                    return
                }
                var url = home.urls.ropeWayRunningRecord.download() + "?startDate=" + startTime + "&startClazz=" + startClass + "&endDate=" + endTime +  "&endClazz=" + endClass;
                $("#download-id").attr("href",url);
            })
        }












    }
}