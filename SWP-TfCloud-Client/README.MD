## 注意事项
1、直接使用  `npm install` 可能会导致依赖不正确。强烈建议给 `npm` 设置 taobao 的 registry，使用  `cnpm install` 。

`npm install --registry=https://registry.npm.taobao.org`

2、大部分打包报错问题，先删除 `node_modules`文件夹后再重装依赖可解决。

3、`npm run dev`将会自动在浏览器打开测试页面，如未正常打开，请访问完整的路径`http:// localhost:8091/pages/home/list.html`

4、新建页面，或者修改配置之后，需重新`npm run dev`才可以正常访问新建的页面。

4、`npm run build` 会编译到  `./static` 文件夹，打包之后放服务器指定 `Nginx` 目录下可直接访问。

## 说明
1、旧页面，请求可以继续使用cryptPost，加解密只有在app内访问才有效

2、新增页面，可以使用axios，后续会封装一套新的http请求方法

## 目录结构
``` 
webpack
 |---build
 |---config
 |---src
     |---assets       #资源
        |---css          #css
        |---font         #字体图标
        |---js           #js
     |---config       #配置文件夹
         |---config.js   #配置文件
     |---lib          #原YQT - lib资源
     |---resource     #原YQT - 图片资源等
     |---style        #原YQT - 样式资源等
     |---thirdparty   #原YQT - 第三方资源库等
     |---comp         #组件文件夹
         |---  ***      #项目内自用组件
     |---pages        #各个页面模块，模块名可以自定义
         |---approval   #一级目录
            |---ApprovalConstantData.js 
         |---home       #一级目录
            |---list      #二级目录
                 |---list.html
                 |---list.js
                 |---list.vue
         |---index      #一级目录
            |---index     #二级目录
                 |---index.html
                 |---index.js
                 |---index.vue	
                 |---index.less	
......
     
  ```

