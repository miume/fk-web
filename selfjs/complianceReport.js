complianceReport = {
    init : function(){
        complianceReport.funcs.bindSelectRender();
        complianceReport.funcs.bindDefaultSearchEvent();
        complianceReport.funcs.bindExportTableEvent($("#export"));

    }
    ,funcs : {
        bindSelectRender : function(){
            $.get(home.urls.clazz.getAll(), {} , function(result) {
                 var clazz = result.data;
                 $("#startClazz").empty();
                 $("#endClazz").empty();
                 clazz.forEach(function(e) {
                    $("#startClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                    $("#endClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                 })
            })
        }
        ,bindDefaultSearchEvent : function() {
            var date = new Date();
            var endDate = new Date().Format("yyyy-MM-dd");
            date.setMonth(date.getMonth()-1);
            var startDate = new Date(date).Format("yyyy-MM-dd");
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            complianceReport.funcs.bindSearchEvent(startDate,endDate,1,1);
            complianceReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var startClazz = $("#startClazz").val();
                var endClazz = $("#endClazz").val();
                complianceReport.funcs.bindSearchEvent(startDate,endDate,startClazz,endClazz);
            })
        }
        ,bindSearchEvent : function(startDate,endDate,startClazz,endClazz) {
            $.get(home.urls.complianceReport.search(),{
                startDate : startDate,
                endDate : endDate,
                startClazzId : startClazz,
                endClazzId : endClazz
            },function(result) {
                var res = result.data;
                complianceReport.funcs.renderTable(res);
            })
        }
        /**绑定渲染表格事件 */
        ,renderTable : function(data) {
            const $tbody = $("#complianceTable").children("tbody");
            $tbody.empty();
            var datas = data.datas;
            var num = data.num;
            for(var value in datas) {
                var flag = 0; //用来约定原矿品味每一类第一行的渲染
                var rows;     //确定原矿品味的跨行数
                for(var val in num){
                    if(val == value)
                        rows = num[val];
                }
                var level = datas[value];
                var levelRows;
                for(var i in level){
                    levelRows = level[i].length;
                    var index = 1;
                    //console.log(level[i])
                    var flag1 = 0;
                    level[i].forEach(function(e) {
                        if(flag === 0) {
                            $tbody.append(
                                "<tr>" +
                                "<td rowspan="+ (rows) +">"+ (value) +"</td>" +
                                "<td rowspan="+ (levelRows) +">"+ (i) +"</td>" +
                                "<td>"+ (index++) +"</td>" +
                                "<td>"+ (e.time?e.time:'') +"</td>" +
                                "<td>"+ (e.clazz?e.clazz.name:'') +"</td>" +
                                "<td>"+ (e.team?e.team.name:'') +"</td>" +
                                "<td>"+ (e.operator?e.operator.name:'') +"</td>" +
                                "<td>"+ (e.rawOreWeight?e.rawOreWeight:'0') +"</td>" +

                                "<td>"+ (e.rawOrePbGrade?e.rawOrePbGrade:'0') +"</td>" +
                                "<td>"+ (e.rawOreZnGrade?e.rawOreZnGrade:'0') +"</td>" +
                                "<td>"+ (e.rawOrePbZnGrade?e.rawOrePbZnGrade:'0') +"</td>" +

                                "<td>"+ (e.highPbProductivity?e.highPbProductivity:'0') +"</td>" +
                                "<td>"+ (e.highPbPbGrade?e.highPbPbGrade:'0') +"</td>" +
                                "<td>"+ (e.highPbZnGrade?e.highPbZnGrade:'0') +"</td>" +
                                "<td>"+ (e.highPbPbRecovery?e.highPbPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.highPbZnRecovery?e.highPbZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.highZnProductivity?e.highZnProductivity:'0') +"</td>" +
                                "<td>"+ (e.highZnPbGrade?e.highZnPbGrade:'0') +"</td>" +
                                "<td>"+ (e.highZnZnGrade?e.highZnZnGrade:'0') +"</td>" +
                                "<td>"+ (e.highZnPbRecovery?e.highZnPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.highZnZnRecovery?e.highZnZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.tailProductivity?e.tailProductivity:'0') +"</td>" +
                                "<td>"+ (e.tailPbGrade?e.tailPbGrade:'0') +"</td>" +
                                "<td>"+ (e.tailZnGrade?e.tailZnGrade:'0') +"</td>" +
                                "<td>"+ (e.tailPbRecovery?e.tailPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.tailZnRecovery?e.tailZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.totalPbRecovery?e.totalPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.totalZnRecovery?e.totalZnRecovery:'0') +"</td>" +
                                "<td>"+ (e.totalPbZnRecovery?e.totalPbZnRecovery:'0') +"</td>" +

                                "</tr>"
                            )
                            flag = 1;
                            if(levelRows > 1)
                                flag1 = 1;
                        }
                        else if(flag1 === 0) {
                            $tbody.append(
                                "<tr>" +
                                "<td rowspan="+ (levelRows) +">"+ (i) +"</td>" +
                                "<td>"+ (index++) +"</td>" +
                                "<td>"+ (e.time?e.time:'') +"</td>" +
                                "<td>"+ (e.clazz?e.clazz.name:'') +"</td>" +
                                "<td>"+ (e.team?e.team.name:'') +"</td>" +
                                "<td>"+ (e.operator?e.operator.name:'') +"</td>" +
                                "<td>"+ (e.rawOreWeight?e.rawOreWeight:'0') +"</td>" +

                                "<td>"+ (e.rawOrePbGrade?e.rawOrePbGrade:'0') +"</td>" +
                                "<td>"+ (e.rawOreZnGrade?e.rawOreZnGrade:'0') +"</td>" +
                                "<td>"+ (e.rawOrePbZnGrade?e.rawOrePbZnGrade:'0') +"</td>" +

                                "<td>"+ (e.highPbProductivity?e.highPbProductivity:'0') +"</td>" +
                                "<td>"+ (e.highPbPbGrade?e.highPbPbGrade:'0') +"</td>" +
                                "<td>"+ (e.highPbZnGrade?e.highPbZnGrade:'0') +"</td>" +
                                "<td>"+ (e.highPbPbRecovery?e.highPbPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.highPbZnRecovery?e.highPbZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.highZnProductivity?e.highZnProductivity:'0') +"</td>" +
                                "<td>"+ (e.highZnPbGrade?e.highZnPbGrade:'0') +"</td>" +
                                "<td>"+ (e.highZnZnGrade?e.highZnZnGrade:'0') +"</td>" +
                                "<td>"+ (e.highZnPbRecovery?e.highZnPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.highZnZnRecovery?e.highZnZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.tailProductivity?e.tailProductivity:'0') +"</td>" +
                                "<td>"+ (e.tailPbGrade?e.tailPbGrade:'0') +"</td>" +
                                "<td>"+ (e.tailZnGrade?e.tailZnGrade:'0') +"</td>" +
                                "<td>"+ (e.tailPbRecovery?e.tailPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.tailZnRecovery?e.tailZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.totalPbRecovery?e.totalPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.totalZnRecovery?e.totalZnRecovery:'0') +"</td>" +
                                "<td>"+ (e.totalPbZnRecovery?e.totalPbZnRecovery:'0') +"</td>" +

                                "</tr>"
                            )
                            flag1 = 1;
                        }
                        else {
                            $tbody.append(
                                "<tr>" +
                                "<td>"+ (index++) +"</td>" +
                                "<td>"+ (e.time?e.time:'') +"</td>" +
                                "<td>"+ (e.clazz?e.clazz.name:'') +"</td>" +
                                "<td>"+ (e.team?e.team.name:'') +"</td>" +
                                "<td>"+ (e.operator?e.operator.name:'') +"</td>" +
                                "<td>"+ (e.rawOreWeight?e.rawOreWeight:'0') +"</td>" +

                                "<td>"+ (e.rawOrePbGrade?e.rawOrePbGrade:'0') +"</td>" +
                                "<td>"+ (e.rawOreZnGrade?e.rawOreZnGrade:'0') +"</td>" +
                                "<td>"+ (e.rawOrePbZnGrade?e.rawOrePbZnGrade:'0') +"</td>" +

                                "<td>"+ (e.highPbProductivity?e.highPbProductivity:'0') +"</td>" +
                                "<td>"+ (e.highPbPbGrade?e.highPbPbGrade:'0') +"</td>" +
                                "<td>"+ (e.highPbZnGrade?e.highPbZnGrade:'0') +"</td>" +
                                "<td>"+ (e.highPbPbRecovery?e.highPbPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.highPbZnRecovery?e.highPbZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.highZnProductivity?e.highZnProductivity:'0') +"</td>" +
                                "<td>"+ (e.highZnPbGrade?e.highZnPbGrade:'0') +"</td>" +
                                "<td>"+ (e.highZnZnGrade?e.highZnZnGrade:'0') +"</td>" +
                                "<td>"+ (e.highZnPbRecovery?e.highZnPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.highZnZnRecovery?e.highZnZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.tailProductivity?e.tailProductivity:'0') +"</td>" +
                                "<td>"+ (e.tailPbGrade?e.tailPbGrade:'0') +"</td>" +
                                "<td>"+ (e.tailZnGrade?e.tailZnGrade:'0') +"</td>" +
                                "<td>"+ (e.tailPbRecovery?e.tailPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.tailZnRecovery?e.tailZnRecovery:'0') +"</td>" +

                                "<td>"+ (e.totalPbRecovery?e.totalPbRecovery:'0') +"</td>" +
                                "<td>"+ (e.totalZnRecovery?e.totalZnRecovery:'0') +"</td>" +
                                "<td>"+ (e.totalPbZnRecovery?e.totalPbZnRecovery:'0') +"</td>" +

                                "</tr>"
                            )
                        }
                        //console.log("flag="+flag,"flag1="+flag1)
                    })
                }
            }

        }
        /**绑定导出事件 */
        ,bindExportTableEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var startClazz = $("#startClazz").val();
                var endClazz = $("#endClazz").val();
                if(startDate === "" && endDate === "") {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var urls = home.urls.complianceReport.export() + "?startDate=" + startDate + "&endDate=" + endDate + "&startClazzId=" + startClazz + "&endClazzId=" + endClazz;
                location.href = urls;
            })
        }
        ,bindSetAssessmentCriteriaEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#criteriaModal").removeClass("hide");
                layer.open({
                    title : "考核标准设置",
                    type : 1,
                    content : $("#criteriaModal"),
                    area : ["1000px","500px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        $("#criteriaModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#criteriaModal").addClass("hide");
                        layer.close(index);
                    }
                })
                /**绑定原矿品味设置 */
                complianceReport.funcs.bindSetTasteEvent($("#setTaste"));
                /**绑定添加档次 */
                complianceReport.funcs.bindAddGradeEvent($("#addGrade"));
            })
        }
        /**绑定原矿品味设置 */
        ,bindSetTasteEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#setTasteModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : " 原矿品味设置",
                    content : $("#setTasteModal"),
                    area : ["400px","350px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                   yes : function(index) {
                       var name = [];
                       $("#setTasteTable tbody").find("tr").each(function() {
                           var tdArr = $(this).children();
                           name.push(tdArr.eq(0).find("input").val());
                       })
                       console.log(name)
                       $("#setTasteModal").addClass("hide");
                       layer.close(index);
                   }
                   ,btn2 : function(index) {
                       $("#setTasteModal").addClass("hide");
                       layer.close(index);
                   }
                })
                complianceReport.funcs.bindDeleteLinesEvent($(".delete"));
            })
        }
        /**绑定删掉某一行 */
        ,bindDeleteLinesEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $(this).parent('td').parent('tr').remove();
            })
        }
        /**绑定添加档次事件 */
        ,bindAddGradeEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#addGradeModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "添加档次",
                    content : $("#addGradeModal"),
                    area : ["500px","500px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $("#addGradeModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#addGradeModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
    }
}