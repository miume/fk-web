var home = {
  urls: {
      
  }
 
  /** start */
  , menu3Clicks: null  //所有的一级菜单点击栏
  , menu2Clicks: null  //所有的二级菜单点击栏
  , menu1Clicks: null  //所有的三级菜单点击栏
  , menu3s: []
  , menu2s: []
  , menu1s: []
  , menu1Wrapper: null
  , menu2Wrapper: null
  , monitor_data: null
  , realdata_interval: []
  , singlePage_interval: []
  , user: null
  , operations: []
  /** end */
  /**
   *  初始化函数
   * @param userJson  session中存储的用户信息
   * @param menu1Wrapper 用来包装一级菜单的块
   * @param menu2Wrapper 用来包装二级菜单的块
   * @hides 代表所有三级菜单点击后显示的内容的id
   */
  , init: function (userJson, menu1Wrapper, menu2Wrapper) {
      /** 头像显示事件绑定 */
      // home.funcs.bindClickEventForAvatar($('#user-info-hover'), $("#hover-body"))
      home.menu1Wrapper = menu1Wrapper
      home.menu2Wrapper = menu2Wrapper

      /** 获取session用户信息 */
      const user = userJson
      home.user = userJson
      var roles = user.roles //获取用户角色
      //console.log(roles)
      $("#currentUser").text(home.user.name + " ")
      $('#user-id').text(user.code)

      var menu1codes = []//用户一级菜单去重
      var menu2codes = []//用于二级菜单去重

      /** 遍历用户的角色,从何获取一二三级菜单,填充home.menu1s,home.menu2s,home.menu3s */
      roles.forEach(function (element) {//遍历所有roles
          /**遍历用户的三级菜单*/
          element.models.forEach(function (ele) {
              home.menu3s.push(ele)
              var menu1code = ele.menu1.code
              var menu2code = ele.menu2.code
              /**去重menu1*/
              if (menu1codes.indexOf(menu1code) == -1) {
                  menu1codes.push(menu1code)
                  home.menu1s.push(ele.menu1)
              }
              /**去重menu2*/
              if (menu2codes.indexOf(menu2code) == -1) {
                  menu2codes.push(menu2code)
                  home.menu2s.push(ele.menu2)
              }
          })
      })
      /** $$$ 此处已经获取到用户的所有的一级菜单，二级菜单，三级菜单,分别存储在数组munu1s, menu2s, models中,无重复 $$$*/
      /** 给一级菜单进行排序,通过一级菜单的rank进行排序 */
      home.menu1s.sort(function (a, b) {
          return a.rank - b.rank
      })

      /** 遍历一级菜单,然后给一级菜单的容器填充一级菜单,并且给selected菜单添加样式 */
      home.menu1s.forEach(function (element, index) {
          var path = element.path
          if (path.indexOf('10') > -1)
              home.menu1Wrapper.append("<li id='menu1-li-" + (element.code) + "'class='menu1-tab-bar'><div class='fl'><img src='../" + (path) + "' alt='' width='25px' height='25px' style='position:relative;top: -2px;left: 10px;'></div><a href='#'>" + home.menu1s[index].name + "</a></li>", null)
          else {
              home.menu1Wrapper.append("<li id='menu1-li-" + (element.code) + "'class='menu1-tab-bar'><div class='fl'><img src='../" + (path) + "' alt='' width='20px' height='20px' style='position:relative;top: -2px;left: 10px;'></div><a href='#'>" + home.menu1s[index].name + "</a></li>", null)
          }
      })
      /** ########这里是记录123级菜单的关键,########*/
      /** ########这里是记录123级菜单的关键,########*/
      /** ########这里是记录123级菜单的关键,########*/
      /** ########这里是记录123级菜单的关键,########*/

      //
      var selectedMenu1 = localStorage.getItem('selectedMenu1') || $(home.menu1Wrapper.children('li')[0]).attr('id').substr(9)   //选中的一级菜单ID 默认为1
      var selectedMenu2 = localStorage.getItem('selectedMenu2') || null //选中的二级菜单ID
      var selectedMenu3 = localStorage.getItem('selectedMenu3') || null  //选中三级菜单ID
      /** ########这里是记录123级菜单的关键,########*/
      /** ########这里是记录123级菜单的关键,########*/
      /** ########这里是记录123级菜单的关键,########*/
      /** ########这里是记录123级菜单的关键,########*/

      /** 给选中的一级菜单追加默认selected类标签,也就是默认样式 */
      $('#menu1-li-' + selectedMenu1).addClass('li-selected')
      home.menu1Clicks = home.menu1Wrapper.children('.menu1-tab-bar')
      /** 绑定一级菜单点击事件 */
      home.funcs.bindClickAndMouseEventForMenu1s()
      /** 给selected状态的一级菜单设置默认状态,包括填充2级菜单、给其所有的二级菜单追加三级菜单和绑定事件*/
      var selectedMenu1Code = $('.li-selected').attr('id').substr(9)
      /**获取selected状态的一级菜单的二级菜单*/
      var menu2ToSelected = home.funcs.getMenu2ListByMenu1Code(selectedMenu1Code)
      /** 填充二级菜单并且携带3级菜单 */
      console.log(menu2ToSelected)
      home.funcs.appendMenu2sToWrapperAndCarryModels(menu2ToSelected)

      var personal_center = $('#personal_center')
      home.funcs.personalCenter(personal_center)
      /** 绑定退出登录时间 */
      var $exit = $('#exit')
      home.funcs.handleLogout($exit)

  }//$init()
  , funcs: {
      /** 给一级菜单绑定点击事件 */
      bindClickAndMouseEventForMenu1s: function () {
          home.menu1Clicks.on('mouseenter', function () {
              $(this).addClass('blue')
          }).on('mouseleave', function () {
              $(this).removeClass('blue')
          }).on('click', function () {
              /** 首先清除interval */
              home.funcs.clearIntervals(home.realdata_interval)
              /** 点击二级菜单必须要把所有的展示框移除 */
              $('.display-component-container').remove()

              /** 记住当前一级菜单 */
              localStorage.setItem('selectedMenu1', $(this).attr('id').substr(9))
              localStorage.setItem('selectedMenu2', null)
              localStorage.setItem('selectedMenu3', null)

              /** 首先将上一次selected的标签移除样式,然后给当前点击元素追加样式 */
              $('.menus1 .li-selected').removeClass('li-selected')
              $('#menu1-li-' + localStorage.getItem('selectedMenu1')).addClass('li-selected')

              /** 通过一级菜单的code获取二级菜单 */
              const menu1code = localStorage.getItem('selectedMenu1')
              var menu2ToSelf = home.funcs.getMenu2ListByMenu1Code(menu1code)

              /** 将二级菜单填充到框内并且给2级菜单都绑定弹出3级菜单的事件 */
              home.funcs.appendMenu2sToWrapperAndCarryModels(menu2ToSelf)
          })//$().on
      },

      /** 通过一级菜单的code获取其下的所有二级菜单 */
      getMenu2ListByMenu1Code: function (selectedMenu1Code) {
          var menu2ToMenu1 = home.menu2s.filter(function (ele) {
              return ele.menu1.code == selectedMenu1Code
          })
          menu2ToMenu1.sort(function (a, b) {
              return a.rank - b.rank
          }) //一级菜单排序
          return menu2ToMenu1
      }

      /** 将二级菜单填充到二级菜单的容器 */
      , appendMenu2sToWrapperAndCarryModels: function (Menu2List) {
          /** 首先清空menu2wrapper的内容 */
          home.menu2Wrapper.empty()
          /** 开始填充2级菜单 */
          Menu2List.forEach(function (element, index) {
              home.menu2Wrapper.append(
                  "<div id='menu2-li-" + (element.code) + "' class='menu2-tab-bar'>" +
                  "<li class='menu2-tab-bar-item'>" +
                  "<i class='fa fa-caret-right'></i> &nbsp" +
                  "<a href='#'>" + Menu2List[index].name + "</a>" +
                  "</li>" +
                  "</div>" +
                  "<div id='menu2-li-hide-" + (element.code) + "'class='hide models'>" +
                  "<ul></ul>" +
                  "</div>", null)
          })
          /** 当前一级菜单下的所有的2级菜单 */
          home.menu2Clicks = $('.menu2-tab-bar')
          var selectedMenu2Code = localStorage.getItem('selectedMenu2')//用的二级菜单保存记录,如果有点击过2级菜单,此处就有值,否则为null
          /** 如果记录了用户的二级菜单,执行下面的逻辑 */
          if (selectedMenu2Code != null && localStorage.getItem('selectedMenu3') != 'null') {
              var selectedTabBarId = 'menu2-li-' + selectedMenu2Code
              var selectedTabBarItem = $('#' + selectedTabBarId) //二级菜单
              selectedTabBarItem.next().removeClass('hide')//三级菜单显示
              selectedTabBarItem.find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down')//todo
              var Menu3List = home.menu3s.filter(function (ele) {
                  return ele.menu2.code == selectedMenu2Code
              })
              Menu3List.sort(function (a, b) {
                  return a.rank - b.rank
              })

              var modelWrapper = selectedTabBarItem.next().children('ul')
              modelWrapper.empty()
              Menu3List.forEach(function (element, index) {
                  modelWrapper.append("<li id='menu3-li-" + (element.code) + "' class='menu3-tab-bar whiteFontMenu3'><a href='#'>" + Menu3List[index].name + "</a></li>", null)
              })
              $('#menu3-li-' + localStorage.getItem('selectedMenu3')).addClass('chosenMenu3')
              /** 三级菜单都添加完毕,需要把后面html加载进来*/
              var path = "../components/html/" + localStorage.getItem('selectedMenu3') + ".html"
              var $right = $('.right')
              /** 加载页面,之后也要显示实时数据 */
              $right.load(path)
              /** 页面上刷新时实时数据显示 */
              /** -------------------------------------------------------------------------------------*/
              /** -------------------------------------------------------------------------------------*/
              /** -------------------------------------------------------------------------------------*/
              /** -------------------------------------------------------------------------------------*/
              /** -------------------------------------------------------------------------------------*/
              /** -------------------------------------------------------------------------------------*/

             

              /**如果记忆中的二级菜单是在线监视,那么就开始显示实时数据*/
              home.menu3Clicks = modelWrapper.children('li')
              home.funcs.addModelClickEvent()
          }

          /** 初始化的时候给记忆中的二级菜单添加chosenMenu2类 */
          var menu2Id = '#menu2-li-' + localStorage.getItem('selectedMenu2')
          $(menu2Id).addClass('chosenMenu2')

          /** 给所有的二级菜单追加点击事件 */
          home.funcs.addMenu2ClickEvent()
         
      }
      /** 给2级菜单添加点击事件 */
      , addMenu2ClickEvent: function () {
          /** 先删除所有绑定的事件 */
          home.menu2Clicks.off('click')
          home.menu2Clicks.on('click', function () {
              home.funcs.clearIntervals(home.realdata_interval)
              /** 点击二级菜单必须要把所有的展示框移除 */
              $('.display-component-container').remove()

              /** 以下是2级菜单样式切换逻辑 点击一个关闭其他*/
              localStorage.setItem('selectedMenu2', $(this).attr('id').substr(9))
              localStorage.setItem('selectedMenu3', null)


              var menu2Id = 'menu2-li-' + localStorage.getItem('selectedMenu2')

              if ($('.chosenMenu2').attr('id') !== menu2Id) {
                  $('.chosenMenu2').next().addClass('hide')
                  $('.chosenMenu2').find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right')
              }
              $('.chosenMenu2').removeClass('chosenMenu2')
              $('#' + menu2Id).addClass('chosenMenu2')
              const _this_next = $('#' + menu2Id).next()
              _this_next.attr('class').indexOf('hide') > -1 ?
                  (function () {
                      _this_next.removeClass('hide')
                      $('#' + menu2Id).find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down')
                  })() :
                  (function () {
                      _this_next.addClass('hide')
                      $('#' + menu2Id).find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right')
                  })()


              /** 获取3级菜单wrapper */
              var modelWrapper = _this_next.children('ul')
              /** 二级菜单隐藏的三级菜单的id */
              var menu2HideCode = _this_next.attr('id').substr(14)
              /** 当前二级菜单下所有三级菜单的集合 */
              var Menu3List = home.menu3s.filter(function (ele) {
                  return ele.menu2.code == menu2HideCode
              })
              Menu3List.sort(function (a, b) {
                  return a.rank - b.rank
              })
              /** 填充三级菜单 */
              modelWrapper.empty()
              Menu3List.forEach(function (element, index) {
                  modelWrapper.append("<li id='menu3-li-" + (element.code) + "'  class='menu3-tab-bar whiteFontMenu3'><a href='#'>" + Menu3List[index].name + "</a></li>", null)
              })
              /** $$ 此处3级菜单已经填充完毕 */
              home.menu3Clicks = modelWrapper.children('li')

              /** 追加三级菜单点击事件 */
              home.funcs.addModelClickEvent()
          })
      }

      /** 三级菜单点击事件 */
      , addModelClickEvent: function () {
          $('.layui-laypage').remove()
          home.menu3Clicks.off('click')
          /** 首先加载展示层页面 */
          home.menu3Clicks.on('click', function () {
              $('.chosenMenu3').removeClass('chosenMenu3')
              $(this).addClass('chosenMenu3')
              /** 记录用户点击3级菜单的事件 */
              localStorage.setItem('selectedMenu3', $(this).attr('id').substr(9))
              /** 获取展示框并且展示3级菜单对应的内容 */
              var $right = $('.right')
              var index = localStorage.getItem('selectedMenu3')
              var path = "../components/html/" + index + ".html"
              $right.load(path)
          })
          /** -------------------------------------------------------------------------------------*/
          /** -------------------------------------------------------------------------------------*/
          /** -------------------------------------------------------------------------------------*/
          /** -------------------------------------------------------------------------------------*/
          /** -------------------------------------------------------------------------------------*/
          /** -------------------------------------------------------------------------------------*/

      }
     
     
  
      /** 清除intervals */
      , clearIntervals: function (intervals) {
          intervals.forEach(function (e) {
              clearInterval(e)
          })
          intervals.splice(0, home.realdata_interval.length) //清空所有的interval
      }
      /** $$$ok,监视模块代码到此位置, 继续往下 $$$*/
      /** -------------------------------------------------------------------------------------*/
      /** -------------------------------------------------------------------------------------*/
      /** -------------------------------------------------------------------------------------*/
      /** -------------------------------------------------------------------------------------*/
      /** -------------------------------------------------------------------------------------*/
      /** -------------------------------------------------------------------------------------*/

      /**进入用户中心 */
      ,personalCenter:function(personal_center) {
          personal_center.off('click').on('click',function(){
              var userStr = $.session.get('user')
              var userJson = JSON.parse(userStr)
              console.log(userJson)
             layer.open({
                  type:1,
                  title:'修改初始密码',
                  content:"<div id='change_Modal'>" +
                  "<div style='text-align: center;padding-top: 10px;'>" +
                  "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;原密码:<input type='password' id='old_password'/></p>" +
                  "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;新密码:<input type='password' id='new_password' placeholder='至少6位'/></p>" +
                  "<p style='padding: 5px 0px 5px 0px;'>确认密码:<input type='password' id='renew_password' placeholder='至少6位'/></p>" +
                  "</div>" +
                  "</div>",
                  area:['400px','250px'],
                  btn:['确认','取消'],
                  offset:['40%','55%'],
                  yes:function(index){
                      var userCode = userJson.code
                      var oldPassword = $('#old_password').val()
                      var newPassword = $('#new_password').val()
                      var reNewPassword = $('#renew_password').val()
                      $.post(home.urls.user.updatePassword(), {
                          code: userCode,
                          oldPassword: oldPassword,
                          newPassword: newPassword,
                          reNewPassword: reNewPassword
                      }, function (result) {
                          layer.msg(result.message, {
                              offset: ['40%', '55%'],
                              time: 700
                          })
                          if (result.code === 0) {
                              var time = setTimeout(function () {
                                  user_manage.funcs.department_Set()
                                  clearTimeout(time)
                              }, 500)
                          }
                          layer.close(index)
                      })
                  },
                  btn2: function (index) {
                      layer.close(index)
                  }
              })
          })
      }
      /** 用户退出登录逻辑 */
      , handleLogout: function ($exit) {
          $exit.on('click', function () {
              /** 清除浏览记录 */
              localStorage.clear()
              /** 清除用户登录信息 */
              $.session.clear()
              /** 返回登录页面 */
              window.location.href = './login.html'
          })
      }//$funcs

      /** 绑定全选事件 */
      , bindSelectAll: function (selectAllBox, subCheckBoxes, checkedBoxLen, $table) {
          selectAllBox.off('change').on('change', function () {
              var status = selectAllBox.prop('checked')
              subCheckBoxes.each(function () {
                  $(this).prop('checked', status)
              })
          })
          subCheckBoxes.off('change').on('change', function () {
              var statusNow = $(this).prop('checked')
              if (statusNow === false) {
                  selectAllBox.prop('checked', false)
              } else if (statusNow === true && checkedBoxLen.length === $table.children('tbody').children('tr').length) {

                  selectAllBox.prop('checked', true)
              }
          })
      }
  }
}