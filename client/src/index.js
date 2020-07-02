import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store/store'
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import './vee-validate'
import VueSocketIO from 'vue-socket.io'
// import Chat from 'vue-beautiful-chat'
import vuetify from '~/plugins/vuetify'
import dateFilter from '~/plugins/date.filter'
import messages from '~/plugins/messages'
import Appheader from './components/Header.vue'
import Appfooter from './components/Footer.vue'
import Appaside from './components/Sidebar.vue'
import Applogin from './views/Login.vue'
import VModal from 'vue-js-modal'
import EmojiPicker from 'vue-emoji-picker'
 
Vue.use(VModal)
Vue.use(EmojiPicker)

import 'materialize-css/dist/js/materialize.min'
import 'air-datepicker'
Vue.prototype.$http = axios
if(localStorage.tokenData){
const tokenData = JSON.parse(localStorage.tokenData)
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`
}
Vue.filter('Fdate', dateFilter)
Vue.use(messages)
// Vue.use(Chat)
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://localhost:5000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('app-header', Appheader)
Vue.component('app-aside', Appaside)
Vue.component('app-footer', Appfooter)
Vue.component('app-login', Applogin)
Vue.component('emoji-picker', EmojiPicker)

// JS
import './js/'

// SASS
import './assets/sass/main.sass'

// Vue init
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


