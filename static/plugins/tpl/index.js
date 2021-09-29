import doc from './doc.js';

const { ipcRenderer } = require("electron");


function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

const routes = [
  { path: '/doc', name: 'doc', component: doc }
]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  data: {
  },
  mounted() {
    ipcRenderer.on('help-ready-show', (e, args) => {
      this.$router.push({
        name: 'doc',
        query: {
          plugins: args
        },
      })
    })


  },
  router,
})
