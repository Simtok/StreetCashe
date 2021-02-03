import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    alias: '/Home',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Home'),
  },
  {
    path: '/payers',
    name: 'Payers',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Payers'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'login' },
    component: () => import('@/views/Login'),
  },

  {
    path: '/payments',
    name: 'Payments',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Payments'),
  },
  {
    path: '/expenses',
    name: 'Expenses',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Expenses'),
  },
  {
    path: '/addpayment',
    name: 'Addpayment',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/AddPayment'),
  },
  {
    path: '/editpayment/:id',
    name: 'Editpayment',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/EditPayment'),
    props: true,
  },
  {
    path: '/addperson',
    name: 'Addperson',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Addperson'),
  },
  {
    path: '/editperson/:id',
    name: 'Editperson',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/EditPerson'),
    props: true,
  },
  {
    path: '/addexpenditure',
    name: 'Addexpenditure',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Addexpenditure'),
  },
  {
    path: '/editexpenditure/:id',
    name: 'Editexpenditure',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/Editexpenditure'),
    props: true,
  },

  {
    path: '/register',
    name: 'register',
    meta: { layout: 'login' },
    component: () => import('@/views/Register'),
  },

  {
    path: '/monthinfo/:month',
    name: 'monthinfo',
    meta: { layout: 'main', auth: true },
    component: () => import('@/views/ShowMontsInfo'),
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

// router.beforeEach((to, from, next) => {
//   const currentUser = store.getters.TOCKEN
//   const requireAuth = to.matched.some(record => record.meta.auth)
//   if (requireAuth && !currentUser) {
//     next({ name: 'login' })
//   } else {
//     next()
//   }
// })

export default router
