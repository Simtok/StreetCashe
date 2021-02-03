import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authorize: {
      name: '',
      login: '',
      tocken: false,
    },
    homePage: {
      yearValue: '',
      monthValue: '',
    },
  },
  mutations: {
    SETUSER(state, value) {
      state.authorize.tocken = true
      state.authorize.name = value.name
      state.authorize.login = value.login
    },
    setYear(state, value) {
      state.homePage.yearValue = value
    },
  },
  actions: {
    get_authorize({ commit }, value) {
      if (value.name !== null) {
        commit('SETUSER', value)
      }
    },
    set_year({ commit }, value) {
      commit('setYear', value)
    },
  },
  getters: {
    TOCKEN: state => {
      return state.authorize.tocken
    },
    getYear: state => {
      return state.homePage.yearValue
    },
  },
  modules: {},
})
