import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    whichForm: ''
  },
  mutations: {
    SET_WICHFORM: (state, val) => {
      state.wichForm = val
    },
  },
  actions: {
  },
  modules: {
  }
})
