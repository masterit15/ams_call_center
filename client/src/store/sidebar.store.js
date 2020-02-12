
export default ({
  state: {
    miniVariant: true,
    expandOnHover: true
  },
  mutations: {
    set_miniVariant(state, miniVariant){
      state.miniVariant = miniVariant
      state.expandOnHover = miniVariant
    }
  },
  actions: {
    miniAside({ commit }, miniVariant){
      commit('set_miniVariant', miniVariant)
    }
  },
  getters: {
    miniVariant: state => state.miniVariant, 
    expandOnHover: state => state.expandOnHover, 
  }
})