accountRecording = {
    addData : [],
    init : function() {
        accountRecording.funcs.bindSearchEvent($("#searchButton"));
        $.get(home.urls.dataDictionary.getAllDataByTypeId(),{
            id : 1
        }, function(result) {
            var cycle = result.data;
            $("#scheduleId").empty();
            $("#scheduleId").html("<option value='-1'>请选择班次</option>");
            cycle.forEach(function(e) {
                $("#scheduleId").append("<option value="+ (e.id) + ">"+ (e.dicName) +"</option>");
            })
        })
    }
    ,funcs : {
        bindSearchEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var scheduleId = $("#scheduleId").val();
                if(!startDate || !endDate || !scheduleId) {
                    layer.msg("请同时选择起始时间、结束时间以及班次");
                    return
                }
                $("#accountRecordingTable").removeClass("hide");
                $.get(home.urls.dispatchAccount.getByDateAndScheduleByPage(),{
                    startDate : startDate,
                    endDate : endDate,
                    scheduleId : scheduleId
                 }, function(result) {
                    var res = result.data.content;
                    const $tbody = $("#accountRecordingTable").children("tbody");
                    accountRecording.funcs.renderHandler($tbody,res,0);
                    var data = result.data;
                    /**分页消息 */
                    layui.laypage.render({
                        elem : "accountRecording_page",
                        count : 10 * data.totalPages,
                        /**页面变换后的逻辑 */
                        jump : function(obj,first) {
                            if(!first) {
                                $.get(home.urls.dispatchAccount.getByDateAndScheduleByPage(),{
                                    startDate : startDate,
                                    endDate : endDate,
                                    scheduleId : scheduleId,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                 }, function(result) {
                                    var res = result.data.content;
                                    var page = obj.curr - 1;
                                    const $tbody = $("#accountRecordingTable").children("tbody");
                                    accountRecording.funcs.renderHandler($tbody,res,page);
                                 })
                            }
                        }
                    })
                })
            })
        }
        ,renderHandler : function($tbody,data,page) {
            $tbody.empty();
            var i = page * 10 + 1;
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>"+ (e.standingBook ? e.standingBook : '') +"</td>" +
                    "<td>"+ (e.dataDictionary ? e.dataDictionary.dicName : '') +"</td>" +
                    "<td>"+ (e.user ? e.user.name : '') +"</td>" +
                    "<td>"+ (e.time ? e.time : '') +"</td>" +
                    "<td>"+ (e.ssbz ? e.ssbz : '') +"</td>" +
                    "<td><a href='#' class='detail' id='detail-" + (e.id) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "<td><a href='#' class='editor' id='edit-'"+ (e.id) +"><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            })
            /**绑定详情事件 */
            accountRecording.funcs.bindDetailEvent($(".detail"));
            accountRecording.funcs.bindEditorEvent($(".editor"));
        }
        ,bindDetailEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                $.get(home.urls.dispatchAccount.generateStandingBook(),{
                    date : '2018-08-25',
                    scheduleId : 1
                },function(result) {
                    var items = result.data;
                    $("#detailModal").removeClass("hide");
                    accountRecording.funcs.renderHeader(items.sectionInfos);
                    layer.open({
                        type : 1,
                        title : "查看台账",
                        content : $("#detailModal"),
                        area : ["1000px","550px"],
                        offset : "auto",
                        btn : ["取消"],
                        closeBtn : 0,
                        yes : function(index) {
                            $("#detailModal").addClass("hide");
                            layer.close(index);
                        }
                    })
                })
                
            })
        }
        ,bindEditorEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                $.get(home.urls.dispatchAccount.generateStandingBook(),{
                    date : '2018-08-25',
                    scheduleId : 1
                },function(result) {
                    var items = result.data;
                    $("#detailModal").removeClass("hide");
                    accountRecording.funcs.renderHeader(items.sectionInfos);
                    layer.open({
                        type : 1,
                        title : "编辑台账",
                        content : $("#detailModal"),
                        area : ["1000px","550px"],
                        offset : "auto",
                        btn : ["保存" ,"取消"],
                        closeBtn : 0,
                        yes : function(index) {
                            $("#detailModal").addClass("hide");
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            $("#detailModal").addClass("hide");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        ,renderHeader : function(data) {
            var $table1 = $("#brokenSection").children('tbody');
            var $table2 = $("#grindingSection").children('tbody');
            var $table3 = $("#concentrateSection").children('tbody');
            var $table4 = $("#tailingSection").children('tbody');
            /**为四个表分别保存数据，方便后面单独渲染 */
            var brokenSection = [] , grindingSection = [], concentrateSection = [], tailingSection = [] ;
            data.forEach(function(e) {
                switch(e.sectionName) {
                    case '破碎工段' : 
                        brokenSection = e.standingBookTypeList
                        break;
                    case '磨浮工段' : 
                        grindingSection = e.standingBookTypeList
                        break;
                    case '精矿工段' : 
                        concentrateSection = e.standingBookTypeList
                        break;
                    case '尾砂工段' : 
                        tailingSection = e.standingBookTypeList
                        break;
                }
            })
            /**为四个表填充数据 */
            accountRecording.funcs.bindAppendThead($table1,brokenSection);
            accountRecording.funcs.bindAppendThead($table2,grindingSection);
            accountRecording.funcs.bindAppendThead($table3,concentrateSection);
            accountRecording.funcs.bindAppendThead($table4,tailingSection);
            
            /**绑定选项卡切换事件 */
            var clickA = $(".options");
            console.log(clickA)
            accountRecording.funcs.bindClickChangeEvents(clickA);
        }
        /**为四个表格分别渲染数据 */
        ,bindAppendThead : function($table,data) {
            $table.empty();
            //先渲染每个表格的大标题，然后每个大标题在单独渲染
            data.forEach(function(e) {
                var theadId = "thead-"+e.id;
                $table.append("<tr id="+ (theadId) +" style='border-right:none;'><td colspan='6'>"+ (e.itemTypeName) +"</td></tr>");
                var standingBookItemList = e.standingBookItemList;
                accountRecording.funcs.appendRows(standingBookItemList,theadId);
            })
        }
        ,appendRows : function(data,theadId) {
            //console.log(data.length)
            /**每行显示三个字段，如果data.length能被3整除，直接每行三条数据渲染，不需要判断；若不能被3整除，则需要判断 */
            for( var i = 0; i < parseInt(data.length / 3); i++ ) {
                $("#"+theadId).append("<tr><td>"+ (data[3*i].itemName) +"</td><td><input id="+ (data[3*i].id) +" type='text' /></td><td>"+ (data[3*i+1].itemName) +"</td><td><input id="+ (data[3*i+1].id) +" type='text' /></td><td>"+ (data[3*i+2].itemName) +"</td><td><input id="+ (data[3*i+2].id) +" type='text' /></td></tr>")
            }  
            var temp = parseInt(data.length / 3) * 3 ;
            if(data.length % 3 === 1){
                $("#"+theadId).append("<tr><td>"+ (data[temp].itemName) +"</td><td><input id="+ (data[temp].id) +" type='text' /><td colspan='2'></td><td colspan='2'></td></tr>");
            }        
            if(data.length % 3 === 2){
                $("#"+theadId).append("<tr><td>"+ (data[temp].itemName) +"</td><td><input id="+ (data[temp].id) +" type='text' /><td>"+ (data[temp+1].itemName) +"</td><td><input id="+ (data[temp+1].id) +" type='text' /></td><td></td><td></td></tr>");
            }         
                
    }
        ,bindClickChangeEvents : function(buttons) {
            buttons.on('click', function() {
                var tableId = $(this).children('a').attr('id');
                console.log(tableId)
                $(".list .selected").removeClass("selected");
                $(this).addClass("selected");
                $(".table .selectedTable").removeClass("selectedTable").addClass("hide");
                $(tableId).removeClass("hide").addClass("selectedTable");
            })
           
        }
    }
}