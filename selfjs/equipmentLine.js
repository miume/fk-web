var equipmentLine = {
    init : function() {
        equipmentLine.funcs.bindDefaultSearch(-1,-1);
        equipmentLine.funcs.bindAutoSearch($("#searchButton"));
        equipmentLine.funcs.bindAddEvent($("#addButton"));
        equipmentLine.funcs.bindExportEvent($("#exportTable"));
    }
    ,funcs : {
        bindDefaultSearch : function(code,name) {
            $.get(home.urls.equipmentLine.getByCodeLikeAndNameLike(),{
                code : code,
                name : name
            },function(result) {
                var process = result.data.content; 
                var data = result.data;
                equipmentLine.funcs.renderTable(process,0);
                layui.laypage.render({
                    elem : "equipmentLine_page",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.equipmentLine.getByCodeLikeAndNameLike(),{
                                code : code,
                                name : name,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var process = result.data.content;
                                var page = obj.curr - 1;
                                equipmentLine.funcs.renderTable(process,page);
                            })
                        }
                    }
                })
            })
        }
        /**根据工段编码和工段名称进行搜索 */
        ,bindAutoSearch : function(buttons) {
            buttons.off("click").on("click",function() {
                var code = $("#processId").val();
                var name = $("#equipmentLine").val();
                equipmentLine.funcs.bindDefaultSearch(code,name);
            })
        }
        ,renderTable : function(data,page) {
            const $tbody = $("#equipmentLineTable").children("tbody");
            $tbody.empty();
            var i = page * 10 + 1
            data.forEach(function(e) {
                var flag ;
                if(e.autoFlag == 0) {
                    flag = "不是";
                }
                else {
                    flag = "是";
                }
                $tbody.append(
                    "<tr>" +
                    // "<td><input type='checkbox' class='processCheckbox'  /></td>" +
                    "<td>"+ (i++) +"</td>" + 
                    "<td>"+ (e.code?e.code:'') +"</td>" + 
                    "<td>"+ (e.name?e.name:'') +"</td>" + 
                    "<td>"+ (e.energyDpPoint?e.energyDpPoint.dpPoint:'') +"</td>" + 
                    "<td>"+ (e.autoFlag?'是':'不是') +"</td>" + 
                    "<td>"+ (e.energySectionInfo?e.energySectionInfo.name:'') +"</td>" + 
                    "<td>"+ (e.energyWorkProcedure?e.energyWorkProcedure.name:'') +"</td>" +
                    "<td>"+ (e.energyWorkType?e.energyWorkType.name:'') +"</td>" +
                    // "<td>"+ (e.citeInfo?e.citeInfo:'') +"</td>" + 
                    "<td>"+ (e.electricPredict1H?e.electricPredict1H:'0') +"</td>" + 
                    "<td>"+ (e.date?e.date:'') +"</td>" + 
                    "<td><a href='#' class='editor' id='editor-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +  
                    "</tr>"
                )
            })
            equipmentLine.funcs.bindEditorEvent($(".editor"));
            equipmentLine.funcs.bindDeleteEvent($(".delete"));
        }
        /**编辑事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(7);
                equipmentLine.funcs.bindRenderSelectEvent();
                $.get(home.urls.equipmentLine.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    var energyDpPoint = res.energyDpPoint?res.energyDpPoint.id:"-1";
                    var energySectionInfo = res.energySectionInfo?res.energySectionInfo.id:"-1";
                    var energyWorkProcedure = res.energyWorkProcedure?res.energyWorkProcedure.id:"-1";
                    var energyWorkType = res.energyWorkType?res.energyWorkType.id:"-1";
                    var autoFlag = res.autoFlag;
                    $("#autoFlag option[value="+ (autoFlag) +"]").attr("selected","selected");
                    $("#energyDpPoint option[value="+ (energyDpPoint) +"]").attr("selected","selected");
                    $("#energySectionInfo option[value="+(energySectionInfo) +"]").attr("selected","selected");
                    $("#energyWorkProcedure option[value="+ (energyWorkProcedure) +"]").attr("selected","selected"); 
                    $("#energyWorkType option[value="+ (energyWorkType) +"]").attr("selected","selected");
                    $("#code").val(res.code);
                    $("#name").val(res.name);
                    //$("#citeInfo").val(res.citeInfo);
                    $("#electricPredict1H").val(res.electricPredict1H);
                
                $("#equipmentLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑",
                    content : $("#equipmentLayerModal"),
                    area : ["400px","470px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var code = $("#code").val();
                        var name = $("#name").val();
                        var energyDpPoint = $("#energyDpPoint").val();
                        var energySectionInfo = $("#energySectionInfo").val();
                        var energyWorkProcedure = $("#energyWorkProcedure").val();
                        var energyWorkType = $("#energyWorkType").val();
                        var electricPredict1H = $("#electricPredict1H").val();
                        //var citeInfo = $("#citeInfo").val();
                        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        $.post(home.urls.equipmentLine.update(),{
                            id : id,
                            code : code,
                            name : name,
                            'energyDpPoint.id' : energyDpPoint,
                            'energySectionInfo.id' : energySectionInfo,
                            'energyWorkProcedure.id' : energyWorkProcedure,
                            'energyWorkType.id' : energyWorkType,
                             //citeInfo : citeInfo,
                             electricPredict1H : electricPredict1H?parseInt(electricPredict1H):0,
                             date : date
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    equipmentLine.init();
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#equipmentLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#equipmentLayerModal").addClass("hide");
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
                        $.post(home.urls.equipmentLine.deleteById(),{
                            _method : "delete", id : id
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    equipmentLine.init();
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
                equipmentLine.funcs.bindRenderSelectEvent();
                $("#equipmentLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#equipmentLayerModal"),
                    area : ["400px","470px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var code = $("#code").val();
                        var name = $("#name").val();
                        var energyDpPoint = $("#energyDpPoint").val();
                        var autoFlag = $("#autoFlag").val();
                        var energySectionInfo = $("#energySectionInfo").val();
                        var energyWorkProcedure = $("#energyWorkProcedure").val();
                        var energyWorkType = $("#energyWorkType").val();
                        var electricPredict1H = $("#electricPredict1H").val() ;
                        //var citeInfo = $("#citeInfo").val();
                        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        //console.log($("#electricPredict1H").val())
                        if(code === "" && name === ""){
                            layer.msg("设备/线路编号和设备/线路名称不能为空！",{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            return
                        }
                       
                        $.post(home.urls.equipmentLine.add(),{
                            code : code,
                            name : name,
                            autoFlag : autoFlag,
                            'energyDpPoint.id' : energyDpPoint,
                            'energySectionInfo.id' : energySectionInfo,
                            'energyWorkProcedure.id' : energyWorkProcedure,
                            'energyWorkType.id' : energyWorkType,
                            //citeInfo : citeInfo,
                            electricPredict1H : electricPredict1H?parseInt(electricPredict1H):0,
                            date : date
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    equipmentLine.init();
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#equipmentLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#equipmentLayerModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定新增和编辑中下拉框初始化渲染 */
        ,bindRenderSelectEvent : function() {
            $("#code").val("");
            $("#name").val("");
            $("#energyDpPoint").empty();
            $("#energySectionInfo").empty();
            $("#energyWorkProcedure").empty();
            //$("#citeInfo").val("");
            $("#electricPredict1H").val("");
            $("#autoFlag option[value='1']").attr("selected","selected");
            /**电表DP点 */
            $.get(servers.backup()+"energyDpPoint/getAll",{},function(result) {
                var res = result.data;
                res.forEach(function(e) {
                    $("#energyDpPoint").append("<option value="+ (e.id) +">"+ (e.dpPoint) +"</option>")
                })
            })
            /**获取所有工段 */
            $.get(home.urls.sectionName.getAll(),{},function(result) {
                var res = result.data;
                $("#energySectionInfo").html("<option value='-1'>请选择工段</option>")
                res.forEach(function(e) {
                    $("#energySectionInfo").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                })
            })
            /**获取所有工序 */
            $.get(home.urls.processName.getAll(),{},function(result) {
                var res = result.data;
                $("#energyWorkProcedure").html("<option value='-1'>请选择工序</option>")
                res.forEach(function(e) {
                    $("#energyWorkProcedure").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                })
            })
            /**获取所有站点 */
            // $.get(servers.backup() + "citeInfo/getAll",{},function(result) {
            //     var res = result.data;
            //     $("#citeInfo").html("<option value=>请选择站点</option>")
            //     res.forEach(function(e) {
            //         $("#citeInfo").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
            //     })
            // })
        }
        /**导出事件 */
        ,bindExportEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var code = $("#processId").val();
                var name = $("#equipmentLine").val();
                var urls = home.urls.equipmentLine.exportByGet() + "?code=" + code + "&name=" + name;
                location.href = urls;
            })
        }
    }
}