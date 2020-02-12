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
  },
  actions: {
    getUsers({ commit }, params) {
      axios.get('http://localhost:5000/api/auth/users', params ).then(response => {
          if (response.status === 200) {
            let users = response.data.users.results
            commit('SET_USERS', users)
          }
        });
    },
    async auth({commit}, authData) {
     let res = await axios.post('http://localhost:5000/api/auth/login', authData)
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
    register({ commit }, authData){
        axios.post('http://localhost:5000/api/auth/register', authData)
          .then(response => {
            console.log(response.data)
          });
    },
    editUser({ commit }, authData) {
      axios.put('http://localhost:5000/api/auth/edit', authData)
        .then(response => {
          console.log(response.data)
        });
    },
    deleteUser({ commit }, authData) {
      axios.delete('http://localhost:5000/api/auth/edit', authData)
        .then(response => {
          console.log(response.data)
        });
    },
    async logout({commit}){
      await localStorage.removeItem('access_token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('login')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
  },
  getters: {
    isLoginedIn: state => state.access_token || '',
    authState: state => state.status,
    user: state => state.user,
    users: state => state.users,
  }
})