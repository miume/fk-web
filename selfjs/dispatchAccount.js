var dispatchAccount = {
    addData : [],
    init : function() {
        dispatchAccount.funcs.bindSearchEvent($("#search"));
        $.get(home.urls.dataDictionary.getAllDataByTypeId(),{
            id : 1
        }, function(result) {
            var cycle = result.data;
            $("#cycleName").empty();
            $("#cycleName").html("<option value='-1'>请选择班次</option>");
            cycle.forEach(function(e) {
                $("#cycleName").append("<option value="+ (e.id) + ">"+ (e.dicName) +"</option>");
            })
        })
    }
    ,funcs : {
        bindSearchEvent : function(buttons) {
            buttons.off('click').on('click', function() {
                var date = $("#inputDate").val();
                var scheduleId = $("#cycleName").val();
                //console.log(scheduleId)
                if(!date || scheduleId==='-1') {
                    layer.msg("请选择时间和班次");
                    return
                }
                $.get(home.urls.dispatchAccount.generateStandingBook(),{
                    date : date,
                    scheduleId : scheduleId
                },function(result) {
                    var items = result.data;
                    if(items === null) {
                        layer.msg(result.message);
                        return
                    }
                    dispatchAccount.funcs.renderHeader(items.sectionInfos);
                })
                /**绑定生成生产调度台账记录 */
                dispatchAccount.funcs.bindAddDispatchAccount($("#save"));
                /**取消生成生产调度台账记录 */
                dispatchAccount.funcs.bindCancleDispatchAccount($("#cancel"));
            })
        }
        ,renderHeader : function(data) {
            $("#tab").removeClass("hide");
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
            dispatchAccount.funcs.bindAppendThead($table1,brokenSection);
            dispatchAccount.funcs.bindAppendThead($table2,grindingSection);
            dispatchAccount.funcs.bindAppendThead($table3,concentrateSection);
            dispatchAccount.funcs.bindAppendThead($table4,tailingSection);
            
            /**绑定选项卡切换事件 */
            var clickA = $(".list ul").children(".options");
            console.log(clickA)
            dispatchAccount.funcs.bindClickChangeEvents(clickA);
        }
        ,bindAppendThead : function($table,data) {
            $table.empty();
            //先渲染每个表格的大标题，然后每个大标题在单独渲染
            data.forEach(function(e) {
                var theadId = "thead-"+e.id;
                $table.append("<tr id="+ (theadId) +" style='border-right:none;'><td colspan='6' class='grey'>"+ (e.itemTypeName) +"</td></tr>");
                var standingBookItemList = e.standingBookItemList;
                dispatchAccount.funcs.appendRows(standingBookItemList,theadId);
            })
        }
        ,appendRows : function(data,theadId) {
            //console.log(data.length)
            /**每行显示三个字段，如果data.length能被3整除，直接每行三条数据渲染，不需要判断；若不能被3整除，则需要判断 */
                for( var i = 0; i < parseInt(data.length / 3); i++ ) {
                    $("#"+theadId).append("<tr><td class='grey'>"+ (data[3*i].itemName) +"</td><td><input id="+ (data[3*i].id) +" type='text' /></td><td class='grey'>"+ (data[3*i+1].itemName) +"</td><td><input id="+ (data[3*i+1].id) +" type='text' /></td><td class='grey'>"+ (data[3*i+2].itemName) +"</td><td><input id="+ (data[3*i+2].id) +" type='text' /></td></tr>")
                    for(var i1 = 3 * i; i1 < 3 * i + 3; i1++) {
                        dispatchAccount.addData.push({
                            standingBookItem : { id : data[i1].id },
                            itemValue : $("#" + data[i1].id).val() ,
                            fieldId : data[i1].fieldId
                        })
                    } 
                }  
                var temp = parseInt(data.length / 3) * 3 ;
                if(data.length % 3 === 1){
                    $("#"+theadId).append("<tr><td class='grey'>"+ (data[temp].itemName) +"</td><td><input id="+ (data[temp].id) +" type='text' /><td colspan='2' class='grey'></td><td colspan='2' class='grey'></td></tr>");
                    dispatchAccount.addData.push({
                        standingBookItem : { id : data[temp].id },
                        itemValue : $("#" + data[temp].id).val() ,
                        fieldId : data[temp].fieldId
                    })
                }        
                if(data.length % 3 === 2){
                    $("#"+theadId).append("<tr><td class='grey'>"+ (data[temp].itemName) +"</td><td><input id="+ (data[temp].id) +" type='text' /><td class='grey'>"+ (data[temp+1].itemName) +"</td><td><input id="+ (data[temp+1].id) +" type='text' /></td><td class='grey'></td><td class='grey'></td></tr>");
                    for(var i1 = temp; i1 < temp + 2; i1++) {
                        dispatchAccount.addData.push({
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
                //console.log(tableId)
                $(".list .selected").removeClass("selected");
                $(this).addClass("selected");
                $(".table .selectedTable").removeClass("selectedTable").addClass("hide");
                $(tableId).removeClass("hide").addClass("selectedTable");
            })
           
        }
        ,bindAddDispatchAccount : function(buttons) {
            buttons.off('click').on('click', function() {
                console.log(dispatchAccount.addData)
                layer.open({
                    type : 1,
                    title : "新增",
                    content : "<h5 style='text-align:center;'>确定生成调度台账</h5>",
                    area : ['200px', '140px'],
                    offset : ['40%', '55%'],
                    btn : ['确定','取消'],
                    closeBtn : 0,
                    yes : function(index) {
                        dispatchAccount.addData.forEach(function(e) {
                            var item = e.standingBookItem.id;
                            e.itemValue = $("#"+item).val();
                        })
                        /**获取当前登录用户的信息 */
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            date : new Date($("#inputDate").val()).getTime(),
                            user : { id : userJson.id},
                            dataDictionary : { id : $("#cycleName").val() },
                            standingBookDetailList : dispatchAccount.addData
                        }
                        $.ajax({
                            url : home.urls.dispatchAccount.add(),
                            contentType : "application/json" ,
                            dataType : "JSON",
                            type : "post",
                            data : JSON.stringify(data),
                            success : function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        dispatchAccount.init();
                                        clearTimeout(time);
                                    },500)
                                }
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                            }
                        })
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                })
            })
        }
        ,bindCancleDispatchAccount : function(buttons){
            buttons.off('click').on('click',function() {
                $("#tab").hide();
            })
        }
    }
}