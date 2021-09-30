# mess plugin demo

@author:	zhouyu

@version:	0.0.1

@homePage:	www.4mychip.com

@github:

@gitee:

@logo:![](./logo.png)

## 安装

```
git clone 
cd	
```

复制 `plugin.json` 文件，在 `rubick` 主窗口执行 `ctrl/command + v` 即可唤起安装插件的功能，选择`新建rubick插件`，进入插件主界面，
开启插件后，在插件主窗口即可通过命令打开插件：

## 开发一个最基础的插件

一个最基础插件的目录是这样的：
```
rubick-plugin-demo
  |-- index.html
  |-- logo.png
  |-- plugin.json
  |-- preload.js
```
## 文件说明
### plugin.json
用于指定插件最基础的配置，一个最基础的配置信息如下：
```json
{
  "pluginName": "demo插件",
  "author": "zhouyu",
  "description": "mess plugin demo",
  "main": "index.html",
  "version": "0.0.1",
  "logo": "logo.png",
  "name": "mess-plugin-demo",
  "gitUrl": "",
  "features": [
    {
      "code": "demo",
      "explain": "这是一个测试的插件",
      "cmds":[
        "demo"
      ]
    }
  ],
  "preload": "preload.js"
}
```
核心字段说明：

* name 插件仓库名称，需要保持和git仓库同名，不要随意变更
* pluginName 插件显示名称，用于展示给使用者
* description 插件描述，描述这个插件的作用
* main 入口文件，一般为 `index.html`
* version 插件的版本
* features 插件核心功能列表
* features.code 插件某个功能的识别码，可用于区分不同的功能
* features.cmds 输入框内搜索该 cmd 进入插件

### index.html
插件的入口文件，用于展示插件的样式，一个最基础的 `html` 结构可以是这样：
```html
<!DOCTYPE html>
<html>
<body>
  hello Mess
  <button id="showNotification">通知</button>
</body>
<script>
  document.getElementById('showNotification').addEventListener('click', () => {
    window.showNotification();
  })
</script>
</html>
```

### preload.js
 `electron` 是可以再渲染进程中执行 `node.js` 的，所以 `preload.js` 是既可以
执行 `node.js` 以及执行 `Mess` 提供的系统命令的位置：

```js
window.showNotification = function () {
  mess.showNotification('HI, mess')
}
```
mess更多支持 API 能力参考：[mess 全局API]()

### logo.png
当前插件的logo图标，建议是 200 x 200 方形图标

