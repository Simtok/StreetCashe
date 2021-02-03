import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import DateFilter from './filters/dateFilter'

const cache = new InMemoryCache()

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: 'http://localhost:4001/graphql',
    cache,
  }),
})

Vue.filter('dateFilter', DateFilter)

Vue.config.productionTip = false

Vue.use(VueApollo)
Vue.use(Vuelidate)

new Vue({
  vuetify,
  store,
  router,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
