var powerDay = {
    init : function() {
        powerDay.funcs.renderTable();

        // var out = $("#powerDayPage").width();
        // var time = setTimeout(function(){
        //     var inside = $(".layui-laypage").width();
        //     $('#powerDayPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
        //     clearTimeout(time);
        // },30);
    }
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            $("#nowDate").val(currentDate);
            /**获取所有的记录 */
            $.get(home.urls.powerConsumptionDay.getByDate(),{
                date : currentDate
            },function(result) {
                var powerDayDatas = result.data;
                const $tbody = $("#powerDayTbody");
                powerDay.funcs.renderHandler($tbody , powerDayDatas , 0);
            });
            /**绑定搜索事件 */
            powerDay.funcs.bindSearchEvents($("#searchButton"));
        }
        ,bindSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var date = $("#nowDate").val();
                if(date === ""){
                    layer.msg('时间不能为空！',{
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                $.get(home.urls.powerConsumptionDay.getByDate(),{
                    date : date
                },function(result) {
                    var powerDayDatas = result.data;
                    const $tbody = $("#powerDayTbody");
                    powerDay.funcs.renderHandler($tbody , powerDayDatas , 0);
                    layer.msg(result.message, {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                })
            })
        }
        ,renderHandler : function($tbody, powerDayDatas, page) {
            $tbody.empty();
            var i = 1 + page * 10;
            powerDayDatas.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>" + e.device.code + "</td>" +
                    "<td>" + e.device.name+"</td>" +
                    "<td>" + e.dpPoint.dpPoint+"</td>" +
                    "<td>" + e.hour0+"</td>" +
                    "<td>" + e.hour1+"</td>" +
                    "<td>" + e.hour2+"</td>" +
                    "<td>" + e.hour3+"</td>" +
                    "<td>" + e.hour4+"</td>" +
                    "<td>" + e.hour5+"</td>" +
                    "<td>" + e.hour6+"</td>" +
                    "<td>" + e.hour7+"</td>" +
                    "<td>" + e.hour8+"</td>" +
                    "<td>" + e.hour9+"</td>" +
                    "<td>" + e.hour10+"</td>" +
                    "<td>" + e.hour11+"</td>" +
                    "<td>" + e.hour12+"</td>" +
                    "<td>" + e.hour13+"</td>" +
                    "<td>" + e.hour14+"</td>" +
                    "<td>" + e.hour15+"</td>" +
                    "<td>" + e.hour16+"</td>" +
                    "<td>" + e.hour17+"</td>" +
                    "<td>" + e.hour18+"</td>" +
                    "<td>" + e.hour19+"</td>" +
                    "<td>" + e.hour20+"</td>" +
                    "<td>" + e.hour21+"</td>" +
                    "<td>" + e.hour22+"</td>" +
                    "<td>" + e.hour23+"</td>" +
                    "</tr>"
                )
            })
        }
    }
};