# mess-vue-demo

## 新建插件

新建完成后在public文件夹下分别新建以下文件：

1.README.md作为插件说明文件

2.plugin.json作为插件管理文件

3.根据plugin.json中指定的路径新建logo.png以及preload.js作为插件logo和预加载文件，文件名不可修改

## 运行插件

先build项目，使用ctrl/command + c复制plugin.json文件，在主界面搜索框内ctrl/command + v，选择新建插件，然后使能插件，即可使用，注意被复制的文件是项目build后文件夹中的plugin.json文件

## 注意

1.项目build后需要修改index.html中引入的js文件路径，去掉引入路径的第一个斜杠

2.项目中使用的本地资源都放在public文件下,如有logo.png图片在public路径下/image/logo.png

```html
<img alt="Vue logo" src="image/logo.png">
```

