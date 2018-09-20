var materialManagement = {
    init: function() {
        /**获取物料管理信息分页显示 */
        materialManagement.funcs.renderTable();

        var out = $("#materialManagementPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#materialManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,count : 0
    ,count_data : 0
    ,key : []
    ,funcs: {
        /**渲染页面 */
        renderTable: function() {
            /**渲染表头,获取所有数据 */
            $.get(home.urls.materialConsumptionItem.getAll(),{}, function(result) {
                var materialHead = result.data;
                // 渲染表头

                $("#dynNum").attr("colspan" , materialHead.length);
                const $tr = $("#dynamicAdd");
                // 获取表头的健值对
                var keyDyn = materialManagement.funcs.renderHead($tr, materialHead);
                key = materialManagement.funcs.getHeadKey(keyDyn);
                /**获取当前日期 */
                // .Format('yyyy-MM-dd')
                var currentDate = new Date().Format('yyyy-MM-dd');
                /**获取前一个月日期 */
                var preMonthDate = materialManagement.funcs.getPreMonth();
                /**获取所有的记录 */
                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                    startDate : preMonthDate ,
                    endDate : currentDate
                }, function(result) {
                    $("#beginDate").val(preMonthDate);
                    $("#endDate").val(currentDate);
                    var page = result.data;
                    var materialItems = result.data.content;
                    var mapDatas = materialManagement.funcs.getMapData(materialItems);
                    const $tbody = $("#materialItemTbody");
                    // const $tbody = $("#materialManagementTable").children("tbody");
                    materialManagement.funcs.renderHandler($tbody,mapDatas,0,key);
                    materialManagement.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialManagementPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            console.log(obj.curr - 1);
                            if(!first) {
                                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                                    startDate : preMonthDate ,
                                    endDate : currentDate,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var materialItems = result.data.content;
                                    var mapDatas = materialManagement.funcs.getMapData(materialItems);
                                    const $tbody = $("#materialItemTbody");
                                    materialManagement.funcs.renderHandler($tbody,mapDatas,obj.curr-1,key);
                                    materialManagement.pageSize = page.size;
                                })
                            }
                        }
                    })
                })
            });
            /**绑定搜索事件 */
            materialManagement.funcs.bingSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            materialManagement.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定刷新事件 */
            materialManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定数据录入事件 */
            materialManagement.funcs.bindAddByIdsEvents($("#addButton"));
        }
        /**渲染表头 */
        ,renderHead : function($tr , materialHeads) {
            $tr.empty();
            var keyDyn = [];
            materialHeads.forEach(function(e) {
                $tr.append(
                    "<td id=\""+  e.id +"\">"+ e.name +"</td>"
                );
                keyDyn.push(e.id);
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
            // console.log(key);
            return key;
        }
        /**渲染数据 */
        ,renderHandler : function ($tbody, mapDatas, page , keys) {
            //清空表格
            $tbody.empty();
            // var i = 1 + page * 10;
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
                    "<td><a href='#' class = 'editor' id='edit-"+mapData["id"]+"'><i class='layui-icon'>&#xe642;</i></a></td>"
                );
                $tbody.append(
                    "</tr>"
                );
            });
             /**绑定编辑操作名称事件 */
             materialManagement.funcs.bindEditEvents($(".editor"));
        }
        /**将数据渲染成健值对形式 */
        ,getMapData : function (results) {
            var datas = [];
            for(var i in results) {
                var result = results[i];
                var map = {};
                map["id"] = result.id||"";
                map["date"] = result.date||"";
                map["enterTime"] = result.enterTime||"";
                map["enterUser"] = result.enterUser&&result.enterUser.name||"";
                map["modifyTime"] = result.modifyTime||"";
                map["modifyUser"] = result.modifyUser&&result.modifyUser.name||"";
                for(var j in result.materialConsumptionDetails){
                    var detail = result.materialConsumptionDetails[j];
                    map[detail.item.id] = detail.value||"";
                }
                datas.push(map);
            }
            return datas;
        }
        /**动态得到对象中数组的元素 */
        ,getArrayDate : function(result){
            var arrayDate ={};
            for(var i=0 ; i<result.length; i++){
                arrayDate = arrayDate + "<td>"+ (result[i] ? result[i].value : ' ') +"</td>";
            }
            return arrayDate;
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
        /**绑定搜索事件 */
        ,bingSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                if(beginDates === "" && endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                    startDate : beginDates ,
                    endDate : endDates
                }, function(result) {
                    $("#beginDate").val(beginDates);
                    $("#endDate").val(endDates);
                    var page = result.data;
                    var materialItems = result.data.content;
                    var mapDatas = materialManagement.funcs.getMapData(materialItems);
                    const $tbody = $("#materialItemTbody");
                    // const $tbody = $("#materialManagementTable").children("tbody");
                    materialManagement.funcs.renderHandler($tbody,mapDatas,0,key);
                    materialManagement.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialManagementPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            console.log(obj.curr - 1);
                            if(!first) {
                                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                                    startDate : beginDates ,
                                    endDate : endDates,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var materialItems = result.data.content;
                                    var mapDatas = materialManagement.funcs.getMapData(materialItems);
                                    const $tbody = $("#materialItemTbody");
                                    materialManagement.funcs.renderHandler($tbody,mapDatas,obj.curr-1,key);
                                    materialManagement.pageSize = page.size;
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
                    })
                    materialManagement.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定导出事件 */
        ,bingDownloadEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                if(beginDates === "" || endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                var href = home.urls.materialConsumptionManagement.exportByStartDateAndEndDate()+"?startDate="+ beginDates + "&endDate=" + endDates;
                $("#downloadA").attr("href",href);
             
            })
        }
        /**绑定编辑事件 */
        ,bindEditEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(5);
                // 清空操作
                $("#inputDate").val("");
                $.get(home.urls.materialConsumptionItem.getAll(),{},function(result) {
                    var materialConsumptions = result.data;
                    var itemLength = materialConsumptions.length;
                    const $materialAddTbody = $("#materialAddTbody");
                    materialManagement.funcs.addWindowStyle($materialAddTbody,materialConsumptions);
                    $.get(home.urls.materialConsumptionManagement.getById(),{ id:id },function(result) {
                        var materialItems = result.data.materialConsumptionDetails;
                        materialItems.forEach(function(materialItem) {
                            $(".win-"+materialItem.item.id).attr("value" , materialItem.value);
                        })
                        $("#inputDate").val(result.data.date);
                        $("#inputDate").attr("disabled","disable");
                    });
                    var materialArrays = [];
                    $("#addModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#addModal"),
                        area: ['50%', '50%'],
                        btn: ['确认', '取消'],
                        offset: ['25%', '25%'],
                        closeBtn: 0,
                        yes: function(index) {
                            // 实现json格式传数据
                            var userStr = $.session.get('user');
                            var userJson = JSON.parse(userStr);
                            for(var k=0; k<itemLength; k++){
                                materialArrays.push({
                                    item : { id : materialConsumptions[k].id },
                                    value : $(".win-"+materialConsumptions[k].id).val()
                                })
                            }
                            var data = {
                                id : id,
                                modifyUser : { id : userJson.id},
                                materialConsumptionDetails : []
                            };
                            data.materialConsumptionDetails = materialArrays;
                            $.ajax({
                                url: home.urls.materialConsumptionManagement.update(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            materialManagement.init()
                                            clearTimeout(time)
                                        }, 500);
                                        $("#addModal").css("display","none");
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
                            $("#addModal").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }

        /**绑定数据录入事件 */
        ,bindAddByIdsEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                $("#inputDate").val("");
                $("#inputDate").removeAttr("disabled");
                $.get(home.urls.materialConsumptionItem.getAll(),{},function(result) {
                    var materialConsumptions = result.data;
                    var itemLength = materialConsumptions.length;
                    const $materialAddTbody = $("#materialAddTbody");
                    materialManagement.funcs.addWindowStyle($materialAddTbody,materialConsumptions);
                    var materialArrays = [];
                    $("#addModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '数据录入',
                        content: $("#addModal"),
                        area: ['50%', '50%'],
                        btn: ['确认', '取消'],
                        offset: ['25%', '25%'],
                        closeBtn: 0,
                        yes: function(index) {
                            // 实现json格式传数据
                            var inputDate = $("#inputDate").val();
                            var userStr = $.session.get('user');
                            var userJson = JSON.parse(userStr);
                            // 数组内容数据
                            for(var k=0; k<itemLength; k++){
                                materialArrays.push({
                                    item : { id : materialConsumptions[k].id },
                                    value : $(".win-"+materialConsumptions[k].id).val()
                                })
                            }
                            var data = {
                                date : inputDate,
                                enterUser : { id : userJson.id },
                                materialConsumptionDetails : []
                            };
                            data.materialConsumptionDetails = materialArrays;
                            $.ajax({
                                url: home.urls.materialConsumptionManagement.add(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            materialManagement.init()
                                            clearTimeout(time)
                                        }, 500);
                                        $("#addModal").css("display","none");
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
                            $("#addModal").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })

        }
        /**新增窗口样式操作 */
        ,addWindowStyle : function($materialAddTbody, materialConsumptions ) {
            $materialAddTbody.empty();
            var itemLength = materialConsumptions.length;
            for(var j=0; j<itemLength;j=j+2) {
                if(materialConsumptions[j+1]){
                    $materialAddTbody.append(
                        "<tr>"+
                        "<td>" + (materialConsumptions[j] ? materialConsumptions[j].name:'') + ":&nbsp;</td>"+
                        "<td><input style='width:100%;height: 100%;border:none;text-align:center' type=\"text\" class=\"win-"+(materialConsumptions[j] ? materialConsumptions[j].id:'')+"\"  /></td>"+
                        "<td>" + (materialConsumptions[j+1] ? materialConsumptions[j+1].name:'') + ":&nbsp;</td>"+
                        "<td><input style='width:100%;height: 100%;border:none;text-align:center' type=\"text\" class=\"win-"+(materialConsumptions[j+1] ? materialConsumptions[j+1].id:'')+"\"  /></td>"+
                        "</tr>"
                    )
                }else{
                    $dynTable.append(
                        "<tr>"+
                        "<td>" + (materialConsumptions[j] ? materialConsumptions[j].name:'') + ":&nbsp;</td>"+
                        "<td><input style='width:100%;height: 100%;border:none;text-align:center' type=\"text\" class=\"win-"+(materialConsumptions[j] ? materialConsumptions[j].id:'')+"\"  /></td>"+
                        "</tr>"
                    )
                }
            }
        }
    }
};