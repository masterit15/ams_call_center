import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.store'
import posts from './post.store'
import sidebar from './sidebar.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    posts,
    sidebar
  }
})