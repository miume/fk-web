var timeManagement = {
    init : function(){
        timeManagement.funcs.renderOption();
        timeManagement.funcs.renderDropBox();
        var out = $("#temporal_page").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#temporal_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable:function(){
            var year = $("#timeTemporal").val()
            $.get(home.urls.temporal.getAllByYear(),{statisticalYear : year},function(result){
                var times = result.data;
                const $tbody = $("#temporalTable").children("tbody");
                timeManagement.funcs.renderHandler($tbody, times);
            })
            /**绑定查询事件 */
            timeManagement.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            timeManagement.funcs.bindDownloadEvents($("#downloadButton"));
        }
        ,renderOption:function(){
            var date = new Date();
            var year = date.getFullYear();
            $("#timeTemporal").val(year);
            $.get(home.urls.temporal.getAllByYear(),{statisticalYear : year},function(result){
                var times = result.data;
                const $tbody = $("#temporalTable").children("tbody");
                timeManagement.funcs.renderHandler($tbody, times);
            })
            /**绑定查询事件 */
            timeManagement.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            timeManagement.funcs.bindDownloadEvents($("#downloadButton"));
        }
        /**绑定查询事件 */
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var year = $('#timeTemporal').val();
                //获取所有记录
                $.get(home.urls.temporal.getAllByYear(),{statisticalYear : year},function(result){
                    var times = result.data;
                    const $tbody = $("#temporalTable").children("tbody");
                    timeManagement.funcs.renderHandler($tbody,times);
                })
            })
        }
        /**绑定导出事件 */
        ,bindDownloadEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var year = $("#timeTemporal").val()
                if (year ===""){
                    layer.msg("日期选择不能为空!");
                    return
                }
                var url = "http://218.77.105.241:40080/fk/temporalInterval/download?statisticalYear=" + year;
                $("#download-id").attr("href",url);
            })
        }
        ,renderHandler : function($tbody,times){
            
            $tbody.empty();
            var i = 1;
            for(var t=1;t<=12;t++){
                var flag = false;
                for(x in times){
                    if(times[x].statisticalMonth == t){
                        // console.log(times[x].id)
                        $tbody.append(
                            "<tr>" + 
                            "<td id='month'>"+(times[x].statisticalMonth)+"</td>" +
                            "<td>"+(times[x].startDate)+"</td>" +
                            "<td>"+(times[x].startShift)+"</td>" +
                            "<td>"+(times[x].endDate)+"</td>" +
                            "<td>"+(times[x].endShift)+"</td>" +
                            "<td>"+(times[x].updateTime ? times[x].updateTime : '')+"</td>" +
                            "<td>"+(times[x].updateUser&&times[x].updateUser.name ? times[x].updateUser.name : '')+"</td>" +
                            "<td>"+(times[x].description ? times[x].description : '')+"</td>" +
                            "<td><a href='#' class='edit' id='edit-"+(times[x].id)+"' name="+(times[x].statisticalMonth)+"><i class='layui-icon'>&#xe642;</i></a></td>" +
                            "</tr>"
                        )
                        flag = true;
                        i++
                        break;
                    }
                }
                if(flag == false){
                    i++
                    $tbody.append(
                        "<tr>" +
                        "<td id='month'>"+(i-1)+"</td>"+
                        "<td>"+"</td>" +
                        "<td>"+"</td>" +
                        "<td>"+"</td>" +
                        "<td>"+"</td>" +
                        "<td>"+"</td>" +
                        "<td>"+"</td>" +
                        "<td>"+"</td>" +
                        "<td><a href='#' class='edit' id='edit-"+(-1)+"' name="+(i-1)+"><i class='layui-icon'>&#xe642;</i></a></td>" +
                        "</tr>"
                    )
                }
            }
            //绑定编辑事件
            timeManagement.funcs.bindEditEvents($(".edit"));
        }
        /**编辑，新增事件 */
        ,bindEditEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#time").empty();
                var id = $(this).attr('id').substr(5);
                var month = $(this).attr('name');
                var year = $("#timeTemporal").val();
                var t = year + "." + month;
                $("#time").val(t);
                $("#startTime").val("");
                $("#endTime").val("");
                $("#startShift").val("");
                $("#endShift").val("");
                $("#description").val("");
                $("#updateModal").removeClass("hide");
                if(id == -1){
                    layer.open({
                        type : 1,
                        title : "新增",
                        content : $("#updateModal"),
                        area : ['550px', '300px'],
                        btn : ['确定' , '取消'],
                        offset : ['40%' , '45%'],
                        closeBtn: 0,
                        yes : function(index){
                            var startTime = $("#startTime").val();
                            var description = $("#description").val();
                            var endTime = $("#endTime").val();
                            var startShift = $("#startShift").val();
                            var endShift = $("#endShift").val();
                            if(startTime===""||endTime===""||startShift===""||endShift===""){
                                layer.msg("所填信息不能为空！")
                                return
                            }
                            $.post(home.urls.temporal.edit(),{
                                id : id,
                                startDate : startTime,
                                endDate : endTime,
                                startShift :startShift,
                                endShift : endShift,
                                description : description,
                                statisticalYear : year,
                                statisticalMonth : month
                            },function(result){
                                layer.msg(result.message,{
                                    offset : ['40%' , '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        timeManagement.funcs.renderTable();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#updateModal").addClass("hide");
                            layer.close(index);
                        },
                        btn2 : function(index) {
                            $("#updateModal").addClass("hide");
                            layer,close(index);
                        }
                })
            }else{
                $.get(home.urls.temporal.getById(),{ id:id }, function(result) {
                    var times = result.data;
                    var id = times.id;
                    var t = year + "." + month;
                    $("#time").val(t);
                    $("#startTime").val(times.startDate);
                    $("#endTime").val(times.endDate);
                    $("#startShift").val(times.startShift);
                    $("#endShift").val(times.endShift);
                    $("#description").val(times.description);
                    $("#updateModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['550px', '300px'],
                        btn: ['确定', '取消'],
                        offset: ['40%','45%'],
                        closeBtn: 0,
                        yes: function(index){
                            var startTime = $("#startTime").val();
                            var description = $("#description").val();
                            var endTime = $("#endTime").val();
                            var startShift = $("#startShift").val();
                            var endShift = $("#endShift").val();                            
                            if(startTime===""||endTime===""||startShift===""||endShift===""){
                                layer.msg('所填信息不能为空!');
                                return 
                            }
                            $.post(home.urls.temporal.edit() ,{
                                id : id,
                                startDate : startTime,
                                endDate : endTime,
                                startShift :startShift,
                                endShift : endShift,
                                description : description,
                                statisticalYear : year,
                                statisticalMonth : month
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        timeManagement.funcs.renderTable();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#updateModal").css("display","none");
                            layer.close(index);
                        },
                        btn2 : function(index) {
                            $("#updateModal").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            }
            })
        }
    }
}