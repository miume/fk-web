var powerData = {
    init : function() {
        powerData.funcs.renderTable();
        powerData.funcs.renderDropBox();
        var out = $("#powerDataPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#powerDataPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date();
            var preDate = new Date(currentDate.getTime() - 24*60*60*1000).Format('yyyy-MM-dd');
            $("#searchDate").val(preDate);
            /**绑定搜索事件 */
            powerData.funcs.bingSearchEvents($("#searchButton"));
        }
        /**绑定搜索事件 */
        ,bingSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var searchDates = $('#searchDate').val();
                var selectNames = $('#selectName').val();
                $.get(home.urls.powerConsumptionRealtime.getByDateAndDevice(),{
                    date : searchDates ,
                    deviceId : selectNames
                }, function(result) {
                    var powerConDatas = result.data;
                    const $tbody = $("#powerDataTbody");
                    powerData.funcs.renderHandler($tbody,powerConDatas,0);
                    layer.msg(result.message, {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                })
            })
        }
        ,renderHandler : function($tbody , powerDatas , page ) {
            $tbody.empty();
            var i = 1 + page * 10 ;
            console.log(powerDatas)
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
        ,renderDropBox : function() {
            $("#selectName").empty();
            //  获取名称
            $.get(home.urls.equipmentLine.getAll(),{},function(result) {
                var equipmentData = result.data;
                equipmentData.forEach(function(e) {
                    $("#selectName").append('<option value='+e.id+'>'+e.name+'</option>');
                })
            })
        }
    }
};