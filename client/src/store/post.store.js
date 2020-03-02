import axios from "axios";
import router from '../router'
export default ({
  state: {
    posts: [],
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
    SET_PAGIN(state, pagin) {
      state.pagin = pagin
    },
  },
  actions: {
    async exportsXML(ctx, data){
      let res = await axios.get('/api/posts/export', data)
      return res
    },
    addPost({ commit, dispatch }, post) {
      console.log(post)
      axios.post('/api/posts/add', post)
        .then(response => {
          if (response.data.success) {
            dispatch('loadPost')
            message = "Обращение успешно добавлено"
            commit("SET_MESSAGE", message)
            commit("SET_POSTS", posts)
          }
        })
    },
    loadPost({ commit }, params) {
      let pagin = params.pagin
      axios.get("/api/posts/",
        {
          params: pagin
        }
      )
      .then(response => {
        var poststatus = ["Все"]
        for (let i in response.data.posts.results) {
          poststatus.push(response.data.posts.results[i].selectstatus)
        }
        commit("SET_STATUS", poststatus)
        let posts
        if (params.status != "Все") {
          //posts = response.data.posts.results.find(post => post.selectstatus === params.status)
          posts = response.data.posts.results.filter(post => post.selectstatus == params.status)
        } else {
          posts = response.data.posts.results
        }
        let pagin = response.data.posts.pagin
        commit("SET_POSTS", posts)
        commit("SET_PAGIN", pagin)
      })
      .catch(error =>{
        // console.log(error)
        // if (error){
        //   router.push('/')
        // }
      })
    },
    async editPost({commit}, post) {
      if (confirm("Вы уверены что хотите редактировать обращение?")) {
      let res = await axios.put("/api/posts/", post)
      return res
      }
    },
    async editPostTimeline({ commit, dispatch }, post) {
        let res = await axios.put("/api/posts/timeline", post)
        return res
    },
    deletePost({ commit, dispatch }, id, index) {
      if (confirm("Вы уверены что хотите удалить обращение?")) {
        axios.delete(`/api/posts/${id}`).then(response => {
          if (response.data.success) {
            let message = response.data.message
            dispatch('loadPost')
            commit("SET_MESSAGE", message)
          } else {
            let message = response.data.message
            commit("SET_MESSAGE", message)
          }
        });
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
    }
  }
})