var alarmSetting = {
    init : function() {
        alarmSetting.funcs.renderTable();
        var out = $("#alarmSettingPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#alarmSettingPage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,funcs : {
        renderTable : function() {
            $.get(home.urls.alarmSetting.getAllByPage(),{},function (result) {
                var alarmDatas = result.data.content;
                var page = result.data;
                const $tbody = $("#alarmSettingTbody");
                alarmSetting.funcs.renderHandler($tbody,alarmDatas,0);
                alarmSetting.pageSize = page.size;
                /**分页信息 */
                layui.laypage.render({
                    elem: "alarmSettingPage",
                    count: page.totalElements ,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.alarmSetting.getAllByPage(),{
                                page : obj.curr - 1,
                                size : obj.limit
                            },function(result) {
                                var alarmDatas = result.data.content;
                                const $tbody = $("#alarmSettingTbody");
                                alarmSetting.funcs.renderHandler($tbody,alarmDatas,page);
                                alarmSetting.pageSize = page.size;
                            })
                        }
                    }
                })
            });
            /**绑定新增事件 */
            // alarmSetting.funcs.bindAddByIdsEvents($("#addButton"));
            /**绑定批量删除事件 */
            alarmSetting.funcs.bindDeleteByIdsEvents($("#deleteButton"));
            /**绑定导出事件 */
            alarmSetting.funcs.bingDownloadEvents($("#downloadButton"));
            /**绑定搜索事件 */
            alarmSetting.funcs.bindSearchEvents($("#searchButton"));
        }
        /**绑定搜索事件 */
        ,bindSearchEvents : function (buttons) {
            buttons.off('click').on('click',function() {
                var dpPointName = $('#dpPoint').val();
                $.get(home.urls.alarmSetting.getByDpPointLikeByPage(),{
                    dpPoint : dpPointName
                },function(result) {
                    var alarmDatas = result.data.content;
                    var page = result.data;
                    const $tbody = $("#alarmSettingTbody");
                    alarmSetting.funcs.renderHandler($tbody,alarmDatas,0);
                    alarmSetting.pageSize = page.size;
                    /**分页信息 */
                    layui.laypage.render({
                        elem: "alarmSettingPage",
                        count: page.totalElements ,
                        /**页面变换后的逻辑 */
                        jump: function(obj, first) {
                            if(!first) {
                                $.get(home.urls.alarmSetting.getByDpPointLikeByPage(),{
                                    dpPoint : dpPointName,
                                    page : obj.curr - 1,
                                    size : obj.limit
                                },function(result) {
                                    var alarmDatas = result.data.content;
                                    const $tbody = $("#alarmSettingTbody");
                                    alarmSetting.funcs.renderHandler($tbody,alarmDatas);
                                    alarmSetting.pageSize = page.size;
                                })
                            }
                        }
                    })
                });
            })
        }
        /**绑定导出事件 */
        ,bingDownloadEvents : function(buttons) {
            buttons.off('click').on('click',function() {
                var dpPointId = $('#dpPoint').val();
                var href = home.urls.alarmSetting.exportByDpPointLike()+"?dpPoint="+ dpPointId ;
                $("#downloadA").attr("href",href);

            })
        }
        /**绑定批量删除事件 */
        ,bindDeleteByIdsEvents: function(buttons) {
            buttons.off('click').on('click',function(){
                if($(".alarm-checkbox:checked").length === 0) {
                    layer.msg('您还没选中任何数据!', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                }else {
                    layer.open({
                        type : 1,
                        title : "删除",
                        content : "<h5 style='text-align:center;'>您确定要删除选中数据吗？</h5>",
                        area: ['200px','140px'],
                        offset : 'auto',
                        btn: ['确定', '取消'],
                        closeBtn: 0,
                        yes : function(index) {
                            var alarmIdS = [];
                            /**存取所有选中行的id值 */
                            $(".alarm-checkbox").each(function() {
                                if($(this).prop("checked")) {
                                    alarmIdS.push(parseInt($(this).val()));
                                }
                            });
                            $.post(home.urls.alarmSetting.deleteByIds(), {
                                _method : "delete", ids : alarmIdS.toString()
                            },function(result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        alarmSetting.init();
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                            });
                            layer.close(index);
                        }
                        ,btn2 : function(index) {
                            layer.close(index);
                        }
                    })
                }
            })
        }
        ,renderHandler : function ($tbody, alarmDatas, page) {
            $tbody.empty();
            var i = 1 + page * 10;
            alarmDatas.forEach(function(e) {
                $tbody.append(
                    "<tr>"+
                    "<td><input type='checkbox' value="+e.id+" class='alarm-checkBox' /></td>" +
                    "<td>"+ (i++) +"</td>" +
                    "<td>" + e.dpPoint.dpPoint+"</td>" +
                    "<td>" + e.upValue+"</td>" +
                    "<td>" + e.priority+"</td>" +
                    "<td>" + e.info+"</td>" +
                    "<td>" + e.createTime+"</td>" +
                    "<td><a href='#' class = 'editor' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>"
                )
            });
            var checkedBoxLength = $(".alarm-checkBox:checked").length;
            home.funcs.bindselectAll($("#alarm-checkBoxAll"), $(".alarm-checkbox"), checkedBoxLength, $("#alarmSettingTable"));
            /**绑定编辑操作名称事件 */
            // alarmSetting.funcs.bindEditorAlarmEvents($(".editor"));
        }
        // ,bindEditorAlarmEvents: function(buttons) {
        //     buttons.off('click').on('click',function() {
        //         var id = $(this).attr('id').substr(5);
        //         $.get(home.urls.alarmSetting.getById(),{ id:id }, function(result) {
        //             var alarmDatas = result.data;
        //             var alarmId = alarmDatas.id;
        //             $("#upDpPoint").empty();
        //             $.get(home.urls.energyDpPoint.getAll(),{},function(result) {
        //                 var dpDatas = result.data;
        //                 //  渲染弹出框内容
        //                 dpDatas.forEach(function(e) {
        //                     $("#upDpPoint").append('<option value='+e.id+'>'+e.dpPoint+'</option>')
        //                 });
        //                 //  优先级
        //                 // $("#upPriority").spinner({
        //                 //     max:10,
        //                 //     min:0,
        //                 //     step:1
        //                 // });
        //                 //  设定值以及报警描述
        //                 $("#upValue").val(alarmDatas.upValue);
        //                 $("#upAlarmInfo").val(alarmDatas.info);
        //                 $("#updateModal").removeClass("hide");
        //                 layer.open({
        //                     type: 1,
        //                     title: '编辑',
        //                     content: $("#updateModal"),
        //                     area: ['400px', '300px'],
        //                     btn: ['确定', '取消'],
        //                     offset: "auto",
        //                     closeBtn: 0,
        //                     yes: function(index) {
        //                         var upDpPoint = $("#upDpPoint").val();
        //                         var upPriority = $("#upPriority").val();
        //                         var upValue = $("#upValue").val();
        //                         var upAlarmInfo = $("#upAlarmInfo").val();
        //                         $.post(home.urls.alarmSetting.update(), {
        //                             id : alarmId,
        //                             upValue : upValue,
        //                             priority : upPriority,
        //                             info : upAlarmInfo,
        //                             'dpPoint.id' : upDpPoint
        //                         }, function(result) {
        //                             layer.msg(result.message, {
        //                                 offset : ['40%', '55%'],
        //                                 time : 700
        //                             });
        //                             if(result.code === 0) {
        //                                 var time = setTimeout(function() {
        //                                     alarmSetting.init();
        //                                     clearTimeout(time);
        //                                 },500)
        //                             }
        //                         })
        //                         $("#updateModal").css("display","none");
        //                         layer.close(index);
        //                     },
        //                     btn2 : function(index) {
        //                         $("#updateModal").css("display","none");
        //                         layer.close(index);
        //                     }
        //                 })
        //             });
        //
        //         })
        //     })
        // }
    }
};