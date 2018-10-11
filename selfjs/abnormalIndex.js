var abnormalIndex = {
    init : function() {
        abnormalIndex.funcs.renderTable();
        abnormalIndex.funcs.renderDropBox();

    }
    ,pageSize : 0
    ,funcs : {
        renderTable : function() {
            /**获取当前日期 */
            var currentDate = new Date().Format('yyyy-MM-dd');
            /**获取前一个月日期 */
            var preMonthDate = abnormalIndex.funcs.getPreMonth();
            /**界面显示初值 */
            $("#beginDate").val(preMonthDate);
            $("#endDate").val(currentDate);
            /**获取所有数据 */
            $.get(home.urls.exceptIndexReport.search(),{
                startDate : preMonthDate,
                startClazzId : 3,
                endDate : currentDate,
                endClazzId : 2
            },function(result) {
                var detailDatas = result.data;
                const $tbody = $("#abnormalIndexTbody");
                abnormalIndex.funcs.renderTbodyData($tbody, detailDatas);
            });
            /**绑定搜索事件 */
            abnormalIndex.funcs.bindSearchEvents($("#searchButton"));
            /**绑定导出事件 */
            abnormalIndex.funcs.bindExportEvents($("#downloadButton"));
            /**绑定异常指标设置事件 */
            abnormalIndex.funcs.bindAbnormalEvents($("#abnormalButton"));
        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#beginDate").val();
                var startClazzId = $("#beginTeam").val();
                var endDate = $("#endDate").val();
                var endClazzId = $("#endTeam").val();
                if(startDate === "" || endDate === "" || startClazzId === "" || endClazzId === ""){
                    layer.msg('日期选择不能为空！',{
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                $.get(home.urls.exceptIndexReport.search(),{
                    startDate : startDate,
                    startClazzId : startClazzId,
                    endDate : endDate,
                    endClazzId : endClazzId
                },function(result) {
                    var detailDatas = result.data;
                    const $tbody = $("#abnormalIndexTbody");
                    abnormalIndex.funcs.renderTbodyData($tbody, detailDatas);
                    layer.msg(result.message, {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                });
            })
        }
        /**绑定导出事件 */
        ,bindExportEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var startDate = $("#beginDate").val();
                var startClazzId = $("#beginTeam").val();
                var endDate = $("#endDate").val();
                var endClazzId = $("#endTeam").val();
                if(startDate === "" || endDate === "" || startClazzId === "" || endClazzId === ""){
                    layer.msg('日期选择不能为空！', {
                        offset : ['40%', '55%'],
                        time : 700
                    });
                    return
                }
                var href = home.urls.exceptIndexReport.export()+"?startDate="+startDate+"&startClazzId="+startClazzId+
                    "&endDate="+endDate+"&endClazzId="+endClazzId;
                $("#downloadA").attr("href",href);
            })
        }
        /**绑定异常指标设置事件 */
        ,bindAbnormalEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                abnormalIndex.funcs.renderSetAbnormalTbody();
                $("#setAbnormalIndex").removeClass("hide");
                layer.open({
                    type: 1,
                    title: '异常指标设置',
                    content: $("#setAbnormalIndex"),
                    area: ['50%', '50%'],
                    btn: ['保存', '取消'],
                    offset: ['25%', '25%'],
                    closeBtn: 0,
                    yes : function(index) {
                        $("#setAbnormalIndex").addClass("hide");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#setAbnormalIndex").addClass("hide");
                        layer.close(index);
                    },
                })
            })
        }
        /**渲染异常指标设置中的数据*/
        ,renderSetAbnormalTbody : function() {
            $.get(home.urls.sampleIndexSetup.getAll(),{},function(result) {
                var sampleIndex = result.data;
                const $tbody = $("#setAbnormalIndexTbody");
                $tbody.empty();
                var operate = [">","≥","<","≤"];
                sampleIndex.forEach(function(e) {
                    $tbody.append(
                        "<tr>"+
                        "<td id='"+ e.type.id +"'>"+ e.type.name+"</td>"+
                        "<td id='"+ e.operate +"'>"+ operate[e.operate]+"</td>"+
                        "<td id='value-"+e.value+"'>"+ e.value +"</td>"+
                        "<td><a href='#' class = 'editor' id='edit-"+ e.id +"'><i class='layui-icon'>&#xe642;</i></a></td>"+
                        "<td><a href='#' class = 'delete' id='del-"+ e.id +"'><i class='layui-icon'>&#xe640;</i></a></td>"+
                        "</tr>"
                    )
                });
                /**绑定新增一行操作名称事件 */
                abnormalIndex.funcs.bindAddLinesEvent($("#addLine"));
                /**绑定编辑操作名称事件 */
                abnormalIndex.funcs.bindEditEvents($(".editor"));
                /**绑定删除操作名称事件 */
                abnormalIndex.funcs.bindDeleteEvents($(".delete"));
            });
        }
        /**绑定新增一行操作名称事件 */
        ,bindAddLinesEvent : function(buttons) {
            buttons.off('click').on('click',function() {
                $("#norName").empty();
                $("#operate option[value='0']").attr("selected","selected");
                $("#value").val("");
                $("#updateAbnormalModal").removeClass("hide");
                $.get(home.urls.sampleIndexType.getAll(),{},function(result) {
                    var sampleTypes = result.data;
                    const $norName = $("#norName");
                    sampleTypes.forEach(function(e) {
                        $norName.append(
                            "<option value='"+ e.id +"'>"+ e.name+"</option>"
                        )
                    })
                });
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#updateAbnormalModal"),
                    area : ["300px","300px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        var norId = $("#norName").val();
                        var operate = $("#operate").val();
                        var value = $("#value").val();
                        console.log(norId)
                        console.log(operate)
                        console.log(value)
                        $.post(home.urls.sampleIndexSetup.add(),{
                            'type.id' : norId,
                            operate : operate,
                            value : value
                        },function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            });
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    abnormalIndex.init();
                                    clearTimeout(time);
                                },500)
                            }
                        });
                        $("#updateAbnormalModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#updateTasteModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定编辑操作名称事件 */
        ,bindEditEvents : function(buttons) {
            buttons.off("click").on("click",function() {
                var id = $(this).attr("id").substr(5);
                $.get(home.urls.sampleIndexType.getAll(),{},function(result) {
                    var sampleTypes = result.data;
                    const $norName = $("#norName");
                    $norName.empty();
                    sampleTypes.forEach(function(e) {
                        $norName.append(
                            "<option value='"+ e.id +"'>"+ e.name+"</option>"
                        )
                    });
                    $("#norName option[value="+(nameVal)+"]").attr("selected","selected");

                });
                var e = $(this).parent("td").parent("tr");
                var td = e.find("td");
                console.log(td);
                var nameVal = td.eq(0).attr("id");
                var val = td.eq(1).attr("id");
                var setValue = td.eq(2).attr("id").substr(6);
                $("#operate option[value="+(val)+"]").attr("selected","selected");
                $("#value").val(setValue);
                $("#updateAbnormalModal").removeClass("hide");
                //  使操作符下拉框出去选订状态
                layer.open({
                    type : 1,
                    title : "修改",
                    content : $("#updateAbnormalModal"),
                    area : ["300px","300px"],
                    btn : ["保存","返回"],
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        var norId = $("#norName").val();
                        var operate = $("#operate").val();
                        var value = $("#value").val();
                        $.post(home.urls.sampleIndexSetup.update(),{
                            id : id,
                            'type.id' : norId,
                            operate : operate,
                            value : value
                        },function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            });
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    //  应该需要增加  当成功的时候  刷新异常指标设置
                                    abnormalIndex.funcs.renderSetAbnormalTbody();
                                    abnormalIndex.init();
                                    clearTimeout(time);
                                },500)
                            }
                        });
                        $("#updateAbnormalModal").addClass("hide");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#updateAbnormalModal").addClass("hide");
                        layer.close(index);
                    }
                })
            })
        }
        /**绑定删除操作名称事件 */
        ,bindDeleteEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var id = $(this).attr("id").substr(4);
                console.log(id);
                layer.open({
                    type : 1,
                    title : "删除",
                    content : "<h5 style='text-align:center;'>确定要删除该记录吗？</h5>",
                    area : ["240px","140px"],
                    btn : ["确定","取消"] ,
                    offset : "auto",
                    closeBtn : 0,
                    yes : function(index) {
                        $.post(home.urls.sampleIndexSetup.deleteById(),{
                            _method : "delete" , id : id
                        },function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            });
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    abnormalIndex.init();
                                    abnormalIndex.funcs.renderSetAbnormalTbody();
                                    clearTimeout(time);
                                },500)
                            }
                        });
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                })
            })
        }
        /**渲染数据*/
        ,renderTbodyData : function($tbody, detailDatas) {
            //  page标签只是用来控制序号的，若不需要序号，则可以不使用
            $tbody.empty();
            for(var name in detailDatas) {
                //  其中name为对象名
                var detailData = detailDatas[name];
                var flag = 0;
                detailData.forEach(function(e) {
                    if(flag === 0){
                        // 1.写类型
                        $tbody.append(
                            "<tr>" +
                            "<td rowspan='"+detailData.length+"'>" + name +"</td>" +
                            "<td>"+ (flag+1) +"</td>" +
                            "<td>"+ detailData[0].time.substring(0,10) +"</td>" +
                            "<td>"+ detailData[0].clazz.name +"</td>" +
                            "<td>"+ detailData[0].team.name +"</td>" +
                            "<td>"+ detailData[0].operator.name +"</td>" +
                            "<td>"+ detailData[0].value +"</td>" +
                            "</tr>"
                        );
                        flag = flag + 1 ;
                    }else{
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ (flag+1) +"</td>" +
                            "<td>"+ detailData[flag].time.substring(0,10) +"</td>" +
                            "<td>"+ detailData[flag].clazz.name +"</td>" +
                            "<td>"+ detailData[flag].team.name +"</td>" +
                            "<td>"+ detailData[flag].operator.name +"</td>" +
                            "<td>"+ detailData[flag].value +"</td>" +
                            "</tr>"
                        );
                        flag++;
                    }
                })
            }
        }
        /**渲染页面下拉框*/
        ,renderDropBox : function() {
            $("#beginTeam").empty();
            $("#endTeam").empty();
            $("#team").empty();
            $("#shift").empty();
            // $("#optName").empty();
            //  获取开始班次
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var beginClazzTypes = result.data;
                beginClazzTypes.forEach(function(e) {
                    if(e.id===3){
                        $("#beginTeam").append('<option selected="selected" value='+e.id+'>'+e.name+'</option>')
                    }
                else{
                        $("#beginTeam").append('<option value='+e.id+'>'+e.name+'</option>')
                    }
                })
            });
            //  获取结束班次
            $.get(home.urls.clazz.getAll(),{},function(result) {
                var endClazzTypes = result.data;
                endClazzTypes.forEach(function(e) {
                    if(e.id===2){
                        $("#endTeam").append('<option selected="selected" value='+e.id+'>'+e.name+'</option>')
                    }
                    else{
                        $("#endTeam").append('<option value='+e.id+'>'+e.name+'</option>')
                    }
                })
            });
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
    }
};