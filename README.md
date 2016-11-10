# 简易版mvvm库 

 - 指令
    - v-model : 双向数据绑定
    - v-text : 单项数据绑定
    - v-show : 是否显示
    - v-for : 循环遍历
    - v-if/v-else : 条件判断
    
## 可在console里面对数据操作调试ui    
 - 启动项目
    - npm i 
    - npm run build
    - npm run start
    - http://127.0.0.1:8080/webpack-dev-server/example 打开   
     
如果sourcemap没生效可以将babel-core node_modules里面babel-generator/lib source-map替换为6.11.0及之前就能生效
babel的bug 尼玛一个礼拜才踩过来的坑!!!!  
