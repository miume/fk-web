var product = {
    init :function(){
        product.funcs.renderTable();
        var out = $("#productPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#productPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function(){
            /**渲染表头与默认项，获取默认数据 */
            $.get(home.urls.clazz.getAll(),{},function(result){
                var classData = result.data;
                classData.forEach(function(e){
                    $("#classStart").append("<option value='"+e.id+"'>"+e.name+"</option>");
                    $("#classEnd").append("<option value='"+e.id+"'>"+e.name+"</option>");
                })
            })
            $("#monthTime").removeClass("hide");
            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr);
            var ids = $(".productItem");
            var flag = [];
            // console.log(ids[1].value);
            // console.log(userJson.id)
            $.get(home.urls.production.findByUserId(),{id:userJson.id},function(result){
                var datas = result.data;
                // console.log(datas.yldFlag)
                flag.push(datas.lstFlag,datas.dhyFlag,datas.yhyFlag,datas.yldFlag,datas.ehyFlag,datas.dsjFlag,datas.lsFlag,datas.shFlag)
                // console.log(flag)
                for(i=0;i<flag.length;i++){
                    if(flag[i]==1){
                        ids[i].checked = true;
                    }
                }
            });
            /**选择报表事件 */
            product.funcs.bindSelectEvents($("#tableType"));
            /**绑定查找事件 */
            product.funcs.bindFindEvents($("#searchButton"))
        }
        /**选择报表事件 */
        ,bindSelectEvents : function(select){
            select.change(function(){
                var value = $(this).children("option:selected").val();
                // console.log(value);
                if(value == 1){
                    $("#monthTime").addClass("hide");
                    $("#yearTime").addClass("hide");
                    $("#dayTime").removeClass("hide");
                }else if(value==2){
                    $("#dayTime").addClass("hide");
                    $("#yearTime").addClass("hide");
                    $("#monthTime").removeClass("hide");
                }else if(value==3){
                    $("#dayTime").addClass("hide");
                    $("#monthTime").addClass("hide");
                    $("#yearTime").removeClass("hide");
                }
            })
        }
        ,/**绑定查找事件 */
        bindFindEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var datalength = $(".productItem").length;
                $("#dynNum").attr("colspan" , datalength);
                $("#dynConsume").attr("colspan" , datalength);
                const $tr = $("#dynamicAdd")
                var items = $(".productItem");
                product.funcs.renderHead($tr,items)
                var startTime = $("#monthStart").val();
                var endTime = $("#monthEnd").val();
                var startClass = $("#classStart").val();
                var endClass = $("#classEnd").val();
                $.get(home.urls.ddConsumeTeamReport.getByPage(),
                {
                    startDate : startTime,
                    endDate : endTime,
                    clazzId1 : startClass,
                    clazzId2 : endClass
                },function(result){
                    const $tbody = $("#productTbody")
                    var teamData = result.data.content;
                    product.funcs.renderDeatils($tbody,teamData);
                    // console.log(teamData);
                })
            })
        }
        ,/**渲染表头 */
        renderHead : function($tr,items){
            $tr.empty();
            items.each(function(){
                $tr.append(
                    "<td id=\""+  $(this).value +"\">"+ $(this).attr("name") +"</td>"
                );
            })
            items.each(function(){
                $tr.append(
                    "<td id=\""+  "unit"+$(this).value +"\">"+ $(this).attr("name") +"</td>"
                );
            })
        }
        /**渲染查找页面 */
        ,renderDeatils : function($tbody,teamData){

        }
    }
}