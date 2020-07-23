import Vue from 'vue'
import Router from 'vue-router'
import TotpAuthenticator from '@/components/TotpAuthenticator/TotpAuthenticator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TotpAuthenticator',
      component: TotpAuthenticator
    }
  ]
})
