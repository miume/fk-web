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
            menuManagement.funcs.renderMenu1(navigationClickId);
        })
       }
      /**渲染一级菜单 */
      ,renderMenu1 : function(id) {
          $.get(home.urls.navigations.getFirstLevelMenusById() , { id : id } , function(result) {
                var currentMenu1s = result.data;
                /**清空一级菜单的container */
                $("#firstMenu").empty();
                currentMenu1s.forEach(function(ele) {
                    $("#firstMenu").append("<li class='item' id='menu1-" + (ele.id) + "'><div class='fl'><a href='#' class='mainClick'>" + (ele.name) + "</a></div>" +
                        "<div class='fr' style='position: relative;top: 2px;'>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu1-up-" + (ele.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;" +
                        "<a href='#' class='shift-down' id='menu1-down-" + (ele.id) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-" + (ele.id) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;" +
                        "<a href='#' class='deleteBtn' id='menu1-del-" + (ele.id) + "'><i class='fa fa-trash-o'></i></a></div></li>")
                })
                /**给导航菜单、一级菜单、二级菜单添加上移、下移、删除以及编辑事件 */
                menuManagement.funcs.bindCrubEvent();  
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
        $.get(home.urls.menu1.getSecondLevelMenusById() , { id : id } , function(result) {
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
            /**给导航菜单、一级菜单、二级菜单添加上移、下移、删除以及编辑事件 */
            menuManagement.funcs.bindCrubEvent();  
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
              var clickId = $(this).attr('id').substr(4);
              var _this = $(this);
              if(clickId == 1 && !$('.selected')[0]) {
                  layer.msg("您还没选择导航菜单，请先选择导航菜单项", {
                      offset : ['45%', '47%'],
                      time : 900
                  })
                  return 
              }
              if(clickId == 2 && !$('.selected-menu1')[0]) {
                  layer.msg("您还没选择一级菜单，请先选择一级菜单项", {
                      offset : ['45%', '47%'],
                      time : 900
                  })
                  return
              }
              if(_this.attr('id') == 'operation-manage' && !$('.selected-menu2')[0]) {
                layer.msg("您还没选择二级菜单，请先选择二级菜单项", {
                    offset : ['45%', '47%'],
                    time : 900
                })
                return
            }
            if(_this.attr('id') != 'operation-manage'){
                $("#menuNames").val('');
                $("#EditMenus").removeClass('hide');
                layer.open({
                    type : 1,
                    title : '添加',
                    content : $("#EditMenus"),
                    area : ['280px', '180px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    closeBtn : 0,
                    yes : function(index) {
                        var menuName = $("#menuNames").val();
                        if(menuName === ''){
                            layer.msg("新增菜单名称为空！");
                            return 
                        }
                        /**请求添加元素的接口地址 */
                        var addUrl;
                        /**请求添加所要传输的数据 */
                        var addData;
                        if(clickId == 1) {
                            addUrl = home.urls.menu1.add();
                            addData = {
                                name : menuName,
                                'navigation.id' : $('#navigations').children('.selected').attr('id').substr(12)
                            }  
                        }      
                        if(clickId == 2) {
                            addUrl = home.urls.menu2.add();
                            addData = {
                                name : menuName,
                                'navigation.id' : $('#navigations').children('.selected').attr('id').substr(12),
                                'firstLevelMenu.id' : $('#firstMenu').children('.selected-menu1').attr('id').substr(6)
                            }       
                        }
                        console.log(addUrl)
                        console.log(addData)
                        $.post(addUrl, addData, function(result) {
                            console.log('result.code='+result.code)
                            if(result.code === 0) {
                                var time = setTimeout(function() {
                                    if(clickId == 1) {
                                        var clickNavigationId = $('#navigations').children('.selected').attr('id').substr(12);
                                        console.log(clickNavigationId)
                                        menuManagement.funcs.renderMenu1(clickNavigationId);
                                    }
                                    if(clickId == 2) {
                                        var clickMenu1Id = $('#firstMenu').children('.selected-menu1').attr('id').substr(6);
                                        console.log(clickMenu1Id)
                                        menuManagement.funcs.renderMenu2(clickMenu1Id);
                                    }
                                    clearTimeout(time);
                                },500)
                            }
                            layer.msg(result.message,{
                                offset : ['40%' ,'55%'],
                                time : 700
                            })
                            
                        })
                        $("#EditMenus").addClass('hide');
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#EditMenus").addClass('hide');
                        layer.close(index);
                    }
            })
            }
            else {
                $tbody = $("#operationTable").children('tbody');
                menuManagement.funcs.renderAllOperation($tbody);
                $("#operationModal").removeClass('hide');
                layer.open({
                    type : 1,
                    title : '选择操作',
                    content : $("#operationModal"),
                    area : ['570px', '450px'],
                    btn : ['确认', '取消'],
                    offset : ['35%', '35%'],
                    closeBtn : 0,
                    yes : function(index) {
                        var operationIds = []; 
                        //获取当前被选中的二级菜单的id
                        var secondLevelMenuId = $(".selected-menu2").attr('id').substr(6);
                        $(".operationBox").each(function(e) {
                            if($(this).prop("checked")) {
                                operationIds.push($(this).val())
                            }
                        })
                        /**更新二级菜单的操作权限 */
                        $.get(home.urls.menu2.assignOperations(), {
                            menuId : secondLevelMenuId,
                            operationIds : operationIds.toString()
                        },function(result) {
                            if(result.code === 0) {
                                menuManagement.funcs.renderCurrentOperations(secondLevelMenuId);
                            }
                            layer.msg(result.message , {
                                offset : ['40%', '55%'],
                                time : 700
                            })
                        })
                        $("#operationModal").addClass('hide');
                        layer.close(index);
                    }
                    ,btn2 : function(index) {
                        $("#operationModal").addClass('hide');
                        layer.close(index);
                    }
                })
            }
          })
      }
      ,renderAllOperation : function($tbody) {
          $tbody.empty();
          $.get(servers.backup() + 'operation/getAll' , {} ,function(result) {
              var operation = result.data;
              console.log(operation)
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
            var checkedLen = $('.operationBox:checked').length;
            home.funcs.bindselectAll($("#operationBoxAll"),$(".operationBox"),checkedLen,$("#operationTable"));
          }) 
      }
      
      
     
      ,bindCrubEvent: function () {
          menuManagement.funcs.bindDeleteEventListener($(".deleteBtn"));
          menuManagement.funcs.bindEditEventListener($(".editBtn"));
          menuManagement.funcs.bindShiftUpListener($(".shift-down"));
          menuManagement.funcs.bindShiftDownListener($(".shift-up"));
     }
     ,bindDeleteEventListener : function(buttons) {
         buttons.off('click').on('click', function() {
            console.log('delete')
            var _this = $(this);
            var deleteUrl;
            var deleteMenu = _this.attr('id').charAt(4);
            var clickId = _this.attr('id').substr(10)
            console.log('clickId' +clickId)
            console.log("menu"+deleteMenu)
            if(deleteMenu == 1){
                deleteUrl = home.urls.menu1.deleteById();
            }
            if(deleteMenu == 2){
                deleteUrl = home.urls.menu2.deleteById();
            }
            layer.open({
                type : 1,
                title : '删除',
                content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                area: ['180px', '130px'],
                btn: ['确认', '取消'],
                offset: ['40%', '55%'],
                closeBtn : 0,
                yes : function(index) {
                    $.post(deleteUrl,{ _method:"delete",id : clickId },function(result) {
                        if (result.code != 0) {
                            layer.msg('当前' + _this.attr('id').charAt(4) + '级菜单下还存在子菜单,您必须删除其下的所有子菜单后才能删除该菜单！', {
                                offset: ['45%', '48%'],
                                time: 1200
                            })
                        }
                        /**如果删除二级菜单成功 */
                        console.log(deleteUrl.indexOf('menu2'))
                        if(result.code === 0 && deleteMenu == 2) {
                            var time = setTimeout(function () {
                                var clickMenu1Id = $('#firstMenu').children('.selected-menu1').attr("id").substr(6);
                                menuManagement.funcs.renderMenu2(clickMenu1Id);
                                clearTimeout(time)
                            }, 500)   
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })  
                        }
                        /**如果删除一级菜单成功 */
                        if(result.code === 0 && deleteMenu == 1) {
                            var time = setTimeout(function () {
                                var clickNavigationId = $('#navigations').children('.selected').attr("id").substr(12);
                                menuManagement.funcs.renderMenu1(clickNavigationId);
                                clearTimeout(time)
                            }, 500)  
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })  
                        }
                        
                   })
                   layer.close(index)
               },
               btn2: function (index) {
                layer.close(index)
            }
       })
     })
     }
     /**编辑事件 */
     ,bindEditEventListener : function(buttons) {
        buttons.off('click').on('click', function() {
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
                    area = ['330px' ,'160px'];
                }
                else {
                    $("#menuNames").val(menu.name);
                    area = ['330px' ,'160px'];
                }  
                content.removeClass("hide");
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
                        content.addClass("hide");
                        layer.close(index);
                    }
                    ,btn2: function (index) {
                        content.addClass("hide");
                        layer.close(index)
                    }
                })          
            })
        })
    }
    /**上移事件 */
    ,bindShiftUpListener : function(buttons) {
        buttons.off('click').on('click', function() {
            console.log('shift-up')
        })
    }
    /**下移事件 */
    ,bindShiftDownListener : function(buttons) {
        buttons.off('click').on('click', function() {
            console.log('shift-down')
        })
    }
  }
}