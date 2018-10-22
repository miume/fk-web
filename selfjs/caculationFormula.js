var caculationFormula = {
    init : function() {
        caculationFormula.funcs.renderHandle();
        caculationFormula.funcs.bindRadioChange();
        caculationFormula.funcs.bindLineToCountEvent($("#lineToCount"));
        caculationFormula.funcs.bindCountToLineEvent($("#countToLine"));
        caculationFormula.funcs.bindLineToDeductionEvent($("#lineToDeduction"));
        caculationFormula.funcs.bindDeductionToLineEvent($("#deductionToLine"));
        caculationFormula.funcs.bindSaveEvent($("#save"));
    }
    ,flag : 0   //用来区分工段、工序
    ,data1 : []
    ,data2 : []
    ,data3 : []
    ,funcs : {
        bindRadioChange : function() {
            $("#section").click(function() {
                $("#sectionDiv").removeClass("hide");
                $("#processDiv").addClass("hide");
                caculationFormula.flag = 0;
                caculationFormula.funcs.bindInitClickEvent();
                caculationFormula.funcs.bindClickEvent($("#sectionTable tbody tr"));
            })
            $("#process").click(function() {
                $("#processDiv").removeClass("hide");
                $("#sectionDiv").addClass("hide");
                caculationFormula.flag = 1;
                caculationFormula.funcs.bindInitClickEvent();
                caculationFormula.funcs.bindClickEvent($("#processTable tbody tr"));
            })
        }
        ,bindInitClickEvent : function() {
            const $tbody1 = $("#countItem").children("tbody");
            const $tbody2 = $("#equipmentLine").children("tbody");
            const $tbody3 = $("#deduction").children("tbody");
            $tbody1.empty();
            $tbody2.empty();
            $tbody3.empty();
        }
        ,renderHandle : function(){
            /**获取所有工段 */
            var id1,id2;
            $.get(home.urls.sectionName.getAll(),{},function(result) {
                var res = result.data;
                const $tbody = $("#sectionTable").children("tbody");
                $tbody.empty();
                var i = 0;
                res.forEach(function(e) {
                    if(i===0){
                        $tbody.append(
                            "<tr class='selected-section' id='section-"+(e.id)+"' class='click'>" +
                            "<td>"+ (e.sectionCode) +"</td>" +
                            "<td>"+ (e.name) +"</td>" +
                            "</tr>"
                             )
                        i = 1;
                        id1 = e.id
                    }
                    else {
                        $tbody.append(
                        "<tr id='section-"+(e.id)+"' class='click'>" +
                        "<td>"+ (e.sectionCode) +"</td>" +
                        "<td>"+ (e.name) +"</td>" +
                        "</tr>"
                         )
                    }
                })
                caculationFormula.funcs.render(0,id1);
                caculationFormula.funcs.bindClickEvent($("#sectionTable tbody tr"));
            })
            /**获取所有工序 */
            $.get(home.urls.processName.getAll(),{},function(result) {
                var res1 = result.data;
                const $tbody1 = $("#processTable").children("tbody");
                $tbody1.empty();
                var j = 0;
                res1.forEach(function(e) {
                    if(j===0){
                        $tbody1.append(
                            "<tr class='selected-process' id='process-"+(+e.id)+"' class='click'>" +
                            "<td>"+ (e.workCode) +"</td>" +
                            "<td>"+ (e.name) +"</td>" +
                            "</tr>"
                     )
                     j = 1;
                     id2 = e.id;
                    }
                    else {
                        $tbody1.append(
                            "<tr id='process-"+(+e.id)+"' class='click'>" +
                            "<td>"+ (e.workCode) +"</td>" +
                            "<td>"+ (e.name) +"</td>" +
                            "</tr>"
                        )
                    }
                     
                })
                // console.log(id2)
                //caculationFormula.funcs.render(1,id2);
                caculationFormula.funcs.bindClickEvent($("#processTable tbody tr"));
             })
        }
        ,bindClickEvent : function(items){
            items.off("click").on("click",function() {
                var id = $(this).attr("id").substr(8);
                var str = $(this).attr("id").substr(0,1);
                var flag;
                if(str === "s"){
                    $(".selected-section").removeClass("selected-section");
                    $(this).addClass("selected-section");
                    flag = 0;
                }
                else {
                    $(".selected-process").removeClass("selected-process");
                    $(this).addClass("selected-process");
                    flag = 1;
                }
                caculationFormula.funcs.render(flag,id);
            })
        }
        ,render : function(flag,id) {
            /**flag 0代表工段 1代表工序 */
            if(flag === 0) {
                var urls = home.urls.caculationFormula.getBySectionIdAndFlag();
                caculationFormula.funcs.getBySectionIdAndFlag(id,urls,0);  //计入项
                caculationFormula.funcs.getBySectionIdAndFlag(id,urls,2);  //设备/线路
                caculationFormula.funcs.getBySectionIdAndFlag(id,urls,1);  //扣除项
            }
            else{
                var urls = home.urls.caculationFormula.getByProcedureIdAndFlag();
                caculationFormula.funcs.getBySectionIdAndFlag(id,urls,0);  //计入项
                caculationFormula.funcs.getBySectionIdAndFlag(id,urls,2);  //设备/线路
                caculationFormula.funcs.getBySectionIdAndFlag(id,urls,1);  //扣除项
            }
        }
        /**根据工段id和标志位flag查询  flag=0 代表计入项 flag=1 代表扣除项 flag=2 代表设备/线路*/
        ,getBySectionIdAndFlag : function(id,urls,flag){
            const $tbody1 = $("#countItem").children("tbody");
            const $tbody2 = $("#equipmentLine").children("tbody");
            const $tbody3 = $("#deduction").children("tbody");
            $.get(urls,{
                sectionId : id,
                flag : flag
            },function(result){
                switch(flag){
                    case 0:
                        var data1 = result.data;
                        caculationFormula.funcs.renderData(data1,$tbody1,0);
                        break;
                     case 1:
                        var data3 = result.data;
                        caculationFormula.funcs.renderData(data3,$tbody3,1);
                        break;
                     case 2:
                        var data2 = result.data;
                        caculationFormula.funcs.renderData(data2,$tbody2,2);
                        break;
                }
           }) 
        }
        /**渲染计入项数据 */
        ,renderData : function(data,$tbody,flag) {
           $tbody.empty();
            var i = 1;
            //console.log(data)
            if(flag === 2) {
                data.forEach(function(ele) {
                    var e = ele.energyDeviceRoute;
                    $tbody.append(
                        "<tr id="+ (e.id) +">" +
                        "<td>"+ (i++) +"</td>"+
                        "<td>"+ (e.code?e.code:"") +"</td>"+
                        "<td>"+ (e.name?e.name:"") +"</td>"+
                        "</tr>"
                    )
                })
            }
            else {
                if(data){
                    data.forEach(function(ele) {
                    var e = ele.energyDeviceRoute;
                    $tbody.append(
                        "<tr id="+ (e.id) +">" +
                        "<td>"+ (i++) +"</td>"+
                        "<td>"+ (e.code?e.code:"") +"</td>"+
                        "<td>"+ (e.name?e.name:"") +"</td>"+
                        "</tr>"
                    )
                })    
                }                
            }
            caculationFormula.funcs.bindForCountClicks($("#countItem tbody tr"));
            caculationFormula.funcs.bindForLineClicks($("#equipmentLine tbody tr"));
            caculationFormula.funcs.bindForDeductionClicks($("#deduction tbody tr"));

        } 
        ,bindForCountClicks : function(items) {
            items.off("click").on("click",function(){
                $(".selected-count").removeClass("selected-count");
                $(this).addClass("selected-count");
            })
        }
        ,bindForLineClicks : function(items) {
            items.off("click").on("click",function(){
                $(".selected-line").removeClass("selected-line");
                $(this).addClass("selected-line");
            })
        }
        ,bindForDeductionClicks : function(items) {
            items.off("click").on("click",function(){
                $(".selected-deduction").removeClass("selected-deduction");
                $(this).addClass("selected-deduction");
            })
        }
         /**判断是否出现滚动条，相应改变样式 */
         ,bindJudgeScroll : function(obj) {
            if(obj.scrollHeight>obj.clientHeight)
                return true;
            else 
                return false;
         }
         /**绑定设备线路到计入项 */
         ,bindLineToCountEvent : function(buttons) {
             buttons.off("click").on("click",function() {
                if($(".selected-line").length){
                    var e = $(".selected-line").find("td");
                    const $tbody = $("#countItem").children("tbody");
                    var lens = $("#countItem tbody tr").length;
                    var id = $(".selected-line").attr("id");
                    $tbody.append("<tr id="+ (id) +"><td>"+ (lens+1) +"</td><td>"+(e.eq(1).text())+"</td><td>"+(e.eq(2).text())+"</td></tr>")
                    $(".selected-line").remove();
                    /**重新渲染设备线路的序号 */
                    var i = 1;
                    $("#equipmentLine tbody tr").each(function(){
                        var e = $(this).find("td");
                        e.eq(0).text(i++);
                    })
                }
                else{
                    layer.msg("请先选择设备/线路",{
                        offset : ["44%","50%"],
                        time : 1000
                    })
                }
                caculationFormula.funcs.bindForCountClicks($("#countItem tbody tr"));
             })
         }
         /**绑定计入项到设备线路 */
         ,bindCountToLineEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                if($(".selected-count").length){
                    var e = $(".selected-count").find("td");
                    const $tbody = $("#equipmentLine").children("tbody");
                    var lens = $("#equipmentLine tbody tr").length;
                    var id = $(".selected-count").attr("id");
                    $tbody.append("<tr id="+ (id) +"><td>"+ (lens+1) +"</td><td>"+(e.eq(1).text())+"</td><td>"+(e.eq(2).text())+"</td></tr>")
                    $(".selected-count").remove();
                     /**重新渲染计入项的序号 */
                     var i = 1;
                     $("#countItem tbody tr").each(function(){
                         var e = $(this).find("td");
                         e.eq(0).text(i++);
                     })
                }
                else{
                    layer.msg("请先选择计入项",{
                        offset : ["44%","50%"],
                        time : 1000
                    })
                }
                caculationFormula.funcs.bindForLineClicks($("#equipmentLine tbody tr"));
            })
        }
        /**绑定设备线路到扣除项 */
        ,bindLineToDeductionEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                if($(".selected-line").length){
                    var e = $(".selected-line").find("td");
                    const $tbody = $("#deduction").children("tbody");
                    var lens = $("#deduction tbody tr").length;
                    var id = $(".selected-line").attr("id");
                    $tbody.append("<tr id="+ (id) +"><td>"+ (lens+1) +"</td><td>"+(e.eq(1).text())+"</td><td>"+(e.eq(2).text())+"</td></tr>")
                    $(".selected-line").remove();
                     /**重新渲染设备线路的序号 */
                     var i = 1;
                     $("#equipmentLine tbody tr").each(function(){
                         var e = $(this).find("td");
                         e.eq(0).text(i++);
                     })
                }
                else{
                    layer.msg("请先选择设备/线路",{
                        offset : ["44%","50%"],
                        time : 1000
                    })
                }
                caculationFormula.funcs.bindForDeductionClicks($("#deduction tbody tr"));
            })
        }
        /**绑定扣除项到设备线路 */
        ,bindDeductionToLineEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                if($(".selected-deduction").length){
                    var e = $(".selected-deduction").find("td");
                    const $tbody = $("#equipmentLine").children("tbody");
                    var lens = $("#equipmentLine tbody tr").length;
                    var id = $(".selected-deduction").attr("id");
                    $tbody.append("<tr id="+ (id) +"><td>"+ (lens+1) +"</td><td>"+(e.eq(1).text())+"</td><td>"+(e.eq(2).text())+"</td></tr>")
                    $(".selected-deduction").remove();
                     /**重新渲染设备线路的序号 */
                     var i = 1;
                     $("#deduction tbody tr").each(function(){
                         var e = $(this).find("td");
                         e.eq(0).text(i++);
                     })
                }
                else{
                    layer.msg("请先选择扣除项",{
                        offset : ["44%","50%"],
                        time : 1000
                    })
                }
                caculationFormula.funcs.bindForLineClicks($("#equipmentLine tbody tr"));
            })
        }
        /**绑定最后保存事件 */
        ,bindSaveEvent : function(buttons){
            buttons.off("click").on("click",function() {
                layer.open({
                    type : 1,
                    title : "保存",
                    content : "<h5 style='text-align:center;'>确定保存计算公式配置？</h5>",
                    area : ["250px","150px"],
                    btn : ["确定","取消"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        var urls ,data = [];
                        if(caculationFormula.flag === 0) {
                            urls = home.urls.caculationFormula.updateSection();
                            data = caculationFormula.funcs.saveData();
                        }
                        else {
                            urls = home.urls.caculationFormula.updateProcedure();
                            data = caculationFormula.funcs.saveData();
                        }
                        //console.log(data)
                        $.ajax({
                            url : urls,
                            contentType : "application/json",
                            dataType : "JSON",
                            type : "post",
                            data : JSON.stringify(data),
                            success : function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        caculationFormula.init();
                                        clearTimeout(time);
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset : ["40%","55%"],          
                                    time : 700                      
                                })
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
        /**保存计入项和扣除项数据 */
        ,saveData : function(){
            var data = [];
            var energySectionInfo = $(".selected-section").attr("id").substr(8);
            $("#countItem tbody tr").each(function(){
                data.push({
                    energyDeviceRoute : { id : $(this).attr("id") } ,
                    flag : 0,
                    energySectionInfo : { id : energySectionInfo }
                    })
            })
            $("#deduction tbody tr").each(function(){
                data.push({
                    energyDeviceRoute : { id : $(this).attr("id") } ,
                    flag : 1,
                    energySectionInfo : { id : energySectionInfo }
                })
            })
            $("#equipmentLine tbody tr").each(function(){
                data.push({
                    energyDeviceRoute : { id : $(this).attr("id") } ,
                    flag : 2,
                    energySectionInfo : { id : energySectionInfo }
                    })
            })
            return data;
        }
    }
}