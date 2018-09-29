var electricityPlan = {
    init : function() {
        electricityPlan.funcs.bindDefaultSearch();
        electricityPlan.funcs.bindAddEvent($("#addButton"));
        electricityPlan.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,funcs : {
        /**默认搜索当年的数据 */
        bindDefaultSearch : function() {
            var date = new Date();
            var year = date.getFullYear();
            $("#date").val(year);
            electricityPlan.funcs.bindSearch(year);
            electricityPlan.funcs.bindAutoSearch($("#searchButton"));
        }
        /**点击搜索按钮进行搜索 */
        ,bindAutoSearch : function(buttons) {
            buttons.off("click").on("click",function() {
                var year = $("#date").val();
                electricityPlan.funcs.bindSearch(year);
            })
        }
        /**根据year进行搜索*/
        ,bindSearch : function(year) {
            $.get(home.urls.electricityPlan.getByDate(),{
                date : year
            },function(result) {
                var res = result.data.content;
                electricityPlan.funcs.renderTable(res,0);
                var data = result.data;
                /**分页逻辑*/
                layui.laypage.render({
                    elem : "electricityPlan_html",
                    page : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.electricityPlan.getByDate(),{
                                date : year,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var res = result.data.content;
                                var page = obj.curr - 1;
                                electricityPlan.funcs.renderTable(res,page);
                            })
                        }
                    }
                })
            })
        }
        /**渲染表格 */
        ,renderTable : function(data,page) {
            const $tbody = $("#electricityPlanTable").children("tbody");
            $tbody.empty();
            var i = page * 10 + 1;
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>"+ (e.energyDeviceRoute?e.energyDeviceRoute.code:'') +"</td>" +
                    "<td>"+ (e.energyDeviceRoute?e.energyDeviceRoute.name:'') +"</td>" +
                    "<td>"+ (e.energyDpPoint?e.energyDpPoint.dpPoint:'') +"</td>" +
                    "<td>"+ (e.one?e.one:'0') +"</td>" +
                    "<td>"+ (e.two?e.two:'0') +"</td>" +
                    "<td>"+ (e.three?e.three:'0') +"</td>" +
                    "<td>"+ (e.four?e.four:'0') +"</td>" +
                    "<td>"+ (e.five?e.five:'0') +"</td>" +
                    "<td>"+ (e.six?e.six:'0') +"</td>" +
                    "<td>"+ (e.seven?e.seven:'0') +"</td>" +
                    "<td>"+ (e.eight?e.eight:'0') +"</td>" +
                    "<td>"+ (e.nine?e.nine:'0') +"</td>" +
                    "<td>"+ (e.ten?e.ten:'0') +"</td>" +
                    "<td>"+ (e.eleven?e.eleven:'0') +"</td>" +
                    "<td>"+ (e.twelve?e.twelve:'0') +"</td>" +
                    "<td><a href='#' class='editor' id='editor-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "</tr>"
                )
            })
            electricityPlan.funcs.bindEditorEvent($(".editor"));
        }
         /**绑定编辑事件 */
         ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(7);
                $("#energyDpPoint").empty();
                $.get(home.urls.electricityPlan.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    $("#code").val(res.energyDeviceRoute.code);
                    $("#name").val(res.energyDeviceRoute.name);
                    $("#energyDpPoint").append("<option value="+ (res.energyDpPoint.id) +">"+ (res.energyDpPoint.dpPoint) +"</option>")
                    $("#one").val(res.one?res.one:"0");
                    $("#two").val(res.two?res.two:"0");
                    $("#three").val(res.three?res.three:"0");
                    $("#four").val(res.four?res.four:"0");
                    $("#five").val(res.five?res.five:"0");
                    $("#six").val(res.six?res.six:"0");
                    $("#seven").val(res.seven?res.seven:"0");
                    $("#eight").val(res.eight?res.eight:"0");
                    $("#nine").val(res.nine?res.nine:"0");
                    $("#ten").val(res.ten?res.ten:"0");
                    $("#eleven").val(res.eleven?res.eleven:"0");
                    $("#twelve").val(res.twelve?res.twelve:"0");
                    $("#electricityLayerModal").removeClass("hide");
                    layer.open({
                        type : 1,
                        title : "编辑",
                        content : $("#electricityLayerModal"),
                        area : ["440px","480px"],
                        offset : "auto",
                        btn : ["保存","取消"],
                        closeBtn : 0,
                        yes : function(index) {
                            var date = $("#date").val();
                            var code = $("#code").val();
                            var name = $("#name").val();
                            var energyDpPoint =  $("#energyDpPoint").val();
                            var one =  $("#one").val();
                            var two =  $("#two").val();
                            var three =  $("#three").val();
                            var four =  $("#four").val();
                            var five =  $("#five").val();
                            var six =  $("#six").val();
                            var seven =  $("#seven").val();
                            var eight =  $("#eight").val();
                            var nine =  $("#nine").val();
                            var ten =  $("#ten").val();
                            var eleven =  $("#eleven").val();
                            var twelve =  $("#twelve").val();
                            $.post(home.urls.electricityPlan.update(),{
                                id : id,
                                date : date,
                                code : code,
                                name : name,
                                'energyDpPoint.id' : energyDpPoint,
                                one : one,
                                two : two,
                                three : three,
                                four : four,
                                five : five,
                                six : six,
                                seven : seven,
                                eight : eight,
                                nine : nine,
                                ten : ten,
                                eleven : eleven,
                                twelve : twelve,
                            },function(result) {
                                layer.msg(result.message,{
                                    offset : ["44%","50%"],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        electricityPlan.init();
                                        clearTimeout(time)
                                    },700)
                                }
                            })
                            $("#electricityLayerModal").addClass("hide");
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            $("#electricityLayerModal").addClass("hide");
                            layer.close(index);
                        }
                    })
                })
          })
        }
        /**绑定新增事件 */
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                electricityPlan.funcs.bindAddInitEvent();
                $("#electricityLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#electricityLayerModal"),
                    area : ["440px","480px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var code = $("#code").val();
                        var name = $("#name").val();
                        var date = $("#date").val();
                        var energyDpPoint =  $("#energyDpPoint").val();
                        var one =  $("#one").val();
                        var two =  $("#two").val();
                        var three =  $("#three").val();
                        var four =  $("#four").val();
                        var five =  $("#five").val();
                        var six =  $("#six").val();
                        var seven =  $("#seven").val();
                        var eight =  $("#eight").val();
                        var nine =  $("#nine").val();
                        var ten =  $("#ten").val();
                        var eleven =  $("#eleven").val();
                        var twelve =  $("#twelve").val();
                        $.post(home.urls.electricityPlan.add(),{
                            date : date,
                            'energyDpPoint.id' : energyDpPoint,
                            one : one,
                            two : two,
                            three : three,
                            four : four,
                            five : five,
                            six : six,
                            seven : seven,
                            eight : eight,
                            nine : nine,
                            ten : ten,
                            eleven : eleven,
                            twelve : twelve,
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    electricityPlan.init();
                                    clearTimeout(time)
                                },700)
                            }
                        })
                        $("#electricityLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#electricityLayerModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定新增初始化 */
        ,bindAddInitEvent : function() {
            $("#code").val("");
            $("#name").val("");
            $("#one").val("");
            $("#two").val("");
            $("#three").val("");
            $("#four").val("");
            $("#five").val("");
            $("#six").val("");
            $("#seven").val("");
            $("#eight").val("");
            $("#nine").val("");
            $("#ten").val("");
            $("#eleven").val("");
            $("#twelve").val("");
            /**电表DP点 */
            $.get(servers.backup()+"energyDpPoint/getAll",{},function(result) {
                var res = result.data;
                $("#energyDpPoint").empty();
                res.forEach(function(e) {
                    $("#energyDpPoint").append("<option value="+ (e.id) +">"+ (e.dpPoint) +"</option>")
                })
            })
        }
        /**根据year导出表格 */
        ,bindExportTableEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var date = $("#date").val();
                var urls = home.urls.electricityPlan.exportByGet() + "?date=" + date;
                location.href = urls;
            })
        } 
    }
}