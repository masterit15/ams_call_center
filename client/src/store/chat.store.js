import axios from "axios";
export default({
  state: {
    chats: [],
    messages: []
  },
  mutations: {
    SOCKET_newMessage(state, message) {
      state.messages.push(message)
    },
    SOCKET_updateUsers(state, users) {
      state.chats = users
    }
  },
  actions: {
    async createChat(ctx, data){
      let res = await axios.post('/chat/', data)
      return res
    },
    async loadChat({commit}, userId){
      let res = await axios.get(`/chat/${userId}`)
      commit('SET_chats', res.data.chat)
      return res
    },
    
  },
  getters: {
    chats: state => state.chats,
    messages: state => state.messages
  },
})