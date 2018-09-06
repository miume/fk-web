var curveAnalysis = {
    init: function() {
        curveAnalysis.funcs.renderOption();
    }
    ,funcs: {
        /**渲染左边菜单*/
        renderOption : function() {
            $.get(home.urls.group.getAll(),{},function(result) {
                var groups = result.data;
                const $ul = $("#materialItem").children('ul');
                $ul.empty();
                $ul.append(
                    "<li style='background: #666666; color :white;'>工艺组别</li>"
                );
                groups.forEach(function(e) {
                    $ul.append(
                        "<div id='group-" + (e.id) + "' class='setGroup'>" +
                        "<li>" + e.name + "</li>"+
                        "</div>"
                    )
                });
                var setGroups = $('.setGroup');
                curveAnalysis.funcs.changeGroup(setGroups); // 选中事件
            })
        }
        /**绑定选中事件*/
        ,changeGroup : function(setGroups) {
            setGroups.off('click').on('click',function() {
                var id = $(this).attr('id').substr(6);
                // console.log(id);

            })
        }
        /**渲染右边事件*/
        ,renderRight : function() {

        }
    }
};