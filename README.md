# 简洁mvvm框架 
laugh提供简洁的双向绑定功能
 - 指令
    - v-model : 双向数据绑定
    - v-text : 单项数据绑定
    - v-show : 是否显示
 - $watch
    ```
    var cc={
        title: '欢迎来到英雄联盟',
        show: false
    };
    
    var vm=new laugh({
        el:'#person',
        data:obj
    });
    
    vm.$watch(cc,function(path,oldValue,newValue){
        console.log(path);
        console.log(oldValue);
        console.log(newValue);
    })
    
    ```