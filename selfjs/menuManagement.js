var menuManagement = {
    navigations : [],
    menu1s : [],
    menu2s : [],
    navigationsClick : [],
    menu1sClick : [],
    menu2sClick : [],
    currentoperations : [],
    init : function() {
        menuManagement.funcs.rendernavigations();
        /**给所有footer下面的链接添加点击事件 */
        menuManagement.funcs.bindAddEventListener($("footer .addBtn"));
        /**给导航菜单、一级菜单、二级菜单添加上移、下移、删除以及编辑事件 */
        menuManagement.funcs.bindCrubEvent();
    }
    ,funcs : {
        rendernavigations : function() {
            $("#navigations").empty();
            $.get(home.urls.navigations.getAll(), { } , function(result){
                menuManagement.navigations = result.data;
                menuManagement.navigations.sort(function(a, b) {
                    return a.rank - b.rank;
                })
                //console.log(menuManagement.navigations)
                var navigationsClick = [];
                menuManagement.navigations.forEach(function(e, index) {
                    if(index == 0) {
                        $("#navigations").append(
                        "<li class='item selected' id='navigations-"+ (e.id) +"'>" +
                        "<div class='fl'><a href='#' class='mainClick'>" + (e.name) + "</a></div>" + 
                        "<div class='fr' style='position: relative;top: 2px;'>&nbsp;&nbsp;<a href='#' class='shift-up' id='navigation-up-" + (e.id) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;" + 
                        "<a href='#' class='shift-down' id='navigation-down-" + (e.id) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;" + 
                        "<a href='#' class='editBtn' id='navigation-edit-" + (e.id) + "'><i class='fa fa-edit'></i></a></div>"+
                        "</li>"
                    )}
                    else {
                        $("#navigations").append(
                            "<li class='item' id='navigations-"+ (e.id) +"'>" +
                            "<div class='fl'><a href='#' class='mainClick'>" + (e.name) + "</a></div>" + 
                            "<div class='fr' style='position: relative;top: 2px;'>&nbsp;&nbsp;<a href='#' class='shift-up' id='navigation-up-" + (e.id) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;" + 
                            "<a href='#' class='shift-down' id='navigation-down-" + (e.id) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;" + 
                            "<a href='#' class='editBtn' id='navigation-edit-" + (e.id) + "'><i class='fa fa-edit'></i></a></div>"+
                            "</li>"
                        )
                    }
                })
                 /**默认选中导航菜单中的基础信息 */
                 menuManagement.funcs.renderMenu1(1);
                /**为导航菜单添加点击事件 */
                menuManagement.funcs.bindClickForNavigations($("#navigations .item .mainClick"));          
        })
      }
      /**为导航菜单绑定点击事件 */
      ,bindClickForNavigations : function(items) {
        items.off('click').on('click', function() {
            /**点击所有的一级菜单的时候都必须将二级菜单关掉 */
            $("#operations").empty();
            $("#secondMenu").empty();
            $(".selected").removeClass("selected");
            $(this).parent("div").parent("li").addClass("selected");
            var navigationClickId = $(".selected").attr("id").substr(12);
            menuManagement.renderMenu1(navigationClickId);
        })
       }
      /**渲染一级菜单 */
      ,renderMenu1 : function(id) {
          $.get(home.urls.navigations.getFirstLevelMenusById() , { id : navigationClickId } , function(result) {
                var currentMenu1s = result.data;
                /**清空一级菜单的container */
                $("#firstMenu").empty();
                currentMenu1s.forEach(function(ele) {
                    $("#firstMenu").append("<li class='item' id='menu1-" + (ele.id) + "'><div class='fl'><a href='#' class='mainClick'>" + (ele.name) + "</a></div>" +
                        "<div class='fr' style='position: relative;top: 2px;'>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu1-up-" + (ele.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;" +
                        "<a href='#' class='shift-down' id='menu1-down-" + (ele.id) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-" + (ele.id) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;" +
                        "<a href='#' class='deleteBtn' id='menu1-del-" + (ele.id) + "'><i class='fa fa-trash-o'></i></a></div></li>")
                })
                /**给容器中一级菜单添加点击事件 */
                menuManagement.funcs.bindClickFormenu1s($("#firstMenu .item .mainClick"));
             })
      } 
      /**绑定一级菜单点击事件 */
      ,bindClickFormenu1s : function(items) {
        items.off('click').on('click', function() {
            $(".selected-menu1").removeClass("selected-menu1");
            $(this).parent("div").parent("li").addClass("selected-menu1");
            var currentMenu1ClickId = $(this).parent("div").parent("li").attr("id").substr(6);
            console.log(currentMenu1ClickId)
            menuManagement.funcs.renderMenu2(currentMenu1ClickId);
       })
    }
      /**渲染二级菜单*/
     ,renderMenu2 : function(id){
        $("#operations").empty();
        $.get(home.urls.navigations.getFirstLevelMenusById() , { id : navigationClickId } , function(result) {
            var currentMenu2s = result.data;
            /**清空一级菜单的container */
            $("#secondMenu").empty();
            currentMenu2s.sort(function(a, b) {
                return a.rank - b.rank ;
            })
            currentMenu2s.forEach(function(e) {
                $("#secondMenu").append(
                    "<li class='item' id='menu2-" + (e.id) + "'><div class='fl'><a href='#' class='mainClick'>" + (e.name) + "</a></div>" +
                    "<div class='fr' style='position: relative;top: 2px;'>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu3-up-" + (e.id) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;" +
                    "<a href='#' class='shift-down' id='menu2-down-" + (e.id) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;" +
                    "<a href='#' class='editBtn' id='menu2-edit-" + (e.id) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu2-del-" + (e.id) + "'><i class='fa fa-trash-o'></i></a></div></li>")
            })
            /**给二级菜单绑定点击事件 */
            menuManagement.funcs.bindClickFormenu2s($("#secondMenu .item .mainClick"));
          })
        } 
      ,bindClickFormenu2s : function(items) {
          items.off('click').on('click', function() {
              $(".selected-menu2").removeClass("selected-menu2");
              $(this).parent("div").parent("li").addClass("selected-menu2");
              var currentMenu2ClickId = $(this).parent("div").parent("li").attr('id').substr(6);
              menuManagement.funcs.renderCurrentOperations(currentMenu2ClickId);
          })
      }
      /**获取当前二级菜单的操作权限 */
      ,renderCurrentOperations : function(currentMenu2ClickId) {
          $("#operations").empty();
          $.get(home.urls.menu2.getOperationsById(), { id : currentMenu2ClickId }, function(result) {
              var operation = result.data;
              menuManagement.currentoperations = operation;
              operation.forEach(function(e) {
                  $("#operations").append("<li class='item' style='color: #2c2e35;' id='operation-" + (e.id) + "'>" + e.name + "</li>")
              })
          })
      }
      
      ,bindAddEventListener : function(addBtn) {
          addBtn.off('click').on('click', function() {
              /**弹出询问框 */
              if($(this).attr('id').substr(4) == 1 && !$('.selected')[0]) {
                  layer.msg("您还没选择导航菜单，请先选择导航菜单项", {
                      offset : ['45%', '47%'],
                      time : 900
                  })
                  return 
              }
              if($(this).attr('id').substr(4) == 2 && !$('.selected-menu1')[0]) {
                  layer.msg("您还没选择一级菜单，请先选择一级菜单项", {
                      offset : ['45%', '47%'],
                      time : 900
                  })
                  return
              }
              if($(this).attr('id') == 'operation-manage' && !$('.selected-menu2')[0]) {
                layer.msg("您还没选择二级菜单，请先选择二级菜单项", {
                    offset : ['45%', '47%'],
                    time : 900
                })
                return
            }

            var content
            var urls
            if($(this).attr('id').substr(4) == 1) {
                content = ("<div id='addModal class='hideModal'>" + 
                "<p><span>菜单名称:</span><input type='text' placeholder='请输入一级菜单名称' id=‘menuName'></p>" +
                "</div>")
            }
            else if($(this).attr('id').substr(4) == 2) {
                content = ("<div id='addModal class='hideModal'>" + 
                "<p><span菜单名称:</span><input type='text' placeholder='请输入二级菜单名称' id=‘menuName'></p>" +
                "</div>")
            }
            else {
                content = ("<div id='addModal'>" +
                "<table id='operationTable'>" +
                "<thead>" +
                "<tr><td><input type='checkbox' id='operationBoxAll' /><td>序号</td><td>操作名称</td></td></tr>" +
                "</thead>" +
                "</table>" +
                "</div>")
            }
            if($(this).attr('id') != 'operation_manage'){
                layer.open({
                    type : 1,
                    title : '添加',
                    content : content,
                    area : ['180px', '150px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    closeBtn : 0,
                    yes : function(index) {
                        var menuName = $("#menuName").val();
                        if(menuName === ''){
                            layer.msg("新增菜单名称为空！");
                            return 
                        }
                        /**请求添加元素的接口地址 */
                        var addUrl;
                        /**请求添加所要传输的数据 */
                        var addData;
                        switch($(this).attr('id').substr(4)) {
                            case '1' :
                                (function () {
                                    addUrl = home.urls.menu1.add();
                                    addData = {
                                        name : menuName,
                                        'navigation.id' : $('#navigations').children('.selected').attr('id').substr(12)
                                    }
                                });
                                break;
                             case '2' :
                                (function () {
                                    addUrl = home.urls.menu2.add();
                                    addData = {
                                        name : menuName,
                                        'navigation.id' : $('#navigations').children('.selected').attr('id').substr(12),
                                        'firstLevelMenu.id' : $('#firstMenu').children('.selected-menu1').attr('id').substr(6)
                                    }
                                });
                                break;
                        }
                        console.log(addUrl)
                        console.log(addData)
                        $.post(addUrl, addData, function(result) {
                            layer.msg(result.message,{
                                offset : ['40%' ,'55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    if($(this).attr('id').substr(4) === 1) {
                                        menuManagement.renderMenu1($('#navigations').children('.selected').attr('id').substr(12));
                                    }
                                    if($(this).attr('id').substr(4) === 2) {
                                        menuManagement.renderMenu1($('#firstMenu').children('.selected-menu1').attr('id').substr(6));
                                    }
                                    clearTimeout(time);
                                },500)
                            }
                        })
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
            })
            }
            else {
                $tbody = $("#operationTable").children('tbody');
                menuManagement.renderAllOperation($tbody);
                layer.open({
                    type : 1,
                    title : '选择操作',
                    content : content,
                    area : ['600px', '300px'],
                    btn : ['确认', '取消'],
                    offset : ['35%', '35%'],
                    closeBtn : 0,
                    yes : function(index) {
                        var addData; 
                        //获取当前被选中的二级菜单的id
                        var secondLevelMenuId = $(".selected-menu2").parent("div").parent("li").attr('id').substr(6);
                        $(".operationBox").each(function(e) {
                            if($(this).prop("checked")) {
                                addData.push({
                                    secondLevelMenuId : secondLevelMenuId,
                                    operationId : $(this).val()
                                })
                            }
                        })
                        /**更新二级菜单的操作权限 */
                        //$.post(home.urls.menu2.updateOperations(), {})
                        $.ajax({
                            urls : home.urls.menu2.updateOperationsBy(),
                            contentType : 'application/json',
                            data : JSON.stringify(addData) ,
                            dataType : 'json',
                            type : 'post',
                            success : function(result) {
                                if(result.code === 0) {
                                    var currentMenu2ClickId = $(".selected-menu2").parent("div").parent("li").attr('id').substr(6);
                                    menuManagement.funcs.renderCurrentOperations(currentMenu2ClickId);
                                }
                                layer.msg(result.message , {
                                    offset : ['40%', '55%'],
                                    time : 700
                                })
                            }
                        })
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        layer.close(index);
                    }
                })
            }
          })
      }
      ,renderAllOperation : function($tbody) {
          $tbody.empty();
          $.post(servers.backup + 'operation/getAll' , {} ,function(result) {
              var operation = result.data;
              operation.forEach(function(e) {
                  var contains = menuManagement.currentoperations.find(function (ele) {
                      return ele.id == e.id;
                  })
                  if(contains) {
                      $tbody.append(
                          "<tr><td><input type='checkbox' class='operationBox' value="+ (e.id) +" checked /></td>" +
                          "<td>"+ (e.id) +"</td><td>"+ (e.name) +"</td>" +
                          "</tr>"
                          )
                  }
                  else {
                      $tbody.append(
                          "<tr><td><input type='checkbox' class='operationBox' value="+ (e.id) +" /></td>" +
                          "<td>"+ (e.id) +"</td><td>"+ (e.name) +"</td>" +
                          "</tr>"
                          )
                  }
              })
              /** 如果说包含了所有的operations那么必须要把checkAll点亮 */
            $("#operationBoxAll").prop('checked', false)
            var $operationsItems = $tbody.children("tr")
            var pageSize = $operationsItems.length
            if ($('.operationBox:checked').length === pageSize) {
                $("#operations_checkAll").prop('checked', true)
            }
            /**实现新增操作全选 */
            var checkedLen = $(".operationBox : checked").length;
            home.funcs.bindselectAll($("#operationBoxAll"),$(".operationBox"),checkedLen,$("#operationTable"));
          }) 
      }
      
      
     
      ,bindCrubEvent: function () {
        /** 给1 2级菜单删除按钮绑定事件 */
        menuManagement.funcs.bindDeleteEventListener($('.deleteBtn'))
        /** 给1 2级编辑按钮绑定事件 */
        menuManagement.funcs.bindEditEventListener($('.editBtn'))
        /** 给1 2级shift上按钮绑定事件 */
        menuManagement.funcs.bindShiftUpListener($('.shift-up'))
        /** 给1 2级shift下按钮绑定事件 */
        menuManagement.funcs.bindShiftDownListener($('.shift-down'))
     }
     ,bindDeleteEventListener : function(buttons) {
         button.off('click').on('click', function() {

         })
     }
     /**编辑事件 */
     ,bindEditEventListener : function(buttons) {
        button.off('click').on('click', function() {
            var _this = $(this);
            var id , detailUrl , container,content,flag,updateUrl;
            switch (_this.attr('id').charAt(4)) {
                case '1' :
                    (function () {
                        detailUrl = home.urls.menu1.getById();
                        updateUrl = home.urls.menu1.update();
                        content = $("#EditMenus");
                        container = $("#firstMenu");
                        id = _this.attr('id').substr(11);
                        flag = 1;
                    })();
                    break;
                case '2' :
                    (function () {
                        detailUrl = home.urls.menu2.getById();
                        updateUrl = home.urls.menu2.update();
                        content = $("#EditMenus");
                        container = $("#secondMenu");
                        id = _this.attr('id').substr(11);
                        flag = 2;
                    })();
                    break;
                default : {
                    (function () {
                        detailUrl = home.urls.navigations.getById();
                        updateUrl = home.urls.navigations.update();
                        content = $("#EditNavigations");
                        container = $("#navigations");
                        id = _this.attr('id').substr(16);
                        flag = 0;
                    })();
                    break;
                }
            }
            /**更新之前先查询并填充表单元素 */
            $.get(detailUrl, { id : id }, function(result) {
                var menu = result.data;
                var area;
                if(flag === 0) {
                    $("#navigationNames").val(menu.name);
                    $("#path").val(menu.path);
                    area = ['330px' ,'180px'];
                }
                else {
                    $("#menuNames").val(menu.name);
                    area = ['330px' ,'150px'];
                }  
                layer.open({
                    title : '编辑',
                    type : 1,
                    content : content,
                    area : area,
                    btn : ['确定', '取消'],
                    offset : ['40%', '45%'],
                    yes : function(index) {
                        var updateData;
                        if(flag === 0) {
                            updateData = {
                                id : id,
                                name : $("#navigationNames").val(),
                                path : $("#path").val()
                            }
                        }
                        else {
                            updateData = {
                                id : id,
                                name : $("#menuNames").val()
                            }
                        }
                        /**更新菜单 */
                        $.post(updateUrl, updateData, function(result) {
                            layer.msg(result.message, {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    /**如果成功了,要更新相应的菜单外壳，先清空。然后append */
                                    var list = container.children("#" + _this.parent('li').attr('id'));
                                    list.children('.mainClick').text(updateData.name)
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index);
                    }
                    ,btn2: function (index) {
                        layer.close(index)
                    }
                })          
            })
        })
    }
  }
}