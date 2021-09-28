const path = require('path')
const marked = require("marked")
const fs = require("fs")
const { clipboard } = require("electron");
const rendererMD = new marked.Renderer();
export default {
  template: `
    <div class="doc-container">
      <div class="menu">
      
        <div @click="active = index" :class="active === index ? 'active item' : 'item'" v-for="(item, index) in menu">
          <img class="icon" width="40" height="40" :src="icon(item)" />
          <div>
            <div class="title">{{item.pluginName}}</div>
            <div class="desc">{{item.description}}</div>
          </div>
        </div>
      </div>
      <div class="detail-container" v-html="readme"></div>
     
    </div>
  `,
  data() {
    return {
      query: this.$route.query,
      menu: this.$route.query.plugins,
      active: 0,
    }
  },
  mounted() {
    const aNodes = document.querySelectorAll('a')
    console.log(aNodes)
    for (let i = 0; i < aNodes.length; i++) {
      // 遍历绑定监听
      aNodes[i].title = aNodes[i].href
      aNodes[i].onclick = clipboard.writeText(aNodes[i].href);
      aNodes[i].href = 'javascript:void(0);'

    }

  },

  methods: {
    icon(plugin) {
      return plugin.img
        ? plugin.img : "image://" + path.join(plugin.sourceFile, `../${plugin.logo}`)

    },
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
        silent: true
      });
      try {
        const mdFile = path.join(this.menu[this.active].sourceFile, '../README.md');
        return marked(fs.readFileSync(mdFile, 'utf8'));
      } catch (e) {
        return '暂无描述信息'
      }
    },
  }
}
