var assayManage = {
    init : function(){
        assayManage.funcs.renderTable();
        assayManage.funcs.renderSelector();
        setInterval(function(){
            assayManage.funcs.renderTable();
        },1800000);
        var out = $("#report_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#report_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
     /**当前总记录数，用户控制全选逻辑 */
     ,pageSize: 0
     ,funcs : {
        renderTable : function(){
            var sys = $("#system").val();
            var type = $("#type").val();
            var orderCode = $("#number").val();
            $.get(home.urls.delegation.getAssayManage(),{
                sendToCheckId : sys,
                delegationId : type,
                orderCode : orderCode
            },function(result){
                var reports = result.data.content;
                if(reports == null){
                    return;
                }
                const $tbody = $("#reportTable").children("tbody");
                assayManage.funcs.renderHandler1($tbody,reports,0);
                assayManage.pageSize = result.data.length;
                var page = result.data
                 /** @namespace page.totalPages 这是返回数据的总页码数 */
                /**分页信息 */
                layui.laypage.render({
                    elem: "report_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.delegation.getAssayManage(),{
                                sendToCheckId : sys,
                                delegationId : type,
                                orderCode : orderCode,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                const $tbody = $("#reportTable").children("tbody");
                                var page = obj.curr - 1;
                                assayManage.funcs.renderHandler1($tbody, reports,page);
                                assayManage.pageSize = result.data.length;
                            })
                        }
                    }
                })

            })
            /** 绑定查询事件*/
            assayManage.funcs.bindSearchReportEvent($("#searchButton"));
            /** 绑定导出事件*/
            assayManage.funcs.bindExpertReportEvent($("#expertButton1"));
        }
        ,renderSelector : function(){
            const $selector1 = $("#system");
            $.get(home.urls.check.getAll(),{},function(result){
                var systems = result.data;
                assayManage.funcs.renderHandler4($selector1,systems);
            })
            const $selector2 = $("#type");
            $.get(home.urls.delegationInfo.findAll(),{},function(result) {
                var types = result.data;
                assayManage.funcs.renderHandler4($selector2,types);
            })
        }
        /** 下拉框*/
        ,renderHandler4 : function($selector, datas) {    
            $selector.empty() ;
            $selector.append(
                "<option value= '-1'>"+ "所有" + "</option>"
            )
            datas.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /**查询事件 */
        ,bindSearchReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var sys = $("#system").val();
                var type = $("#type").val();
                var orderCode = $("#number").val();
                $.get(home.urls.delegation.getAssayManage(),{
                    sendToCheckId : sys,
                    delegationId : type,
                    orderCode : orderCode
                },function(result){
                    var reports = result.data.content;
                //    if(reports == null){
                //        return;
                //    }
                    const $tbody = $("#reportTable").children("tbody");
                    assayManage.funcs.renderHandler1($tbody,reports,0);
                    assayManage.pageSize = result.data.length;
                    var page = result.data;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "report_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.delegation.getAssayManage(),{
                                    sendToCheckId : sys,
                                    delegationId : type,
                                    orderCode : orderCode,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    const $tbody = $("#reportTable").children("tbody");
                                    var page = obj.curr -1;
                                    assayManage.funcs.renderHandler1($tbody, reports,page);
                                    assayManage.pageSize = result.data.length;
                                })
                            }
                        }
                    })

                })
            })
        }
        /**导出事件 */
        ,bindExpertReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var sys = $("#system").val();
                var type = $("#type").val();
                var orderCode = $("#number").val();
                var url = home.urls.delegation.download2() + "?sendToCheckId=" + sys + "&delegationId=" + type + "&orderCode=" + orderCode;
               $("#download-id1").attr("href",url);
            })
        }
        /**渲染表格 */
        ,renderHandler1: function($tbody,reports,page){
            $tbody.empty();
            var i = page * 10 + 1;
            reports.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.orderCode) + "</td>" +
                    "<td>" + (e.delegationInfo ? e.delegationInfo.name : '') + "</td>" +
                    "<td>" + (e.testMethodInfo ? e.testMethodInfo.name : '') + "</td>" +
                    "<td>" + (e.operationDate) + "</td>" +
                    "<td>" + (e.clazz ? e.clazz.name : '') + "</td>" +
                    "<td>" + (e.sendToCheckInfo ? e.sendToCheckInfo.name : '') + "</td>" +
                    "<td>" + (e.signUser ? e.signUser.name : '') + "</td>" +
                    "<td>" + (e.signDate) + "</td>" +
                    "<td>" + 
                    "<a href='#' class='detail' id='detail-" + (e.id) +"'>查看委托单</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                    "<a href='#' class='update' id='update-" + (e.id) + "'>录入化验结果</a>" + "</td>" +
                    "</tr>"
                )
                /**绑定查看委托单事件 */
                assayManage.funcs.bindPageSwitch($(".detail"));
                /**绑定录入化验结果事件 */
                assayManage.funcs.bindEntryEvent($(".update"));
            })
        }
        /**查看委托单 */
        ,bindPageSwitch : function(buttons){
            buttons.off('click').on('click',function(){
                $("#block1").addClass("hidePage");
                $("#block2").removeClass("hidePage");
                var id = $(this).attr('id').substr(7);   
                $.get(home.urls.delegation.getById(),{id:id},function(result){
                    if(result.data.delegationInfo.id==1){
                        var detailData = result.data;
                        var orderFlag = detailData.delegationOrderDetails;
                        const $tbody = $("#conventionalTbody");
                        var maps = {}
                        var map = {}
                        var itemMap = {}
                        orderFlag.forEach(function(flag){
                            itemMap[id] = flag.id
                        })
                        maps["pb"] = detailData.delegationOrderDetailFlags[0].pbFlag
                        maps["zn"] = detailData.delegationOrderDetailFlags[0].znFlag
                        maps["sf"] = detailData.delegationOrderDetailFlags[0].sflag
                        maps["fe"] = detailData.delegationOrderDetailFlags[0].feFlag
                        var item = {"pb":"铅","zn":"锌","sf":"硫","fe":"铁"}
                        for(var i in maps){
                            if(maps[i]==1){
                                map[i]=item[i]
                            }
                        }
                        var arr = Object.keys(map)
                        var length = arr.length
                        $("#dynResult").attr("colspan",length)
                        const $tr = $("#dynAdd")
                        $("#conventionalModal").removeClass("hidePage")
                        $("#temporalModal").addClass("hidePage")
                        var keyDyn = assayManage.funcs.renderHead($tr,map)
                        keys = assayManage.funcs.getHeadKey(keyDyn);
                        // console.log(keys)
                        assayManage.funcs.renderResult($tbody,detailData,keys,map)
                        // console.log(key)
                    }else if(result.data.delegationInfo.id==2){
                        var detailData = result.data;
                        var orderFlag = detailData.delegationOrderDetails;
                        const $tbody = $("#tempTbody");
                        var maps = {}
                        var map = {}
                        var itemMap = {}
                        orderFlag.forEach(function(flag){
                            itemMap[id] = flag.id
                        })
                        maps["pb"] = detailData.delegationOrderDetailFlags[0].pbFlag
                        maps["zn"] = detailData.delegationOrderDetailFlags[0].znFlag
                        maps["sf"] = detailData.delegationOrderDetailFlags[0].sflag
                        maps["fe"] = detailData.delegationOrderDetailFlags[0].feFlag
                        var item = {"pb":"铅","zn":"锌","sf":"硫","fe":"铁"}
                        for(var i in maps){
                            if(maps[i]==1){
                                map[i]=item[i]
                            }
                        }
                        var arr = Object.keys(map)
                        var length = arr.length
                        $("#tempResult").attr("colspan",length)
                        const $tr = $("#tempAdd")
                        $("#conventionalModal").addClass("hidePage")
                        $("#temporalModal").removeClass("hidePage")
                        var keyDyn = assayManage.funcs.renderHead($tr,map)
                        keys = assayManage.funcs.getHeadKey(keyDyn);
                        // console.log(keys)
                        assayManage.funcs.renderTemporaryResult($tbody,detailData,keys,map)
                        // console.log(key)
                    }
                })
                /**绑定导出事件 */
                assayManage.funcs.bindExpertReportEvent2($("#expertButton2"),id);
          })
        }
        /**导出事件 */
        ,bindExpertReportEvent2 : function(buttons,id){
            buttons.off('click').on('click',function(){
                var url = home.urls.delegation.download1() + "?id=" + id ;
               $("#download-id2").attr("href",url);
            })
        }
        
        /**录入化验结果事件 */
        ,bindEntryEvent : function(buttons){
            buttons.off('click').on('click',function(){
                $("#block1").addClass("hidePage");
                $("#block3").removeClass("hidePage");
                var id = $(this).attr('id').substr(7);   
                $.get(home.urls.delegation.getById(),{
                    id : id
                },function(result){
                    var detailData = result.data;
                    $("#release").empty();
                    if((detailData.delegationInfo.name=="常规委托")&&(detailData.signFlag == 2)){
                        $("#release").append(
                            "<a href='#'><i class='layui-icon'>&#xe619;</i> 发布</a>"
                        )
                    }
                    var orderFlag = detailData.delegationOrderDetails;
                    const $tbody = $("#entryTbody");
                    var maps = {}
                    var map = {}
                    var itemMap = {}
                    orderFlag.forEach(function(flag){
                        itemMap[id] = flag.id
                    })
                    maps["pb"] = detailData.delegationOrderDetailFlags[0].pbFlag
                    maps["zn"] = detailData.delegationOrderDetailFlags[0].znFlag
                    maps["sf"] = detailData.delegationOrderDetailFlags[0].sflag
                    maps["fe"] = detailData.delegationOrderDetailFlags[0].feFlag
                    var item = {"pb":"铅","zn":"锌","sf":"硫","fe":"铁"}
                    for(var i in maps){
                        if(maps[i]==1){
                            map[i]=item[i]
                        }
                    }
                    var arr = Object.keys(map)
                    var length = arr.length
                    $("#entryResult").attr("colspan",length)
                    const $tr = $("#entryAdd")
                    var keyDyn = assayManage.funcs.renderHead($tr,map)
                    keys = assayManage.funcs.getHeadKey(keyDyn);
                    // console.log(keys)
                    assayManage.funcs.renderEntry($tbody,detailData,keys,map)
                    // console.log(key)
                    assayManage.funcs.bindUpdateEvent($("#submitButton"),id,detailData,keys,map);

                }) 
               
                assayManage.funcs.bindPublishEvent($("#release"),id);
          })
        }
        /**提交委托单 */
        ,bindUpdateEvent : function(buttons,id,detailData,keys,map){
            buttons.off('click').on('click',function(){
            //    console.log(detailData)
                    var delegationId = detailData.delegationInfo.id;
                    var orderFlags = detailData.delegationOrderDetailFlags
                    var len = orderFlags.length;
                    var data;
                    var details = [];
                    var inputKey = new Array();
                    var inputVal = new Array();
                    for( var j = 0; j < len; j++){
                        inputKey[j] = new Array();
                        inputVal[j] = new Array();
                        for(var i in map){
                            inputKey[j].push(i);
                        }
                    }
                    console.log(inputKey);
                    var inputData = [];
                    for( var n = 0; n < len; n++){
                        $(".inputData-" + (n + 1)).each(function(){
                            inputVal[n].push($(this).children('input').val())
                        })
                    }
                   console.log(inputVal);
                    
                    var i = -1;
                    orderFlags.forEach(function(orderFlag){ 
                        i ++ ;
                        console.log(i)
                        details.push({
                            "id" : orderFlag.id ,
                            "sampleManageInfo" : {
                                "id" : orderFlag.sampleManageInfo.id
                            },
                            "sampleName" : orderFlag.sampleName,
                            "pb" : "",
                            "zn" : "",
                            "sf" : "",
                            "fe" : ""
                        })
                        for(var m = 0; m < inputKey[i].length; m ++) {
                            if(inputKey[i][m] == "pb"){
                                console.log("pb")
                                details[i].pb = inputVal[i][m]
                            }else if(inputKey[i][m] == "zn"){
                                console.log("zn")
                                details[i].zn = inputVal[i][m]
                            }else if(inputKey[i][m] == "sf"){
                                console.log("sf")
                                details[i].sf = inputVal[i][m]
                            }else if(inputKey[i][m] == "fe"){
                                console.log("fe")
                                details[i].fe = inputVal[i][m]
                            }else{

                            }
                        }
                    })
                //    console.log(details)
                    data = {
                        "id" : id ,
                        "delegationInfo" : {
                            "id" : delegationId
                        },
                        "delegationOrderDetails" : details,
                        "testUser" : {
                            "id" : home.user.id
                        }
                    }
                    console.log(data);
                        $.ajax({
                        url : home.urls.delegation.update(),
                        contentType : "application/json" ,
                        dataType : "JSON",
                        type : "post",
                        data : JSON.stringify(data),
                        success : function(result) {
                        //    if(result.message == "数据已录入, 不要重复录入") {
                        //        layer.msg(result.message, {
                        //            offset : ['40%', '55%'],
                        //            time : 700
                        //        })
                        //    }    
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                //    plan.init();
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                        }
                    }) 
                }) 
                
        }
        /**发布委托单 */
        ,bindPublishEvent : function(buttons,id){
            buttons.off('click').on('click',function(){
                $.get(home.urls.delegation.publish(),{
                    id : id
                },function(result){
                    if (result.code === 0) {
                        var time = setTimeout(function () {
                        //    plan.init();
                            clearTimeout(time)
                        }, 500)
                    }
                    layer.msg(result.message, {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                })
            })
        }
        /**渲染录入化验结果表格 */
        ,renderEntry : function($tbody,detailData,keys,map){
            $tbody.empty();
            var arr = Object.keys(map)
            var length = arr.length
            var i = 1;
            var c = 0;
            var orderFlags = detailData.delegationOrderDetails
            var flags = detailData.delegationOrderDetailFlags
        //    console.log(keys)
        //    console.log(map)
            if(orderFlags.length){
                orderFlags.forEach(function(orderFlag){
                    c = c + 1;
                    $tbody.append(
                        "<tr class='editline'>")
                    $tbody.append(
                        "<td id='edit-" + orderFlag.id + "'>" + (i++) + "</td>"
                    )
                    keys.forEach(function(key){
                        // console.log(key)
                        if(key == "sampleManageInfo"){
                            var code = orderFlag.sampleManageInfo.sampleCode
                            $tbody.append(
                                "<td>"+ (code) +"</td>"
                            )
                        }else if(key == "sampleName"){
                            $tbody.append(
                                "<td id='sample-" + orderFlag.sampleManageInfo.id + "'>"+ (orderFlag[key]||"") +"</td>"
                            )      
                        }else{
                            $tbody.append(
                                "<td class='inputData-" + c + "'>"+ "<input value='" + (orderFlag[key]||"") + "' style='width: 100%; height: 100%; align: center' >" +"</td>"
                            )
                        }
                    })
    
                    $tbody.append(
                        "</tr>"
                    )  
                })
            }else{
                flags.forEach(function(e){
                    c = c + 1;
                    $tbody.append(
                        "<tr class='editline'>")
                    $tbody.append(
                        "<td id='edit-" + e.id + "'>" + (i++)+ "</td>"
                    )
                    keys.forEach(function(key){
                        // console.log(key)
                        if(key == "sampleManageInfo"){
                            var code = e.sampleManageInfo.sampleCode
                            $tbody.append(
                                "<td>"+ (code) +"</td>"
                            )
                        }else if(key == "sampleName"){
                            $tbody.append(
                                "<td id='sample-" + e.sampleManageInfo.id + "'>"+ (e[key]||"") +"</td>"
                            )      
                        }else{
                            $tbody.append(
                                "<td class='inputData-" + c + "'>"+ (e[key]||"<input value='' style='width: 100%; height: 100%' >") +"</td>"
                            )
                        }
                    })
    
                    $tbody.append(
                        "</tr>"
                    )  
                })
            }
                
            
            $tbody.append(
                "<tr>" + 
                "<td>" + ("委托人") +"</td>" + 
                "<td>" + (detailData.signUser.name) + "</td>" + 
                "<td>" + ("委托时间") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.signDate) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("化验人") +"</td>" + 
                "<td>" + (detailData.testUser ? detailData.testUser.name : '') + "</td>" + 
                "<td>" + ("化验时间") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.testDate||"") + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作人") +"</td>" + 
                "<td>" + (detailData.operationUser ? detailData.operationUser.name : '') + "</td>" + 
                "<td>" + ("班组") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.team.name) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作日期") +"</td>" + 
                "<td>" + (detailData.operationDate) + "</td>" + 
                "<td>" + ("班次") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.clazz.name) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("原矿处理量") +"</td>" + 
                "<td>"+(detailData.mineDeal)+"</td>" + 
                "<td>" + ("比例系数") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.coEfficientCode) + "</td>" + 
                "</tr>"
            )
        }

        /**渲染查看委托单表头 */
        ,renderHead : function($tr,map){
            $tr.empty();
            var keyDyn = []
            for(var i in map){
                $tr.append(
                    "<td>" + map[i] + "</td>"
                )
                keyDyn.push(i)
            }
            return keyDyn
        }
        /**获取表头的键值对 */
        ,getHeadKey : function(keyDyn){
            var key = [];
            key.push("sampleName");
            key.push("sampleManageInfo");
            keyDyn.forEach(function(e) {
                key.push(e);
            });
            return key;
        }
        /**渲染常规化验结果数据 */
        ,renderResult : function($tbody,detailData,keys,map){
            $tbody.empty();
            var arr = Object.keys(map)
            var length = arr.length
            var i = 1;
            var orderFlags = detailData.delegationOrderDetails
            var flags = detailData.delegationOrderDetailFlags
        //    console.log(keys)
        //    console.log(map)
            if(orderFlags.length){
                orderFlags.forEach(function(orderFlag){
                    $tbody.append(
                        "<tr>")
                    $tbody.append(
                        "<td>" + (i++)+ "</td>"
                    )
                    keys.forEach(function(key){
                        // console.log(key)
                        if(key == "sampleManageInfo"){
                            var code = orderFlag.sampleManageInfo.sampleCode
                            $tbody.append(
                                "<td>"+ (code) +"</td>"
                            )
                        }else{
                            $tbody.append(
                                "<td>"+ (orderFlag[key]||"") +"</td>"
                            )
                        }
                    })
    
                    $tbody.append(
                        "</tr>"
                    )  
                })
            }else{
                flags.forEach(function(e){
                    $tbody.append(
                        "<tr>")
                    $tbody.append(
                        "<td>" + (i++)+ "</td>"
                    )
                    keys.forEach(function(key){
                        // console.log(key)
                        if(key == "sampleManageInfo"){
                            var code = e.sampleManageInfo.sampleCode
                            $tbody.append(
                                "<td>"+ (code) +"</td>"
                            )
                        }else{
                            $tbody.append(
                                "<td>"+ (e[key]||"") +"</td>"
                            )
                        }
                    })
    
                    $tbody.append(
                        "</tr>"
                    )  
                })
            }
                
            
            $tbody.append(
                "<tr>" + 
                "<td>" + ("委托人") +"</td>" + 
                "<td>" + (detailData.signUser.name) + "</td>" + 
                "<td>" + ("委托时间") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.signDate) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("化验人") +"</td>" + 
                "<td>" + (detailData.testUser ? detailData.testUser.name : '') + "</td>" + 
                "<td>" + ("化验时间") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.testDate||"") + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作人") +"</td>" + 
                "<td>" + (detailData.operationUser ? detailData.operationUser.name : '') + "</td>" + 
                "<td>" + ("班组") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.team.name) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作日期") +"</td>" + 
                "<td>" + (detailData.operationDate) + "</td>" + 
                "<td>" + ("班次") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.clazz.name) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("原矿处理量") +"</td>" + 
                "<td>"+(detailData.mineDeal)+"</td>" + 
                "<td>" + ("比例系数") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.coEfficientCode) + "</td>" + 
                "</tr>"
            )
        }

        /**渲染临时化验结果数据 */
        ,renderTemporaryResult : function($tbody,detailData,keys,map){
            $tbody.empty();
            var arr = Object.keys(map)
            var length = arr.length
            var i = 1;
            var orderFlags = detailData.delegationOrderDetails
            var flags = detailData.delegationOrderDetailFlags
            if(orderFlags.length){
                orderFlags.forEach(function(orderFlag){
                    $tbody.append(
                        "<tr>")
                    $tbody.append(
                        "<td>" + (i++)+ "</td>"
                    )
                    
                    keys.forEach(function(key){
                        // console.log(key)
                        if(key == "sampleManageInfo"){
                            var code = orderFlag.sampleManageInfo.sampleCode
                            $tbody.append(
                                "<td>"+ (code) +"</td>"+
                                "<td>" + (detailData.testMethodInfo.name)+ "</td>"
                            )
                        }else{
                            $tbody.append(
                                "<td>"+ (orderFlag[key]||"") +"</td>"
                            )
                        }
                    })
                    $tbody.append(
                        "</tr>"
                    )  
                })
            }else{
                flags.forEach(function(e){
                    $tbody.append(
                        "<tr>")
                    $tbody.append(
                        "<td>" + (i++)+ "</td>"
                    )
                    keys.forEach(function(key){
                        // console.log(key)
                        if(key == "sampleManageInfo"){
                            var code = e.sampleManageInfo.sampleCode
                            $tbody.append(
                                "<td>"+ (code) +"</td>" +
                                "<td>" + (detailData.testMethodInfo.name)+ "</td>"
                            )
                        }else{
                            $tbody.append(
                                "<td>"+ (e[key]||"") +"</td>"
                            )
                        }
                    })
    
                    $tbody.append(
                        "</tr>"
                    )  
                })
            }
            


            $tbody.append(
                "<tr>" + 
                "<td>" + ("委托人") +"</td>" + 
                "<td>" + (detailData.signUser.name) + "</td>" + 
                "<td>" + ("委托时间") + "</td>" + 
                "<td colspan="+(length+1)+">" + (detailData.signDate) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("化验人") +"</td>" + 
                "<td>" + (detailData.testUser ? detailData.testUser.name : '') + "</td>" + 
                "<td>" + ("化验时间") + "</td>" + 
                "<td colspan="+(length+1)+">" + (detailData.testDate||"") + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作人") +"</td>" + 
                "<td>" + (detailData.operationUser ? detailData.operationUser.name : '') + "</td>" + 
                "<td>" + ("班组") + "</td>" + 
                "<td colspan="+(length+1)+">" + (detailData.team.name) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作日期") +"</td>" + 
                "<td>" + (detailData.operationDate ? detailData.operationDate : '') + "</td>" + 
                "<td>" + ("班次") + "</td>" + 
                "<td colspan="+(length+1)+">" + (detailData.clazz.name) + "</td>" + 
                "</tr>"
            )
        }
        








     }
}