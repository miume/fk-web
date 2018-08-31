var grapple = {
    init :function(){
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
            /**渲染表头，获取当天数据 */
            var startDate = $('#startTime').val()
            var endDate = $('#endTime').val()
            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                startDate : startDate,
                endDate : endDate,
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
        /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var index = layer.load(2, { offset : ['40%','50%']});
                var time = setTimeout(function(){
                    layer.msg('刷新成功', {
                        offset : ['40%','50%'],
                        time : 700
                    })
                    grapple.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定数据录入事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#selected").val("");
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
                        var value = $("#selected").val();
                        $.get(home.urls.truckLoading.isExists(),{
                            id : value,
                        },function(result){
                            if(!result.data){
                                // $.get(home.urls.MaterialItem.getAll(),{},function(result){
                                //     var key = [];
                                //     var materialItem = result.data;
                                //     materialItem.forEach(function(e){
                                //         key.push(e.id);
                                //     })
                                //     // console.log(key)
                                //     $.get(home.urls.)
                                // })
                                $("#confirm").addClass("hide");
                                layer.close(index);
                                // var time = setTimeout(function() {
                                //     dataTypeManagement.init();
                                //     clearTimeout(time);
                                // },500)
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
                                        //实现json格式传数据
                                        
                                    }
                                })
                            }else{
                                alert("该班次已存在");
                            }
                        })
                    },
                    btn2 : function(index) {
                        $("#confirm").addClass("hide");
                        layer,close(index);
                    }
                })
            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteEvents : function(buttons){
            buttons.off('click').on('click',function(){
                
            })
        }
        /**绑定查询事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                
            })
        }
        /**渲染数据 */
        ,renderHandler : function($tbody,grapples,page){
            //清空表格
            $tbody.empty();
            grapples.forEach(function(e){
                $tbody.append(
                    "<tr>"+
                    "<td><input type='checkbox' value="+e.id+" class='grapple-checkbox'></td>" +
                    "<td>"+(e.id)+"</td>" +
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
            }  
            return datas;
        }
        
        /**绑定查看明细事件 */
        ,bindViewEvents : function(buttons){
            buttons.off("click").on("click",function(){
                var id = $(".view").attr("id").substr(5);
                $.get(home.urls.MaterialItem.getAll(),{},function(result){
                    var keys = [];
                    var materialItem = result.data;
                    materialItem.forEach(function(e){
                        keys.push(e.id)
                    })
                    // console.log(materialItem);
                    $("#modal").removeClass("hide")
                    $.get(home.urls.truckLoading.getById(),{id : id},function(result){
                        var details = result.data.details
                        var datas = grapple.funcs.getMapData(details);
                        var headDatas = ["rank","sendTime","num","orebin","contrapositionTime","makeUpTime","finishTime","weighTime","note"]
                        const $tbody = $("#reportChartTbody");
                        $("#modal").removeClass("hide")
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
                                        "<tr>"+
                                        "<td rowspan='"+data.length+"'>"+data[0].item+"</td>"   +
                                        "<td>123421343</td>"   +
                                        "</tr>"      
                                    );
                                } else {
                                    $tbody.append(
                                        "<tr>"+
                                        "<td>123421343</td>"   +
                                        "</tr>"  
                                    );
                                }
                            });
                        });                      
                    })
                })
            })
        }
        /**添加一行按钮操作 */
        ,addRow : function(buttons){
            buttons.off("click").on("click",function(){
                $("#addModal").removeClass("hide");

            })
        }
        /**绑定修改明细事件 */
        ,bindModifyEvents : function(buttons){
            buttons.off("click").on("click",function(){
                
            })
        }
        /**查看详情 */
        ,renderDeatil : function($tbody,grapples,page){
            $tbody.empty();
            grapples.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td>"
                )
            })
            /**绑定添加一行事件 */
            grapple.funcs.addRow($("#addRow"));
        }
    }
}