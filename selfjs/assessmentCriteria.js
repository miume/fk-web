var assessmentCriteria = {
    init : function() {
        assessmentCriteria.funcs.renderHandle();
        assessmentCriteria.funcs.bindSetTasteEvent($("#setTaste"));   //绑定原矿品味设置 
        assessmentCriteria.funcs.bindAddGradeEvent($("#addGrade"));   //绑定添加档次
    }
    ,funcs : {
        renderHandle : function() {
            $.get(home.urls.assessmentCriteria.getAllByPage(),{ }, function(result) {
                var res = result.data.content;
                assessmentCriteria.funcs.renderTable(res);
            })
        }
        /**绑定渲染表格 */
        ,renderTable : function(data) {
            const $tbody = $("#criteriaTable").children("tbody");
            $tbody.empty();
            data.forEach(function(e) {
                var flag = 0;
                var name = "";
                //console.log(e.operate)
                switch(e.operate) {
                    case 0 :
                        name = ">" + e.minValue;
                        break;
                    case 1 : 
                        name = ">=" + e.minValue;
                        break;
                    case 2 :
                        name = "<" + e.maxValue;
                        break;
                    case 3 : 
                        name = "<=" + e.maxValue;   
                        break; 
                    case 4 : 
                        name = e.minValue + "~" + e.maxValue;   
                        break; 
                }
                //console.log(name)
                var rawOreGradeLevels = e.rawOreGradeLevels;
                var lens = rawOreGradeLevels.length;
                rawOreGradeLevels.forEach(function(ele) {
                    if(flag === 0) {
                        $tbody.append(
                            "<tr>" +
                            "<td rowspan="+ (lens) +">"+ (name) +"</td>" +
                            "<td>"+ (ele.name) +"</td>" +
                            "<td>"+ (ele.pbGradeValue) +"</td>" +
                            "<td>"+ (ele.znGradeValue) +"</td>" +
                            "<td>"+ (ele.znRecoveryValue) +"</td>" +
                            "<td>"+ (ele.pbZnAllRecoveryValue) +"</td>" +
                            "<td>"+ (ele.pbAllRecoveryValue) +"</td>" +
                            "<td>"+ (ele.znAllRecoveryValue) +"</td>" +
                            "</tr>"
                        )
                        flag = 1;
                    }
                    else {
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ (ele.name) +"</td>" +
                            "<td>"+ (ele.pbGradeValue) +"</td>" +
                            "<td>"+ (ele.znGradeValue) +"</td>" +
                            "<td>"+ (ele.znRecoveryValue) +"</td>" +
                            "<td>"+ (ele.pbZnAllRecoveryValue) +"</td>" +
                            "<td>"+ (ele.pbAllRecoveryValue) +"</td>" +
                            "<td>"+ (ele.znAllRecoveryValue) +"</td>" +
                            "</tr>"
                        )
                    }
                })
                
            })
        }
        /**绑定原矿品味设置 */
        ,bindSetTasteEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#setTasteModal").removeClass("hide");
                $.get(home.urls.assessmentCriteria.getAll(),{ }, function(result) {
                    var res = result.data;
                    assessmentCriteria.funcs.renderSetTasteTable(res);
                })
                layer.open({
                    type : 1,
                    title : " 原矿品味设置",
                    content : $("#setTasteModal"),
                    area : ["500px","400px"],
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
            })
        }
        ,renderSetTasteTable :function(data) {
            const $tbody = $("#setTasteTable").children("tbody");
            $tbody.empty();
            data.forEach(function(e) {
                var name = "";
                switch(e.operate) {
                    case 0 :
                        name = ">" + e.minValue;
                        $tbody.append("<tr><td>"+ (name) +"</td><td id='operate0'>\>\</td><td>"+ (e.minValue) +"</td><td></td><td><a href='#' class='editor' id='editor"+( e.id )+"'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        break;
                    case 1 : 
                        name = ">=" + e.minValue;
                        $tbody.append("<tr><td>"+ (name) +"</td><td id='operate1'>\>=\</td><td>"+ (e.minValue) +"</td><td></td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        break;
                    case 2 :
                        name = "<" + e.maxValue;
                        $tbody.append("<tr><td>"+ (name) +"</td><td id='operate2'>\<\</td><td></td><td>"+ (e.maxValue) +"</td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        break;
                    case 3 : 
                        name = "<=" + e.maxValue;  
                        $tbody.append("<tr><td>"+ (name) +"</td><td id='operate3'>\<=\</td><td></td><td>"+ (e.maxValue) +"</td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>"); 
                        break; 
                    case 4 : 
                        name = e.minValue + "~" + e.maxValue; 
                        $tbody.append("<tr><td>"+ (name) +"</td><td id='operate4'>\~\</td><td>"+ (e.minValue) +"</td><td>"+ (e.maxValue) +"</td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");  
                        break; 
                }
            })
            assessmentCriteria.funcs.bindAddLinesEvent($("#addLine"));
            assessmentCriteria.funcs.bindEditorLinesEvent($(".editor"));
            assessmentCriteria.funcs.bindDeleteLinesEvent($(".delete"));
        }
        /**新增一行 */
        ,bindAddLinesEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#rawName").text("");
                $("#minValue").val("");
                $("#maxValue").val("");
                $("#operate option[value='0']").attr("selected","selected");
                $("#updateTasteModal").removeClass("hide");
                $("#operate").change(function() {
                    var val = $("#operate").val();
                    switch(val) {
                        case "0" :
                        case "1" : 
                            $("#minValue").removeAttr("disabled");
                            $("#maxValue").attr("disabled","disabled");
                            break;
                        case "2" :
                        case "3" : 
                            $("#maxValue").removeAttr("disabled");
                            $("#minValue").attr("disabled","disabled");  
                            break; 
                        case "4" : 
                             $("#minValue").removeAttr("disabled");
                             $("#maxValue").removeAttr("disabled"); 
                            break; 
                    }
                })
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateTasteModal"),
                    area : ["300px","300px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        $("#updateTasteModal").addClass("hide");
                        const $tbody = $("#setTasteTable").children("tbody");
                        var val = $("#operate").val();
                        var name = "";
                        switch(val) {
                            case "0" :
                                name = ">" + $("#minValue").val();
                                $tbody.append("<tr><td>"+ (name) +"</td><td id='operate0'>></td><td>"+ ($("#minValue").val()) +"</td><td></td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                                break;
                            case "1" : 
                                name = ">=" + $("#minValue").val();
                                $tbody.append("<tr><td>"+ (name) +"</td><td id='operate1'>>=</td><td>"+ ($("#minValue").val()) +"</td><td></td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                                break;
                            case "2" :
                                name = "<" + $("#maxValue").val();
                                $tbody.append("<tr><td>"+ (name) +"</td><td id='operate2'><</td><td></td><td>"+ ($("#maxValue").val()) +"</td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                                break;
                            case "3" : 
                                name = "<=" + $("#maxValue").val();
                                $tbody.append("<tr><td>"+ (name) +"</td><td id='operate3'><=</td><td></td><td>"+ ($("#maxValue").val()) +"</td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                                break; 
                            case "4" : 
                                 name = $("#minValue").val() + "~" + $("#maxValue").val();
                                 $tbody.append("<tr><td>"+ (name) +"</td><td id='operate4'>~</td><td>"+ ($("#minValue").val()) +"</td><td>"+ ($("#maxValue").val()) +"</td><td><a href='#' class='editor'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                                break; 
                        }
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#updateTasteModal").addClass("hide");
                        layer.close(index);
                    }
                })
                assessmentCriteria.funcs.bindEditorLinesEvent($(".editor"));
                assessmentCriteria.funcs.bindDeleteLinesEvent($(".delete"));
            })
        }
        /**绑定select改变事件 */
        ,bindSelectChangeEvent : function(buttons) {
            buttons.off("click").on("click",function() {

            })
        } 
        /**绑定原矿品味设置编辑事件 */
        ,bindEditorLinesEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#rawName").text("");
                var e = $(this).parent("td").parent("tr");
                var td = e.find("td");
                $("#rawName").text(td.eq(0).text());
                $("#minValue").val("");
                $("#maxValue").val("");
                var val = td.eq(1).attr("id").substr(7);
                // console.log(val)
                // console.log(td.eq(2).text())
                //根据已知的value值选定option
                $("#operate option[value="+(val)+"]").attr("selected","selected");
                switch(val) {
                    case "0" :
                        $("#minValue").val(td.eq(2).text());
                        break;
                    case "1" : 
                        $("#minValue").val(td.eq(2).text());
                        break;
                    case "2" :
                        $("#maxValue").val(td.eq(3).text());
                        break;
                    case "3" : 
                        $("#maxValue").val(td.eq(3).text()); 
                        break; 
                    case "4" : 
                        $("#minValue").val(td.eq(2).text()); 
                        $("#maxValue").val(td.eq(3).text());
                        break; 
                }
                $("#updateTasteModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "修改",
                    content : $("#updateTasteModal"),
                    area : ["300px","300px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        $("#updateTasteModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#updateTasteModal").addClass("hide");
                        layer.close(index);
                    }
                })
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
