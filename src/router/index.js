import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/Auth/LoginView.vue'
import RegisterView from '../views/Auth/RegisterView.vue'
import ResetPassword from '../views/Auth/ResetPassword.vue'
import AuthLayout from '../views/layout/AuthLayout.vue'
import { Service } from '@/service/index'
import { C_Service } from '@/service/cards'
import AuthService from '../service/AuthService'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'login',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginView
      },
      {
        path: 'register',
        component: RegisterView
      },
      {
        path: '/recover_password',
        component: ResetPassword
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/home',
    component: () => import('../views/layout/AppLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: {
          auth: true,
          RouteName: 'Home',
          isCreate: true
        }
      },
      {
        path: '/home/view/:id',
        name: 'view',
        component: () => import('../views/ViewTrip.vue'),
        meta: {
          auth: true,
          RouteName: 'View Event',
          isCreate: false
        }
      },
      {
        path: 'create',
        name: 'create',
        component: () => import('../views/Trip/TripCreate.vue'),
        meta: {
          auth: true,
          RouteName: 'Create Event',
          isCreate: false
        }
      },
      {
        path: 'draft',
        name: 'draft',
        component: () => import('../views/Trip/DraftCard.vue'),
        meta: {
          auth: true,
          RouteName: 'Draft Cards',
          isCreate: true
        }
      },
      {
        path: 'profile/:name',
        name: 'profile',
        component: () => import('../views/Profile/ProfileView.vue'),
        meta: {
          auth: true,
          RouteName: 'Profile',
          isCreate: true
        }
      },
      {
        path: 'draft/:id',
        name: 'updateDraft',
        component: () => import('../views/Trip/DraftUpdate.vue'),
        meta: {
          auth: true,
          RouteName: 'Edit Draft',
          isCreate: true
        },
        beforeEnter: (to, from, next) => {
          const cardId = to.params.id
          const EnterUpdate = async (cardId) => {
            const authorId = await C_Service.thisDraftId(cardId)
            const currentUser = await Service.crrUserData()
            if (currentUser.id === authorId.author.id) {
              next()
            } else {
              console.log('---')
              next({
                path: `/home/view/${cardId}`,
              })
            }
          }
          EnterUpdate(cardId)
        }
      },
      {
        path: 'update/:id',
        name: 'update',
        component: () => import('../views/Trip/TripUpdate.vue'),
        meta: {
          auth: true,
          RouteName: 'Update Event',
          isCreate: true
        },
        beforeEnter: (to, from, next) => {
          const cardId = to.params.id
          console.log(cardId)
          const EnterUpdate = async (cardId) => {
            const authorId = await C_Service.getCardById(cardId)
            const currentUser = await Service.crrUserData()
            if (currentUser.id === authorId.author.id) {
              next()
            } else {
              console.log('---')
              next({
                path: `/home/view/${cardId}`,
                props: { alert: 'myProp' }
              })
            }
          }
          EnterUpdate(cardId)
        }
      }
    ]
  },
  {
    path: '*',
    name: 'notfound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      auth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !AuthService.isLoggedIn()) {
    next('/login');
  } else if (!to.meta.auth && AuthService.isLoggedIn()) {
    next('/user')
  } else {
    next()
  }
})

export default router
