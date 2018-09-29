onsiteDailyReport = {
    init : function() {
        onsiteDailyReport.funcs.bindDefaultSearchEvent();
        onsiteDailyReport.funcs.bindExportTableEvent($("#exportTable"));
    }
    ,pageSize : 0
    ,funcs : {
        /**默认显示当前日期的前一天 */
        bindDefaultSearchEvent : function() {
            var date = new Date();
            date.setDate(date.getDate() - 1);  //当前日期减1
            var formerDate = new Date(date).Format("yyyy-MM-dd");
            $("#date").val(formerDate);
            onsiteDailyReport.funcs.bindSearchOreEvent(formerDate);
            onsiteDailyReport.funcs.bindSearchSulfurEvent(formerDate);
            onsiteDailyReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        /**选择任意时间进行搜索 */
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var date = $("#date").val();
                if(date === "") {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                onsiteDailyReport.funcs.bindSearchOreEvent(date);
                onsiteDailyReport.funcs.bindSearchSulfurEvent(date);
            })
        } 
        /**选矿根据时间进行搜索 */
        ,bindSearchOreEvent : function(date) {
            $.get(home.urls.siteTeamReport.searchOre(),{
               date : date
            },function(result) {
                var res = result.data;
                onsiteDailyReport.funcs.renderOreHandler(res);
                onsiteDailyReport.pageSize = result.data.length;
                var page = result.data;
                // /**分页消息 */
                // layui.laypage.render({
                //     elem : "ore_page",
                //     count : 10 * page.totalPages,
                //     /**页面变换的逻辑 */
                //     jump : function(obj,first) {
                //         if(!first) {
                //             $.get(home.urls.siteTeamReport.searchOre(),{
                //                 date : date,
                //                 page : obj.curr - 1 ,
                //                 size : obj.limit
                //              },function(result) {
                //                 var res = result.data;
                //                 onsiteDailyReport.funcs.renderOreHandler(res);
                //                 onsiteDailyReport.pageSize = result.data.length;
                //             })
                //         }
                //     }
                // })
            })
        }
        /**选硫根据时间进行搜索 */
        ,bindSearchSulfurEvent : function(date) {
            $.get(home.urls.siteTeamReport.searchSulfur(),{
               date : date
            },function(result) {
                var res = result.data;
                onsiteDailyReport.funcs.renderSulfurHandler(res);
                var data = result.data;
                // /**分页消息 */
                // layui.laypage.render({
                //     elem : "sulfur_page",
                //     count : 10 * data.totalPages,
                //     /**页面变换的逻辑 */
                //     jump : function(obj,first) {
                //         if(!first) {
                //             $.get(home.urls.siteTeamReport.searchSulfur(),{
                //                 date : date,
                //                 page : obj.curr - 1 ,
                //                 size : obj.limit
                //              },function(result) {
                //                 var res = result.data;
                //                 onsiteDailyReport.funcs.renderSulfurHandler(res);
                //             })
                //         }
                //     }
                // })
            })
        }
        /**渲染表格数据 */
        ,renderOreHandler : function(data) {
            const $tbody = $("#oreTable").children("tbody");
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.time ? e.time : '') +"</td>" +
                    "<td>"+ (e.clazz ? e.clazz.name : '') +"</td>" +
                    "<td>"+ (e.team ? e.team.name : '') +"</td>" +
                    "<td>"+ (e.rawOre ? e.rawOre : '0') +"</td>" +
                    "<td>"+ (e.rawOrePbGrad ? e.rawOrePbGrad : '0') +"</td>" +
                    "<td>"+ (e.rawOreZnGrad ? e.rawOreZnGrad : '0') +"</td>" +
                    "<td>"+ (e.concentratePbGrad ? e.concentratePbGrad : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnGrad ? e.concentrateZnGrad : '0') +"</td>" +
                    "<td>"+ (e.concentratePbRecovery ? e.concentratePbRecovery : '0') +"</td>" +
                    "<td>"+ (e.concentrateZnRecovery ? e.concentrateZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumPbRecovery ? e.sumPbRecovery : '0') +"</td>" +
                    "<td>"+ (e.sumZnRecovery ? e.sumZnRecovery : '0') +"</td>" +
                    "<td>"+ (e.pbZnRecovery ? e.pbZnRecovery : '0') +"</td>" +
                    "</tr>"
                )
            })
        }
        /**渲染选硫表格数据 */
        ,renderSulfurHandler : function(data) {
            const $tbody = $("#sulfurTable").children("tbody");
            $tbody.empty();
            data.forEach(function(e) {
                $tbody.append(
                    "<tr>" +
                    "<td>"+ (e.time ? e.time : '0') +"</td>" +
                    "<td>"+ (e.clazz ? e.clazz.name : '0') +"</td>" +
                    "<td>"+ (e.team ? e.team.name : '0') +"</td>" +
                    "<td>"+ (e.highFeGrad ? e.highFeGrad : '0') +"</td>" +
                    "<td>"+ (e.highFeRecovery ? e.highFeRecovery : '0') +"</td>" +
                    "</tr>"
                )
            })
        }
        /**绑定根据日期导出表格事件 */
        ,bindExportTableEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var date = $("#date").val();
                if(date === "") {
                    layer.msg("日期不能为空！",{
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    return
                }
                var href = home.urls.siteTeamReport.export() + "?date=" + date;
                /**第一种方法 */
                //$("#downloadA").attr("href",href);
                /**第二种方法 */
                location.href = href;
            })
        }
    }
}