import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './config'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)


// import Home from "./components/Home"
// import IndexOfTerminal from "./components/terminal/Index"
// import IndexOfWindow from "./components/window/Index"
// import IndexOfWindowWithoutDock from "./components/window-without-dock/Index"
// import IndexOf520 from "./components/520/Index"
// import IndexOfFoto from "./components/foto/Index"

// const Home = resolve => require.ensure([], () => resolve(require('./components/Home')));
// const IndexOfTerminal = resolve => require.ensure([], () => resolve(require('./components/terminal/Index.vue')));
// const IndexOfWindow = resolve => require.ensure([], () => resolve(require('./components/window/Index.vue')));
// const IndexOfWindowWithoutDock = resolve => require.ensure([], () => resolve(require('./components/window-without-dock/Index.vue')));
// const IndexOf520 = resolve => require.ensure([], () => resolve(require('./components/520/Index.vue')));
const IndexOfFoto = resolve => require.ensure([], () => resolve(require('./components/foto/Index.vue')));

Vue.config.productionTip = false

Vue.use(VueRouter);

let router = new VueRouter({
  mode: "history",
  routes: [
    { path: '/', component: IndexOfFoto },
    // { path: '/home', component: Home },
    // { path: '/terminal', component: IndexOfTerminal },
    // { path: '/window', component: IndexOfWindow },
    // { path: '/window-without-dock', component: IndexOfWindowWithoutDock },
    // { path: '/520', component: IndexOf520 },
    // { path: '/foto', component: IndexOfFoto }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
