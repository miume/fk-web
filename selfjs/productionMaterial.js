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
    ,key : []
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
            //获取当前日期
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = product.funcs.getPreMonth();
            $("#monthStart").val(preMonthDate);
            $("#monthEnd").val(currentDate);
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
                var datalength = $("input:checkbox[class=productItem]:checked").length;
                $("#dynNum").attr("colspan" , datalength);
                
                const $tr = $("#dynamicAdd")
                var items = $("input:checkbox[class=productItem]:checked");
                var keyDyn = product.funcs.renderHead1($tr,items);
                key = product.funcs.getHeadKey(keyDyn);
                /**获取参数 */
                var startTime = $("#monthStart").val();
                var endTime = $("#monthEnd").val();
                var startClass = 1
                var endClass = 1
                $.get(home.urls.ddConsumeTeamReport.getByPage(),
                {
                    startDate : startTime,
                    endDate : endTime,
                    clazzId1 : startClass,
                    clazzId2 : endClass
                },function(result){
                    const $tbody = $("#productTbody")
                    var teamData = result.data.content;
                    var mapDate = product.funcs.getMapData(teamData);
                    product.funcs.renderDeatils($tbody,mapDate,key);
                    // console.log(teamData);
                })
            });
            /**选择报表事件 */
            product.funcs.bindSelectEvents($("#tableType"));
            /**绑定查找区间事件 */
            product.funcs.bindFindEvents($("#searchButton"));
            /**绑定生成图表事件 */
            product.funcs.bindGenerate($("#graphButton"))
        }
        /**生成图表事件 */
        ,bindGenerate : function(buttons){
            buttons.off("click").on('click',function(){
                var findValue = $("#tableType").val();
                if(findValue==1){
                    var items = $("input:checkbox[class=productItem]:checked");
                }else if(findValue==2){
                    
                }else if(findValue==3){

                }
            })
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
        ,/**绑定区间查找事件 */
        bindFindEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var findValue = $("#tableType").val();
                if(findValue==2){
                    $("#DayTable").addClass("hide")
                    $("#yearTable").addClass("hide")
                    $("#itemTable").removeClass("hide")
                    var datalength = $("input:checkbox[class=productItem]:checked").length;
                    $("#dynNum").attr("colspan" , datalength);
                    
                    const $tr = $("#dynamicAdd")
                    var items = $("input:checkbox[class=productItem]:checked");
                    var keyDyn = product.funcs.renderHead1($tr,items);
                    key = product.funcs.getHeadKey(keyDyn);
                    /**获取参数 */
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
                        var mapDate = product.funcs.getMapData(teamData);
                        product.funcs.renderDeatils($tbody,mapDate,key);
                        // console.log(teamData);
                    })
                }else if(findValue==1){
                    $("#itemTable").addClass("hide")
                    $("#yearTable").addClass("hide")
                    $("#DayTable").removeClass("hide")
                    var datalength = $("input:checkbox[class=productItem]:checked").length;
                    $("#dayNum").attr("colspan" , datalength);
                    $("#dayConsume").attr("colspan" , datalength);
                    const $tr = $("#dayAdd")
                    var items = $("input:checkbox[class=productItem]:checked");
                    var keyDyn = product.funcs.renderHead($tr,items);
                    key = product.funcs.getHeadKeyOther(keyDyn);
                    /**获取参数 */
                    var userStr = $.session.get('user')
                    var userJson = JSON.parse(userStr);
                    var date = $("#dayT").val();
                    $.get(home.urls.ddConsumeDayReport.getByDate(),
                    {
                        date : date,
                        userId : userJson.id
                    },function(result){
                        const $tbody = $("#dayTbody")
                        var dayData = result.data;
                        var mapDate = product.funcs.getMapDataOther(dayData);
                        console.log(mapDate)
                        product.funcs.renderDeatils($tbody,mapDate,key);
                        // console.log(teamData);
                    })
                }else if(findValue==3){
                    $("#itemTable").addClass("hide")
                    $("#DayTable").addClass("hide")
                    $("#yearTable").removeClass("hide")
                    var datalength = $("input:checkbox[class=productItem]:checked").length;
                    $("#yearNum").attr("colspan" , datalength);
                    $("#yearConsume").attr("colspan" , datalength);
                    const $tr = $("#yearAdd")
                    var items = $("input:checkbox[class=productItem]:checked");
                    var keyDyn = product.funcs.renderHead($tr,items);
                    key = product.funcs.getHeadKeyOther(keyDyn);
                    /**获取参数 */
                    var userStr = $.session.get('user')
                    var userJson = JSON.parse(userStr);
                    var date = $("#yearT").val();
                    $.get(home.urls.ddConsumeYearReport.getByDate(),
                    {
                        date : date,
                        userId : userJson.id
                    },function(result){
                        const $tbody = $("#yearTbody")
                        var dayData = result.data;
                        var mapDate = product.funcs.getMapDataOther(dayData);
                        console.log(mapDate)
                        product.funcs.renderDeatils($tbody,mapDate,key);
                        // console.log(teamData);
                    })
                } 
            })
        }
        ,/**渲染表头 */
        renderHead : function($tr,items){
            $tr.empty();
            var keyDyn = [];
            items.each(function(){
                $tr.append(
                    "<td id=\""+  $(this).value +"\">"+ $(this).attr("name") +"</td>"
                );
                keyDyn.push($(this).val())
            })
            items.each(function(){
                $tr.append(
                    "<td id=\""+  "unit"+$(this).value +"\">"+ $(this).attr("name") +"</td>"
                );
                keyDyn.push("unit"+$(this).val());
            })
            return keyDyn;
        }
        ,/**渲染表头 */
        renderHead1 : function($tr,items){
            $tr.empty();
            var keyDyn = [];
            items.each(function(){
                $tr.append(
                    "<td id=\""+  $(this).value +"\">"+ $(this).attr("name") +"</td>"
                );
                keyDyn.push($(this).val())
            })
            
            return keyDyn;
        }
        // 获取表头的健值对
        ,getHeadKey : function(keyDyn) {
            var key = [];
            key.push("class");
            key.push("team");
            keyDyn.forEach(function(e) {
                key.push(e);
            });
            return key;
        }
        // 获取年，月表头的健值对
        ,getHeadKeyOther : function(keyDyn) {
            var key = [];
            keyDyn.forEach(function(e) {
                key.push(e);
            });
            return key;
        }
        /**渲染查找页面 */
        ,renderDeatils : function($tbody,mapDatas,keys){
            $tbody.empty();
            mapDatas.forEach(function(mapData){
                $tbody.append(
                    "<tr>"
                );
                keys.forEach(function(key){
                    $tbody.append(
                        "<td>"+ (mapData[key]||"") +"</td>"
                    );
                })
                $tbody.append(
                    "</tr>"
                );
            })

        }
        // map方法使用
        /**将数据渲染成健值对形式 */
        ,getMapData : function(results){
            var datas = [];
            for(var i in results){
                var result = results[i];
                var map = {};
                map['class'] = result.clazzId;
                map['team'] = result.team.dicName;
                map[1] = result.lstUsed;
                map[2] = result.dhyUsed;
                map[3] = result.yhyUsed;
                map[4] = result.yldUsed;
                map[5] = result.ehyUsed;
                map[6] = result.dsjUsed;
                map[7] = result.lsUsed;
                map[8] = result.shUsed;
                datas.push(map)
            }
            return datas;
        }

        // map方法使用
        /**将数据渲染成健值对形式 */
        ,getMapDataOther : function(result){
            var datas = [];
            var map = {};
            map[1] = result.lstUsed;
            map[2] = result.dhyUsed;
            map[3] = result.yhyUsed;
            map[4] = result.yldUsed;
            map[5] = result.ehyUsed;
            map[6] = result.dsjUsed;
            map[7] = result.lsUsed;
            map[8] = result.shUsed;
            map["unit1"] = result.lstUnitUsed;
            map["unit2"] = result.dhyUnitUsed;
            map["unit3"] = result.yhyUnitUsed;
            map["unit4"] = result.yldUnitUsed;
            map["unit5"] = result.ehyUnitUsed;
            map["unit6"] = result.dsjUnitUsed;
            map["unit7"] = result.lsUnitUsed;
            map["unit8"] = result.shUnitUsed;
            datas.push(map)
            return datas;
        }

        /**渲染类型数据 */
        ,getMapItem : function(results){
            var datas = [];
            for(var i in results){
                var result = results[i];
                var map = {};
                map['team'] = result.team.dicName;
                map[1] = result.lstUsed;
                map[2] = result.dhyUsed;
                map[3] = result.yhyUsed;
                map[4] = result.yldUsed;
                map[5] = result.ehyUsed;
                map[6] = result.dsjUsed;
                map[7] = result.lsUsed;
                map[8] = result.shUsed;
                datas.push(map)
            }
            return datas;
        }
    }
}