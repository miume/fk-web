var sectionName = {
    init : function() {
        sectionName.funcs.bindDefaultSearch(-1,-1);
        sectionName.funcs.bindAutoSearch($("#searchButton"));
        sectionName.funcs.bindAddEvent($("#addButton"));
        sectionName.funcs.bindExportEvent($("#exportTable"));
    }
    ,funcs : {
        bindDefaultSearch : function(code,name) {
            $.get(home.urls.sectionName.getByCodeLikeAndNameLike(),{
                code : code,
                name : name
            },function(result) {
                var section = result.data.content; 
                var data = result.data;
                sectionName.funcs.renderTable(section,0);
                layui.laypage.render({
                    elem : "sectionName_page",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.sectionName.getByCodeLikeAndNameLike(),{
                                code : code,
                                name : name,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var section = result.data.content;
                                var page = obj.curr - 1;
                                sectionName.funcs.renderTable(section,page);
                            })
                        }
                    }
                })
            })
        }
        /**根据工段编码和工段名称进行搜索 */
        ,bindAutoSearch : function(buttons) {
            buttons.off("click").on("click",function() {
                var code = $("#sectionId").val();
                var name = $("#sectionName").val();
                sectionName.funcs.bindDefaultSearch(code,name);
            })
        }
        ,renderTable : function(data,page) {
            const $tbody = $("#sectionNameTable").children("tbody");
            $tbody.empty();
            var i = page * 10 + 1
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='sectionCheckbox'  /></td>" +
                    "<td>"+ (i++) +"</td>" + 
                    "<td>"+ (e.sectionCode?e.sectionCode:'') +"</td>" + 
                    "<td>"+ (e.name?e.name:'') +"</td>" + 
                    "<td>"+ (e.workShopInfo?e.workShopInfo.name:'') +"</td>" + 
                    "<td>"+ (e.electricUsedType?e.electricUsedType.name:'') +"</td>" +
                    "<td>"+ (e.date?e.date:'') +"</td>" + 
                    "<td><a href='#' class='editor' id='editor-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +  
                    "</tr>"
                )
            })
            sectionName.funcs.bindEditorEvent($(".editor"));
            sectionName.funcs.bindDeleteEvent($(".delete"));
        }
        /**编辑事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(7);
                $.get(home.urls.workShopInfo.getAll(),{},function(result) {
                    var res = result.data;
                    $("#workShopInfo").html("<option value=''>请选择所属车间</option>")
                    res.forEach(function(e) {
                        $("#workShopInfo").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                    })
                })
                $.get(home.urls.sectionName.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    var workShopInfo = res.workShopInfo.id;
                    var electricUsedType = res.electricUsedType.id;
                    $("#sectionCode").val(res.sectionCode);
                    $("#name").val(res.name);
                    $("#workShopInfo option[value="+ (workShopInfo) +"]").attr("selected","selected");
                    $("#electricUsedType option[value="+ (electricUsedType) +"]").attr("selected","selected");
                
                $("#sectionLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑",
                    content : $("#sectionLayerModal"),
                    area : ["350px","350px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var sectionCode = $("#sectionCode").val();
                        var name = $("#name").val();
                        var workShopInfo = $("#workShopInfo").val();
                        var electricUsedType = $("#electricUsedType").val();
                        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        if(sectionCode === "" && name === ""){
                            layer.msg("工段编码和工段名称不能为空！",{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            return
                        }
                        $.post(home.urls.sectionName.update(),{
                            id : id,
                            sectionCode : sectionCode,
                            name : name,
                            'workShopInfo.id' : workShopInfo,
                            'electricUsedType.id' : electricUsedType,
                            date : date
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    sectionName.init();
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#sectionLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#sectionLayerModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
          })
        }
         /**删除事件 */
         ,bindDeleteEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(7);
                layer.open({
                    type : 1,
                    title : "删除",
                    content : "<h5 style='text-align:center;'>确定删除该记录？</h5>",
                    offset : "auto",
                    area : ["200px","150px"],
                    btn : ["确定","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $.post(home.urls.sectionName.deleteById(),{
                            _method : "delete", id : id
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    sectionName.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        layer.close(index);
                    }
                })
            })
        }
        /**新增事件 */
        ,bindAddEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                //初始化
                $("#sectionCode").val("");
                $("#name").val("");
                $("#workShopInfo").empty();
                $.get(home.urls.workShopInfo.getAll(),{},function(result) {
                    var res = result.data;
                    $("#workShopInfo").html("<option value=''>请选择所属车间</option>")
                    res.forEach(function(e) {
                        $("#workShopInfo").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                    })
                })
                $("#sectionLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#sectionLayerModal"),
                    area : ["350px","350px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var sectionCode = $("#sectionCode").val();
                        var name = $("#name").val();
                        var workShopInfo = $("#workShopInfo").val();
                        if(sectionCode === "" && name === ""){
                            layer.msg("工段编码和工段名称不能为空！",{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            return
                        }
                        var electricUsedType = $("#electricUsedType").val();
                        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        $.post(home.urls.sectionName.add(),{
                            sectionCode : sectionCode,
                            name : name,
                            'workShopInfo.id' : workShopInfo,
                            'electricUsedType.id' : electricUsedType,
                            date : date
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    sectionName.init();
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#sectionLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#sectionLayerModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**导出事件 */
        ,bindExportEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var code = $("#sectionId").val();
                var name = $("#sectionName").val();
                var urls = home.urls.sectionName.exportByGet() + "?code=" + code + "&name=" + name;
                location.href = urls;
            })
        }
    }
}