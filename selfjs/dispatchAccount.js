var dispatchAccount = {
    init : function() {
        dispatchAccount.funcs.bindSearchEvent($("#search"));
        $.get(home.urls.dataDictionary.getAllDataByTypeId(),{
            id : 1
        }, function(result) {
            var cycle = result.data;
            $("#cycleName").empty();
            $("#cycleName").html("<option value='-1'>请选择班次</option>");
            cycle.forEach(function(e) {
                $("#cycleName").append("<option value="+ (e.id) + ">"+ (e.dicName) +"</option>");
            })
        })
    }
    ,funcs : {
        bindSearchEvent : function(buttons) {
            buttons.off('click').on('click', function() {
                var startDate = $("#inputDate").val();
                var endDate = $("#inputDate").val();
                var scheduleId = $("#cycleName").val();
                console.log(scheduleId)
                if(!startDate || scheduleId==='-1') {
                    layer.msg("请选择时间和班次");
                    return
                }
                $.get(home.urls.dispatchAccount.getByDateAndSchedule(),{
                    startDate : startDate,
                    endDate : endDate,
                    scheduleId : scheduleId
                },function(result) {
                    var items = result.data;
                    $("#tab").removeClass("hide");
                    dispatchAccount.funcs.renderHeader(items);
                   
                })
            })
        }
        ,renderHeader : function(items) {
            var $table = $("#brokenSection");
            $table.empty();
            
            /**绑定选项卡切换事件 */
            var clickA = $(".list ul").children(".options");
            console.log(clickA)
            dispatchAccount.funcs.bindClickChangeEvents(clickA);
        }
        ,bindClickChangeEvents : function(buttons) {
            buttons.on('click', function() {
                var tableId = $(this).children('a').attr('id');
                console.log(tableId)
                $(".list .selected").removeClass("selected");
                $(this).addClass("selected");
                $(".table .selectedTable").removeClass("selectedTable").addClass("hide");
                $(tableId).removeClass("hide").addClass("selectedTable");
            })
           
        }
    }
}