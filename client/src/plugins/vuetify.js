// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

// css 
import 'vuetify/dist/vuetify.min.css'
// import '@fortawesome/fontawesome-free/css/all.css'
import 'font-awesome/css/font-awesome.min.css'
const opts = {
  icons: {
    iconfont: 'fa4',
  },
}

export default new Vuetify(opts)