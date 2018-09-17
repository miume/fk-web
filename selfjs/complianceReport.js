complianceReport = {
    init : function(){
        complianceReport.funcs.bindSelectRender();
        complianceReport.funcs.bindDefaultSearchEvent();
        complianceReport.funcs.bindSetAssessmentCriteriaEvent($("#criteria"));
    }
    ,funcs : {
        bindSelectRender : function(){
            $.get(home.urls.clazz.getAll(), {} , function(result) {
                 var clazz = result.data;
                 $("#startClazz").empty();
                 $("#endClazz").empty();
                 $("#startClazz").html("<option value='-1'>请选择班次</option>");
                 $("#endClazz").html("<option value='-1'>请选择班次</option>");
                 clazz.forEach(function(e) {
                    $("#startClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                    $("#endClazz").append("<option value="+ (e.id) +">"+ (e.name) +"</option");
                 })
            })
        }
        ,bindDefaultSearchEvent : function() {
            var date = new Date();
            var endDate = new Date().Format("yyyy-MM-dd");
            date.setMonth(date.getMonth()-1);
            var startDate = new Date(date).Format("yyyy-MM-dd");
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            //complianceReport.funcs.bindSearchEvent(startDate,endDate);
            complianceReport.funcs.bindAutoSearchEvent($("#searchButton"));
        }
        ,bindSearchEvent : function(startDate,endDate) {

        }
        ,bindAutoSearchEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var startClazz = $("#startClazz").val();
                var endClazz = $("#endClazz").val();
            })
        }
        ,bindSetAssessmentCriteriaEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#criteriaModal").removeClass("hide");
                layer.open({
                    title : "考核标准设置",
                    type : 1,
                    content : $("#criteriaModal"),
                    area : ["1000px","500px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        $("#criteriaModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#criteriaModal").addClass("hide");
                        layer.close(index);
                    }
                })
                /**绑定原矿品味设置 */
                complianceReport.funcs.bindSetTasteEvent($("#setTaste"));
                /**绑定添加档次 */
                complianceReport.funcs.bindAddGradeEvent($("#addGrade"));
            })
        }
        /**绑定原矿品味设置 */
        ,bindSetTasteEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#setTasteModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : " 原矿品味设置",
                    content : $("#setTasteModal"),
                    area : ["400px","350px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                   yes : function(index) {
                       var name = [];
                       $("#setTasteTable tbody").find("tr").each(function() {
                           var tdArr = $(this).children();
                           name.push(tdArr.eq(0).find("input").val());
                       })
                       console.log(name)
                       $("#setTasteModal").addClass("hide");
                       layer.close(index);
                   }
                   ,btn2 : function(index) {
                       $("#setTasteModal").addClass("hide");
                       layer.close(index);
                   }
                })
                complianceReport.funcs.bindDeleteLinesEvent($(".delete"));
            })
        }
        /**绑定删掉某一行 */
        ,bindDeleteLinesEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $(this).parent('td').parent('tr').remove();
            })
        }
        /**绑定添加档次事件 */
        ,bindAddGradeEvent : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#addGradeModal").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "添加档次",
                    content : $("#addGradeModal"),
                    area : ["500px","500px"],
                    offset : "auto",
                    btn : ["保存","取消"],
                    closeBtn : 0,
                    yes : function(index) {
                        $("#addGradeModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#addGradeModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
    }
}