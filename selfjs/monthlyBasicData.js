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
            /** 绑定查询事件*/
            basicData.funcs.bindSearchReportEvent($("#searchButton"));
            /** 绑定导出事件*/
            basicData.funcs.bindExpertReportEvent($("#expertButton"));
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
                    "<td>" + (e.editor ? e.editor : '') + "</td>" + 
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