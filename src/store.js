import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null // Initial value is null
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    },
    clearState(state) {
      state.user = null
    }
  }
})

export default store
