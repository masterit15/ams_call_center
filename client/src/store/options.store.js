import axios from "axios";
export default ({
  state: {
    options: {}
  },
  mutations: {
    SET_OPTIONS(state, options){
      state.user = options
    },
  },
  actions: {
    async getOptions({ commit }, options) {
      console.log(options)
      let res = await axios.get('/options', params )
        if (res.status === 200) {
          console.log(res)
            // let options = response.data.users.results
            // commit('SET_OPTIONS', options)
          }
    },
  },
  getters: {
    options: state => state.options,
  }
})