var menuManagement = {
    init : function() {
        menuManagement.funcs.render();
        /**获取所有可分配操作*/
       
        
    }
    ,funcs : {
        render : function() {
            $("#navigations").empty();
            $.get(servers.backup() + 'navigation/getAllNavigationOperations', { } ,function(result) {
                var navigation = result.data;
                navigation.sort(function(a, b) {
                    return a.rank - b.rank;
                })
            
            console.log(navigation)
            var menu1s = [];
            navigation.forEach(function(e) {
                menu1s.push(e.firstLevelMenu);
                $("#navigations").append(
                    "<li id='navigations-"+ (e.id) +"'>" +
                    "<div class='fl'><a href='#' class='mainClick'>" + (e.name) + "</a></div>" + 
                    "<div class='fr' style='position: relative;top: 2px;'>&nbsp;&nbsp;<a href='#' class='shift-up' id='navigation-up" + (e.id) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;" + 
                    "<a href='#' class='shift-down' id='navigation-down-" + (e.id) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;" + 
                    "<a href='#' class='editBtn' id='navigation-edit-" + (e.id) + "'><i class='fa fa-edit'></i></a></div>"+
                    "</li>"
                )
            })
          })
         }
    }
}