var electricityPlan = {
    init : function() {
        //electricityPlan.funcs.bindDefaultSearch();
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
            $.get(home.urls.electricityPlan.getByDateByPage(),{
                year : year
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
                            $.get(home.urls.electricityPlan.getByDateByPage(),{
                                year : year,
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
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.name?e.name:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
                    "<td>"+ (e.code?e.code:'') +"</td>" +
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
                $.post(home.urls.electricityPlan.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    
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
                        var code = $("#code").val();
                        var name = $("#name").val();
                        $.post(home.urls.electricityPlan.update(),{
                            id : id,
                            code : code,
                            name : name,
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50"],
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
                        $.post(home.urls.electricityPlan.add(),{
                            code : code,
                            name : name,
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50"],
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
            $("name").val("");
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