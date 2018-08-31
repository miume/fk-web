cavingDayReport = {
    $tbody : $("#cavingDayReportTable").children("tbody"),
    flag : 0,
    pageSize: 0,
    init : function() {
        cavingDayReport.funcs.bindDefaultSearchEvent();
        cavingDayReport.funcs.bindAddEvent($("#addBtn"));
        var out = $("#cavingDayReport_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#cavingDayReport_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,funcs : {
        /**默认搜索当月的数据 */
        bindDefaultSearchEvent : function() {
            var date = new Date().Format("yyyy-MM");
            $("#searchDate").val(date);
            console.log(date)
            cavingDayReport.funcs.bindSearchEvent(date);
            cavingDayReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**绑定搜索事件 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                cavingDayReport.flag = 1;
                var date = $("#searchDate").val();
                cavingDayReport.funcs.bindSearchEvent(date);
            })
            
        }
        ,bindSearchEvent : function(date) {
            $.get(home.urls.cavingReport.getByDateByPage(),{
                date : date
            }, function(result) {
                var res = result.data.content;
                cavingDayReport.funcs.renderHandler(cavingDayReport.$tbody,res,0);
                var data = result.data;
                cavingDayReport.pageSize = result.data.length;
                /**分页消息 */
                layui.laypage.render({
                    elem : "cavingDayReport_page",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.cavingReport.getByDateByPage(),{
                                date : date,
                                page : obj.curr - 1,
                                size : obj.limit
                            }, function(result) {
                                var res = result.data.content;
                                var page = obj.curr - 1;
                                cavingDayReport.funcs.renderHandler(cavingDayReport.$tbody,res,page);
                                cavingDayReport.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
        }
        /**渲染数据 */
        ,renderHandler : function($tbody,data,page) {
            var i = page * 10 + 1;
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>"+ (e.date ? e.date : '') +"</td>" +
                    "<td>"+ (e.num ? e.num : '') +"</td>" +
                    "<td>"+ (e.ten2fifteenNum ? e.ten2fifteenNum : '' ) +"</td>" +
                    "<td>"+ (e.greaterThan15 ? e.greaterThan15 : '') +"</td>" +
                    "<td>"+ (e.enterUser ? e.enterUser.name : '') +"</td>" +
                    "<td>"+ (e.enterTime ? e.enterTime : '') +"</td>" +
                    "<td><a href='#' class='detail' id='detail-"+ (e.id) +"'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "<td><a href='#' class='editor' id='editor-"+ (e.id) +"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            })
            cavingDayReport.funcs.bindDetailEvent($(".detail"));
            cavingDayReport.funcs.bindEditorEvent($(".editor"));
        }
        /**绑定新增数据 */
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                cavingDayReport.flag = 1;
                $("#date").val("")
                $("#num").val("")
                $("#ten2fifteenNum").val("")
                $("#greaterThan15").val("")
                $("input").removeAttr("disabled");
                var $tbody = $("#detail").children("tbody");
                $tbody.empty();
                $("#addModal").removeClass("hide");
                $("#addLine").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#addModal"),
                    area : ["600px","500px"],
                    offset : "auto",
                    btn : ["保存", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var urls = home.urls.cavingReport.add();
                        cavingDayReport.funcs.bindAddData(index,urls);
                    }
                    ,btn2 : function(index) {
                        $("#addModal").addClass("hide");
                        layer.close(index);
                    }
                    ,success : function(layero,index) {
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                $("#addModal").addClass("hide");
                                layer.close(index);
                            }
                            if(e.keyCode == 13) {
                                var urls = home.urls.cavingReport.add();
                                cavingDayReport.funcs.bindAddData(index,urls);
                            }
                            
                    })
                }
              })
              //cavingDayReport.funcs.bindAddLines($("#addLine"));
            })
        }
        /**保存新增数据 */
        ,bindAddData : function(index,urls,id) {
            if(!$("#date").val()) {
                layer.msg("日期不能为空", {
                    offset : ['40%', '55%'],
                    time : 1000
                }) 
                return
            }
            var details = [];
            $(".newLine").each(function(e) {
                var line = $(this).children("td");
                details.push({
                    rank : line.eq(0).text(),
                    processTime : line.eq(1).children("input").val(),
                    processMinute : line.eq(2).children("input").val(),
                    note : line.eq(3).children("input").val()
                })
            })
            var userStr = $.session.get("user");
            var userJson = JSON.parse(userStr);
            var data;
            if(cavingDayReport.flag === 0) {
                data = {
                    id : id,
                    date : $("#date").val(),
                    num : $("#num").val(),
                    ten2fifteenNum : $("#ten2fifteenNum").val(),
                    greaterThan15 : $("#greaterThan15").val(),
                    modifyUser : { id : userJson.id },
                    modifyTime : new Date().getTime(),
                    flag : 0,
                    details : details
                }
            }
            else {
                data = {
                    date : $("#date").val(),
                    num : $("#num").val(),
                    ten2fifteenNum : $("#ten2fifteenNum").val(),
                    greaterThan15 : $("#greaterThan15").val(),
                    enterUser : { id : userJson.id },
                    flag : 0,
                    details : details
                }
            }
            console.log(data)
            $.ajax({
                url : urls,
                contentType : "application/json" ,
                dataType : "JSON",
                type : "post",
                data : JSON.stringify(data),
                success : function(result) {
                    if(result.message == "数据已录入, 不要重复录入") {
                        layer.msg(result.message, {
                            offset : ['40%', '55%'],
                            time : 700
                        })
                    }
                    if(result.code === 0) {
                        var time = setTimeout(function() {
                            var date = $("#searchDate").val();
                            cavingDayReport.funcs.bindSearchEvent(date);
                            clearTimeout(time);
                        },500)
                        layer.msg(result.message, {
                            offset : ['40%', '55%'],
                            time : 700
                        })
                    }
                    $("#addModal").addClass("hide");
                    layer.close(index);
                }
            })
        }
        /**新增一行数据 */
        // ,bindAddLines : function(buttons) {
        //     buttons.off("click").on("click", function() {
        //         var i = $("#detail tr").length + 1;
        //         var $tbody = $("#detail").children("tbody");
        //         $tbody.append(
        //             "<tr class='newLine'>" +
        //             "<td>"+ (i) +"</td>" +
        //             "<td><input type='text' class='addDate' /></td>" +
        //             "<td><input type='text' /></td>" +
        //             "<td><input type='text' /></td>" +
        //             "</tr>"
        //         )
        //         layui.use("laydate", function() {
        //             var laydate = layui.laydate;
        //             laydate.render({
        //                 elem : ".addDate",
        //                 type : "datetime"
        //             })
        //         })
        //     })
        // }
        /**绑定详情 */
        ,bindDetailEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.cavingReport.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    cavingDayReport.funcs.bindRenderDetailData(res);
                    $("#addModal").removeClass("hide");
                    $("#addLine").addClass("hide");
                    layer.open({
                        type : 1,
                        title : "详情",
                        content : $("#addModal"),
                        area : ["700px", "500px"],
                        btn : ["取消"],
                        offset : "auto",
                        closeBtn : 0,
                        yes : function(index) {
                            $("#addModal").addClass("hide");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        /**渲染详情数据 */
        ,bindRenderDetailData : function(data) {
            $("#date").val(data.date);
            $("#num").val(data.num ? data.num : '');
            $("#ten2fifteenNum").val(data.ten2fifteenNum ? data.ten2fifteenNum : '');
            $("#greaterThan15").val(data.greaterThan15 ? data.greaterThan15 : '');
            $("input").attr("disabled","disabled");
            var $tbody = $("#detail").children("tbody");
            $tbody.empty();
            var detail = data.details;
            var i = 1;
            detail.forEach(function(e) {
                $tbody.append(
                    "<tr>" + 
                    "<td>" +(i++)+ "</td>" +
                    "<td>"+ (e.processTime) +"</td>" +
                    "<td>"+ (e.processMinute) +"</td>" +
                    "<td>"+ (e.note ? e.note : '') +"</td>" +
                    "</tr>"
                )
            })
        }
        /**绑定编辑 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                cavingDayReport.flag = 0;
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.cavingReport.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    cavingDayReport.funcs.bindRenderEditorlData(res);
                    $("#addModal").removeClass("hide");
                    $("#addLine").removeClass("hide");
                    layer.open({
                        type : 1,
                        title : "编辑",
                        content : $("#addModal"),
                        area : ["700px", "500px"],
                        btn : ["确定","取消"],
                        offset : "auto",
                        closeBtn : 0,
                        yes : function(index) {
                            var urls = home.urls.cavingReport.update();
                            cavingDayReport.funcs.bindAddData(index,urls,id);
                        }
                        ,btn2 : function(index) {
                            $("#addModal").addClass("hide");
                            layer.close(index);
                        }
                        ,success : function(layero,index) {
                            $(document).on("keydown", function(e) {
                                if(e.keyCode == 27) {
                                    layer.close(index);
                                    $("#addModal").addClass("hide");
                                   
                                }
                                if(e.keyCode == 13) {
                                    var urls = home.urls.cavingReport.update();
                                    cavingDayReport.funcs.bindAddData(index,urls,id);
                                }
                        
                        })
                    }
                    })
                })
                
            })
        }
        ,bindRenderEditorlData : function(data) {
            $("#date").val(data.date);
            $("#num").val(data.num ? data.num : '');
            $("#ten2fifteenNum").val(data.ten2fifteenNum ? data.ten2fifteenNum : '');
            $("#greaterThan15").val(data.greaterThan15 ? data.greaterThan15 : '');
            $("input").removeAttr("disabled");
            var $tbody = $("#detail").children("tbody");
            $tbody.empty();
            var detail = data.details;
            var i = 1;
            detail.forEach(function(e) {
                $tbody.append(
                    "<tr class='newLine'>" + 
                    "<td>" +(i++)+ "</td>" +
                    "<td><input type='hiden' class='Date' value= '"+  e.processTime  +"'/></td>" +
                    "<td><input type='text' value="+ (e.processMinute) +" /></td>" +
                    "<td><input type='text' value="+ (e.note ? e.note : '') +" /></td>" +
                    "</tr>"
                )
            })
        }
        ,bindUpdateEditorData : function(index) {

        }
    }
}
