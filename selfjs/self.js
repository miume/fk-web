(function($) {
    $.extend($.fn, {
        //设计定宽输出插件
        /** 
         * 定义定宽输出函数，把过多的字符替换为省略号，或者直接截取掉。
         * 定义一个jQuery全局函数，解决定宽输出问题。
         * **/
        fixedWidth : function(str, length, char){
            str = str.toString();      //把参数转换为字符串
            if(!char) char = "..."     //如果没有设置char参数，则设置默认值。
            var num = length - lengthB(str);
            if(num < 0){
                str = substringB(str, length - lengthB(char)) + char;
            }
            return str;
            //以指定的字节数截取字符串
            //返回指定字节数的截取字符串，从原字符串第一个字符开始截取
            function substringB(str, length){
                var num = 0, len = str.length, tenp = "";
                if( len ){
                    for( var i = 0; i < len; i ++ ){
                        if(num > length) break;
                        if(str.charCodeAt(i) > 255){
                            num += 2;
                            tenp += str.charAt(i);
                        }else{
                            num ++;
                            tenp += str.charAt(i);
                        }
                    }
                    return tenp;
                }else{
                    return null;
                }
            }
            //获取字符串的字节数
            function lengthB(str){
                var num = 0, len = str.length;
                if(len){
                    for( var i = 0; i < len; i ++ ){
                        if(str.charCodeAt(i) > 255){
                            num += 2;
                        }else{
                            num ++;
                        }
                    }
                    return num;
                }else{
                    return 0;
                }
            }
        }

         ,color : function(options) {
          
           var options = $.extend({
               bcolor : "white",
               fcolor : "black"
           }, options);
           //参数验证函数
           if(!filter(options))
               return this;
           var options = $.extend({}, $.fn.color.defaults, options);//覆盖原来的参数
           return this.each(function(){
               $(this).css("color",options.fcolor); //遍历设置每一个DOM元素的背景元素
               $(this).css("backgroundColor",options.bcolor);
               var _html = $(this).html();
               _html = $.fn.color.format(_html);
               $(this).html(_html);
           })
       }
       ,parent : function(options){
           var arr = [];
           $.each(this,function(index,value){
               arr.push(value.parentNode);
           })
           //过滤重复的元素
           arr = $.unique(arr);
           //把变量arr打包为数组类型返回
           return this.pushStack(arr);
       }
       ,showIn : function(speed, fn){
            return this.animate({
                height : "show",
                opacity : "show"
            },speed,fn);
       }
       ,hideOut : function(speed, fn){
           return this.animate({
               height : "hide",
               opacity : "hide"
           },speed,fn)
       }
    })
    
    //独立设置$.fn.color对象的默认参数值
    $.fn.color.defaults = {
        bcolor : "white",
        fcolor : "black"
    }
    $.fn.color.format = function(str){
        return str;
    };
    function filter(options){
        //如果参数不存在，或者存在且为对象，则返回true，否则返回false
        return !options || (options && typeof options === "object")?true : false ;
    }
})(jQuery)
