accountRecording = {
    addData : [],
    Id : [],
    detail : [],
    editor : [],
    flag : 0,  //用来区分是编辑还是详情
    init : function() {
        accountRecording.funcs.bindInitSearchEvent();
        $.get(home.urls.dispatchAccount.getAllSchedule(),{}, function(result) {
            var cycle = result.data;
            $("#scheduleId").empty();
            $("#scheduleId").html("<option value='-1'>请选择班次</option>");
            cycle.forEach(function(e) {
                $("#scheduleId").append("<option value="+ (e.id) + ">"+ (e.name) +"</option>");
            })
        })
    }
    ,funcs : {
        bindInitSearchEvent : function() {
            var date = new Date().Format("yyyy-MM-dd");
            $.get(home.urls.dispatchAccount.getByDateAndScheduleByPage(),{
                startDate : date,
                endDate : date,
                scheduleId : -1
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
            accountRecording.funcs.bindSearchEvent($("#searchButton"));
        }
        ,bindSearchEvent : function(buttons) {
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
                    "<td><a href='#' class='editor' id='editor-"+ (e.id) +"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            })
            /**绑定详情事件 */
            accountRecording.funcs.bindDetailEvent($(".detail"));
            accountRecording.funcs.bindEditorEvent($(".editor"));
        }
        ,bindDetailEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                accountRecording.flag = 0;
                accountRecording.Id = $(this).attr("id").substr(7); 
                console.log(accountRecording.Id)
                accountRecording.detail = [];
                $.get(home.urls.dispatchAccount.getDetailByStandingBookId(),{
                    id : accountRecording.Id
                },function(result) {
                     accountRecording.detail = result.data;
               
                console.log(accountRecording.detail)
                $.get(home.urls.dispatchAccount.getAll(),{
                },function(result) {
                    var items = result.data;
                    $("#detailModal").removeClass("hide");
                    accountRecording.funcs.renderHeader(items);
                    layer.open({
                        type : 1,
                        title : "查看台账",
                        content : $("#detailModal"),
                        area : ["1050px","550px"],
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
         })
        }
        ,bindEditorEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                accountRecording.flag = 1;
                var Id = $(this).attr("id").substr(7); 
                console.log($(this).attr("id"))
                console.log(Id)
                accountRecording.editor = [];
                $.get(home.urls.dispatchAccount.getDetailByStandingBookId(),{
                    id : Id
                },function(result) {
                     accountRecording.editor = result.data;
                     console.log(result.data)
                     console.log(accountRecording.editor)
                     $.get(home.urls.dispatchAccount.getAll(),{},function(result) {
                        var items = result.data;
                        $("#detailModal").removeClass("hide");
                        accountRecording.funcs.renderHeader(items);
                        layer.open({
                            type : 1,
                            title : "编辑台账",
                            content : $("#detailModal"),
                            area : ["1050px","550px"],
                            offset : "auto",
                            btn : ["保存" ,"取消"],
                            closeBtn : 0,
                            yes : function(index) {
                                accountRecording.addData.forEach(function(e) {
                                    var item = e.standingBookItem.id;
                                    e.itemValue = $("#"+item).val();
                                })
                                /**获取当前登录用户的信息 */
                                var dataDictionary = accountRecording.editor.dataDictionary.id;
                                var date = new Date(accountRecording.editor.date).getTime();
                                var standingBook = accountRecording.editor.standingBook;
                                var data = {
                                    id : Id,
                                    standingBook : standingBook,
                                    date : date,
                                    dataDictionary : { id : dataDictionary },
                                    standingBookDetailList : accountRecording.addData
                                }     
                                $.ajax({
                                    url : home.urls.dispatchAccount.update(),
                                    contentType : "application/json" ,
                                    dataType : "JSON",
                                    type : "post",
                                    data : JSON.stringify(data),
                                    success : function(result) {
                                        if(result.code === 0) {
                                            var time = setTimeout(function() {
                                                accountRecording.funcs.bindSearchEvent($("#searchButton"));
                                                clearTimeout(time);
                                            },500)
                                        }
                                        layer.msg(result.message, {
                                            offset : ['40%', '55%'],
                                            time : 700
                                        })
                                    }
                                })
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
                $table.append("<tr id="+ (theadId) +" style='border-right:none;'><td colspan='6' class='grey'>"+ (e.itemTypeName) +"</td></tr>");
                var standingBookItemList = e.standingBookItemList;
                if(accountRecording.flag === 0) {
                    accountRecording.funcs.appendDetailRows(standingBookItemList,theadId);
                }
                else {
                    accountRecording.funcs.appendEditorRows(standingBookItemList,theadId);
                }
                
            })
        }
        ,appendDetailRows : function(data,theadId) {
            //console.log(data.length)
            /**每行显示三个字段，如果data.length能被3整除，直接每行三条数据渲染，不需要判断；若不能被3整除，则需要判断 */
            for( var i = 0; i < parseInt(data.length / 3); i++ ) {
                $("#"+theadId).append("<tr class='grey'><td>"+ (data[3*i].itemName) +"</td><td>"+ (accountRecording.detail[data[3*i].id] || '' ) +"</td><td class='grey'>"+ (data[3*i+1].itemName) +"</td><td>"+ (accountRecording.detail[data[3*i+1].id] || '' ) +"</td><td class='grey'>"+ (data[3*i+2].itemName) +"</td><td>"+ (accountRecording.detail[data[3*i+2].id] || '' ) +"</td></tr>")
            }  
            var temp = parseInt(data.length / 3) * 3 ;
            if(data.length % 3 === 1){
                $("#"+theadId).append("<tr class='grey'><td>"+ (data[temp].itemName) +"</td><td>"+ (accountRecording.detail[data[temp].id] || '' ) +"</td><td colspan='2'></td><td colspan='2'></td></tr>");
            }        
            if(data.length % 3 === 2){
                $("#"+theadId).append("<tr class='grey'><td>"+ (data[temp].itemName) +"</td><td>"+ (accountRecording.detail[data[temp].id] || '' ) +"</td><td class='grey'>"+ (data[temp+1].itemName) +"</td><td>"+ (accountRecording.detail[data[temp+1].id] || '' ) +"</td><td></td><td></td></tr>");
            }                
    }
        ,appendEditorRows : function(data,theadId) {
            for( var i = 0; i < parseInt(data.length / 3); i++ ) {
                $("#"+theadId).append("<tr><td class='grey'>"+ (data[3*i].itemName) +"</td><td><input type='text' id="+ (data[3*i].id) +" value="+ (accountRecording.editor[data[3*i].id] || "" ) +"></td><td class='grey'>"+ (data[3*i+1].itemName) +"</td><td><input type='text' id="+ (data[3*i+1].id) +"  value="+ (accountRecording.editor[data[3*i+1].id] || ' ') +" ></td><td class='grey'>"+ (data[3*i+2].itemName) +"</td><td><input type='text' id="+ (data[3*i+2].id) +" value="+ (accountRecording.editor[data[3*i+2].id] || ' ') +" ></td></tr>")
                for(var i1 = 3 * i; i1 < 3 * i + 3; i1++) {
                   accountRecording.addData.push({
                        standingBookItem : { id : data[i1].id },
                        itemValue : $("#" + data[i1].id).val() ,
                        fieldId : data[i1].fieldId
                    })
                } 
            }  
            var temp = parseInt(data.length / 3) * 3 ;
            if(data.length % 3 === 1){
                $("#"+theadId).append("<tr><td class='grey'>"+ (data[temp].itemName) +"</td><td><input type='text' id="+ (data[temp].id) +" value="+ (accountRecording.editor[data[temp].id] || "") +"></td><td colspan='2' class='grey'></td><td colspan='2' class='grey'></td></tr>");
                accountRecording.addData.push({
                    standingBookItem : { id : data[temp].id },
                    itemValue : $("#" + data[temp].id).val() ,
                    fieldId : data[temp].fieldId
                })
            }        
            if(data.length % 3 === 2){
                $("#"+theadId).append("<tr><td class='grey'>"+ (data[temp].itemName) +"</td><td><input type='text' id="+ (data[temp].id) +" value="+ (accountRecording.editor[data[temp].id] || "") +"  ></td><td class='grey'>"+ (data[temp+1].itemName) +"</td><td><input type='text' id="+ (data[temp].id) +" value="+ (accountRecording.editor[data[temp+1].id] || ' ') +" ></td><td class='grey'></td><td class='grey'></td></tr>");
                for(var i1 = temp; i1 < temp + 2; i1++) {
                    accountRecording.addData.push({
                        standingBookItem : { id : data[temp].id },
                        itemValue : $("#" + data[i1].id).val() ,
                        fieldId : data[i1].fieldId
                    })
                }
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