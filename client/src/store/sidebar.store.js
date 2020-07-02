
export default ({
  state: {
    miniVariant: true,
    expandOnHover: true,
    barColor: localStorage.getItem('barColorhex') || '#3f51b58a, #3f51b58a',
    barImage: localStorage.getItem('barImage') || '../assets/img/sidebar_bg/sidebar-1.jpg',
  },
  mutations: {
    set_miniVariant(state, miniVariant){
      state.miniVariant = miniVariant
      state.expandOnHover = miniVariant
    },
    SET_BAR_IMAGE (state, payload) {
      localStorage.setItem('barImage', payload)
      state.barImage = payload
    },
    SET_BAR_COLOR (state, payload) {
      let colorxah = payload+'8a'
      localStorage.setItem('barColorhex', colorxah+', '+colorxah)
      state.barColor = colorxah+', '+colorxah
    },
  },
  actions: {
    miniAside({ commit }, miniVariant){
      commit('set_miniVariant', miniVariant)
    }
  },
  getters: {
    miniVariant: state => state.miniVariant, 
    expandOnHover: state => state.expandOnHover, 
    barColor: state => state.barColor, 
    barImage: state => state.barImage,
  }
})