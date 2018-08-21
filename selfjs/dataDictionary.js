var dataManagement = {
    init : function(){
        /**获取字典数据分页显示 */
        // dataManagement.funcs.renderTable();
        dataManagement.funcs.renderOption();
        var out = $("#dataPage").width();
        var time = setTimeout(function(){
            var inside = $(".layui-laypage").width();
            $('#dataPage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%');
            clearTimeout(time);
        }, 30);
    }
    /**当前总记录数，用户控制全选逻辑 */
    ,pageSize: 0
    ,funcs : {
        /**渲染字典类型菜单*/
        renderOption : function(){
            $.get(home.urls.dataDictionary.getAllTypes(),{},function(result) {
                var types = result.data;
                const $ul = $("#dataType").children('ul');
                $ul.empty();
                $ul.append(
                    "<li style='background: #666666; color :white;'>字典类型</li>"
                )
                types.forEach(function (e) {
                    $ul.append(
                        "<li class='setDataType' id='setdata-" + (e.id) + "'>" + (e.typeName) + "</li>"
                    )
                })
                $($('.setDataType')[0]).addClass('selected_data').css('color', ' #ffffff')
                var set_data = $('.setDataType')
                dataManagement.funcs.changeType(set_data)
            })
        }
        /**选择类型 */
        ,changeType : function(set_data){
            set_data.off('click')
            set_data.on('click',function(){
                var _self = $(this)
                $('.setDataType').removeClass('selected_data').css('color','')
                _self.addClass('selected_data').css('color', ' #ffffff')
                var id_name = $(this).attr('id')
                var typeId = id_name.substr(10)
                dataManagement.funcs.dataType_set(typeId)
            })
            //  dataManagement.funcs.dataType_set(dataTypeId)
        }
        /**渲染 */
        ,dataType_set : function(id){
            $.get(home.urls.dataDictionary.getAllDataByTypeByPage(),{
                id : id,
                page : 0
            },function(result){
                var datas = result.data.content
                const $tbody = $("#dataTable").children('tbody')
                dataManagement.funcs.renderHandler($tbody, datas,0)
                dataManagement.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'dataPage'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.dataDictionary.getAllDataByTypeByPage(), {
                                id: id,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var datas = result.data.content //获取数据
                                const $tbody = $("#dataTable").children('tbody')
                                dataManagement.funcs.renderHandler($tbody, datas,page)
                                dataManagement.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            // /**绑定新增事件 */
            // dataTypeManagement.funcs.bindAddEvents($("#addButton"));
            // /**绑定批量删除事件 */
            // dataTypeManagement.funcs.bindDeleteTypeById($("#deleteButton"));
            // /**绑定刷新事件 */
            // dataTypeManagement.funcs.bindRefreshEvents($("#refreshButton"));
            // /**绑定查询事件 */
            // dataTypeManagement.funcs.bindSearchEvents($("#searchButton"));
        }
        /**渲染表格 */
        ,renderHandler : function($tbody, datas, page) {
            //清空表格
            $tbody.empty() ;
            var i = 1 + page * 10;
            datas.forEach(function(e){
                var str
                if (e.enable == 1)
                //    str = "checked='checked'"
                str = 'checked'
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='data_checkbox' value='" + (e.id) + "'></td>" +
                    "<td>" + (e.id) + "</td>" +
                    "<td>" + (e.dicName) + "</td>" +
                    "<td>" + (e.dicContent) + "</td>" +
                    "<td>" + (e.rank) + "</td>" +
                    "<td>" + (e.dicDescription) + "</td>" +
                    "<td><a href='#' class='edit' id='edit-" + (e.id) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='delete' id='de-" + (e.id) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })
        }
    }
}