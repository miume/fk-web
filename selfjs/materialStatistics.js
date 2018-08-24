var materialStatistics = {
    init : function() {
        materialStatistics.funcs.renderTable();
    }
    ,dataTable
    ,funcs: {
        renderTable:function() {
            $.get(home.urls.materialConsumptionItem.getAll(),{},function(result) {
                var materialHead = result.data;
                // console.log(materialHead);
                var arr = [];
                arr.push({
                    field : "date",
                    title : "时间"
                });
                materialHead.forEach(function(e) {
                    arr.push({
                        field : e.id,
                        title : e.name,
                    })
                });
                arr.push({
                    field : "enterTime",
                    title : "录入时间"
                });
                arr.push({
                    field : "enterUser",
                    title : "录入人"
                });
                arr.push({
                    field : "modifyTime",
                    title : "修改时间"
                });
                arr.push({
                    field : "modifyUser",
                    title : "修改人"
                });
                arr.push({
                    field : "editor",
                    title : "编辑"
                });
                // console.log(arr);
                dataTable = jQuery("#dataTable").raytable({
                    datasource: {data : [], keyfield : 'id'},
                    columns : arr,
                    pagesize: 10,
                    maxPageButtons: 5
                });
                // console.log(dataTable);
            });
            var currentDate = new Date().Format('yyyy-MM-dd');
            var preMonthDate = materialStatistics.funcs.getPreMonth();

            $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                startDate : preMonthDate ,
                endDate : currentDate
            },function(result) {
                $("#beginDate").val(preMonthDate);
                $("#endDate").val(currentDate);
                // console.log(result.data.content);
                var itemDatas = materialStatistics.funcs.getMapData(result.data.content);

                console.log(itemDatas);


                dataTable.data( itemDatas , 'field');
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

            return datas;
        }
    }
}