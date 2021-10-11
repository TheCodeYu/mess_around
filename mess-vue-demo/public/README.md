# mess-vue-demo

## 新建插件

新建完成后在public文件夹下分别新建以下文件：

1.README.md作为插件说明文件

2.plugin.json作为插件管理文件

3.根据plugin.json中指定的路径新建logo.png以及preload.js作为插件logo和预加载文件，文件名不可修改

## 运行插件

先build项目，使用ctrl/command + c复制plugin.json文件，在主界面搜索框内ctrl/command + v，选择新建插件，然后使能插件，即可使用，注意被复制的文件是项目build后文件夹中的plugin.json文件

## 注意

1.项目build后需要修改index.html中引入的js文件路径，去掉引入路径的第一个斜杠，所有引入的地方都需要修改

本插件中除了index.html中还有app.js中搜索到到第一个js位置处的path拼接去掉前缀

2.项目中使用的本地资源都放在public文件下,如有logo.png图片在public路径下/image/logo.png

```html
<img alt="Vue logo" src="image/logo.png">
```

3.如果Vue3.0使用vuetify，在使用命令vue add vuetify前先修改main.js文件如下，这是由于Vue 3.0 发布不久，vuetify 对 Vue 3.0 的语法没有做适配更新，只能使用 Vue 2.0 的语法，增加成功后就可以改回去

```js
//为了顺利利用vue add vuetify命令进行安装，需要在输入命令之前更改main.js代码
//main.js 更改后代码
import Vue from 'vue'
import App from './App.vue'

new Vue({
    render: h => h(App)
}).$mount('#app');

```

