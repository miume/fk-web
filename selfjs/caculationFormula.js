var caculationFormula = {
    init : function() {
        caculationFormula.funcs.bindRadioChange();
        caculationFormula.funcs.renderData();
    }
    ,funcs : {
        bindRadioChange : function() {
            $("#section").click(function() {
                $("#sectionDiv").removeClass("hide");
                $("#processDiv").addClass("hide");
            })
            $("#process").click(function() {
                $("#processDiv").removeClass("hide");
                $("#sectionDiv").addClass("hide");
            })
        }
        ,renderData : function(){
            /**获取所有工段 */
            $.get(home.urls.sectionName.getAll(),{},function(result) {
                var res = result.data;
                const $tbody = $("#sectionTable").children("tbody");
                $tbody.empty();
                res.forEach(function(e) {
                    console.log(e)
                    $tbody.append(
                        "<tr>" +
                        "<td>"+ (e.sectionCode) +"</td>" +
                        "<td>"+ (e.name) +"</td>" +
                        "</tr>"
                     )
                })
            })
            /**获取所有工序 */
            $.get(home.urls.processName.getAll(),{},function(result) {
                var res1 = result.data;
                const $tbody1 = $("#processTable").children("tbody");
                $tbody1.empty();
                res1.forEach(function(e) {
                     $tbody1.append(
                         "<tr>" +
                         "<td>"+ (e.workCode) +"</td>" +
                         "<td>"+ (e.name) +"</td>" +
                         "</tr>"
                     )
                })
            var obj = $("#table2");
            if(caculationFormula.funcs.bindJudgeScroll(obj)) {
                $("#processTable ")
            }

             })
           

        }
         /**判断是否出现滚动条，相应改变样式 */
         ,bindJudgeScroll : function(obj) {
            if(obj.scrollHeight>obj.clientHeight)
                return true;
            else 
                return false;
         }
    }
}