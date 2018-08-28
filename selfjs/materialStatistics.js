var materialStatistics = {
    init : function() {
        materialStatistics.funcs.renderTable();
        var out = $("#materialManagementPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#materialManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,funcs: {
        renderTable:function() {
            /**渲染表头,获取所有数据 */
            $.get(home.urls.materialConsumptionItem.getAll(),{}, function(result) {
                var materialHead = result.data;
                $("#dynNum").attr("colspan" , materialHead.length);
                $("#dynConsume").attr("colspan" , materialHead.length);
                const $tr = $("#dynamicAdd");
                var keyDyn = materialStatistics.funcs.renderHead($tr, materialHead);
                var keyTwoDyn = materialStatistics.funcs.renderHead($tr, materialHead);
                key = materialStatistics.funcs.getHeadKey(keyDyn);
                /**获取当年1月份 */
                var currentDate = new Date().Format('yyyy');
                var startMonthDate = currentDate + "-01";
                var endMonthDate = currentDate + "-12";
                /**获取所有的记录 */
                $.get(home.urls.materialStatistics.getByStartDateAndEndDateByPage(),{
                    startDate : startMonthDate,
                    endDate : endMonthDate
                }, function(result) {
                    $("#beginDate").val(startMonthDate);
                    $("#endDate").val(endMonthDate);
                    var page = result.data;
                    var materialDatas = result.data.content;
                    var mapDatas = materialStatistics.funcs.getMapData(materialDatas);
                    console.log(mapDatas);
                })
            })
        }

        ,getPreMonth : function() {
            var preDate = new Date();
            preDate.setMonth(preDate.getMonth()-1);
            var frontDate = preDate.toLocaleDateString();
            var arr = frontDate.split('/');
            var year = arr[0];
            var month = (arr[1]<10 ? "0"+arr[1] : arr[1]);
            var day = (arr[2]<10 ? "0"+arr[2] : arr[2]);
            var startDate = year + "-" + month + "-" + day;
            return startDate;
        }
        // map方法使用
        ,getMapData : function(results) {
            // console.log(results);
            var datas = [];

            for(var i in results){
                // console.log(result);
                var result = results[i];
                // console.log(result);
                // 不能使用new map，否则会导致之数据格式不对
                var map = {};

                map["id"] = result.id;
                map["date"] = result.date;
                map["enterTime"] = result.enterTime;
                map["enterUser"] = result.enterUser&&result.enterUser.name;
                map["modifyTime"] = result.modifyTime;
                map["modifyUser"] = result.modifyUser&&result.modifyUser.name;
                console.log(result.materialConsumptionDetails);

                for(var j in result.materialConsumptionDetails){
                    var detail = result.materialConsumptionDetails[j];
                    map[detail.item.id] = detail.value;
                }
                datas.push(map);
            }
            // console.log(datas);
            return datas;
        }
        /**渲染表头 */
        ,renderHead : function($tr , materialHeads) {
            var keyDyn = [];
            materialHeads.forEach(function(e) {
                $tr.append(
                    "<td id=\""+  e.id +"\">"+ e.name +"</td>"
                );
                keyDyn.push(e.id);
            });
            return keyDyn;
        }
        // 获取表头的健值对
        ,getHeadKey : function(keyDyn) {
            var key = [];
            key.push("date");
            keyDyn.forEach(function(e) {
                key.push(e);
            });
            keyDyn.forEach(function(e) {
                key.push(e+"t");
            });
            key.push("enterTime");
            key.push("enterUser");
            key.push("modifyTime");
            key.push("modifyUser");
            // console.log(key);
            // console.log(key);

            return key;
        }
        /**将数据渲染成健值对形式 */
        ,getMapData : function (results) {
            var datas = [];
            for(var i in results) {
                var result = results[i];
                var map = {};
                map["id"] = result.id||"";
                map["date"] = result.date||"";
                map["enterTime"] = result.enterTime||"";
                map["enterUser"] = result.enterUser&&result.enterUser.name||"";
                map["modifyTime"] = result.modifyTime||"";
                map["modifyUser"] = result.modifyUser&&result.modifyUser.name||"";
                for(var j in result.materialConsumptionDetails){
                    var detail = result.materialConsumptionDetails[j];
                    map[detail.item.id] = detail.value||"";
                }
                datas.push(map);
            }
            return datas;
        }
    }
}