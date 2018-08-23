var materialManagement = {
    init: function() {
        /**获取物料管理信息分页显示 */
        materialManagement.funcs.renderTable();

        var out = $("#materialManagementPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#materialManagementPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs: {
        /**渲染页面 */
        renderTable: function() {
            /**渲染表头,获取所有数据 */
            $.get(home.urls.materialConsumptionItem.getAll(),{}, function(result) {
                var materialHead = result.data;
                $("#dynNum").attr("colspan" , materialHead.length);
                const $tr = $("#dynamicAdd");
                materialManagement.funcs.renderHead($tr, materialHead);
                /**获取当前日期 */
                // .Format('yyyy-MM-dd')
                var currentDate = new Date().Format('yyyy-MM-dd');
                /**获取前一个月日期 */
                var preMonthDate = materialManagement.funcs.getPreMonth();
                
                /**获取所有的记录 */
                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                    startDate : preMonthDate ,
                    endDate : currentDate
                }, function(result) {
                    $("#beginDate").val(preMonthDate);
                    $("#endDate").val(currentDate);
                    var page = result.data;
                    var materialItems = result.data.content;
                    const $tbody = $("#materialItemTbody");
                    // const $tbody = $("#materialManagementTable").children("tbody");
                    console.log(materialItems);
                    materialManagement.funcs.renderHandler($tbody,materialItems,0);
                    materialManagement.pageSize = result.data.length;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialManagementPage",
                        count: 10 * page.totalPages ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                                    startDate : preMonthDate ,
                                    endDate : currentDate,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {       
                                    var materialItems = result.data.content;
                                    var page = obj.curr - 1;               
                                    const $tbody = $("#materialItemTbody");
                                    materialManagement.funcs.renderHandler($tbody,materialItems,page);
                                    materialManagement.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })
            })
            /**绑定搜索事件 */
            materialManagement.funcs.bingSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            materialManagement.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定刷新事件 */
            materialManagement.funcs.bindRefreshEvents($("#refreshButton"));
            /**绑定数据录入事件 */
            materialManagement.funcs.bindAddByIdsEvents($("#addButton"));
        }
        /**渲染表头 */
        ,renderHead : function($tr , materialHeads) {
            $tr.empty();
            materialHeads.forEach(function(e) {
                $tr.append(
                    "<td abbr=\""+  e.id +"\">"+ e.name +"</td>"
                )
            }) 

        }
        /**渲染数据 */
        ,renderHandler : function ($tbody, materialItems, page) {
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10;
            materialItems.forEach(function(e) {
                // console.log(e.id);
                $tbody.append(
                    "<tr>" + 
                    "<td><input type='checkbox' value="+e.id+" class='materialItem-checkbox' /></td>" +
                    "<td>"+(e.date ? e.date : ' ')+"</td>"+
                    materialManagement.funcs.getArrayDate(e.materialConsumptionDetails) +
                    "<td>"+(e.enterTime ? e.enterTime : ' ')+"</td>" +
                    "<td>"+(e.enterUser ? e.enterUser.name : ' ')+"</td>" +
                    "<td>"+(e.modifyTime ? e.modifyTime : ' ')+"</td>" +
                    "<td>"+(e.modifyUser ? e.modifyUser.name : ' ')+"</td>"+
                    "<td><a href='#' class = 'editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            })
             /**实现全选 */
             var checkedBoxLength = $(".materialItem-checkbox:checked").length;
             home.funcs.bindselectAll($("#materialManagement-checkBoxAll"), $(".materialItem-checkbox"), checkedBoxLength, $("#materialManagementTable"));
             /**绑定编辑操作名称事件 */
            //  materialManagement.funcs.bindEditEvents($(".editor"));
        }
        /**动态得到对象中数组的元素 */
        ,getArrayDate : function(result){
            var arrayDate ={};
            for(var i=0 ; i<result.length; i++){
                arrayDate = arrayDate + "<td>"+ (result[i] ? result[i].value : ' ') +"</td>";
            }
            return arrayDate;
        }
        /**得到当前日期的前一个月 */
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
        /**绑定搜索事件 */
        ,bingSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                // console.log(beginDates);
                // console.log(endDates);
                if(beginDates === "" && endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(), {
                    startDate : beginDates,
                    endDate : endDates
                }, function(result) {
                    var page = result.data;
                    var materialConsumptions = result.data.content;
                    console.log(materialConsumptions);
                    const $tbody = $("#materialItemTbody");
                    materialManagement.funcs.renderHandler($tbody, materialConsumptions, 0);
                    materialManagement.pageSize = result.data.length;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "materialManagementPage",
                        count : 10 * page.totalPages,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.materialConsumptionManagement.getByStartDateAndEndDateByPage(),{
                                    startDate : beginDates,
                                    endDate : endDates,
                                    page : obj.curr - 1 ,
                                    size : obj.limit
                                },function (result) {
                                    var materialConsumptions = result.data.content;
                                    var page = obj.curr - 1;
                                    const $tbody = $("#materialItemTbody");
                                    materialManagement.funcs.renderHandler($tbody, materialConsumptions, page);
                                    materialManagement.pageSize = result.data.length;
                                })
                            }
                        }
                    })
                })
            })
        }
        /**绑定刷新事件 */
        ,bindRefreshEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var index = layer.load(2, { offset : ['40%','50%']});
                var time = setTimeout(function(){
                    layer.msg('刷新成功', {
                        offset : ['40%','50%'],
                        time : 700
                    })
                    materialManagement.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        /**绑定导出事件 */
        ,bingDownloadEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var beginDates = $('#beginDate').val();
                var endDates = $('#endDate').val();
                if(beginDates === "" && endDates === ""){
                    layer.msg('日期选择不能为空！');
                    return
                }
                var href = home.urls.materialConsumptionManagement.exportByStartDateAndEndDate()+"?startDate="+ beginDates + "&endDate=" + endDates;
                console.log(href);
                $("#downloadA").attr("href",href);
            })
        }
        /**绑定编辑事件 */
        // ,bindEditEvents : function(buttons) {
        //     buttons.off('click').on('click',function() {
        //         var id = $(this).attr('id').substr(5);
        //         // 清空操作
                
        //     })
        // }
        /**绑定数据录入事件 */
        ,bindAddByIdsEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                $.get(home.urls.materialConsumptionItem.getAll(),{},function(result) {
                    var materialConsumptions = result.data;
                    // var itemLength = materialConsumptions.length;
                    console.log(materialConsumptions[1].name);
                    const $dynTable = $("#dynTable");
                    materialManagement.funcs.addWindowStyle($dynTable,materialConsumptions);
                    $("#updateModal").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#updateModal"),
                        area: ['450px', '350px'],
                        btn: ['确认', '取消'],
                        offset: ['35%', '30%'],
                        closeBtn: 0,
                        yes: function(index) {
                            var materialConsumptionDetails = [2];
                            var inputDate = $("#inputDate").val();
                            var userStr = $.session.get('user');
                            var userJson = JSON.parse(userStr);
                            // console.log(inputDate);
                            // console.log(userJson);
                            // var date = {
                            //     date : inputDate,
                            //     enterUser : { id :userJson.id },
                            //     materialConsumptionDetails : {}

                            // }


                        }
                    })
                })
            })

        }
        /**新增窗口样式操作 */
        ,addWindowStyle : function($dynTable, materialConsumptions ) {
            $dynTable.empty();
            var itemLength = materialConsumptions.length;
            var inputArray = [];
            for(var j=0; j<itemLength;j=j+2) {
                if(materialConsumptions[j+1]){
                    $dynTable.append(
                        "<tr>"+
                        "<td width=\"90px\" height=\"40px\" align=\"right\">" + (materialConsumptions[j] ? materialConsumptions[j].name:'') + ":&nbsp;</td>"+
                        "<td height=\"40px\"><input size=\"10px\" type=\"text\" class=\"1\" placeholder=\"实际用量\" /></td>"+
                        "<td width=\"90px\" height=\"40px\" align=\"right\">" + (materialConsumptions[j+1] ? materialConsumptions[j+1].name:'') + ":&nbsp;</td>"+
                        "<td  height=\"40px\"><input size=\"10px\" type=\"text\" class=\"2\" placeholder=\"实际用量\" /></td>"+
                        "</tr>"
                    )
                    // inputArray[j] =  materialConsumptions[j].id + "-" + $(".1").val();
                    // inputArray[j+1] = materialConsumptions[j+1].id+ "-" + $(".2").val();
                }else{
                    $dynTable.append(
                        "<tr>"+
                        "<td width=\"90px\" height=\"40px\" align=\"right\">" + (materialConsumptions[j] ? materialConsumptions[j].name:'') + ":&nbsp;</td>"+
                        "<td height=\"40px\"><input size=\"10px\" type=\"text\" class=\"1\"  placeholder=\"实际用量\" /></td>"+
                        "</tr>"
                    )
                    // inputArray[j] =  materialConsumptions[j].id + "-" + $(".1").val();
                }
                // inputArray[j].push(){
                //     id = materialConsumptions[j].id,
                //     value = $(".1").val()
                // };
                // inputArray[j+1].push(){
                //     id = materialConsumptions[j].id,
                //     value = $(".2").val()
                // };
                // inputArray[j] =  materialConsumptions[j].id + "-" + $(".1").val();
                // inputArray[j+1] = materialConsumptions[j+1].id+ "-" + $(".2").val();
            }
            console.log(inputArray);
        }

        /**得到新增输入框操作操作 */
        // ,getAddInput : function() {

        // }
    }
}