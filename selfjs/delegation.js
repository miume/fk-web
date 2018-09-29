var delegationManagement = {
    pageSize : 0
    ,init : function(){
        /**获取数据信息分页显示，初始化各下拉框，单选框，复选框 */
        delegationManagement.funcs.renderTable();
        delegationManagement.funcs.renderDropBox();
        delegationManagement.funcs.renderDropBox2();
        delegationManagement.funcs.renderSingleBox();
        delegationManagement.funcs.renderCheckBox();
        var out = $("#delegation_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#delegation_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,funcs : {
        /**渲染页面 */
        renderTable : function(){
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = delegationManagement.funcs.getPreDate();
            $("#startDate").val(preMonthDate);
            $("#endDate").val(currentDate);
            /**获取所有的记录 */
            $.get(home.urls.delegation.getByManyFactorsByPage(),{startDate : preMonthDate,
                endDate : currentDate},function(result){
                var delegations = result.data.content;
                const $tbody = $("#delegationTable").children("tbody");
                delegationManagement.funcs.renderHandler($tbody, delegations, 0);
                delegationManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "delegation_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.delegation.getByManyFactorsByPage(),{
                                startDate : preMonthDate,
                                endDate : currentDate,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var delegations = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#delegationTable").children("tbody");
                                delegationManagement.funcs.renderHandler($tbody, delegations, page);
                                delegationManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            delegationManagement.funcs.bindAddEvents($("#addButton"));
            /**绑定搜索事件 */
            delegationManagement.funcs.bindSearchEvents($("#searchButton"));
            /**绑定刷新事件 */
            delegationManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定类型选择事件 */
            delegationManagement.funcs.bindClickEvents();
        }
        /**得到当前日期的前一个周 */
        ,getPreDate : function() {
            var now = new Date();
            var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var startDate = year + "-" + month + "-" + day;
            return startDate;
        }
        /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var index = layer.load(2 , { offset : ['40%','58%'] });
                var time = setTimeout(function() {
                    layer.msg('刷新成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                    delegationManagement.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**搜索事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var sendToCheckId = $("#sampleType option:selected").val()
                var delegationId = $("#delegationType option:selected").val()
                var signFlag = $("#assay option:selected").val()
                var startDate = $("#startDate").val()
                var endDate = $("#endDate").val()
                $.get(home.urls.delegation.getByManyFactorsByPage(),{
                    sendToCheckId : sendToCheckId,
                    delegationId : delegationId,
                    signFlag : signFlag,
                    startDate : startDate,
                    endDate : endDate
                },function(result){
                var delegations = result.data.content;
                const $tbody = $("#delegationTable").children("tbody");
                delegationManagement.funcs.renderHandler($tbody, delegations, 0);
                delegationManagement.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "delegation_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.delegation.getByManyFactorsByPage(),{
                                sendToCheckId : sendToCheckId,
                                delegationId : delegationId,
                                signFlag : signFlag,
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var delegations = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#delegationTable").children("tbody");
                                delegationManagement.funcs.renderHandler($tbody, delegations, page);
                                delegationManagement.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
        /**绑定委托类型点击事件 */
        ,bindClickEvents : function(){
            $("input:radio[name='commi']").change(function(){
                var commiId = $(this).attr('id').substr(4);
                if(commiId == 1){
                    $("#capacity").removeAttr("disabled");
                    $("input:radio[name='met']").prop("disabled",true);
                }else if(commiId == 2){
                    $("#capacity").val("");
                    $("#capacity").attr("disabled",true);
                    $("input:radio[name='met']").prop("disabled",false);
                }
            })
        }
        /**绑定新增事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on("click",function(){
                var delegationArrays = [];
                $("#remarks").val("");
                $("#capacity").val("");
                $("#operationDate").val("")
                $("input:radio[name='met']").prop("disabled",false);
                $("input:checkbox[name='item']").prop("checked", false);
                delegationManagement.funcs.bindClickEvents()
                $("#addModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "送检委托单管理",
                    content : $("#addModal"),
                    area: ['75%', '85%'],
                    btn : ['生成委托单' , '返回'],
                    offset : ['10%' , '10%'],
                    closeBtn: 0,
                    yes : function(index){
                        // 实现json格式传数据
                        var item = $("input[name='sample']:checked")
                        var userStr = $.session.get('user');
                        var userJson = JSON.parse(userStr);
                        var data = {
                            clazz : {id : $("#clazz").val()},
                            delegationInfo : {id : $("input[name='commi']:checked").attr('id').substr(4)},
                            delegationOrderDetailFlags : [],
                            description : $("#remarks").val(),
                            mineDeal : $("#capacity").val(),
                            operationDate : $("#operationDate").val(),
                            operationUser : {id : $("#operator option:selected").val()},
                            sendToCheckInfo : {id : $("#sampleTypeHide option:selected").val()},
                            signUser : {id : userJson.id},
                            testMethodInfo : {id : $("input[name='met']:checked").attr('id')||""}
                        }
                        var flag = []
                        var flags = $(".item")
                        flags.each(function(){
                            if($(this).prop("checked")){
                                flag.push(1)
                            }else{
                                flag.push(0)
                            }
                        })
                        console.log(flag)
                        item.each(function(){
                            delegationArrays.push({
                                sampleManageInfo : {id : $(this).attr('id').substr(6)},
                                sampleName : $(this).val(),
                                sflag : flag[3],
                                znFlag : flag[1],
                                feFlag : flag[2],
                                pbFlag : flag[0]
                            })
                        })
                        data.delegationOrderDetailFlags = delegationArrays;
                        $.ajax({
                            url : home.urls.delegation.add(),
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            dataType: 'json',
                            type: 'post',
                            success: function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        delegationManagement.init()
                                        clearTimeout(time)
                                    }, 500);
                                    $("#addModal").css("display","none");
                                    layer.close(index);
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                            }
                        })
                    }
                    ,btn2: function (index) {
                        $("#addModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        ,renderHandler : function($tbody,delegations,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            delegations.forEach(function(e){
                // console.log(e.testUser)
                $tbody.append(
                    "<tr>" + 
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.orderCode)+"</td>" +
                    "<td>"+(e.delegationInfo.name)+"</td>" +
                    "<td>"+(e.operationDate)+"</td>" +
                    "<td>"+(e.clazz.name)+"</td>" +
                    "<td>"+(e.sendToCheckInfo.name)+"</td>" +
                    "<td>"+(e.signUser.name)+"</td>" +
                    "<td>"+(e.signDate)+"</td>" +
                    "<td>"+(e.signFlag===0?"未化验":"已化验")+"</td>" +
                    "<td>"+(e.testMethodInfo&&e.testMethodInfo.name||"")+"</td>" +
                    "<td>"+(e.testUser&&e.testUser.name || "")+"</td>" +
                    "<td>"+(e.testDate)+"</td>" +
                    "<td>"+(e.signFlag===0?"<a href='#' class ='detail' id='deatil-"+(e.id)+"'>委托单</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class ='delete' id='delete-"+(e.id)+"'>删除</a>":"<a href='#' class ='view' id='view-"+(e.id)+"'>化验结果</a>")+"</td>" +
                    "</tr>"
                )
            })
            /**绑定单条记录删除事件 */
            delegationManagement.funcs.bindDeleteByIdEvents($(".delete"));
            /**绑定委托单事件 */
            delegationManagement.funcs.bindDeatilEvents($(".detail"));
            /**绑定化验结果事件 */
            delegationManagement.funcs.bindViewEvents($(".view"));
        }
        /**化验结果事件 */
        ,bindViewEvents : function(buttons){
            buttons.off('click').on("click",function(){
                var id = $(this).attr("id").substr(5);
                $.get(home.urls.delegation.getById(),{id:id},function(result){
                    var detailData = result.data;
                    var orderFlag = detailData.delegationOrderDetails;
                    const $tbody = $("#conventionalTbody");
                    var maps = {}
                    var map = {}
                    var itemMap = {}
                    orderFlag.forEach(function(flag){
                        itemMap[id] = flag.id
                    })
                    // itemMap["铅"] = detailData.delegationOrderDetails[0].pbFlag
                    // itemMap["锌"] = detailData.delegationOrderDetails[0].znFlag
                    // itemMap["硫"] = detailData.delegationOrderDetails[0].sflag
                    // itemMap["铁"] = detailData.delegationOrderDetails[0].feFlag
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
                    var keyDyn = delegationManagement.funcs.renderHead($tr,map)
                    keys = delegationManagement.funcs.getHeadKey(keyDyn);
                    // console.log(keys)
                    delegationManagement.funcs.renderResult($tbody,detailData,keys,map)
                    // console.log(key)
                    $("#conventionalModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: "化验结果",
                        content: $("#conventionalModal"),
                        area: ['80%', '70%'],
                        btn: ['导出', '取消'],
                        offset: ['10%', '10%'],
                        closeBtn: 0,
                        yes: function(index) {
                            var href = home.urls.delegation.exportById()+"?id=" + id;
                            location.href = href;
                        }
                        ,btn2: function (index) {
                            $("#conventionalModal").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        /**委托单详情 */
        ,bindDeatilEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(7);
                $.get(home.urls.delegation.getById(),{
                    id : id
                },function(result) {
                    var detailData = result.data;
                    const $tbody = $("#conventionalTbody");
                    var maps = {}
                    var map = {}
                    maps["铅"] = detailData.delegationOrderDetailFlags[0].pbFlag
                    maps["锌"] = detailData.delegationOrderDetailFlags[0].znFlag
                    maps["硫"] = detailData.delegationOrderDetailFlags[0].sflag
                    maps["铁"] = detailData.delegationOrderDetailFlags[0].feFlag
                    for(var i in maps){
                        if(maps[i]==1){
                            map[i]=maps[i]
                        }
                    }
                    var arr = Object.keys(map)
                    var length = arr.length
                    $("#dynResult").attr("colspan",length)
                    const $tr = $("#dynAdd")
                    delegationManagement.funcs.renderHead1($tr,map)
                    // delegationManagement.funcs.renderDetails($tbody,detailData);
                    delegationManagement.funcs.renderDetails($tbody,detailData,map)
                    $("#conventionalModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: "委托单",
                        content: $("#conventionalModal"),
                        area: ['80%', '85%'],
                        btn: ['确定', '取消'],
                        offset: ['10%', '10%'],
                        closeBtn: 0,
                        yes: function(index) {
                            $("#conventionalModal").css("display","none");
                            layer.close(index);
                        }
                        ,btn2: function (index) {
                            $("#conventionalModal").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
        /**渲染化验结果数据 */
        ,renderResult : function($tbody,detailData,keys,map){
            $tbody.empty();
            var arr = Object.keys(map)
            var length = arr.length
            var i = 1;
            var orderFlags = detailData.delegationOrderDetails
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
                "<td>" + (detailData.testUser.name) + "</td>" + 
                "<td>" + ("化验时间") + "</td>" + 
                "<td colspan="+(length)+">" + (detailData.testDate) + "</td>" + 
                "</tr>"
            )
            $tbody.append(
                "<tr>" + 
                "<td>" + ("操作人") +"</td>" + 
                "<td>" + (detailData.operationUser.name) + "</td>" + 
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
        /**渲染详情数据 */
        ,renderDetails : function($tbody,detailData,map){
            $tbody.empty();
            var arr = Object.keys(map)
            var length = arr.length
            var i = 1;
            var itemFlags = detailData.delegationOrderDetailFlags
            itemFlags.forEach(function(e){
                $tbody.append(
                    "<tr>")
                $tbody.append(
                    "<td>" + (i++) + "</td>"+
                    "<td>" + (e.sampleManageInfo.name) + "</td>"+
                    "<td>" + (e.sampleManageInfo.sampleCode) + "</td>"
                )
                for(var t in map){
                    $tbody.append(
                        "<td></td>"
                    )
                }
                $tbody.append(
                    "</tr>"
                )
            })
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
                "<td>" + ("操作人") +"</td>" + 
                "<td>" + (detailData.operationUser.name) + "</td>" + 
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
        //     var flags = [];

        //     var length = flags.length;
        //     $("#dynAdd").attr("colspan",length)
        //     const $tr = $("#dynAdd")
        //     var keyDyn = delegationManagement.funcs.renderHead($tr,flags)
        //     keys = delegationManagement.funcs.getHeadKey(keyDyn);
        //     var detailFlag = detailData.delegationOrderDetailFlags;
        //     var mapDatas = delegationManagement.funcs.getMapData(detailFlag);
        //     $tbody.empty();
        //     var i = 0;
        //     mapDatas.forEach(function(mapData) {
        //         $tbody.append(
        //             "<tr>" + 
        //             "<td>" + (i++) + "</td>"
        //         );
        //         keys.forEach(function(key){
        //             $tbody.append(
        //                 "<td>"+ (mapData[key]||"") +"</td>"
        //             );
        //         });
        //         $tbody.append(
        //             "</tr>"
        //         );
        //     });
        // }
        /**将数据渲染成键值对形式 */
        // ,getMapData : function(results){
        //     var datas = []

        //     for(var i in results){
        //         var result = results[i];
        //         var map = {};
        //         map["name"] = result.name;
        //         map["sampleCode"] = result.sampleCode;
        //         map["1"] = result.pbFlag
        //         map["2"] = result.znFlag
        //         map["3"] = result.feFlag
        //         map["4"] = result.sflag
        //         datas.push(map);
        //     }
        //     return datas
        // }
        /**获取表头键值对 */
        // ,getHeadKey : function(keyDyn){
        //     var key = [];
        //     key.push("name")
        //     key.push("sampleCode")
        //     keyDyn.forEach(function(e){
        //         key.push(e);
        //     })
        //     return key;
        // }
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
        /**渲染表头 */
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
        /**渲染表头 */
        ,renderHead1 : function($tr,map){
            $tr.empty();
            for(var i in map){
                $tr.append(
                    "<td>" + i + "</td>"
                )
            }
        }
        /**单条记录删除事件 */
        ,bindDeleteByIdEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var _this = $(this);
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align:center;'>确定要删除删除该记录吗？</h5>",
                    area: ['200px','140px'],
                    btn: ['确定', '取消'],
                    offset: ['40%', '55%'],
                    closeBtn: 0,
                    yes: function(index){
                        var id = parseInt(_this.attr('id').substr(7))
                        $.post(home.urls.delegation.deleteById() , { _method : "delete", id : id }, function (result) {
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    delegationManagement.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })    
                        })
                        layer.close(index)
                    },
                    btn2 : function(index){
                        layer.close(index);
                    }
                })
            })
        }
        /**渲染页面下拉框 */
        ,renderDropBox : function() {
            $("#sampleType").empty();
            $("#sampleType").append('<option value="-1">'+("所有")+'</option>');
            $.get(home.urls.check.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#sampleType").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
            $("#sampleTypeHide").empty();
            $.get(home.urls.check.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#sampleTypeHide").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
        },
        /**渲染页面下拉框 */
        renderDropBox2 : function() {
            $("#delegationType").empty();
            $("#delegationType").append('<option value="-1">'+("所有")+'</option>');
            $.get(home.urls.delegationInfo.findAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#delegationType").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
            $("#clazz").empty();
            $("#clazz").append('<option></option>');
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#clazz").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
            $("#operator").empty();
            $("#operator").append('<option></option>');
            $.get(home.urls.user.getByTeam(),{teamId : 1},function(result) {
                var checks = result.data;
                checks.forEach(function(e) {
                    $("#operator").append('<option value='+e.id+'>'+e.name+'</option>')
                })
            })
            $("#team").empty();
            $("#team").append('<option></option>');
            $.get(home.urls.team.getById(),{id : 1},function(result) {
                var checks = result.data;
                $("#team").append('<option value='+checks.id+'>'+checks.name+'</option>')
            })
        }
        /**渲染单选框 */
        ,renderSingleBox : function(){
            $("#commission").empty();
            $.get(home.urls.delegationInfo.findAll(),{},function(result){
                var checks = result.data;
                checks.forEach(function(e){
                    $("#commission").append("<input class='radio' type='radio'  name='commi' id='com-"+(e.id)+"'><span style='padding-right:10px;'> "+(e.name)+"</span>")
                })
            })
            $("#method").empty();
            $.get(home.urls.testMethodInfo.findAll(),{},function(result){
                var checks = result.data;
                checks.forEach(function(e){
                    $("#method").append("<input class='radio' type='radio' name='met'  id="+(e.id)+"><span style='padding-right:10px;'> "+(e.name)+"</span>")
                })
            })
        }
        /**渲染复选框 */
        ,renderCheckBox : function(){    
            $("#sample").empty();
            $.get(home.urls.sample.getAllByPage(),{},function(result){
                var checks = result.data.content;
                checks.forEach(function(e){
                    $("#sample").append("<input name='sample' class='"+e.sampleCode+"' value='"+e.name+"' type='checkbox' id='check-"+(e.id)+"'><span style='padding-right:30px;'> "+(e.name)+"</span>")
                })
            })
        }
    }
}