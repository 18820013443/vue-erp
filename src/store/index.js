import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

import { getHalfYearRevenueList } from '@/api/erp/dashboard'
import { getTopSevenCustomersList } from '@/api/erp/dashboard'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    preSevenMonthsRevenue: null,
    topTenCustomers: null
  },
  mutations: {
    getPreSixMonthsRevenue(state, res) {
      state.preSevenMonthsRevenue = res
    },
    getTopSevenCustomers(state, res) {
      state.topTenCustomers = res
      // console.log(state.topTenCustomers)
    }
  },
  actions: {
    getPreSixMonthsRevenueAction(context) {
      getHalfYearRevenueList().then(response => {
        context.commit('getPreSixMonthsRevenue', response)
      })
    },
    getTopSevenCustomersAction(context) {
      getTopSevenCustomersList().then(response => {
        context.commit('getTopSevenCustomers', response)
      })
    }
  },
  modules: {
    app,
    settings,
    user
  },
  getters
})

store.dispatch('getPreSixMonthsRevenueAction')
store.dispatch('getTopSevenCustomersAction')
// console.log(store.state.preSixMonthsRevenue)
export default store
