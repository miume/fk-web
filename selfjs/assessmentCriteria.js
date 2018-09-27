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
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.pbGradeOperate,ele.pbGradeValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.znGradeOperate,ele.znGradeValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.znRecoveryOperate,ele.znRecoveryValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.pbZnAllRecoveryOperate,ele.pbZnAllRecoveryValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.pbAllRecoveryOperate,ele.pbAllRecoveryValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.znAllRecoveryOperate,ele.znAllRecoveryValue) ) +"</td>" +
                            "</tr>"
                        )
                        flag = 1;
                    }
                    else {
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ (ele.name) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.pbGradeOperate,ele.pbGradeValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.znGradeOperate,ele.znGradeValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.znRecoveryOperate,ele.znRecoveryValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.pbZnAllRecoveryOperate,ele.pbZnAllRecoveryValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.pbAllRecoveryOperate,ele.pbAllRecoveryValue) ) +"</td>" +
                            "<td>"+ ( assessmentCriteria.funcs.bindStringOutput(ele.znAllRecoveryOperate,ele.znAllRecoveryValue) ) +"</td>" +
                            "</tr>"
                        )
                    }
                })
                
            })
        }
        /**传入操作符和值  转换为字符串输出 */
        ,bindStringOutput : function(operate,value) {
            var str = "";
            switch(operate) {
                case 0 :
                    str = ">" + value;
                    break;
                case 1 :
                    str = ">=" + value;
                    break;
                case 2 :
                    str = "<" + value;
                    break;
                case 3 :
                    str = "<=" + value;
                    break;
            }
            return str;
        }
        /**绑定原矿品味设置 */
        ,bindSetTasteEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#setTasteModal").removeClass("hide");
                assessmentCriteria.funcs.renderSetTasteTable();
                layer.open({
                    type : 1,
                    title : " 原矿品味设置",
                    content : $("#setTasteModal"),
                    area : ["500px","400px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                   yes : function(index) {
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
        ,renderSetTasteTable :function() {
            $.get(home.urls.assessmentCriteria.getAll(),{ }, function(result) {
                var data = result.data;
                const $tbody = $("#setTasteTable").children("tbody");
                $tbody.empty();
                data.forEach(function(e) {
                    var name = "";
                    switch(e.operate) {
                        case 0 :
                            name = ">" + e.minValue;
                            $tbody.append("<tr><td>"+ (name) +"</td><td id='operate0'>\>\</td><td>"+ (e.minValue) +"</td><td>/</td><td><a href='#' class='editor' id='editor"+( e.id )+"'><i class='layui-icon'>&#xe642;</i></a></td>/<td><a href=#' class='delete' id='delete"+( e.id )+"'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                            break;
                        case 1 : 
                            name = ">=" + e.minValue;
                            $tbody.append("<tr><td>"+ (name) +"</td><td id='operate1'>\>=\</td><td>"+ (e.minValue) +"</td><td>/</td><td><a href='#' class='editor' id='editor"+( e.id )+"'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete' id='delete"+( e.id )+"'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                            break;
                        case 2 :
                            name = "<" + e.maxValue;
                            $tbody.append("<tr><td>"+ (name) +"</td><td id='operate2'>\<\</td>/<td></td><td>"+ (e.maxValue) +"</td><td><a href='#' class='editor' id='editor"+( e.id )+"'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete' id='delete"+( e.id )+"'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                            break;
                        case 3 : 
                            name = "<=" + e.maxValue;  
                            $tbody.append("<tr><td>"+ (name) +"</td><td id='operate3'>\<=\</td><td>/</td><td>"+ (e.maxValue) +"</td><td><a href='#' class='editor' id='editor"+( e.id )+"'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete' id='delete"+( e.id )+"'><i class='layui-icon'>&#x1006;</i></a></td></tr>"); 
                            break; 
                        case 4 : 
                            name = e.minValue + "~" + e.maxValue; 
                            $tbody.append("<tr><td>"+ (name) +"</td><td id='operate4'>\~\</td><td>"+ (e.minValue) +"</td><td>"+ (e.maxValue) +"</td><td><a href='#' class='editor' id='editor"+( e.id )+"'><i class='layui-icon'>&#xe642;</i></a></td><td><a href=#' class='delete' id='delete"+( e.id )+"'><i class='layui-icon'>&#x1006;</i></a></td></tr>");  
                            break; 
                    }
            })
            assessmentCriteria.funcs.bindAddLinesEvent($("#addLine"));
            assessmentCriteria.funcs.bindEditorLinesEvent($(".editor"));
            assessmentCriteria.funcs.bindDeleteLinesEvent($(".delete"));
        })
        }
        /**新增一行 */
        ,bindAddLinesEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#rawName").text("");
                $("#minValue").val("");
                $("#maxValue").val("/");
                $("#operate option[value='0']").attr("selected","selected");
                $("#updateTasteModal").removeClass("hide");
                /**操作符变换后的操作 */
                $("#operate").change(function() {
                    var val = $("#operate").val();
                    switch(val) {
                        case "0" :
                        case "1" : 
                            $("#minValue").removeAttr("disabled");
                            $("#maxValue").attr("disabled","disabled");
                            $("#minValue").val("");
                            $("#maxValue").val("/");
                            break;
                        case "2" :
                        case "3" : 
                            $("#maxValue").removeAttr("disabled");
                            $("#minValue").attr("disabled","disabled"); 
                            $("#minValue").val("/");
                            $("#maxValue").val(""); 
                            break; 
                        case "4" : 
                             $("#minValue").removeAttr("disabled");
                             $("#maxValue").removeAttr("disabled"); 
                             $("#minValue").val("");
                             $("#maxValue").val("");
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
                        var operate = $("#operate").val();
                        var minValue = $("#minValue").val();
                        var maxValue = $("maxValue").val();
                        $.post(home.urls.assessmentCriteria.add(),{ 
                            operate : operate,
                            minValue : minValue,
                            maxValue : maxValue
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    assessmentCriteria.init();
                                    assessmentCriteria.funcs.renderSetTasteTable();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#updateTasteModal").addClass("hide");
                        // const $tbody = $("#setTasteTable").children("tbody");
                        // var val = $("#operate").val();
                        // var name = "";
                        // switch(val) {
                        //     case "0" :
                        //         name = ">" + $("#minValue").val();
                        //         $tbody.append("<tr><td>"+ (name) +"</td><td id='operate0'>></td><td>"+ ($("#minValue").val()) +"</td><td></td><td><a href='#' class='editor' id='editor0'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete' id='delete0'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        //         break;
                        //     case "1" : 
                        //         name = ">=" + $("#minValue").val();
                        //         $tbody.append("<tr><td>"+ (name) +"</td><td id='operate1'>>=</td><td>"+ ($("#minValue").val()) +"</td><td></td><td><a href='#' class='editor' id='editor1'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete' id='delete1'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        //         break;
                        //     case "2" :
                        //         name = "<" + $("#maxValue").val();
                        //         $tbody.append("<tr><td>"+ (name) +"</td><td id='operate2'><</td><td></td><td>"+ ($("#maxValue").val()) +"</td><td><a href='#' class='editor' id='editor2'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete' id='delete2'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        //         break;
                        //     case "3" : 
                        //         name = "<=" + $("#maxValue").val();
                        //         $tbody.append("<tr><td>"+ (name) +"</td><td id='operate3'><=</td><td></td><td>"+ ($("#maxValue").val()) +"</td><td><a href='#' class='editor' id='editor3'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete' id='delete3'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        //         break; 
                        //     case "4" : 
                        //          name = $("#minValue").val() + "~" + $("#maxValue").val();
                        //          $tbody.append("<tr><td>"+ (name) +"</td><td id='operate4'>~</td><td>"+ ($("#minValue").val()) +"</td><td>"+ ($("#maxValue").val()) +"</td><td><a href='#' class='editor' id='editor4'><i class='layui-icon'>&#xe642;</i></a></td><td><a href='#' class='delete' id='delete4'><i class='layui-icon'>&#x1006;</i></a></td></tr>");
                        //         break; 
                        // }
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
                var e = $(this).parent("td").parent("tr");
                var id = $(this).attr("id").substr(6);
                var td = e.find("td");
                $("#minValue").val("");
                $("#maxValue").val("");
                var val = td.eq(1).attr("id").substr(7);
                // console.log(val)
                // console.log(td.eq(2).text())
                //根据已知的value值选定option
                $("#operate option[value="+(val)+"]").attr("selected","selected");
                switch(val) {
                    case "0" :
                    case "1" : 
                        $("#minValue").val(td.eq(2).text());
                        $("#maxValue").val("/");
                        $("#minValue").removeAttr("disabled");
                        $("#maxValue").attr("disabled","disabled");
                        break;
                    case "2" :
                    case "3" : 
                        $("#maxValue").val(td.eq(3).text()); 
                        $("#minValue").val("/");
                        $("#maxValue").removeAttr("disabled");
                        $("#minValue").attr("disabled","disabled"); 
                        break; 
                    case "4" : 
                        $("#minValue").val(td.eq(2).text()); 
                        $("#maxValue").val(td.eq(3).text());
                        $("#minValue").removeAttr("disabled");
                        $("#maxValue").removeAttr("disabled"); 
                        break; 
                }
                $("#updateTasteModal").removeClass("hide");
                /**操作符变换后的操作 */
                $("#operate").change(function() {
                    var val = $("#operate").val();
                    switch(val) {
                        case "0" :
                        case "1" : 
                            $("#minValue").removeAttr("disabled");
                            $("#maxValue").attr("disabled","disabled");
                            $("#minValue").val("");
                            $("#maxValue").val("/");
                            break;
                        case "2" :
                        case "3" : 
                            $("#maxValue").removeAttr("disabled");
                            $("#minValue").attr("disabled","disabled"); 
                            $("#minValue").val("/"); 
                            $("#maxValue").val("");
                            break; 
                        case "4" : 
                             $("#minValue").removeAttr("disabled");
                             $("#maxValue").removeAttr("disabled"); 
                             $("#minValue").val(" "); 
                             $("#maxValue").val(" "); 
                            break; 
                    }
                })
                layer.open({
                    type : 1,
                    title : "修改",
                    content : $("#updateTasteModal"),
                    area : ["300px","300px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        var operate = $("#operate").val();
                        var minValue = $("#minValue").val();
                        var maxValue = $("maxValue").val();
                        $.post(home.urls.assessmentCriteria.update(),{ 
                            id : id,
                            operate : operate,
                            minValue : minValue,
                            maxValue : maxValue
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    assessmentCriteria.init();
                                    assessmentCriteria.funcs.renderSetTasteTable();
                                    clearTimeout(time);
                                },500)
                            }
                        })
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
                var id = $(this).attr("id").substr(6);
                // $(this).parent('td').parent('tr').remove();
                layer.open({
                    type : 1,
                    title : "删除",
                    content : "<h5 style='text-align:center;'>确定要删除该记录吗？</h5>",
                    area : ["240px","140px"],
                    btn : ["确定","取消"] ,
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index){
                        $.post(home.urls.assessmentCriteria.deleteById(),{
                            _method : "delete" , id : id
                        },function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    assessmentCriteria.init();
                                    assessmentCriteria.funcs.renderSetTasteTable();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定添加档次事件 */
        ,bindAddGradeEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#addGradeModal").removeClass("hide");
                //初始化
                assessmentCriteria.funcs.bindInitAddGradeTable();
                layer.open({
                    type : 1,
                    title : "添加档次",
                    content : $("#addGradeModal"),
                    area : ["500px","500px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var id = $("#rawTaste").val();
                        var name = $("#levelName").val();
                        var pbGradeOperate = $("#pbGradeOperate").val();
                        var pbGradeValue = $("#pbGradeValue").val();
                        var znGradeOperate = $("#znGradeOperate").val();
                        var znGradeValue = $("#znGradeValue").val();
                        var znRecoveryOperate = $("#znRecoveryOperate").val();
                        var znRecoveryValue = $("#znRecoveryValue").val();
                        var pbZnAllRecoveryOperate = $("#pbZnAllRecoveryOperate").val();
                        var pbZnAllRecoveryValue = $("#pbZnAllRecoveryValue").val();
                    
                        var pbAllRecoveryOperate = $("#pbAllRecoveryOperate").val();
                        var pbAllRecoveryValue = $("#pbAllRecoveryValue").val();
                        var znAllRecoveryOperate = $("#znAllRecoveryOperate").val();
                        var znAllRecoveryValue = $("#znAllRecoveryValue").val();
                        $.post(home.urls.assessmentCriteria.addRawOreGradeLevel(),{
                            'rawOreGrade.id' : id,
                            name : name,
                            pbGradeOperate : pbGradeOperate,
                            pbGradeValue : pbGradeValue,
                            znGradeOperate : znGradeOperate,
                            znGradeValue : znGradeValue,
                            znRecoveryOperate : znRecoveryOperate,
                            znRecoveryValue : znRecoveryValue,
                            pbZnAllRecoveryOperate : pbZnAllRecoveryOperate,
                            pbZnAllRecoveryValue : pbZnAllRecoveryValue,
                            pbAllRecoveryOperate : pbAllRecoveryOperate,
                            pbAllRecoveryValue : pbAllRecoveryValue, 
                            znAllRecoveryOperate : znAllRecoveryOperate,
                            znAllRecoveryValue : znAllRecoveryValue
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    assessmentCriteria.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
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
        /**新增事件初始化 */
        ,bindInitAddGradeTable : function() {
            $("#rawTaste").empty();
            $("#pbGradeOperate option[value='0']").attr("selected","selected");;
            $("#znGradeOperate option[value='0']").attr("selected","selected");
            $("#znRecoveryOperate option[value='0']").attr("selected","selected");;
            $("#pbZnAllRecoveryOperate option[value='0']").attr("selected","selected");
            $("#pbAllRecoveryOperate option[value='0']").attr("selected","selected");;
            $("#znAllRecoveryOperate option[value='0']").attr("selected","selected");
            
            $.get(home.urls.assessmentCriteria.getAll(),{ }, function(result) {
                var data = result.data;
                data.forEach(function(e) {
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
                    $("#rawTaste").append("<option value="+ (e.id) +">"+ (name) +"</option>");
                })
                
                $("#levelName").val("");
                $("#pbGradeValue").val("");
                $("#znGradeValue").val("");
                $("#znRecoveryValue").val("");
                $("#pbAllRecoveryValue").val("");
                $("#pbZnAllRecoveryValue").val("");
                $("#znAllRecoveryValue").val("");
            })
        }
    }
}
