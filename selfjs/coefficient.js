var coefficient = {
    init :function(){
        coefficient.funcs.renderTable()
        var out = $("#coefficientPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#coefficientPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    ,pageSize : 0
    ,funcs:{
        //渲染页面
        renderTable:function(){
            //获取所有的记录
            $.get(home.urls.coefficient.getAllByPage(), { page : 0 }, function(result) {
                var coefficients = result.data.content;
                const $tbody = $("#coefficientTable").children("tbody");
                coefficient.funcs.renderHandler($tbody, coefficients, 0);
                coefficient.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "coefficientPage",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.coefficient.getAllByPage(),{
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var coefficients = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#coefficientTable").children("tbody");
                                coefficient.funcs.renderHandler($tbody, coefficients, page);
                                coefficient.pageSize = result.data.length;
                            })
                        }
                    }
                })
            })
            /**绑定搜索事件 */
            coefficient.funcs.bindSearchEvents($("#searchButton"));
            /**绑定新增事件 */
            coefficient.funcs.bindaddEvents($("#addButton"));
            /**绑定刷新事件 */
            coefficient.funcs.bindRefreshEvents($("#refreshButton"))
        }
        ,bindRefreshEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var index = layer.load(2 , { offset : ['40%','58%'] });
                var time = setTimeout(function() {
                    layer.msg('刷新成功', {
                        offset : ['40%', '55%'],
                        time : 700
                    })
                    coefficient.init();
                    layer.close(index);
                    clearTimeout(time);
                }, 200)
            })
        }
        //新增事件
        ,bindaddEvents : function(buttons){
            buttons.off('click').on('click',function(){
                $("#yieldCoefficient").val("");
                $("#coeDate").val("");
                $("#addPage").removeClass("hide");
                layer.open({
                    type : 1,
                    title : "新增",
                    content : $("#addPage"),
                    area : ['380px', '200px'],
                    btn : ['确定' , '取消'],
                    offset : ['40%' , '45%'],
                    closeBtn: 0,
                    yes : function(index) {
                        var value = $("#yieldCoefficient").val();
                        var date = $("#coeDate").val();
                        if(date === ""&&value === ""){
                            layer.msg('所填信息不能为空!');
                            return 
                        }
                        $.post(home.urls.coefficient.add() , {
                            date : date,
                            coEfficientNumber : value,
                        }, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%' , '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    coefficient.init();
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        $("#addPage").addClass("hide");
                        layer.close(index);
                    },
                    btn2 : function(index) {
                        $("#addPage").addClass("hide");
                        layer,close(index);
                    }
                })
            })
        }
        //搜索事件
        ,bindSearchEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var date = $("#date").val();
                // console.log(typeName);
                $.get(home.urls.coefficient.getByDateByPage(),
                {
                    date : date
                }, function(result){
                var datas = result.data.content;
                const $tbody = $("#coefficientTable").children("tbody");
                coefficient.funcs.renderHandler($tbody, datas , 0);
                coefficient.pageSize = result.data.length;
                var page = result.data;
                /**分页信息 */
                layui.laypage.render({
                    elem: "dataType_page",
                    count : 10 * page.totalPages,
                    /**页面变换后的逻辑 */
                    jump: function(obj, first) {
                        if(!first) {
                            $.get(home.urls.coefficient.getByDateByPage(),{
                                date : date,
                                page : obj.curr - 1 ,
                                size : obj.limit
                            }, function (result) {
                                var datas = result.data.content;
                                var page = obj.curr - 1;
                                const $tbody = $("#coefficientTable").children("tbody");
                                coefficient.funcs.renderHandler($tbody, datas, page);
                                coefficient.pageSize = result.data.length;
                            })
                        }
                    }
                })
                })
            })
        }
        ,renderHandler : function($tbody,coefficients,page){
            //清空表格
            $tbody.empty()
            var i = 1 + page * 10;
            coefficients.forEach(function(e){
                $tbody.append(
                    "<tr>" + 
                    "<td>"+(i++)+"</td>" +
                    "<td>"+(e.date)+"</td>" +
                    "<td>"+(e.coEfficientNumber)+"</td>" +
                    "<td><a href='#' class='edit' id='edit-"+(e.id)+"'><i class='layui-icon'>&#xe642;</i></a></td>" + 
                    "</tr>"
                )
            })
            /**绑定编辑事件 */
            coefficient.funcs.bindEditEvents($(".edit"));
        }
        /**绑定编辑事件 */
        ,bindEditEvents : function(buttons){
            buttons.off('click').on('click',function(){
                var id = $(this).attr('id').substr(5);
                $("#yieldCoefficient").val("");
                $("#coeDate").val("");
                $.get(home.urls.coefficient.getById(),{ id:id }, function(result) {
                    var coe = result.data;
                    var id = coe.id;
                    $("#yieldCoefficient").val(coe.coEfficientNumber);
                    $("#coeDate").val(coe.date);
                    $("#addPage").removeClass("hide");
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#addPage"),
                        area: ['380px', '200px'],
                        btn: ['确定', '取消'],
                        offset: ['40%','45%'],
                        closeBtn: 0,
                        yes: function(index){
                            var value = $("#yieldCoefficient").val();
                            var date = $("#coeDate").val();
                            if(value===""|| date===""){
                                layer.msg('所填数据不能为空!');
                                return 
                            }
                            $.post(home.urls.coefficient.update() ,{
                                id : id,
                                date : date,
                                coEfficientNumber : value
                            }, function(result) {
                                layer.msg(result.message, {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                                if(result.code === 0) {
                                    var time = setTimeout(function() {
                                        coefficient.init();
                                        clearTimeout(time);
                                    },500)
                                }
                            })
                            $("#addPage").css("display","none");
                            layer.close(index);
                        },
                        btn2 : function(index) {
                            $("#addPage").css("display","none");
                            layer.close(index);
                        }
                    })
                })
            })
        }
    }
}