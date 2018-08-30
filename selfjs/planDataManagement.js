var planDataManagement = {
    init : function() {
        planDataManagement.funcs.renderTable();
        var out = $("#planDataManagementPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#planDataManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    },key : []
    ,funcs : {
        renderTable : function() {
            /**渲染表头,获取表头所有数据，并在其插入数组中 */
            $.get(home.urls.materialConsumptionItem.getAll(),{}, function(result) {
                var materialHead = result.data;
                $("#unitPrice").attr("colspan" , materialHead.length);
                $("#planConsume").attr("colspan" , materialHead.length);
                $("#storageNum").attr("colspan" , materialHead.length);
                const $tr = $("#dynamicAdd");
                var keyDyn = planDataManagement.funcs.renderHead($tr, materialHead);
                key = planDataManagement.funcs.getHeadKey(keyDyn);
                /**获取当年1和12月份 */
                var currentDate = new Date().Format('yyyy');
                var startMonthDate = currentDate + "-01";
                var endMonthDate = currentDate + "-12";
                /**获取所有的记录 */
                $.get(home.urls.planDataManagement.getByStartDateAndEndDateByPage(),{
                    startDate : startMonthDate,
                    endDate : endMonthDate
                }, function(result) {
                    $("#beginDate").val(startMonthDate);
                    $("#endDate").val(endMonthDate);
                    var page = result.data;
                    var planDatas = result.data.content;
                    var mapDatas = planDataManagement.funcs.getMapData(planDatas);
                    const $tbody = $("#planDataManagementTbody");
                    planDataManagement.funcs.renderHandler($tbody,mapDatas,0,key);
                    planDataManagement.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "planDataManagementPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.planDataManagement.getByStartDateAndEndDateByPage(),{
                                    startDate : startMonthDate ,
                                    endDate : endMonthDate,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var planDatas = result.data.content;
                                    var mapDatas = planDataManagement.funcs.getMapData(planDatas);
                                    const $tbody = $("#planDataManagementTbody");
                                    planDataManagement.funcs.renderHandler($tbody,mapDatas,obj.curr-1,key);
                                    planDataManagement.pageSize = page.size;
                                })
                            }
                        }
                    })
                })
            });
            /**绑定搜索事件 */
            planDataManagement.funcs.bingSearchEvents($("#searchButton"));
            /**绑定刷新事件 */
            planDataManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定数据录入事件 */
            planDataManagement.funcs.bindAddByIdsEvents($("#addButton"));
        }
        /**渲染表头 */
        ,renderHead : function($tr , materialHeads) {
            $tr.empty();
            var keyDyn = [];
            materialHeads.forEach(function(e) {
                $tr.append(
                    "<td id=\""+ "price" + e.id +"\">"+ e.name +"</td>"
                );
                keyDyn.push("price"+e.id);
            });
            materialHeads.forEach(function(e) {
                $tr.append(
                    "<td id=\""+ "plan" + e.id +"\">"+ e.name +"</td>"
                );
                keyDyn.push("plan"+e.id);
            });
            materialHeads.forEach(function(e) {
                $tr.append(
                    "<td id=\""+ "storage" + e.id +"\">"+ e.name +"</td>"
                );
                keyDyn.push("storage"+e.id);
            });
            return keyDyn;
        }
        // 获取表头的健值对
        ,getHeadKey : function(keyDyn) {
            var key = [];
            key.push("date");
            keyDyn.forEach(function(e) {
                key.push(e);
            });
            key.push("enterTime");
            key.push("enterUser");
            key.push("modifyTime");
            key.push("modifyUser");
            return key;
        }
        /**将数据渲染成健值对形式 */
        ,getMapData : function(results) {
            // console.log(results);
            var datas = [];
            for(var i in results){
                var result = results[i];
                // 不能使用new map，否则会导致之数据格式不对
                var map = {};
                map["id"] = result.id||'';
                map["date"] = result.date.substring(0,4)+"-"+result.date.substr(4);
                for(var j in result.details){
                    var detail = result.details[j];
                    map["price"+detail.item.id] = detail.price||'';
                    map["plan"+detail.item.id] = detail.planUnitConsumption||'';
                    map["storage"+detail.item.id] = detail.storage||'';
                }
                map["enterTime"] = result.enterTime||'';
                map["enterUser"] = result.enterUser&&result.enterUser.name||'';
                map["modifyTime"] = result.modifyTime||'';
                map["modifyUser"] = result.modifyUser&&result.modifyUser.name||'';
                datas.push(map);
            }
            return datas;
        }
        ,renderHandler : function ($tbody, mapDatas, page , keys) {
            $tbody.empty();
            mapDatas.forEach(function(mapData) {
                $tbody.append(
                    "<tr>"
                );
                keys.forEach(function(key){
                    $tbody.append(
                        "<td>"+ (mapData[key]||"") +"</td>"
                    );
                });
                $tbody.append(
                    "<td><a href='#' class = 'editor' id='edit-"+mapData["id"]+"'><i class='layui-icon'>&#xe642;</i></a></td>",
                );
                $tbody.append(
                    "</tr>"
                );
            });
            /**绑定编辑事件 */
            planDataManagement.funcs.bindEditorEvents($(".editor"));
        }
        /**绑定搜索事件 */
        ,bingSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                if(beginDates === "" && endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                $.get(home.urls.planDataManagement.getByStartDateAndEndDateByPage(),{
                    startDate : beginDates,
                    endDate : endDates
                }, function(result) {
                    $("#beginDate").val(beginDates);
                    $("#endDate").val(endDates);
                    var page = result.data;
                    var planDatas = result.data.content;
                    var mapDatas = planDataManagement.funcs.getMapData(planDatas);
                    const $tbody = $("#planDataManagementTbody");
                    planDataManagement.funcs.renderHandler($tbody,mapDatas,0,key);
                    planDataManagement.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "planDataManagementPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.planDataManagement.getByStartDateAndEndDateByPage(),{
                                    startDate : beginDates ,
                                    endDate : endDates,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var planDatas = result.data.content;
                                    var mapDatas = planDataManagement.funcs.getMapData(planDatas);
                                    const $tbody = $("#planDataManagementTbody");
                                    planDataManagement.funcs.renderHandler($tbody,mapDatas,obj.curr-1,key);
                                    planDataManagement.pageSize = page.size;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var index = layer.load(2, { offset : ['40%','50%']});
                var time = setTimeout(function(){
                    layer.msg('刷新成功', {
                        offset : ['40%','50%'],
                        time : 700
                    });
                    planDataManagement.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定数据录入事件 */
        ,bindAddByIdsEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                // 清空操作
                $("#inputDate").val("");
                $("#inputDate").removeAttr("disabled");
                $.get(home.urls.materialConsumptionItem.getAll(),{},function(result) {
                   var materialConsumptions = result.data;
                   const $planDataAddTbody = $("#planDataAddTbody");
                   planDataManagement.funcs.addWindowStyle($planDataAddTbody,materialConsumptions);
                   var planDetailsDatas = [];
                    $("#addDateWindow").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: "数据录入",
                        content: $("#addDateWindow"),
                        area: ['50%', '50%'],
                        btn: ['确定', '取消'],
                        offset: ['30%', '25%'],
                        closeBtn: 0,
                        yes: function(index) {
                            // 组装json格式传数据
                            var inputDate = $("#inputDate").val().substring(0,4)+$("#inputDate").val().substr(5);
                            var userStr = $.session.get('user');
                            var userJson = JSON.parse(userStr);
                            materialConsumptions.forEach(function(details) {
                                var id = details.id;
                                planDetailsDatas.push({
                                    item : { id : id },
                                    price : $("#price-"+id).val(),
                                    planUnitConsumption : $("#plan-"+id).val(),
                                    storage : $("#storage-"+id).val()
                                });
                            });
                            var data = {
                                date : inputDate,
                                enterUser : { id : userJson.id },
                                details : []
                            };
                            data.details = planDetailsDatas;
                            $.ajax({
                                url: home.urls.planDataManagement.add(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            planDataManagement.init();
                                            clearTimeout(time)
                                        }, 500);
                                        $("#addDateWindow").css("display","none");
                                        layer.close(index);
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                }
                            })
                        }
                        ,btn2: function (index) {
                            $("#addDateWindow").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        /**新增窗口样式操作 */
        ,addWindowStyle : function($planDataAddTbody,materialConsumptions) {
            $planDataAddTbody.empty();
            materialConsumptions.forEach(function(e) {
                $planDataAddTbody.append(
                    "<tr>"+
                    "<td>"+e.name+"</td>"+
                    "<td>"+"<input id='price-"+ e.id+ "' type='text' style='width:100%;height: 100%;border:none;text-align:center'\>"+"</td>"+
                    "<td>"+"<input id='plan-"+ e.id+ "' type='text' style='width:100%;height: 100%;border:none;text-align:center' \>"+"</td>"+
                    "<td>"+"<input id='storage-"+ e.id+ "' type='text' style='width:100%;height: 100%;border:none;text-align:center' \>"+"</td>"+
                    "</tr>"
                )
            })

        }
        /**绑定编辑事件 */
        ,bindEditorEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(5);
                // console.log(id);
                $.get(home.urls.materialConsumptionItem.getAll(),{},function(result) {
                    var materialConsumptions = result.data;
                    const $planDataAddTbody = $("#planDataAddTbody");
                    planDataManagement.funcs.addWindowStyle($planDataAddTbody,materialConsumptions);
                    $.get(home.urls.planDataManagement.getById(),{ id:id }, function(result) {
                        var planDatas = result.data;
                        var planDataDetails = planDatas.details;
                        var planDate = planDatas.date.substring(0,4)+"-"+planDatas.date.substr(4);
                        $("#inputDate").val(planDate);
                        $("#inputDate").attr("disabled","disable");
                        // console.log(planDataDetails);
                        planDataDetails.forEach(function(detail) {
                            $("#price-"+detail.item.id).attr("value",detail.price);
                            $("#plan-"+detail.item.id).attr("value",detail.price);
                            $("#storage-"+detail.item.id).attr("value",detail.price);
                        });
                    });
                    $("#addDateWindow").removeClass("hide");
                    var planDetailsDatas = [];
                    layer.open({
                        type: 1,
                        title: "编辑",
                        content: $("#addDateWindow"),
                        area: ['50%', '60%'],
                        btn: ['确定', '取消'],
                        offset: ['20%', '25%'],
                        closeBtn: 0,
                        yes: function(index) {
                            // 组装json格式传数据
                            var inputDate = $("#inputDate").val().substring(0,4)+$("#inputDate").val().substr(5);
                            var userStr = $.session.get('user');
                            var userJson = JSON.parse(userStr);
                            materialConsumptions.forEach(function(details) {
                                var id = details.id;
                                planDetailsDatas.push({
                                    item : { id : id },
                                    price : $("#price-"+id).val(),
                                    planUnitConsumption : $("#plan-"+id).val(),
                                    storage : $("#storage-"+id).val()
                                });
                            });
                            var data = {
                                id : id,
                                modifyUser : { id : userJson.id },
                                details : []
                            };
                            data.details = planDetailsDatas;
                            $.ajax({
                                url: home.urls.planDataManagement.update(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            planDataManagement.init();
                                            clearTimeout(time)
                                        }, 500);
                                        $("#addDateWindow").css("display","none");
                                        layer.close(index);
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                }
                            })
                        }
                        ,btn2: function (index) {
                            $("#addDateWindow").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
    }
};