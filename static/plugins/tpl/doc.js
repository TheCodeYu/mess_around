
const rendererMD = new marked.Renderer();
{/* <div class="menu">
        <div @click="active = index" :class="active === index ? 'active item' : 'item'" v-for="(item, index) in menu">
          <div class="title">{{item.t}}</div>
          <div class="desc">{{item.d}}</div>
        </div>
      </div>
      <iframe class="frame"  /> */}
export default {
  template: `
    <div class="doc-container" v-html="readme">
      
    </div>
  `,
  data() {
    return {
      menu: readmeStr
    }
  },
  mounted() {
    
    
  },
  computed: {
    
    readme() {
      let self = this
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
      console.log(readmeStr)
      marked(readmeStr);
      // try {
      //   return marked(self.$http.get('static/plugins/tpl/README.MD'));
      // } catch (e) {
      //   return "暂无描述信息";
      // }
    }
  }
}
