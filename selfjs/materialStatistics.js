var materialStatistics = {
    init : function() {
        materialStatistics.funcs.renderTable();
        var out = $("#materialStatisticsPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#materialStatisticsPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,key : []
    ,pageSize : 0
    ,funcs: {
        renderTable : function() {
            /**渲染表头,获取所有数据 */
            $.get(home.urls.materialConsumptionItem.getAll(),{}, function(result) {
                var materialHead = result.data;
                $("#dynNum").attr("colspan" , materialHead.length);
                $("#dynConsume").attr("colspan" , materialHead.length);
                const $tr = $("#dynamicAdd");
                var keyDyn = materialStatistics.funcs.renderHead($tr, materialHead);
                key = materialStatistics.funcs.getHeadKey(keyDyn);
                /**获取当年1月份 */
                var currentDate = new Date().Format('yyyy');
                var startMonthDate = currentDate + "-01";
                var endMonthDate = currentDate + "-12";
                /**获取所有的记录 */
                $.get(home.urls.materialStatistics.getByStartDateAndEndDateByPage(),{
                    startDate : startMonthDate,
                    endDate : endMonthDate
                }, function(result) {
                    $("#beginDate").val(startMonthDate);
                    $("#endDate").val(endMonthDate);
                    var page = result.data;
                    var materialDatas = result.data.content;
                    var mapDatas = materialStatistics.funcs.getMapData(materialDatas);
                    const $tbody = $("#materialStatisticsTbody");
                    materialStatistics.funcs.renderHandler($tbody,mapDatas,0,key);
                    materialStatistics.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialStatisticsPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.materialStatistics.getByStartDateAndEndDateByPage(),{
                                    startDate : startMonthDate ,
                                    endDate : endMonthDate,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var materialDatas = result.data.content;
                                    var mapDatas = materialStatistics.funcs.getMapData(materialDatas);
                                    const $tbody = $("#materialStatisticsTbody");
                                    materialStatistics.funcs.renderHandler($tbody,mapDatas,obj.curr-1,key);
                                    materialStatistics.pageSize = page.size;
                                })
                            }
                        }
                    })
                })
            });
            /**绑定搜索事件 */
            materialStatistics.funcs.bingSearchEvents($("#searchButton"));
            /**绑定刷新事件 */
            materialStatistics.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定生成报表事件 */
            materialStatistics.funcs.bindreportByIdsEvents($("#reportButton"));
        }
        /**渲染数据 */
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
                    "<td><a href='#' class = 'details' id='detail-"+mapData["id"]+"'><i class='layui-icon'>&#xe642;</i></a></td>"+
                    "<td><a href='#' class = 'regenerate' id='generate-"+mapData["month"]+"'><i class='layui-icon'>&#xe642;</i></a></td>"
                );
                $tbody.append(
                    "</tr>"
                );
            });
            /**绑定详情事件 */
            materialStatistics.funcs.bindDetailEvents($(".details"));
            /**绑定重新生成事件 */
            materialStatistics.funcs.bindRegenerateEvents($(".regenerate"));
        }
        /**渲染详情数据 */
        ,renderDetails : function ($tbody, detailDatas) {
            //清空表格
            var details = detailDatas.details;
            $tbody.empty();
            details.forEach(function(detail) {
                $tbody.append(
                    "<tr>"+
                    "<td>"+ (detail.item ? detail.item.name : '')+"</td>"+
                    "<td>"+ detail.price+"</td>"+
                    "<td>"+ detail.curConsump+"</td>"+
                    "<td>"+ detail.totalConsump+"</td>"+
                    "<td>"+ detail.planUnitConsump+"</td>"+
                    "<td>"+ detail.curUnitConsump+"</td>"+
                    "<td>"+ detail.totalUnitConsump+"</td>"+
                    "<td>"+ detail.storage+"</td>"+
                    "</tr>"
                )
            });
            $tbody.append(
                "<tr>"+
                "<td colspan='2'>项目</td>"+
                "<td colspan='3'>本月</td>"+
                "<td colspan='3'>累计</td>"+
                "</tr>"
            );
            $tbody.append(
                "<tr>"+
                "<td colspan='2'>原矿处理量</td>"+
                "<td colspan='3'>"+ detailDatas.curRawOre +"</td>"+
                "<td colspan='3'>"+ detailDatas.totalRawOre +"</td>"+
                "</tr>"
            );
            detailDatas.typeDetails.forEach(function(typeDetail) {
                $tbody.append(
                    "<tr>"+
                    "<td rowspan='2'>"+ typeDetail.type.name +"</td>"+
                    "<td>成本（元）</td>"+
                    "<td colspan='3'>"+ typeDetail.curCost +"</td>"+
                    "<td colspan='3'>"+ typeDetail.totalCost +"</td>"+
                    "</tr>"+
                    "<tr>"+
                    "<td>单位成本（元）</td>"+
                    "<td colspan='3'>"+ typeDetail.curUnitCost +"</td>"+
                    "<td colspan='3'>"+ typeDetail.totalUnitCost +"</td>"+
                    "</tr>"
                )
            });
        }
        // map方法使用
        /**将数据渲染成健值对形式 */
        ,getMapData : function(results) {
            // console.log(results);
            var datas = [];

            for(var i in results){
                var result = results[i];
                // console.log(result);
                // 不能使用new map，否则会导致之数据格式不对
                var map = {};
                map["id"] = result.id||'';
                map["month"] = result.date.substring(0,4)+"-"+result.date.substr(4);
                map["date"] = (result.startDate + "至" + result.endDate)||'';
                for(var j in result.details){
                    var detail = result.details[j];
                    // console.log(detail);
                    map[detail.item.id] = detail.curConsump||'0';
                    map["unit"+detail.item.id] = detail.curUnitConsump||'0';
                }
                datas.push(map);
            }
            return datas;
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
            materialHeads.forEach(function(unit) {
                $tr.append(
                    "<td id=\""+  "unit"+unit.id +"\">"+ unit.name +"</td>"
                );
                keyDyn.push("unit"+unit.id);
            });
            $tr.append(
                "<td cliass=''>详情</td>",
                "<td>重新生成</td>"
            );
            return keyDyn;
        }
        // 获取表头的健值对
        ,getHeadKey : function(keyDyn) {
            var key = [];
            key.push("month");
            key.push("date");
            keyDyn.forEach(function(e) {
                key.push(e);
            });
            return key;
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
                $.get(home.urls.materialStatistics.getByStartDateAndEndDateByPage(),{
                    startDate : beginDates ,
                    endDate : endDates
                }, function(result) {
                    $("#beginDate").val(beginDates);
                    $("#endDate").val(endDates);
                    var page = result.data;
                    var materialDatas = result.data.content;
                    var mapDatas = materialStatistics.funcs.getMapData(materialDatas);
                    const $tbody = $("#materialStatisticsTbody");
                    materialStatistics.funcs.renderHandler($tbody,mapDatas,0,key);
                    materialStatistics.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialStatisticsPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            console.log(obj.curr - 1);
                            if(!first) {
                                $.get(home.urls.materialStatistics.getByStartDateAndEndDateByPage(),{
                                    startDate : startMonthDate ,
                                    endDate : endMonthDate,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var materialDatas = result.data.content;
                                    var mapDatas = materialStatistics.funcs.getMapData(materialDatas);
                                    const $tbody = $("#materialStatisticsTbody");
                                    materialStatistics.funcs.renderHandler($tbody,mapDatas,obj.curr-1,key);
                                    materialStatistics.pageSize = page.size;
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
                    materialStatistics.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定生成报表事件 */
        ,bindreportByIdsEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                $("#reportDate").val("");
                $("#reportForm").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '生成报表',
                    content: $("#reportForm"),
                    area: ['300px', '250px'],
                    btn: ['生成报表', '取消'],
                    offset: ['35%', '40%'],
                    closeBtn: 0,
                    yes: function(index) {
                        var reportDate = $("#reportDate").val();
                        var userStr = $.session.get('user');
                        var userJson = JSON.parse(userStr);
                        $.get(home.urls.materialStatistics.generateReport(),{
                            enterUserId : userJson.id,
                            date : reportDate
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    materialStatistics.init();
                                    clearTimeout(time);
                                }, 500);
                                $("#reportForm").css("display","none");
                                layer.close(index);
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            });
                        })
                    }
                    ,btn2: function (index) {
                        $("#reportForm").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定详情事件 */
        ,bindDetailEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr('id').substr(7);
                $.get(home.urls.materialStatistics.getById(),{
                    id : id
                },function(result) {
                    var detailData = result.data;
                    var detailTitle = "物料消耗"+detailData.date.substring(0,4)+"年"+detailData.date.substr(5)+"月报表";
                    var detailDate = detailData.date.substring(0,4)+"-"+detailData.date.substr(5);
                    console.log(detailDate);
                    //填充表格数据
                    // console.log(detailData);
                    const $tbody = $("#statisticsDetailTbody");
                    materialStatistics.funcs.renderDetails($tbody,detailData);
                    $("#detailsWindow").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: detailTitle,
                        content: $("#detailsWindow"),
                        area: ['80%', '70%'],
                        btn: ['导出', '取消'],
                        offset: ['10%', '10%'],
                        closeBtn: 0,
                        yes: function(index) {
                            var href = home.urls.materialStatistics.exportByDate()+"?date=" + detailDate;
                            location.href = href;
                        }
                        ,btn2: function (index) {
                            $("#detailsWindow").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        /**绑定重新生成事件 */
        ,bindRegenerateEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var userStr = $.session.get('user');
                var userJson = JSON.parse(userStr);
                var date = $(this).attr('id').substr(9);
                $.get(home.urls.materialStatistics.reGenerateReport(),{
                    enterUserId : userJson.id,
                    date : date
                },function(result) {
                    if (result.code === 0) {
                        var time = setTimeout(function () {
                            materialStatistics.init();
                            clearTimeout(time);
                        }, 500);
                    }
                    layer.msg(result.message, {
                        offset: ['40%', '55%'],
                        time: 700
                    });
                })
            })
        }
    }
};