cavingMonthReport = {
    init : function() {
        cavingMonthReport.funcs.bindDefaultSearchEvent();
        cavingMonthReport.funcs.bindProductReportEvent($("#addBtn"));
    }
    ,$tbody : $("#cavingMonthReportTable").children("tbody")
    ,cols : 2
    ,funcs : {
        /**默认搜索当年的数据 */
        bindDefaultSearchEvent : function() {
            var date = new Date().Format("yyyy-");
            var startDate = date + "01";
            var endDate = date + "12";
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            cavingMonthReport.funcs.bindSearchEvent(startDate,endDate);
            cavingMonthReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
         /**绑定搜索事件 */
         ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                cavingMonthReport.flag = 1;
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                cavingMonthReport.funcs.bindSearchEvent(startDate,endDate);
            })
            
        }
        ,bindSearchEvent : function(startDate,endDate) {
            $.get(home.urls.cavingReport.getByStartDateAndEndDateByPage(),{
                startDate : startDate,
                endDate : endDate
            }, function(result) {
                var res = result.data.content;
                cavingMonthReport.funcs.renderHandler(cavingMonthReport.$tbody,res);
                var data = result.data;
                cavingMonthReport.pageSize = result.data.length;
                /**分页消息 */
                layui.laypage.render({
                    elem : "cavingMonthReport_page",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.cavingReport.getByStartDateAndEndDateByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1,
                                size : obj.limit
                            }, function(result) {
                                var res = result.data.content;
                                var page = obj.curr - 1;
                                cavingMonthReport.funcs.renderHandler(cavingMonthReport.$tbody,res);
                                cavingMonthReport.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
        }
         /**渲染数据 */
         ,renderHandler : function($tbody,data) {
            console.log(data)
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.date ? e.date : '') +"</td>" +
                    "<td>"+ (e.num ? e.num : '') +"</td>" +
                    "<td>"+ (e.ten2fifteenNum ? e.ten2fifteenNum : '' ) +"</td>" +
                    "<td>"+ (e.greaterThan15 ? e.greaterThan15 : '') +"</td>" +
                    "<td>"+ (e.enterUser ? e.enterUser.name : '') +"</td>" +
                    "<td>"+ (e.enterTime ? e.enterTime : '') +"</td>" +
                    "<td><a href='#' class='detail' id='detail-"+ (e.id) +"'>查看报表</a>&nbsp;&nbsp;<a href='#' class='reproduct' id='re-"+ (e.id) +"'>重新生成</a></td>" +
                    "</tr>"
                )
            })
            cavingMonthReport.funcs.bindDetailEvent($(".detail"));
            cavingMonthReport.funcs.bindReGenerateReportEvent($(".reproduct"));
        }
         /**绑定详情 */
         ,bindDetailEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.cavingReport.getCavingMonthReportById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    cavingMonthReport.funcs.bindRenderDetailData(res);
                    $("#modal").removeClass("hide");
                    layer.open({
                        type : 1,
                        title : "详情",
                        content : $("#modal"),
                        area : ["1100px", "600px"],
                        btn : ["导出","取消"],
                        offset : "auto",
                        closeBtn : 0,
                        yes : function(index) {
                            cavingMonthReport.funcs.bindexportById(index,id); 
                            $("#modal").addClass("hide");
                            layer.close(index);                          
                        }
                        ,btn2 : function(index) {
                            $("#modal").addClass("hide");
                            layer.close(index);
                        }
                        ,success : function(layero,index) {
                            $(document).on("keydown", function(e) {
                                if(e.keyCode == 27) {
                                    $("#modal").addClass("hide");
                                    layer.close(index);
                                }
                                if(e.keyCode == 13) {
                                    cavingMonthReport.funcs.bindexportById(index,id); 
                                    $("#modal").addClass("hide");
                                    layer.close(index);       
                                }
                            })
                        }
                    })
                })
            })
        }
        ,bindexportById : function(index,id) {
            var href = home.urls.cavingReport.exportById()+"?id=" + id;
            location.href = href;
            
        }
        /**渲染详情数据 */
        ,bindRenderDetailData : function(data) {
            var date = data.date;
            var dayDetails = data.dayDetails;
            var detail = data.details;
            var $tbody = $("#headTable").children("tbody");
            
            $tbody.empty();
            $tbody.append(
                "<tr><td>"+ (date) +"</td><td>合计</td>"+ (cavingMonthReport.funcs.bindRenderTheadData(data)) +"</tr>"
            )   
            for(var i = 1; i <= 3; i++){
                var rows = "";
                for(var j = 0; j < cavingMonthReport.cols; j++) {
                    rows += "<td></td>" ;
                }
                $tbody.append("<tr>"+ rows +"</tr>")   
             } 
            $tbody.children("tr").eq(1).children("td").eq(0).text("吊棚次数");
            $tbody.children("tr").eq(2).children("td").eq(0).text("10＜T＜15");
            $tbody.children("tr").eq(3).children("td").eq(0).text("T＞15min");

            $tbody.children("tr").eq(1).children("td").eq(1).text(data.num);
            $tbody.children("tr").eq(2).children("td").eq(1).text(data.ten2fifteenNum);
            $tbody.children("tr").eq(3).children("td").eq(1).text(data.greaterThan15);
            detail.forEach(function(e) {
                
                var col = e.date.substr(5);
                for(var i = 2; i < cavingMonthReport.cols; i++ ){
                    var tdData = $tbody.children("tr").eq(0).children("td").eq(i).text();
                    if(col === tdData) {
                        $tbody.children("tr").eq(1).children("td").eq(i).text(e.num);
                        $tbody.children("tr").eq(2).children("td").eq(i).text(e.ten2fifteenNum);
                        $tbody.children("tr").eq(3).children("td").eq(i).text(e.greaterThan15);
                    }
                }
            })
            var $tbody1 = $("#detail").children("tbody");
            $tbody1.empty();
            
            var i = 1;
            dayDetails.forEach(function(e) {
                $tbody1.append(
                    "<tr>" + 
                    "<td>" +(i++)+ "</td>" +
                    "<td>"+ (e.processTime ? e.processTime.substr(0,10) : '') +"</td>" +
                    "<td>"+ (e.processTime ? e.processTime.substr(11) : '') +"</td>" +
                    "<td>"+ (e.processMinute) +"</td>" +
                    "<td>"+ (e.note ? e.note : '') +"</td>" +
                    "</tr>"
                )
            })
        }
        ,bindRenderTheadData : function(data) {
            var startDate = data.startDate;
            var endDate = data.endDate;
            var str = "";
            while(startDate <= endDate) {
                str += "<td>"+ (startDate.substr(5)) +"</td>"
                cavingMonthReport.cols ++;
                var date = new Date(startDate)
                date.setDate(date.getDate()+1);//设置天数 +1 天
                startDate = new Date(date).Format("yyyy-MM-dd");
                //console.log(startDate)
            }
            console.log(cavingMonthReport.cols)
            return str;
        }
        /**绑定重新生成事件 */
        ,bindReGenerateReportEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(3);
                $.get(home.urls.cavingReport.getCavingMonthReportById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                layer.open({
                    type : 1,
                    title : "重新生成报表",
                    content : "<h5 style='text-align:center;'>确定重新生成报表?</h5>",
                    area : ["250px", "140px"],
                    offset : "auto",
                    btn : ["确定", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var date = res.date.substr(0,4) + "-" + res.date.substr(4);
                        var userStr = $.session.get('user');
                        var userJson = JSON.parse(userStr);
                        $.get(home.urls.cavingReport.reGenerateReport(),{
                            date : date,
                            userId : userJson.id
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    var startDate = $("#startDate").val();
                                    var endDate = $("#endDate").val();
                                    cavingMonthReport.funcs.bindSearchEvent(startDate,endDate);
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
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                layer.close(index);
                                //让按钮失去焦点
                                $(':focus').blur();
                            }
                        })
                    }
                })
            })
         })
        }
        /**绑定生成报表事件 */
        ,bindProductReportEvent : function(buttons) {
            buttons.off("click").on("click", function() {
                $("#productReport").removeClass("hide");
                $("#productDate").val("");
                layer.open({
                    type : 1,
                    title : "生成报表",
                    content : $("#productReport"),
                    area : ["280px", "160px"],
                    offset : "auto",
                    btn : ["生成报表", "取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var date = $("#productDate").val();
                        var userStr = $.session.get('user');
                        var userJson = JSON.parse(userStr);
                        $.get(home.urls.cavingReport.generateReport(),{
                            date : date,
                            userId : userJson.id
                        },function(result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    var startDate = $("#startDate").val();
                                    var endDate = $("#endDate").val();
                                    cavingMonthReport.funcs.bindSearchEvent(startDate,endDate);
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
                        $("#productReport").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#productReport").addClass("hide");
                        layer.close(index);
                    }
                    ,success : function(layero, index){
                        /**document为当前元素，限制范围；如果不限制范围，就会一直触发事件 */
                        $(document).on("keydown", function(e) {
                            if(e.keyCode == 27) {
                                $("#productReport").addClass("hide");
                                layer.close(index);
                                //让按钮失去焦点
                                $(':focus').blur();
                            }
                        })
                    }
                })
            })
        }
    }
}