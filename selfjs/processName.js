var processName = {
    init : function() {
        processName.funcs.bindDefaultSearch(-1,-1);
        processName.funcs.bindAutoSearch($("#searchButton"));
        processName.funcs.bindAddEvent($("#addButton"));
        processName.funcs.bindExportEvent($("#exportTable"));
    }
    ,funcs : {
        bindDefaultSearch : function(code,name) {
            $.get(home.urls.processName.getByCodeLikeAndNameLike(),{
                code : code,
                name : name
            },function(result) {
                var process = result.data.content; 
                var data = result.data;
                processName.funcs.renderTable(process,0);
                layui.laypage.render({
                    elem : "processName_page",
                    count : 10 * data.totalPages,
                    jump : function(obj,first) {
                        if(!first) {
                            $.get(home.urls.processName.getByCodeLikeAndNameLike(),{
                                code : code,
                                name : name,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var process = result.data.content;
                                var page = obj.curr - 1;
                                processName.funcs.renderTable(process,page);
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
                var name = $("#processName").val();
                processName.funcs.bindDefaultSearch(code,name);
            })
        }
        ,renderTable : function(data,page) {
            const $tbody = $("#processNameTable").children("tbody");
            $tbody.empty();
            var i = page * 10 + 1
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    // "<td><input type='checkbox' class='processCheckbox'  /></td>" +
                    "<td>"+ (i++) +"</td>" + 
                    "<td>"+ (e.workCode?e.workCode:'') +"</td>" + 
                    "<td>"+ (e.name?e.name:'') +"</td>" + 
                    "<td>"+ (e.energyWorkType?e.energyWorkType.name:'') +"</td>" + 
                    "<td>"+ (e.energySectionInfo?e.energySectionInfo.name:'') +"</td>" + 
                    "<td>"+ (e.workShopInfo?e.workShopInfo:'') +"</td>" + 
                    "<td>"+ (e.electricUsedType?e.electricUsedType.name:'') +"</td>" +
                    "<td>"+ (e.date?e.date:'') +"</td>" + 
                    "<td><a href='#' class='editor' id='editor-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "<td><a href='#' class = 'delete' id='delete-"+(e.id)+"'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +  
                    "</tr>"
                )
            })
            processName.funcs.bindEditorEvent($(".editor"));
            processName.funcs.bindDeleteEvent($(".delete"));
        }
        /**编辑事件 */
        ,bindEditorEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(7);
                processName.funcs.bindInitEvent();//初始化
                $.get(home.urls.processName.getById(),{
                    id : id
                },function(result) {
                    var res = result.data;
                    var energySectionInfo = res.energySectionInfo?res.energySectionInfo.id:"-1";
                    var electricUsedType = res.electricUsedType?res.electricUsedType.id:"-1";
                    var energyWorkType = res.energyWorkType ? res.energyWorkType.id : "-1";
                    console.log(energySectionInfo)
                    $("#workCode").val(res.workCode);
                    $("#name").val(res.name);
                    $("#energyWorkType option[value="+ (energyWorkType) +"]").attr("selected","selected");
                    $("#energySectionInfo option[value="+ (energySectionInfo) +"]").attr("selected","selected");
                    $("#electricUsedType option[value="+ (electricUsedType) +"]").attr("selected","selected");
                    $("#workShopInfo").val(res.workShopInfo)
                $("#processLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "编辑",
                    content : $("#processLayerModal"),
                    area : ["400px","350px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var workCode = $("#workCode").val();
                        var name = $("#name").val();
                        var energySectionInfo = $("#energySectionInfo").val();
                        var energyWorkType = $("#energyWorkType").val();
                        var workShopInfo = $("#workShopInfo").val();
                        var electricUsedType = $("#electricUsedType").val();
                        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        $.post(home.urls.processName.update(),{
                             id : id,
                             workCode : workCode,
                             name : name,
                             workShopInfo : workShopInfo,
                             'electricUsedType.id' : electricUsedType,
                             'energyWorkType.id' : energyWorkType,
                             'energySectionInfo.id' : energySectionInfo,
                             date : date
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    processName.init();
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#processLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#processLayerModal").addClass("hide");
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
                        $.post(home.urls.processName.deleteById(),{
                            _method : "delete", id : id
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    processName.init();
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
                processName.funcs.bindInitEvent();//初始化
                $("#energyWorkType option[value='-1']").attr("selected","selected");
                $("#energySectionInfo option[value='-1']").attr("selected","selected");
                $("#electricUsedType option[value='-1']").attr("selected","selected");
                $("#processLayerModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#processLayerModal"),
                    area : ["400px","350px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        var workCode = $("#workCode").val();
                        var name = $("#name").val();
                        var workShopInfo = $("#workShopInfo").val();
                        var energyWorkType = $("#energyWorkType").val();  //工艺类型
                        var energySectionInfo = $("#energySectionInfo").val();
                        var electricUsedType = $("#electricUsedType").val();
                        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        if(workCode === "" && name === ""){
                            layer.msg("工序编码和工序名称不能为空！",{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            return
                        }
            
                        $.post(home.urls.processName.add(),{
                            workCode : workCode,
                            name : name,
                            workShopInfo : workShopInfo,
                            'electricUsedType.id' : electricUsedType,
                            'energyWorkType.id' : energyWorkType,
                            'energySectionInfo.id' : energySectionInfo?energySectionInfo:"-1",
                            date : date
                        },function(result) {
                            layer.msg(result.message,{
                                offset : ["44%","50%"],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    processName.init();
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#processLayerModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#processLayerModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定新增或编辑时初始化事件 */
        ,bindInitEvent :function() {
            $("#workCode").val("");
            $("#name").val("");
            $("#workShopInfo").val("");
            /**获取所有工段 */
            $.get(home.urls.sectionName.getAll(),{},function(result) {
                var res = result.data;
                $("#energySectionInfo").empty();
                $("#energySectionInfo").html("<option value='-1' selected>请选择工段</option>")
                res.forEach(function(e) {
                    $("#energySectionInfo").append("<option value="+ (e.id) +">"+ (e.name) +"</option>")
                })
            })
            /**根据工段查询所属车间  车间是不可编辑的*/
            $("#energySectionInfo").change(function(){
                var id = $("#energySectionInfo").val();
                $("#workShopInfo").empty();
                $.get(home.urls.sectionName.getWorkShopById(),{ id : id },function(result) {
                    var res = result.data;
                    $("#workShopInfo").val(res);
                })
            })
            
        }
        /**导出事件 */
        ,bindExportEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var code = $("#processId").val();
                var name = $("#processName").val();
                var urls = home.urls.processName.exportByGet() + "?code=" + code + "&name=" + name;
                location.href = urls;
            })
        }
    }
}