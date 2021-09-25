import Vue from 'vue'
import Router from 'vue-router'
import Market from '../pages/search/components/market'
import Dev from '../pages/search/components/dev'
import Installed from '../pages/search/components/plugin'
import Settings from '../pages/search/components/settings'
Vue.use(Router)


const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  routes: [{
    path: '/home',
    name: 'search',
    component: require('@/pages/search/index.vue').default,
    children: [
      {
        path: 'market',
        component: Market
      },
      {
        path: 'dev',
        component: Dev
      },
      {
        path: 'plugin',
        component: Installed
      },
      {
        path: 'settings',
        component: Settings
      },
    ]
  },
  {
    path: '/plugin',
    name: 'plugin',
    component: require('@/pages/plugins/index.vue').default
  },
  {
    path: '*',
    redirect: '/home'
  }
  ]
})
