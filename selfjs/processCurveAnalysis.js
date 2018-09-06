var curveAnalysis = {
    init: function() {
        curveAnalysis.funcs.renderLeftOption();
    }
    ,funcs: {
        /**渲染左边菜单*/
        renderLeftOption : function() {
            $.get(home.urls.group.getAll(),{},function(result) {
                var groups = result.data;
                const $tbody = $("#processItemTbody");
                $tbody.empty();
                groups.forEach(function(e) {
                    $tbody.append(
                        "<tr>"+
                        "<td id='group-"+e.id+"' class='setGroup'>"+e.name+"</td>"+
                        "</tr>"
                    )
                });
                var setGroups = $('.setGroup');
                curveAnalysis.funcs.renderData(setGroups); // 选中事件
                /**绑定开始分析事件 */
                curveAnalysis.funcs.bindAnalysisEvents($("#analyButton"));
            })
        }
        /**绑定开始分析事件 */
        // ,bindAnalysisEvents : function(buttons) {
        //     buttons.off('click').on('click',function() {
        //         var parameterId = $("#parameterGroup").val();
        //         var startDate = $("#beginDate").val();
        //         var endDate = $("#endDate").val();
        //         $.get(home.urls.parameterData.getByTableNameAndDate(),{
        //
        //         },function(result) {
        //
        //         })
        //     })
        // }
        /** 渲染下拉框 */
        ,renderData : function(setGroups) {
            setGroups.off('click').on('click',function() {
                var id = $(this).attr('id').substr(6);
                console.log(id);
                curveAnalysis.funcs.getGroupParameter(id);
            })

        }
        /** 获取该组别下的参数  渲染下拉框 */
        ,getGroupParameter : function(id) {
            $.get(home.urls.parameter.getByGroup(),{
                groupId:id
            },function(result) {
                var parameters = result.data;
                console.log("------")
                console.log(parameters);
                $("#parameterGroup").empty();
                $("#parameterGroup").append('<option></option>');
                parameters.forEach(function(e) {
                    $("#parameterGroup").append('<option value='+e.id+'>'+e.name+'</option>')
                })

            })
        }
        /**渲染右边菜单*/
        ,renderRightOption : function(id) {
            $.get(home.urls.parameter.getById(),{
                id : id
            },function(result) {
                var parameters = result.data;
                console.log(parameters);
                const $tbody = $("#processAnalysisTbody");
                $tbody.empty();
                $tbody.append(
                    "<tr>" +
                    "<td style='width:60%'>平均值</td>"+
                    "<td>"+ (parameters&&parameters.eps||'')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>合格率</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td style='width:60%'>最大值</td>"+
                    "<td>"+ (parameters&&parameters.upValue||'')+"</td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td style='width:60%'>最小值</td>"+
                    "<td>"+ (parameters&&parameters.downValue||'')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>最长超上限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>累计超上限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>最长超下限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"+
                    "<td style='width:60%'>累计超下限时间</td>"+
                    "<td>"+ ('')+"</td>"+
                    "</tr>"
                )
            })
        }
        /**绑定选中事件*/
        // ,changeGroup : function(setGroups) {
        //     setGroups.off('click').on('click',function() {
        //         var id = $(this).attr('id').substr(6);
        //         // console.log(id);
        //
        //     })
        // }
        /**渲染右边事件*/
        // ,renderRight : function() {
        //
        // }
    }
};