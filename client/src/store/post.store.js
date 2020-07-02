import axios from "axios";
export default ({
  state: {
    posts: [],
    timeline: [],
    message: "",
    autor: [],
    poststatus: ["Все"],
    pagin: null,
  },
  mutations: {
    SET_POSTS(state, posts) {
      state.posts = posts
    },
    SET_MESSAGE(state, message) {
      state.message = message
    },
    SET_STATUS(state, poststatus) {
      state.poststatus = poststatus
    },
    SET_TIMELINE(state, timeline){
      state.timeline = timeline
    },
    SET_PAGIN(state, pagin) {
      state.pagin = pagin
    },
  },
  actions: {
    async exportsXML(ctx, params){
      let pagin = params.pagin
      let res = await axios.get('/posts/export/', {
        params: pagin
      })
      return res
    },
    async addPost({commit}, post) {
      let res = await axios.post('/posts/add', post)
      return res
    },
    async loadPost({ commit }, params = null) {
      var pagin = {}
      if(params !== null){
        pagin = params.pagin
      }else{
        pagin = {
          page: 1,
          limit: 6,
          status: "Все",
        }
      }
      let res = await axios.get("/posts/",
        {
          params: pagin
        }
      )
      if(res.data.success){
        var poststatus = ["Все"]
        for (let i in res.data.posts.results) {
          poststatus.push(res.data.posts.results[i].selectstatus)
        }
        commit("SET_STATUS", poststatus)
        let posts = res.data.posts.results
        let pagin = res.data.posts.pagin
        commit("SET_POSTS", posts)
        commit("SET_PAGIN", pagin)
      }

    },
    async editPostTimeline({ commit}, params) {
      let res = await axios.post("/posts/tml/add", params)
      return res
    },
    async loadTimeline({commit}, postId) {
      let res = await axios.get(`/posts/tml/${postId}`)
      commit('SET_TIMELINE', res.data.timelines)
      if(res.data.success){
      return res.data.timelines
      }
    },
    async deleteTimelineItem({ commit, dispatch }, id) {
        let res = await axios.delete(`/posts/tml/${id}`)
        return res
    },
    async editPost({commit}, post) {
      if (confirm("Вы уверены что хотите редактировать обращение?")) {
      let res = await axios.put(`/posts/${post.id}`, post)
      return res
      }
    },
    async deletePost({ commit, dispatch }, id) {
      if (confirm("Вы уверены что хотите удалить обращение?")) {
        let res = await axios.delete(`/posts/${id}`)
        return res
      }
    },
  },
  getters: {
    posts(state) {
      if (state.posts.length === undefined){
        return [state.posts]
      }
      return state.posts
    },
    postsstatus(state) {
      return state.poststatus
    },
    message(state) {
      return state.message
    },
    pagination(state) {
      return state.pagin
    },
    timelines: state => state.timeline
  }
})