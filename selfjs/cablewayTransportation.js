cablewayTransportation = {
    init : function(){
        /**确定参数位置 */
        cablewayTransportation.funcs.bindparameterPositions();
        /**表格显示 */
        cablewayTransportation.funcs.bindTableShow($("#tableShow"));
        /**图显示 */
        cablewayTransportation.funcs.bindImageShow($("#imagesShow"));
    }
    ,paraMeterArrays : []          //存取所有参数
    ,selectedParameterArrays : []  //存取被选中的参数
    ,checkboxLength : 0
    ,funcs : {
        /**通过调接口确定参数字段在默认图中的显示位置 */
        bindparameterPositions : function() {
            $.get(home.urls.parameter.getByGroup(), { groupId : groupId } , function(result){
                var parameters = result.data;
                cablewayTransportation.paraMeterArrays = [];
                const $div = $("#imagesPart");
                parameters.forEach(function(e) {
                    $div.append(
                        "<table id='table-"+ (e.id) +"' style='position:absolute;left:"+ (e.cssX) +"%;top:"+ (e.cssY) +"%;'>" +
                        "<tr><td colspan='2' id='name-"+ (e.id) +"' style='background:#fff;'>"+ (e.name) +"</td></tr>" +
                        "<tr><td id='value-"+ (e.id) +"'></td><td id='unit-"+ (e.id) +"'></td></tr></table>"
                    )
                    cablewayTransportation.paraMeterArrays.push({
                        name : e.name,
                        id : e.id
                    })
                })

                 /**渲染下拉面框中的数据 */
             cablewayTransportation.funcs.bindparameterRender(cablewayTransportation.paraMeterArrays);
             /**点击重新选择参数 */
             cablewayTransportation.funcs.bindparameterClick($("#paraMeter"));
            })
        }
        ,bindTableShow : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#images").addClass("hide");
                $("#imagesPart").addClass("hide");
                $("#tableShow").addClass("hide");
                $("#pImages").addClass("hide");
                $("#pTable").removeClass("hide");
                $("#imagesShow").removeClass("hide");
                $("#parameterDiv").removeClass("hide")
                 /**默认显示20个参数的参数表展示 */
                 cablewayTransportation.funcs.bindparameterTableRender();
            })
        }
        /**下拉面板中参数渲染 */
        ,bindparameterRender :function(data) {
            var $tbody = $("#panelTable").children("tbody");
            $tbody.empty();
            //用来计算对象的长度
            var arr = Object.keys(data);  
            var lengths = arr.length;
            //console.log(data)
            cablewayTransportation.checkboxLength = lengths
            //console.log(cablewayTransportation.checkboxLength)
            //每行渲染四个checkbox
            for( var i = 0; i < parseInt(lengths / 4); i++ ) {
                $tbody.append("<tr><td><input type='checkbox' id="+(data[3*i].id)+" data-name="+(data[3*i].name)+" /><span>"+(data[3*i].name)+"</span></td><td><input type='checkbox' id="+(data[3*i+1].id)+" data-name="+(data[3*i+1].name)+" /><span>"+(data[3*i+1].name)+"</span></td><td><input type='checkbox' id="+(data[3*i+2].id)+" data-name="+(data[3*i+2].name)+"  /><span>"+(data[3*i+2].name)+"</span></td><td><input type='checkbox' id="+(data[3*i+3].id)+" data-name="+(data[3*i+3].name)+" /><span>"+(data[3*i+3].name)+"</span></td></tr>")
                }  
            var temp = parseInt(lengths / 4) * 4 ;
            if(lengths % 4 === 3){
                $tbody.append("<tr><td><input type='checkbox' id="+(data[temp].id)+" data-name="+(data[temp].name)+" /><span>"+(data[temp].name)+"</span></td><td><input type='checkbox' id="+(data[temp+1].id)+" data-name="+(data[temp+1].name)+" /><span>"+(data[temp+1].name)+"</span></td><td><input type='checkbox' id="+(data[temp+2].id)+" data-name="+(data[temp+2].name)+" /><span>"+(data[temp+2].name)+"</span></td><td></td></tr>")
            }        
            if(lengths % 4 === 2){
                $tbody.append("<tr><td><input type='checkbox' id="+(data[temp].id)+" data-name="+(data[temp].name)+" /><span>"+(data[temp].name)+"</span></td><td><input type='checkbox' id="+(data[temp+1].id)+" data-name="+(data[temp+1].name)+" /><span>"+(data[temp+1].name)+"</span></td><td></td><td></td></tr>")
            }  
            if(lengths % 4 === 1){
                $tbody.append("<tr><td><input type='checkbox' id="+(data[temp].id)+" data-name="+(data[temp].name)+" /><span>"+(data[temp].name)+"</span></td><td></td><td></td><td></td></tr>")
            } 
            //默认选择前20个参数，若参数长度小于20则全选
            if(lengths <= 20) {
                $("#panelTable input").each(function() {
                    $(this).prop("checked",true);
                    cablewayTransportation.selectedParameterArrays.push({
                        id : $(this).attr("id"),
                        name : $(this).attr("data-name")
                    })
                })
                $("#paraMeter").val("已选择"+ (lengths) + "个参数");
            }
            else{
                for( var i = 0; i < 20; i++ ) {
                    $("#panelTable input")[i].prop("checked",true);
                    cablewayTransportation.selectedParameterArrays.push({
                        id : $("#panelTable input")[i].attr("id"),
                        name : $("#panelTable input")[i].attr("data-name")
                    })
                }
                $("#paraMeter").val("已选择20个参数");
            }
            //console.log(cablewayTransportation.selectedParameterArrays)
        }
        /**默认显示参数表（默认20） */
        ,bindparameterTableRender : function() {
            var $thead = $("#parameterTable").children("thead");
            var $tbody = $("#parameterTable").children("tbody");
            $thead.empty();
            $tbody.empty();
            $thead.append("<tr>");
            $thead.append("<td>数据时间</td>");
            cablewayTransportation.selectedParameterArrays.forEach(function(e) {
                $thead.append("<td>"+ (e.name) +"</td>");
            })
            $thead.append("</tr>");
        }
        /**绑定下拉面板显示 */
        ,bindparameterClick : function(buttons) {
            $("#paraMeter").click(function(){
                $(this).attr('placeholder','');
                $("#panelDiv").removeClass('hide');
                var checkedBoxLen = $(".checkbox checked");
                cablewayTransportation.funcs.bindparameterSelectAll($("#selectAll"));
                cablewayTransportation.funcs.bindparameterUnselectAll($("#unselectAll"));
                cablewayTransportation.funcs.bindparameterSave($("#save"));
                cablewayTransportation.funcs.bindparameterCancel($("#cancel"));
            });
        }
        /**实现下拉面板全选 */
        ,bindparameterSelectAll : function(selectAllBox) {
            selectAllBox.off("click").on("click",function() {
                $('#panelTable input').each(function () {
                    $(this).prop("checked",true);
                })
            })
        }
        /**实现下拉面板全不选 */
        ,bindparameterUnselectAll : function(unselectAllBox) {
            unselectAllBox.off("click").on("click",function() {
                $('#panelTable input').each(function () {
                    $(this).prop("checked",false);
                })
            })
        }
        /**绑定下拉板保存事件 */
        ,bindparameterSave : function(buttons) {
            buttons.off("click").on("click",function() {
                cablewayTransportation.selectedParameterArrays = [];
                var lens = 0;
                $('#panelTable input').each(function () {//遍历checkbox
                    var check = $(this).is(':checked');//判断是否选中
                    if (check) {
                        var id = $(this).attr("id");
                        cablewayTransportation.selectedParameterArrays.push({
                            id : id,
                            name : $("#"+id).next().text()
                        });
                        lens ++;
                    } 
                });
                console.log(lens)
                console.log(cablewayTransportation.selectedParameterArrays)
                $("#paraMeter").val("已选择"+ (lens) + "个参数");
                $("#panelDiv").addClass('hide');
            })
        }
        /**绑定下拉板取消事件 */
        ,bindparameterCancel : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#panelDiv").addClass('hide');
            })
        }
        ,bindImageShow : function(buttons) {
            buttons.off("click").on("click",function() {
                $("#images").removeClass("hide");
                $("#imagesPart").removeClass("hide");
                $("#tableShow").removeClass("hide");
                $("#pImages").removeClass("hide");
                $("#pTable").addClass("hide");
                $("#imagesShow").addClass("hide");
                $("#parameterDiv").addClass("hide")
            })
        }
    }
}