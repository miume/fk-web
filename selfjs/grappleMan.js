var grapple ={
    init : function(){
        grapple.funcs.renderTable();
        var out = $("#grapplepage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#grapplepage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable:function(){
            /**渲染当天数据 */
            var startDate = $('#startTime').val()
            var endDate = $('#endTime').val()
            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                startDate : startDate,
                endDate : endDate
            },function(result){
                var grapples = result.data.content;
                const $tbody = $('#grappleTable').children('tbody');
                grapple.funcs.renderHandler($tbody,grapples,0);
                grapple.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "grapplepage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var grapples = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#grappleTable").children("tbody");
                                grapple.funcs.renderHandler($tbody, grapples, page);
                                grapple.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定数据录入事件 */
            grapple.funcs.bindAddEvents($("#addButton"));
            /**绑定批量删除事件 */
            grapple.funcs.bindDeleteEvents($("#deleteButton"));
            /**绑定刷新事件 */
            grapple.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定查询事件 */
            grapple.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定数据录入事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#selected").val("");
                grapple.funcs.renderInit();
                $("#confirm").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "确认",
                    content : $("#confirm"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes : function(index){
                        var value = $("#sel").val();
                        $.get(home.urls.truckLoading.isExists(),{
                            id : value,
                        },function(result){
                            if(!result.data){
                                $("#confirm").addClass("hide");
                                layer.close(index);                              
                                $("#modal").removeClass("hide");
                                layer.open({
                                    type: 1,
                                    title: "新增",
                                    content: $("#modal"),
                                    area: ['80%', '70%'],
                                    btn: ['保存', '取消'],
                                    offset: ['10%', '10%'],
                                    closeBtn: 0,
                                    yes : function(index){
                                        var clazzId = $("#sel").val();
                                        var userStr = $.session.get('user');
                                        var userJson = JSON.parse(userStr);
                                        var dispatcherId = userJson.id;
                                        var reporterId = $("#reporter").val();
                                    }
                                    ,btn2 : function(index) {
                                        $("#modal").css("display","none");
                                        layer,close(index);
                                    }
                                })
                            }
                        })
                    }
                    ,btn2 : function(index) {
                        $("#confirm").css("display","none");
                        layer,close(index);
                    }
                })
            })
        }
        /**渲染数据录入的初始化页面 */
        ,renderInit : function(){
            $("#reporter").empty()
            $("#reporter").removeAttr("disabled")
            $.get(home.urls.user.getAll(),{},function(result){
                var userData = result.data;
                userData.forEach(function(e){
                    $("#reporter").append("<option value='"+e.id+"'>"+e.name+"</option>");
                })
            })
            $("#time").removeAttr("disabled")
            $("#reportChartTbody").empty();
            /**绑定添加一行事件 */
            grapple.funcs.bindAddRow($("#addRow"));
        }
        /**添加一行事件 */
        ,bindAddRow : function(buttons){
            buttons.off('click').on('click',function(){
                $("#addMaterial").empty();
                $.get(home.urls.MaterialItem.getAll(),{},function(result){
                    var materialItem = result.data;
                    materialItem.forEach(function(e){
                        $("#addMaterial").append("<option value='"+e.id+"'>"+e.name+"</option>");
                    }) 
                })
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#addModal"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes : function(index){
                        var item = $("#addMaterial").text();
                        var itemId = $("#addMaterial").val();
                        const $reportChartTbody = $("#reportChartTbody");
                        grapple.funcs.renderAdd($reportChartTbody,item,itemId);
                        $("#addModal").addClass("hide");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#addModal").addClass("hide");
                        layer,close(index);
                    }
                })
            })
        }
        /**渲染添加一行后数据录入的页面 */
        ,renderAdd : function($tbody,item,itemId){

        }
        /**渲染数据 */
        ,renderHandler : function($tbody,grapples,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10 ;
            grapples.forEach(function(e){
                $tbody.append(
                    "<tr>"+
                    "<td><input type='checkbox' value="+e.id+" class='grapple-checkbox'></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.code)+"</td>" +
                    "<td>"+(e.date)+"</td>" +
                    "<td>"+(e.clazz.name)+"</td>" +
                    "<td>"+(e.dispatcher.name)+"</td>" +
                    "<td>"+(e.reporter.name)+"</td>" +
                    "<td><a href='#' class ='view' id='view-"+(e.id)+"'>查看明细</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class ='modify' id='modify-"+(e.id)+"'>修改明细</a></td>" +
                    "</tr>"
                )
            })

            /**实现全选 */
            var checkedBoxLength = $(".grapple_checkbox:checked").length;
            home.funcs.bindselectAll($("#grapple_checkAll"), $(".grapple_checkbox"), checkedBoxLength, $("#grappleTable"));
            /**绑定查看明细事件 */
            grapple.funcs.bindViewEvents($('.view'));
            /**绑定修改明细事件 */
            grapple.funcs.bindModifyEvents($('.modify'));
        }
        /**map渲染 */
        ,getMapData : function(results){
            var datas = {};
            for(var i in results) {
                var result = results[i];
                var key = result.item.id;
                var maps = [];
                if(datas[key] != undefined){
                    maps = datas[key];
                }
                // console.log(maps)
                var map = {};
                map["id"] = result.id||"";
                map["item"] = result.item&&result.item.name||"";
                map["rank"] = result.rank||"";
                map["sendTime"] = result.sendTime||"";
                map["num"] = result.num||"";
                map["orebin"] = result.orebin.name||"";
                map["contrapositionTime"] = result.contrapositionTime||"";
                map["makeUpTime"] = result.makeUpTime||"";
                map["finishTime"] = result.finishTime||"";
                map["weighTime"] = result.weighTime||"";
                map["note"] = result.note||"";
                maps.push(map);
                datas[key] = maps;
                console.log(datas);
            }
            return datas;
        }
        /**查看明细事件 */
        ,bindViewEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(".view").attr("id").substr(5);
                $("#reporter").empty();
                $.get(home.urls.MaterialItem.getAll(),{},function(result){
                    var keys = [];
                    var materialItem = result.data;
                    materialItem.forEach(function(e){
                        keys.push(e.id)
                    })
                    $.get(home.urls.truckLoading.getById(),{id : id},function(result){
                        var details = result.data.details
                        var datas = grapple.funcs.getMapData(details);
                        var name = result.data.reporter.name
                        $("#reporter").append("<option value='"+result.data.reporter.id+"'>"+name+"</option>").attr("disabled","disabled")
                        $("#time").attr("disabled","disable")
                        const $tbody = $("#reportChartTbody");
                        grapple.funcs.renderDeatil($tbody,datas,keys);
                        $("#modal").removeClass("hide")
                        layer.open({
                            type: 1,
                            title: "明细",
                            content: $("#modal"),
                            area: ['80%', '70%'],
                            btn: ['导出', '取消'],
                            offset: ['10%', '10%'],
                            closeBtn: 0,
                            yes : function(index){
                                var href = home.urls.truckLoading.exportById()+"?id=" + id;
                                location.href = href;
                            }
                            ,btn2: function (index) {
                                $("#modal").css("display","none");
                                layer.close(index);
                            }
                        })
                    })
                })
            })
        }
        /**渲染详情数据 */
        ,renderDeatil : function($tbody,datas,keys){
            $tbody.empty();
            keys.forEach((key)=>{
                var data = datas[key];
                // console.log("==========");
                // console.log(data);
                var flag = 0;
                // 2.循环写数据
                data.forEach((d)=>{
                    if(flag == 0){
                        flag = flag + 1;
                        // 1.写类型
                        $tbody.append(
                            "<tr>" +
                            "<td rowspan='"+data.length+"'>" + data[0].item+"</td>" +
                            "<td>"+ data[0].rank +"</td>" +
                            "<td>"+ data[0].sendTime +"</td>" +
                            "<td>"+ data[0].num +"</td>" +
                            "<td>"+ data[0].orebin +"</td>" +
                            "<td>"+ data[0].contrapositionTime +"</td>" +
                            "<td>"+ data[0].makeUpTime +"</td>" +
                            "<td>"+ data[0].finishTime +"</td>" +
                            "<td>"+ data[0].weighTime +"</td>" +
                            "<td><a href='#' class='delete' ><i class='layui-icon'>&#xe640;</i></a></td>" +
                            "<td>"+ data[0].note +"</td>" +                                      
                            "</tr>"      
                        );
                    } else {
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ data[flag].rank +"</td>" +
                            "<td>"+ data[flag].sendTime +"</td>" +
                            "<td>"+ data[flag].num +"</td>" +
                            "<td>"+ data[flag].orebin +"</td>" +
                            "<td>"+ data[flag].contrapositionTime +"</td>" +
                            "<td>"+ data[flag].makeUpTime +"</td>" +
                            "<td>"+ data[flag].finishTime +"</td>" +
                            "<td>"+ data[flag].weighTime +"</td>" +
                            "<td><a href='#' class='delete'><i class='layui-icon'>&#xe640;</i></a></td>" +
                            "<td>"+ data[flag].note +"</td>" +                                      
                            "</tr>"  
                        );
                        flag++;
                    }
                })
            })
        }
    }
}