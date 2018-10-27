var basicData = {
    init : function(){
        basicData.funcs.renderTable();
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
            var year = $("#yearTime").val();
            $.get(home.urls.monthPower.getAllByYear(),{
                year : year,
            },function(result){
                var reports = result.data.content;
                if(reports == null){
                    return;
                }
                const $tbody = $("#monthPowerTable").children("tbody");
                basicData.funcs.renderHandler1($tbody,reports,0);
                basicData.pageSize = result.data.length;
                var page = result.data.content;
                /**分页信息 */
                layui.laypage.render({
                    elem: "report_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.monthPower.getAllByYear(),{
                                year : year,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var reports = result.data.content;
                                var page =  obj.curr - 1 ;
                                const $tbody = $("#monthPowerTable").children("tbody");
                                basicData.funcs.renderHandler1($tbody, reports,page);
                                basicData.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定新增事件 */
            basicData.funcs.bindAddReportEvent($("#addButton"));
            /** 绑定查询事件*/
            basicData.funcs.bindSearchReportEvent($("#searchButton"));
            /** 绑定导出事件*/
            basicData.funcs.bindExpertReportEvent($("#expertButton"));
        }
        /**渲染设备下拉框 */
        ,renderEquipmentSelector : function(){
            const $selector = $("#equipmentName2");    
                $.get(home.urls.equipmentLine.getByCodeLikeAndNameLike(),{code : -1,name : -1},function(result) {
                    var equipments = result.data.content;
                    basicData.funcs.renderHandler2($selector, equipments);
                })
                $selector.off('click').on('click',function(){
                    var code = $(this).val();
                    console.log(code);
                    $.get(home.urls.equipmentLine.getById(),{id : code},function(result){
                        console.log(result.data)
                        $("#powerDp1").val(result.data.energyDpPoint.dpPoint);
                        $("#powerDp1").attr('name',result.data.energyDpPoint.id);
                    })
                })
        }
        ,renderHandler2 : function($selector, equipments) {    
            $selector.empty() ;
            equipments.forEach(function(e){
                $selector.append(
                        "<option value=\"" + (e.id) +"\""+ ">"+ (e.name) + "</option>"
                )
            })
        }
        /**新增事件 */
        ,bindAddReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                $("#addReportModal").removeClass("hidePage");
                basicData.funcs.renderEquipmentSelector();
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#addReportModal"),
                    area: ['600px', '250px'],
                    btn: ['确定', '取消'],
                    offset: "auto",
                    yes: function(index){
                        /**收集手动输入数据 */
                            var equipmentId = $("#equipmentName2").val();
                            console.log(equipmentId)
                            var dpPoint = $("#powerDp1").attr("name");
                            console.log(dpPoint)
                            var year = $("#addYear").val();
                            console.log(year)
                            var unit = $("#addDpt").val();
                            console.log(unit)
                            var cal = $("#addCal").val();
                            console.log(cal)
                            var times = $("#addTimes").val();
                            console.log(times)
                        $.post(home.urls.monthPower.add() ,{ 
                           "energyDeviceRoute.id" : equipmentId,
                           "energyDpPoint.id" : dpPoint,
                           "year" : year,
                           "unit" : unit,
                           "isCal" : cal,
                           "times" : times,
                           "editor.id" : home.user.id
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    basicData.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#addReportModal").css("display","none");
                        layer.close(index);
                    },
                    closeBtn : 0,
                    btn2 : function(index) {
                        $("#addReportModal").css("display","none");
                        layer.close(index);
                    }  
                })
            })
        }
        /**查询事件 */
        ,bindSearchReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var year = $("#yearTime").val();
                $.get(home.urls.monthPower.getAllByYear(),{
                    year : year,
                },function(result){
                    var reports = result.data.content;
                    if(reports == null){
                        return;
                    }
                    const $tbody = $("#monthPowerTable").children("tbody");
                    basicData.funcs.renderHandler1($tbody,reports,0);
                    basicData.pageSize = result.data.length;
                    var page = result.data.content;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "report_page",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.monthPower.getAllByYear(),{
                                    year : year,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                }, function (result) {
                                    var reports = result.data.content;
                                    var page =  obj.curr - 1 ;
                                    const $tbody = $("#monthPowerTable").children("tbody");
                                    basicData.funcs.renderHandler1($tbody, reports,page);
                                    basicData.pageSize = result.data.length;
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
                var year = $("#yearTime").val();
                var url = home.urls.monthPower.export() + "?year=" + year;
                $("#download-id").attr("href",url);
            })
        }
        /**渲染月用电信息表 */
        ,renderHandler1 : function($tbody,data,page){
            $tbody.empty();
            var i = page * 10 + 1;
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" + 
                    "<td>" + (i++) + "</td>" + 
                    "<td>" + (e.energyDeviceRoute.name) + "</td>" + 
                    "<td>" + (e.energyDeviceRoute.id) + "</td>" + 
                    "<td>" + (e.unit) + "</td>" + 
                    "<td>" + (e.times) + "</td>" + 
                    "<td>" + (e.isCal) + "</td>" + 
                    "<td>" + (e.editor ? e.editor.name : '') + "</td>" + 
                    "<td>" + (e.editTime ? e.editTime : '') + "</td>" + 
                    "<td>" + (e.one) + "</td>" + 
                    "<td>" + (e.two) + "</td>" + 
                    "<td>" + (e.three) + "</td>" + 
                    "<td>" + (e.four) + "</td>" + 
                    "<td>" + (e.five) + "</td>" + 
                    "<td>" + (e.six) + "</td>" + 
                    "<td>" + (e.seven) + "</td>" + 
                    "<td>" + (e.eight) + "</td>" + 
                    "<td>" + (e.nine) + "</td>" + 
                    "<td>" + (e.ten) + "</td>" + 
                    "<td>" + (e.eleven) + "</td>" + 
                    "<td>" + (e.twelve) + "</td>" + 
                    "<td><a href='#' class='update' id='update-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            });
            /**绑定编辑事件 */
            basicData.funcs.bindUpdateReportEvent($('.update'));
        }
        /**编辑事件 */
        ,bindUpdateReportEvent : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(7);
                console.log(id)
            //    $("#updatePowerModal").removeClass("hidePage");
                $.get(home.urls.monthPower.getById(),{
                    id : id
                },function(result){
                    // do something ..
                    var powerData = result.data
                    var id = powerData.id
                    $("#equipmentName").val(powerData.energyDeviceRoute.name);
                    $("#equipmentName1").val(powerData.energyDeviceRoute.id);
                    $("#powerDp").val(powerData.energyDpPoint.dpPoint);
                    $("#firstMonth").val(powerData.one);
                    $("#secondMonth").val(powerData.two);
                    $("#thirdMonth").val(powerData.three);
                    $("#fourthMonth").val(powerData.four);
                    $("#fifthMonth").val(powerData.five);
                    $("#sixthMonth").val(powerData.six);
                    $("#seventhMonth").val(powerData.seven);
                    $("#eighthMonth").val(powerData.eight);
                    $("#ninthMonth").val(powerData.nine);
                    $("#tenthMonth").val(powerData.ten);
                    $("#eleventhMonth").val(powerData.eleven);
                    $("#twelvthMonth").val(powerData.twelve);
                    $("#updatePowerModal").removeClass("hidePage");
                    layer.open({
                        type: 1,
                        title: '用电月基础数据编辑',
                        content: $("#updatePowerModal"),
                        area: ['600px', '450px'],
                        btn: ['确定', '取消'],
                        offset: "auto",
                        yes: function(index){
                            /**获取数据 */
                            var one = $("#firstMonth").val();
                            var two = $("#secondMonth").val();
                            var three = $("#thirdMonth").val();
                            var four = $("#fourthMonth").val();
                            var five = $("#fifthMonth").val();
                            var six = $("#sixthMonth").val();
                            var seven = $("#seventhMonth").val();
                            var eight = $("#eighthMonth").val();
                            var nine = $("#ninthMonth").val();
                            var ten = $("#tenthMonth").val();
                            var eleven = $("#eleventhMonth").val();
                            var twelve = $("#twelvthMonth").val();
                            $.post(home.urls.monthPower.update() ,{
                                id : id,
                                one : one,
                                two : two,
                                three : three,
                                four : four,
                                five : five,
                                six : six,
                                seven : seven,
                                eight : eight,
                                nine : nine,
                                ten : ten,
                                eleven : eleven,
                                twelve : twelve,
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        basicData.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#updatePowerModal").css("display","none");
                            layer.close(index);
                        },
                        closeBtn : 0,
                        btn2 : function(index) {
                            $("#updatePowerModal").css("display","none");
                            layer.close(index);
                        }
                        
                    })

                })
            })
        }


    }
}