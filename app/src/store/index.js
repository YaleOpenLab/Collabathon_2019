import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    whichForm: ''
  },
  mutations: {
    SET_WICHFORM: (state, val) => {
      state.whichForm = val
    },
  },
  actions: {
  },
  getters: {
    whichForm: state => state.whichForm,
  },
  plugins: [createPersistedState()]
})
