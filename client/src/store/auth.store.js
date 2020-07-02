import axios from "axios"; 
export default ({
  state: {
    access_token: localStorage.tokenData || '',
    userName: localStorage.getItem('user_name') || '',
    userId: localStorage.getItem('user_id') || '',
    userAvatar: localStorage.getItem('user_avatar') || '',
    user: {
      login: localStorage.getItem('user_login') || '',
      username: localStorage.getItem('user_name') || '',
      userId: localStorage.getItem('user_id') || '',
      avatar: localStorage.getItem('user_avatar') || '',
      room: 12
    },
    users: [],
    autor: [],
    status: '',
  },
  mutations: {
    SET_AUTH(state, user){
      state.access_token = user.token
      state.userName = user.username
      state.userId = user.userId
      state.avatar = user.avatar
    },
    SET_USERS(state, users) {
      state.users = users
    },
  },
  actions: {
    saveToken({},token) {
      sessionStorage.setItem('tokenData', JSON.stringify(token))
      localStorage.setItem('tokenData', JSON.stringify(token))
    },
    async refreshToken({}, Rtoken){
        let res = await axios.post(`/auth/token?token=${Rtoken}`)
        return res
    },
    async fetchWithAuth({dispatch}){
      let tokenData = null; // объявляем локальную переменную tokenData
      if (sessionStorage.tokenData) { // если в sessionStorage присутствует tokenData, то берем её
          tokenData = JSON.parse(localStorage.tokenData);
      } else {
        dispatch('logout'); // если токен отсутствует, то перенаправляем пользователя на страницу авторизации
      }
      if (tokenData) {
          if (Date.now() >= tokenData.expires_on) { // проверяем не истек ли срок жизни токена
              try {
                console.log(tokenData.refresh_token)
                  const newToken = await dispatch('refreshToken', tokenData.refresh_token); // если истек, то обновляем токен с помощью refresh_token
                  console.log('newToken: ',newToken)
                  let newtokenData = {
                    access_token: newToken.data.accessToken,
                    refresh_token: newToken.data.refreshToken,
                    expires_on: newToken.data.expires_on
                  }
                  dispatch('saveToken', newtokenData)
              } catch (e) { // если тут что-то пошло не так, то перенаправляем пользователя на страницу авторизации
                dispatch('logout')
              }
          }
      }
    },
    async getUsers({ commit }, params) {
      let res = await axios.get('/auth/users', {params} )
      if (res.status === 200) {
        let users = res.data.user.results
        commit('SET_USERS', users)
      }
    },
    async uploadFiles({commit}, file){
      let formData = new FormData();
      formData.append('file', file);
      let res = await axios.post('/upload', formData)
      return res.data.filedata.path
    },
    async auth({ commit, dispatch }, data) {
      let res = await axios.post('/auth/login', data)
      if (res.data.success) {
        let user = res.data    
        let tokenData = {
          access_token: res.data.accessToken,
          refresh_token: res.data.refreshToken,
          expires_on: res.data.expires_on
        }
        dispatch('saveToken', tokenData)
        localStorage.setItem('user_name', user.username)
        localStorage.setItem('user_login', user.login)
        localStorage.setItem('user_id', user.userId)
        localStorage.setItem('user_avatar', user.avatar)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`
        commit("SET_AUTH", user)
            
      }
        return res
    },
    async register({ commit }, data){
      let res = await axios.post('/auth/register', data)
      return res
    },
    async getUser({ commit }, data) {
      let res = await axios.get('/auth/user', {
        params: {
          id: data
        }
      })
      return res
    },
    async editUser({ commit, dispatch }, data) {
      if(data.avatar !== ''){
        let filepath = await dispatch('uploadFiles', data.avatar)
        data.avatar = filepath
      }
     let res = await axios.put('/auth/edit', data)
     return res
    },
    async deleteUser({ commit }, data) {
      let res = await axios.delete('/auth/delete', {
        params: {
          id: data
        }
      })
        return res
    },
    async logout({}){
      if(localStorage.tokenData){
        const tokenData = JSON.parse(localStorage.tokenData)
        const token = tokenData.access_token
      
      let res = await axios.delete('/auth/logout', 
      {
        params: {
          token
        }
      })
      if(res.data.success){
        sessionStorage.removeItem('tokenData')
        localStorage.removeItem('tokenData')
        localStorage.removeItem('user_avatar')
        localStorage.removeItem('user_login')
        localStorage.removeItem('user_name')
        localStorage.removeItem('user_id')
        delete axios.defaults.headers.common['Authorization']
      }
      return res
    }
    }
  },
  getters: {
    isLoginedIn: state => state.access_token || '',
    userName: state => state.userName,
    avatar: state => state.userAvatar,
    authState: state => state.status,
    userId: state => state.userId,
    users: state => state.users,
    user: state => state.user,
  }
})