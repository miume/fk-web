var spUseElec = {
    init : function() {
        spUseElec.funcs.renderTable();

        var out = $("#spUseElecPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#spUseElecPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize: 0
    ,sectionDataId: 0   // 要在统计计算时候进行判断--要先进行查询，才能统计--和清空
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            $("#searchDate").val(currentDate);
            /**获取所有的记录 */
            $.get(home.urls.sectionUseElec.getByDateByPage(),{
                date : currentDate
            },function(result) {
                var sectionItems = result.data.content;
                const $tbody = $("#spUseElecTbody");
                spUseElec.funcs.renderHandler($tbody, sectionItems, 0);
                spUseElec.pageSize = result.data.size;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "spUseElecPage",
                    count: page.totalElements ,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        console.log(obj.curr - 1);
                        if(!first) {
                            $.get(home.urls.sectionUseElec.getByDateByPage(),{
                                date : currentDate,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var sectionItems = result.data.content;
                                const $tbody = $("#spUseElecTbody");
                                spUseElec.funcs.renderHandler($tbody,sectionItems,obj.curr-1);
                                spUseElec.pageSize = page.size;
                            })
                        }
                    }
                })
            });
            /**绑定查询事件 */
            spUseElec.funcs.bingSearchEvents($("#searchButton"));
            /**绑定统计计算事件 */
            spUseElec.funcs.bingCalculEvents($("#calculButton"));
        }
        /**绑定查询事件 */
        ,bingSearchEvents : function (buttons) {
            buttons.off('click').on('click',function() {
                var searchDates = $("#searchDate").val();
                console.log(searchDates);
                //  获取单选按钮的value
                var sectionId = $('input:radio[name="spElec"]:checked').val();
                console.log(sectionId);
                switch(sectionId) {
                    case 1 :
                        //  调用工段的查询事件
                        spUseElec.funcs.bingSectionSearch(searchDates);
                        break;
                    case 2 :
                        //  调用工序的查询事件
                        console.log('dg');
                        break;
                }
            })
        }
        /**绑定工段查询事件 */
        ,bingSectionSearch : function (searchDate) {
            $.get(home.urls.sectionUseElec.getByDateByPage(),{
                date : searchDate
            },function(result) {
                //无法得到result--获取是异步函数构成，所以不能构造心的绑定工段事件？？
                console.log(result);




                var sectionItems = result.data.content;
                //  获取查询结果的工段ID
                sectionDataId = sectionItems.section.id;
                const $tbody = $("#spUseElecTbody");
                spUseElec.funcs.renderHandler($tbody, sectionItems, 0);
                layer.msg(result.message, {
                    offset : ['40%', '55%'],
                    time : 700
                });
                spUseElec.pageSize = result.data.size;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "spUseElecPage",
                    count: page.totalElements ,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        console.log(obj.curr - 1);
                        if(!first) {
                            $.get(home.urls.sectionUseElec.getByDateByPage(),{
                                date : searchDate,
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var sectionItems = result.data.content;
                                const $tbody = $("#spUseElecTbody");
                                spUseElec.funcs.renderHandler($tbody,sectionItems,obj.curr-1);
                                spUseElec.pageSize = page.size;
                            })
                        }
                    }
                })
            })

        }
        /**绑定工序查询事件 */
        /**绑定统计计算事件 */
        ,bingCalculEvents : function (buttons) {
            buttons.off('click').on('click',function() {
                var searchDates = $("#searchDate").val();
                //  获取单选按钮的value
                var sectionId = $('input:radio[name="spElec"]:checked').val();
                console.log(sectionId);
                //  如何知道哪部分是工段还是工序
                //---自己设定  工段为1，工序为2 ，然后根据日期查询 获取id
                switch(sectionId) {
                    case 1 :
                        //  调用工段的统计
                        console.log('dfc');
                        break;
                    case 2 :
                        //  调用工序的统计
                        console.log('dg');
                        break;
                }


            })
        }
        /**绑定工段统计事件 */
        /**绑定工序统计事件 */
        ,renderHandler : function($tbody, powerDayDatas, page) {
            $tbody.empty();
            var i = 1 + page * 10;
            powerDayDatas.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>" + e.section.sectionCode + "</td>" +
                    "<td>" + e.section.name+"</td>" +
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