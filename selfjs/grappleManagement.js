var grapple ={
    init : function(){
        grapple.funcs.renderTable();
        grapple.funcs.renderInit();
        var out = $("#grapplepage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $("#grapplepage").css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        },30);
    }
    ,pageSize : 0
    ,funcs : {
        renderTable:function(){
            /**渲染当天数据 */
            var startDate = $('#startTime').val()
            var endDate = $('#endTime').val()
            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                startDate : startDate,
                endDate : endDate
            },function(result){
                var grapples = result.data.content;
                const $tbody = $('#grappleTable').children('tbody');
                grapple.funcs.renderHandler($tbody,grapples,0);
                grapple.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "grapplepage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.truckLoading.getByStartDateAndEndDateAndClazzByPage(),{
                                startDate : startDate,
                                endDate : endDate,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var grapples = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#grappleTable").children("tbody");
                                grapple.funcs.renderHandler($tbody, grapples, page);
                                grapple.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定数据录入事件 */
            grapple.funcs.bindAddEvents($("#addButton"));
        }
        /**数据录入事件 */
        ,bindAddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#reportChartTbody").empty();
                $("#confirm").removeClass("hide");
                $("#addLine").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "确认",
                    content : $("#confirm"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes: function(index){
                        var value = $("#sel").val();
                        $.get(home.urls.truckLoading.isExists(),{
                            id : value,
                        },function(result){
                            if(!result.data){
                                $("#modal").removeClass("hide");
                                layer.open({
                                    type: 1,
                                    title: "新增",
                                    content: $("#modal"),
                                    area: ['80%', '70%'],
                                    btn: ['保存', '取消'],
                                    offset: ['10%', '10%'],
                                    closeBtn: 0,
                                    yes : function(index){
                                        var clazzId = $("#sel").val();
                                        var userStr = $.session.get('user');
                                        var userJson = JSON.parse(userStr);
                                        var dispatcherId = userJson.id;
                                        var reporterId = $("#reporter").val();
                                    }
                                    ,btn2 : function(index) {
                                        $("#modal").css("display","none");
                                        layer.close(index);
                                    }
                                })
                                var maps = {}
                                grapple.funcs.buttonAdd($("#addRow"),maps);
                            }else{
                                layer.msg("该班次已存在");
                            }
                            $("#confirm").addClass("hide");
                            layer.close(index);         
                        })  
                    }
                    ,btn2 : function(index) {
                        $("#confirm").css("display","none");
                        layer.close(index);
                    }
                })
            })
        },
        //按钮添加一行事件
        buttonAdd:function (buttons,maps){
            buttons.off('cilck').on('click',function(){
                $("#addMaterial").empty();
                $.get(home.urls.MaterialItem.getAll(),{},function(result){
                    var materialItem = result.data;
                    materialItem.forEach(function(e){
                        $("#addMaterial").append("<option value='"+e.id+"'>"+e.name+"</option>");
                    })
                })
                $("#addModal").removeClass("hide")
                layer.open({
                    type : 1,
                    title : "确认",
                    content : $("#addModal"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes: function(index){
                        var id = $("#addMaterial option:selected").val();
                        var name = $("#addMaterial option:selected").text();                        
                        if(maps[id] == undefined){
                            maps[id]={}
                            maps[id]['name']=name
                            maps[id]['data']=[]
                            maps[id]['data'].push({})
                        }else{
                            maps[id]['data'].push({});
                        }
                        const $tbody = $("#reportChartTbody");
                        grapple.funcs.renderAddRow($tbody,maps)
                        $("#addModal").css("display","none");
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#addModal").css("display","none");
                        layer.close(index);
                    }
                })
            })
        }
        ,renderHandler : function($tbody,grapples,page){
            //清空表格
            $tbody.empty();
            var i = 1 + page * 10 ;
            grapples.forEach(function(e){
                $tbody.append(
                    "<tr>"+
                    "<td><input type='checkbox' value="+e.id+" class='grapple-checkbox'></td>" +
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.code)+"</td>" +
                    "<td>"+(e.date)+"</td>" +
                    "<td>"+(e.clazz.name)+"</td>" +
                    "<td>"+(e.dispatcher.name)+"</td>" +
                    "<td>"+(e.reporter.name)+"</td>" +
                    "<td><a href='#' class ='view' id='view-"+(e.id)+"'>查看明细</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class ='modify' id='modify-"+(e.id)+"'>修改明细</a></td>" +
                    "</tr>"
                )
            })
        }
        //渲染初始数据
        ,renderInit : function(){
            $("#reporter").empty()
            $.get(home.urls.user.getAll(),{},function(result){
                var userData = result.data;
                userData.forEach(function(e){
                    $("#reporter").append("<option value='"+e.id+"'>"+e.name+"</option>");
                })
            })
            
            /**渲染班次信息 */
            $("#clazz").empty();
            $("#sel").empty();
            $.get(home.urls.clazz.getAll(),{},function(result){
                var classData = result.data;
                $("#clazz").append("<option value="+(-1)+">"+("所有班次")+"</option>");
                classData.forEach(function(e){
                    $("#clazz").append("<option value="+e.id+">"+e.name+"</option>");
                    $("#sel").append("<option value="+e.id+">"+e.name+"</option>");
                })
            })
            /**绑定添加一行事件 */
            // grapple.funcs.bindAddRow($("#addRow"));
        }
        ,//渲染增加一行页面
        renderAddRow :function($tbody,maps){
            $tbody.empty();
            for(var key in maps){
                var rowNum=0
                value = maps[key]
                $tbody.append(
                    "<tr id="+(rowNum)+">" + 
                    "<td rowspan="+value.data.length+" id="+key+">" + (value.name || "") + "</td>" +
                    "<td>"+ (rowNum+1)+"</td>"+
                    "<td>"+ (value.data[rowNum].sendTime||"") +"</td>" +
                    "<td>"+ (value.data[rowNum].num ||"") +"</td>" +
                    "<td>"+ (value.data[rowNum].orebin ||"") +"</td>" +
                    "<td>"+ (value.data[rowNum].contrapositionTime ||"") +"</td>" +
                    "<td>"+ (value.data[rowNum].makeUpTime ||"") +"</td>" +
                    "<td>"+ (value.data[rowNum].finishTime ||"") +"</td>" +
                    "<td>"+ (value.data[rowNum].weighTime ||"") +"</td>" +
                    "<td><a href='#' class='delete' id=del"+rowNum+"><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "<td rowspan="+value.data.length+" id=note"+key+">"+ (value.data[rowNum].note||"") +"</td>" +
                    "</tr>"
                )
                rowNum++
                for(var i=1;i<value.data.length;i++){
                    $tbody.append(
                        "<tr id="+rowNum+">" + 
                        "<td>"+ (rowNum+1)+"</td>"+
                        "<td>"+ (value.data[rowNum].sendTime||"") +"</td>" +
                        "<td>"+ (value.data[rowNum].num ||"") +"</td>" +
                        "<td>"+ (value.data[rowNum].orebin ||"") +"</td>" +
                        "<td>"+ (value.data[rowNum].contrapositionTime ||"") +"</td>" +
                        "<td>"+ (value.data[rowNum].makeUpTime ||"") +"</td>" +
                        "<td>"+ (value.data[rowNum].finishTime ||"") +"</td>" +
                        "<td>"+ (value.data[rowNum].weighTime ||"") +"</td>" +
                        "<td><a href='#' class='delete' id=del"+rowNum+"><i class='layui-icon'>&#xe640;</i></a></td>" +
                        "</tr>"
                    )
                    rowNum++
                }
            }
        }
        /**渲染详情数据 */
        ,renderDeatil : function($tbody,datas,keys){
            $tbody.empty();
            keys.forEach((key)=>{
                var data = datas[key];
                // console.log("==========");
                // console.log(data);
                var flag = 0;
                // 2.循环写数据
                data.forEach((d)=>{
                    if(flag == 0){
                        flag = flag + 1;
                        // 1.写类型
                        $tbody.append(
                            "<tr>" +
                            "<td rowspan='"+data.length+"'>" + data[0].item+"</td>" +
                            "<td>"+ data[0].rank +"</td>" +
                            "<td>"+ data[0].sendTime +"</td>" +
                            "<td>"+ data[0].num +"</td>" +
                            "<td>"+ data[0].orebin +"</td>" +
                            "<td>"+ data[0].contrapositionTime +"</td>" +
                            "<td>"+ data[0].makeUpTime +"</td>" +
                            "<td>"+ data[0].finishTime +"</td>" +
                            "<td>"+ data[0].weighTime +"</td>" +
                            "<td><a href='#' class='delete' ><i class='layui-icon'>&#xe640;</i></a></td>" +
                            "<td>"+ data[0].note +"</td>" +                                      
                            "</tr>"      
                        );
                    } else {
                        $tbody.append(
                            "<tr>" +
                            "<td>"+ data[flag].rank +"</td>" +
                            "<td>"+ data[flag].sendTime +"</td>" +
                            "<td>"+ data[flag].num +"</td>" +
                            "<td>"+ data[flag].orebin +"</td>" +
                            "<td>"+ data[flag].contrapositionTime +"</td>" +
                            "<td>"+ data[flag].makeUpTime +"</td>" +
                            "<td>"+ data[flag].finishTime +"</td>" +
                            "<td>"+ data[flag].weighTime +"</td>" +
                            "<td><a href='#' class='delete'><i class='layui-icon'>&#xe640;</i></a></td>" +
                            "<td>"+ data[flag].note +"</td>" +                                      
                            "</tr>"  
                        );
                        flag++;
                    }
                })
            })
        }
    }
}