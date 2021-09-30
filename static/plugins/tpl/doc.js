const path = require('path')
const marked = require("marked")
const fs = require("fs")
const { clipboard,shell } = require("electron");
const rendererMD = new marked.Renderer();
export default {
  template: `

    <div class="doc-container">
      <div class="toast" v-show="toastShow">
        {{toastText}}
      </div>
      <div class="menu">
      
        <div @click="active = index" :class="active === index ? 'active item' : 'item'" v-for="(item, index) in menu">
          <img class="icon" width="40" height="40" :src="icon(item)" />
          <div>
            <div class="title">{{item.pluginName}}</div>
            <div class="desc">{{item.description}}</div>
          </div>
        </div>
      </div>
      <div id="read" class="detail-container" v-html="readme"></div>
     
    </div>
  `,
  data() {
    return {
      toastShow: false,
      toastText: '',
      query: this.$route.query,
      menu: this.$route.query.plugins.sort(function (a, b) {
        return b.name > a.name;
      }),
      active: 0,
    }
  },
  methods: {
    icon(plugin) {
      return plugin.img
        ? plugin.img : "image://" + path.join(plugin.sourceFile, `../${plugin.logo}`)

    },
    toast(str) {
      let v = this
      v.toastText = str
      v.toastShow = true
      setTimeout(function () {
        v.toastShow = false
      }, 1500)
    },
    //不支持绝对路径
     urlencode (str) {  
      str = (str + '').toString();   
  
      return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
      replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
  }
  },
  computed: {
    readme() {

      marked.setOptions({
        renderer: rendererMD,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,

      });
      let parentNode = document.getElementById("read")
      
      while (parentNode && parentNode.firstChild) {
        var oldNode = parentNode.removeChild(parentNode.firstChild);
         oldNode = null;
      }
      try {
        
        const mdFile = path.join(this.menu[this.active].sourceFile, '../README.md');
      
        setTimeout(() => {
          let aNodes = document.querySelectorAll('a')
          let img = document.getElementsByTagName('img')
          for (let i = 0; i < img.length; i++) {
            if (img[i].className === 'icon') continue      
            if(img[i].src.toLocaleLowerCase().startsWith('http://') || img[i].src.toLocaleLowerCase().startsWith('https://')){
              continue
            }
            if(img[i].title===''){
              img[i].title = path.join(this.menu[this.active].sourceFile, `../${img[i].attributes['src'].value}`)           
            }
            img[i].src = img[i].title
          }
          for (let i = 0; i < aNodes.length; i++) {
            // 遍历绑定监听
            aNodes[i].title = aNodes[i].title ? aNodes[i].title : aNodes[i].href
            aNodes[i].addEventListener('click', (e, argv) => {
              //clipboard.writeText(aNodes[i].title)
              shell.openExternal(aNodes[i].title)
              //this.toast('已复制到剪贴板')
            })
            aNodes[i].href = "javascript:void(0);"

          }
        }, 50)
        return marked(fs.readFileSync(mdFile, 'utf8'));

      } catch (e) {
        return '暂无描述信息'
      }
    },
  }
}
