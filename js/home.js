var home = {
    urls: {
        role : {
            getAllByPage : function() {
                return servers.backup() + "role/getAllByPage" ;
            },
            getAll : function() {
                return servers.backup() + "role/getAll" ;
            },
            getById : function() {
                return servers.backup() + "role/getById" ;
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "role/getByNameLikeByPage" ;
            },
            add : function() {
                return servers.backup() + "role/add" ;
            },
            assignPermissions : function() {
                return servers.backup() + "role/assignPermissions" ;
            },
            deleteById : function() {
                return servers.backup() + "role/deleteById" ;
            },
            deleteByIds : function() {
                return servers.backup() + "role/deleteByIds" ;
            },
            update : function() {
                return servers.backup() + "role/update" ;
            },
            getPermissionsById : function() {
                return servers.backup() + "role/getPermissionsById" ;
            },
            getAssignUsersById : function() {
                return servers.backup() + "role/getAssignUsersById" ;
            },
            assignRoleToUsers : function() {
                return servers.backup() + "role/assignRoleToUsers" ;
            },
        },
        loginLog:{
            getAllByPage : function(){
                return servers.backup() + "loginLog/getAllByPage";
            },
            getByDate : function(){
                return servers.backup() + "loginLog/getByDate";
            },
            deleteByIds:function(){
                return servers.backup() + "loginLog/deleteByIds"; 
            },
            getByDateToExcel : function(){
                return servers.backup() + "loginLog/getByDateToExcel";
            },
        }
        ,operationLog : {
            getAllByPage : function() {
                return servers.backup() + "actionLog/getAllByPage" ;
            },
            getByDate : function() {
                return servers.backup() + "actionLog/getByDate" ;
            },
            deleteByIds : function() {
                return servers.backup() + "actionLog/deleteByIds" ;
            },
            getByDateToExcel : function() {
                return servers.backup() + "actionLog/getByDateToExcel"
            },
        }
        ,department : {
            deleteByIds : function() {
                return servers.backup() + "department/deleteByIds" ;
            },
            deleteById : function() {
                return servers.backup() + "department/deleteById" ;
            },
            add : function() {
                return servers.backup() + "department/add" ;
            },
            getAll : function() {
                return servers.backup() + "department/getAll" ;
            },
            getAllByPage : function() {
                return servers.backup() + "department/getAllByPage" ;
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "department/getByNameLikeByPage" ;
            },
            getById : function() {
                return servers.backup() + "department/getById" ;
            },
            update : function() {
                return servers.backup() + "department/update" ;
            },
            getTop: function() {
                return servers.backup() + "department/getTop" ;
            },
            getSonByParent: function() {
                return servers.backup() + "department/getSonByParent" ;
            },
        }
        ,user : {
            add : function() {
                return servers.backup() + "user/add" ;
            },
            assignRolesToUsers : function() {
                return servers.backup() + "user/assignRolesToUsers";
            },
            deleteById : function() {
                return servers.backup() + "user/deleteById" ;
            },
            deleteByIds : function() {
                return servers.backup() + "user/deleteByIds" ;
            },
            getAll : function() {
                return servers.backup() + "user/getAll" ;
            },
            getAllByPage : function() {
                return servers.backup() + "user/getAllByPage" ;
            },
            getByDepartment : function() {
                return servers.backup() + "user/getByDepartment" ;
            },
            getById : function() {
                return servers.backup() + "user/getById" ;
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "user/getByNameLikeByPage" ;
            },
            getPermissionsById : function() {
                return servers.backup() + "user/getPermissionsById" ;
            },
            getRolesById : function() {
                return servers.backup() + "user/getRolesById" ;
            },
            login : function() {
                return servers.backup() + "user/login" ;
            },
            resetPassword : function() {
                return servers.backup() + "user/resetPassword" ;
            },
            update : function() {
                return servers.backup() + "user/update" ;
            },
            updatePassword : function() {
                return servers.backup() + "user/updatePassword" ;
            },
        }
        ,navigations : {
            getAll : function() {
                return servers.backup() + "navigation/getAll" ;
            },
            update : function() {
                return servers.backup() + "navigation/update" ;
            },
            add : function() {
                return servers.backup() + "navigation/add" ;
            },
            getById : function() {
                return servers.backup() + "navigation/getById" ;
            },
            shift : function() {
                return servers.backup() + "navigation/shift" ;
            },
            getFirstLevelMenusById : function() {
                return servers.backup() + "navigation/getFirstLevelMenusById" ;
            },
        }
        ,menu1 : {
            getAll : function() {
                return servers.backup() + "firstLevelMenu/getAll" ;
            },
            update : function() {
                return servers.backup() + "firstLevelMenu/update" ;
            },
            add : function() {
                return servers.backup() + "firstLevelMenu/add" ;
            },
            getById : function() {
                return servers.backup() + "firstLevelMenu/getById" ;
            },
            shift : function() {
                return servers.backup() + "firstLevelMenu/shift" ;
            },
            getSecondLevelMenusById : function() {
                return servers.backup() + "firstLevelMenu/getSecondLevelMenusById" ;
            },
        }
        ,menu2 : {
            getAll : function() {
                return servers.backup() + "secondLevelMenu/getAll" ;
            },
            getOperationsById : function() {
                return servers.backup() + "secondLevelMenu/getOperationsById" ;
            },
            update : function() {
                return servers.backup() + "secondLevelMenu/update" ;
            },
            add : function() {
                return servers.backup() + "secondLevelMenu/add" ;
            },
            getById : function() {
                return servers.backup() + "secondLevelMenu/getById" ;
            },
            shift : function() {
                return servers.backup() + "secondLevelMenu/shift" ;
            },
        }
        ,operationManagement : {
            getAllByPage : function() {
                return servers.backup() + "operation/getAllByPage";
            },
            getById : function() {
                return servers.backup() + "operation/getById";
            },
            update : function() {
                return servers.backup() + "operation/update";
            }
        }
        ,dataDictionary : {
            add : function(){
                return servers.backup() + "dataDictionary/add";
            },
            deleteById : function(){
                return servers.backup() + "dataDictionary/deleteById";
            },
            deleteByIds : function(){
                return servers.backup() + "dataDictionary/deleteByIds";
            },
            getAll : function(){
                return servers.backup() + "dataDictionary/getAll";
            },
            getAllByPage : function(){
                return servers.backup() + "dataDictionary/getAllPage";
            },
            getAllByParentId : function(){
                return servers.backup() + "dataDictionary/getAllByParentId";
            },
            getAllChildrensByPage : function(){
                return servers.backup() + "dataDictionary/getAllChildrensByPage";
            },
            getAllParents : function(){
                return servers.backup() + "dataDictionary/getAllParents";
            },
            getByDicId : function(){
                return servers.backup() + "dataDictionary/getByDicId";
            },
            getById : function(){
                return servers.backup() + "dataDictionary/getById";
            },
            getChildrensByPageNameLike : function(){
                return servers.backup() + "dataDictionary/getChildrensByPageNameLike";
            },
            update : function(){
                return servers.backup() + "dataDictionary/update";
            },
        }
    }
   
    /** start */
    , navigationsClicks: null  //所有的一级菜单点击栏
    , menu1Clicks: null  //所有的一级菜单点击栏
    , menu2Clicks: null  //所有的二级菜单点击栏
    , navigations: []
    , menu1s: []
    , menu2s: []
    , navigationsWrapper: null
    , menu1Wrapper: null
    , monitor_data: null
    , realdata_interval: []
    , singlePage_interval: []
    , user: null
    , operations: []
    /** end */
    /**
     *  初始化函数
     * @param userJson  session中存储的用户信息
     * @param menuWrapper 用来包装导航菜单的块
     * @param menu1Wrapper 用来包装一级菜单的块
     * @hides 代表所有三级菜单点击后显示的内容的id
     */
    , init: function (userJson, navigationsWrapper, menu1Wrapper) {
        home.navigationsWrapper = navigationsWrapper;
        home.menu1Wrapper = menu1Wrapper;

        /**获取session用户信息 */
        console.log(userJson)
        const user = userJson;
        home.user = userJson;
        home.navigations = userJson.navigations;
        home.menu1s = [];
        home.menu2s = [];
        //console.log(home.navigations)
        /**遍历用户导航信息，从而获取导航菜单，一级菜单和二级菜单 填充home.navigations,home.menu1,home.menu2 */
        /**得先对获取得导航菜单、一级菜单、二级菜单进行排序 */
        var navigationsCodes = []  //用户导航菜单去重
        var menu1Codes = []        //用户一级菜单去重
        home.navigations.sort(function(a, b){
            return a.rank - b.rank;
        })
        userJson.navigations.forEach(function(element){
            home.navigationsWrapper.append("<li id='navigations-li-" + (element.id) + "' class='menu-tab-bar whiteFontMenu'><a href='#'>" + element.name + "</a></li>", null);
        })
        /**选中的导航菜单id 默认为1 */
        var selectedNavigations = localStorage.getItem('selectedNavigation') || $(home.navigationsWrapper.children('li')[0]).attr('id').substr(15);
        var selectedMenu1 = localStorage.getItem('selectedMenu1');
        var selectedMenu2 = localStorage.getItem('selectedMenu2');
        
        /**给选的导航菜单追加默认selected类标签，也是默认样式 */
        $('#navigations-li-'+ selectedNavigations).addClass('chosenMenu');
        home.navigationsClicks = home.navigationsWrapper.children('.menu-tab-bar');
        //console.log(home.navigationsClicks)
        /**给选中的导航菜单绑定点击事件 */
        home.funcs.bindClickAndMouseEventsForNavigations();
        /**给selected状态的导航菜单设置默认状态，包括填充一级菜单、给其所有的一级菜单追加二级菜单和绑定事件 */
        var selectedNavigationCode = $('.chosenMenu').attr('id').substr(15);
        home.menu1s = home.funcs.getMenu1ListByNavigation(selectedNavigationCode);
        /**将一级菜单填充到框内，并且给一级菜单都绑定弹出二级菜单的事件 */
        home.funcs.appendMenu1sToWrapperAndCarryModels(home.menu1s);
        /**绑定退出登录事件 */
        var $exit = $("#exit");
        home.funcs.handleLogout($exit);
    }
    ,funcs : {
        /**给导航菜单绑定点击事件 */
        bindClickAndMouseEventsForNavigations : function () {
            home.navigationsClicks.on('mouseenter', function(){
                $(this).addClass('blue_font');
            }).on('mouseleave', function() {
                $(this).removeClass('blue_font');
            }).on('click', function () {
                /**首先清除interval */
                home.funcs.clearIntervals(home.realdata_interval);
                /**点击一级菜单必须把所有展示框移除 */
                $('.display-component-container').remove();

                /**记住当前一级菜单 */
                localStorage.setItem('selectedNavigations', $(this).attr('id').substr(15));
                localStorage.setItem('selectedMenu1', null);
                localStorage.setItem('selectedMenu2', null);

                //console.log(localStorage.getItem('selectedNavigations'));
                /**首先将上一次selected的标签移除样式，然后给当前点击元素追加样式 */
                $('.navigations .chosenMenu').removeClass('chosenMenu');
                $('#navigations-li-'+ localStorage.getItem('selectedNavigations')).addClass('chosenMenu');

                /**通过导航菜单的code获取二级菜单 */
                const navigationsCode = localStorage.getItem('selectedNavigations');
                
                home.menu1s = home.funcs.getMenu1ListByNavigation(navigationsCode);
                /**将一级菜单填充到框内，并且给一级菜单都绑定弹出二级菜单的事件 */
                home.funcs.appendMenu1sToWrapperAndCarryModels(home.menu1s);
            })
        }
        /**通过导航菜单的code获取其下的所有一级菜单 */
        ,getMenu1ListByNavigation : function(selectedNavigationCode){
            //console.log(home.navigations)
            home.navigations.forEach(function(element){
                if(selectedNavigationCode == element.id){
                    home.menu1s = element.firstLevelMenus;
                }
            })
            //console.log(home.menu1s)
            home.menu1s.sort(function(a, b){
                return a.rank - b.rank;
            })
            return home.menu1s;
        }
        /**将一级菜单填充到一级菜单容器 */
        ,appendMenu1sToWrapperAndCarryModels : function(menu1List){
            /**首先清空menu1wrapper的内容 */
            home.menu1Wrapper.empty();
            /**开始填充二级菜单 */
            menu1List.forEach(function(element){
                home.menu1Wrapper.append(
                    "<div id='menu1-li-" + (element.id) + "' class='menu1-tab-bar'>" +
                    "<li class='menu1-tab-bar-item'>" +
                    //"<i class='fa fa-caret-right'></i> &nbsp" +
                    "<div class='fl'><img src='./" + (element.path) + "' alt='' width='20px' height='20px' style='position:relative;top: 8px;left: 10px;'></div>"+
                    "<a href='#'>" + element.name + "</a>" +
                    "</li>" +
                    "</div>" +
                    "<div id='menu1-li-hide-" + (element.id) + "'class='hide models'>" +
                    "<ul></ul>" +
                    "</div>", null) ;
            })
            /**当前导航菜单下的所有的一级菜单 */
            home.menu1Clicks = $('.menu1-tab-bar');
            //console.log(home.menu1Clicks);
            //用于一级菜单保存记录，如果有点击过一级菜单，此处就有值，否则则为null
            var selectedMenu1Code = localStorage.getItem('selectedMenu1');
            //console.log(selectedMenu1Code)
            /**如果记录了用户的一级菜单，就执行下面的逻辑 */
            if(selectedMenu1Code != null && localStorage.getItem('selectedMenu3') != null){
                var selectedTabBarId = 'menu1-li-' + selectedMenu1Code;
                var selectedTabBarItem = $('#' + selectedTabBarId);  //一级菜单
                //selectedTabBarItem.find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down');
                menu1List.forEach(function(ele){
                    if(selectedMenu1Code == ele.id){
                        home.menu2s = ele.secondLevelMenus;
                    }
                })
                home.menu2s.sort(function(a, b ){
                    return a.rank - b.rank;
                })
                //console.log(home.menu2s);
                //找到hide元素
                var menu2Wrapper = selectedTabBarItem.next().children('ul');
                menu2Wrapper.empty();
                home.menu2s.forEach(function(ele){
                    menu2Wrapper.append("li id='menu2-li-"+ (ele.id) +"' class='menu2-tab-bar whiteFontMenu2'><a href='#'>"+ ele.name +"</a></li>")
                })
                $('#menu3-li-' + localStorage.getItem('selectedMenu2')).addClass('chosenMenu2');
                /**三级菜单加载完毕后，需要把后面对应的html加载进来 */
                var path = "../components/html/" + localStorage.getItem('selectedMenu2') + ".html";
                var right = $('.right');
                $right.load(path);

                home.menu2Clicks = menu2Wrapper.children('li');
                //console.log(home.menu2Clicks);
                //home.funcs.addMenuClickEvent();
            }
            /** 初始化的时候给记忆中的一级菜单添加chosenMenu2类 */
            var menu1Id = '#menu1-li-' + localStorage.getItem('selectedMenu1');
           // console.log(menu1Id)
            $(menu1Id).addClass('chosenMenu1');

            /**给所以的一级菜单追加点击事件 */
            home.funcs.addMenu1ClickEvent();

        }
        /**给一级菜单添加点击事件 */
        ,addMenu1ClickEvent : function() {
            /**先删除所有绑定的事件 */
            home.menu1Clicks.off('click').on('click', function() {
                home.funcs.clearIntervals(home.realdata_interval);
                /**点击一级菜单必须把所有的展示框移除 */
                $('.display-component-container').remove();

                /**一级菜单样式切换逻辑 点击一个关闭其他*/
                localStorage.setItem('selectedMenu1',$(this).attr('id').substr(9));
                localStorage.setItem('selectedMenu2',null);
                
                var menu1Code = localStorage.getItem('selectedMenu1');
                //console.log(menu1Code);
                var menu1Id = 'menu1-li-' + localStorage.getItem('selectedMenu1');
                if($('.chosenMenu1').attr('id') != menu1Id) {
                    $('.chosenMenu1').next().addClass('hide')
                   // $('.chosenMenu1').find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right');
                }
                $('.chosenMenu1').removeClass('chosenMenu1');
                $('#' + menu1Id ).addClass('chosenMenu1');
                 
                const _this_next = $('#' + menu1Id).next();
                _this_next.attr('class').indexOf('hide') > -1 ?
                    (function () {
                        _this_next.removeClass('hide');
                       /** $('#' + menu1Id).find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down');**/
                    })() :
                    (function () {
                        _this_next.addClass('hide')
                       /** $('#' + menu1Id).find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right')*/
                    })()
                    
                    /**获取二级菜wrapper */
                    var menu2Wrapper = _this_next.children('ul');
                    /**获取一级菜单下隐藏的二级菜单的id */
                    var menu1HideCode = _this_next.attr('id').substr(14);
                    /**获取当前一级菜单下所有的二级菜单的集合 */
                    var menu1Code = 
                    home.menu1s.forEach(function(ele) {
                        if(menu1Code == ele.id) {
                            home.menu2s = ele.secondLevelMenus;
                        }
                    })
                    home.menu2s.sort(function(a, b){
                        return a.rank - b.rank;
                    })
                    //console.log(home.menu2s);
                    /**填充三级菜单 */
                    menu2Wrapper.empty();
                    home.menu2s.forEach(function(ele){
                        //console.log(ele)
                        menu2Wrapper.append("<li id='menu2-li-" + (ele.id) +"' class='menu2-tab-bar whiteFontMenu2'><a href='#'>"+ (ele.name) +"</a></li>",null);
                    })
                    /**此处二级菜单已填充完毕 */
                    home.menu2Clicks = menu2Wrapper.children('li');

                    /**追加二级菜单点击事件 */
                    home.funcs.addMenu2ClickEvent();
            })
        }
        /**三级菜单点击事件 */
        ,addMenu2ClickEvent : function() {
            $('.layui-laypage').remove();
            home.menu2Clicks.on('click',function(){
                $('.chosenMenu2').removeClass('chosenMenu2');
                $(this).addClass('chosenMenu2');
                /**记录用户点击二级菜单的事件 */
                localStorage.setItem('selectedMenu2', $(this).attr('id').substr(9));
                /**获取展示框并且展示二级菜单对应的内容 */
                var $right = $('.right');
                var page;
                var menu2Code = localStorage.getItem('selectedMenu2');
                home.menu2s.forEach(function(ele){
                    if(menu2Code == ele.id){
                        page = ele.page;
                    }
                })
                var path = "html/" + page + ".html";
                $right.load(path);
            })
        }
        /**清除Intervals */
        ,clearIntervals : function (intervals) {
            intervals.forEach(function(e) {
                clearInterval(e);
            })
            //清空所有的intervals
            intervals.splice(0, home.realdata_interval.length)
        }
        /**退出登录事件 */
        ,handleLogout : function($exit) {
            $exit.on('click', function(){
                /**清除用户信息 */
                localStorage.clear();
                /**清除用户登录信息 */
                $.session.clear();
                /**返回登录页面 */
                window.location.href = './login.html';
                
            })
        }
        /**绑定全选事件 */
        /**
         * selectAllBox ：表示thead中的checkbox的id
         * subCheckBoxes ：表示每行的class
         * checkedBoxLen ：表示被选中的行数
         * $table ：表示表格的id
         */
        ,bindselectAll : function (selectAllBox, subCheckBoxes, checkedBoxLen, $table) {
            selectAllBox.off('change').on('change', function() {
                var status = selectAllBox.prop('checked');
                subCheckBoxes.each(function() {
                    $(this).prop('checked',status);
                })
            })
            subCheckBoxes.off('click').on('click', function() {
                var statusNow = $(this).prop('checked');
                if(statusNow == false) {
                    selectAllBox.prop('checked', false);
                } else if(statusNow === true && checkedBoxLen.length === $table.children('tbody').children('tr').length) {
                    selectAllBox.prop('checked', true);
                }
            })
        }
    }
}
