import axios from "axios";
import router from '../router'
export default ({
  state: {
    access_token: localStorage.getItem('access_token') || '',
    user: localStorage.getItem('user_name') || '',
    users: [],
    status: '',
  },
  mutations: {
    SET_AUTH(state, user){
      state.user = user.userName
      state.access_token = user.token
    },
    SET_USERS(state, users) {
      state.users = users
    },
    SET_LOGOUT(state) {
      state.access_token = ''
    },
  },
  actions: {
    getUsers({ commit }, params) {
      axios.get('/api/auth/users', params ).then(response => {
          if (response.status === 200) {
            let users = response.data.users.results
            commit('SET_USERS', users)
          }
        });
    },
    async auth({ commit }, data) {
      let res = await axios.post('/api/auth/login', data)
      if (res.status === 200) {
        let access_token = res.data.token
        let user = res.data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('user_name', user.userName)
            axios.defaults.headers.common['Authorization'] = "Bearer " + access_token
            commit("SET_AUTH", user)
          }
        return res
    },
    async register({ commit }, data){
      let res = await axios.post('/api/auth/register', data)
      return res
    },
    async getUser({ commit }, data) {
      let res = await axios.get('/api/auth/user', {
        params: {
          id: data
        }
      })
      return res
    },
    async editUser({ commit }, data) {
     let res = await axios.put('/api/auth/edit', data)
     return res
    },
    async deleteUser({ commit }, data) {
      let res = await axios.delete('/api/auth/delete', {
        params: {
          id: data
        }
      })
        return res
    },
    logout({commit}){
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('login')
      delete axios.defaults.headers.common['Authorization']
      commit('SET_LOGOUT')
    }
  },
  getters: {
    isLoginedIn: state => state.access_token || '',
    authState: state => state.status,
    user: state => state.user,
    users: state => state.users,
  }
})