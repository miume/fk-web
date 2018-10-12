var powerRealtime = {
    init : function() {
        powerRealtime.funcs.renderTable();
        var out = $("#powerRealtimePage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#powerRealtimePage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            $("#nowDate").val(currentDate);
            /**获取所有数据 */
            $.get(home.urls.powerConsumptionRealtime.getLatestData(),{},function(result) {
                var powerDatas = result.data;
                const $tbody = $("#powerRealtimeTbody");
                powerRealtime.funcs.renderHandler($tbody , powerDatas);
            })
        }
        ,renderHandler : function($tbody , powerDatas ) {
            $tbody.empty();
            var i = 1 ;
            powerDatas.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>" + e.hour+ "</td>" +
                    "<td>" + e.device.name+"</td>" +
                    "<td>" + e.dpPoint.dpPoint+"</td>" +
                    "<td>" + e.activePower+"</td>" +
                    "<td>" + e.activeUsePower+"</td>" +
                    "<td>" + e.unactivePower+"</td>" +
                    "<td>" + e.unctiveUsePower+"</td>" +
                    "</tr>"
                )
            })
        }
    }
};