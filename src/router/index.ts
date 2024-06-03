import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: '404' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'transactions',
        path: 'transactions',
        component: () => import('../pages/transactions/TransactionsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'budgets',
        path: 'budgets',
        component: () => import('../pages/budgets/BudgetsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'loans',
        path: 'loans',
        component: () => import('../pages/loans/LoansPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'sources',
        path: 'sources',
        component: () => import('../pages/sources/SourcesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'logout',
        path: 'logout',
        component: () => import('../pages/auth/Logout.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-change',
        path: 'reset-password/change-password',
        component: () => import('../pages/auth/RecoverPasswordChange.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
  {
    name: '500',
    path: '/500',
    component: () => import('../pages/500.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach((to) => {
  const loggedIn = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : undefined

  if (to.meta.requiresAuth && !loggedIn) {
    return {
      path: '/auth/login',
      query: {
        redirectTo: to.fullPath,
      },
    }
  }
})

export default router
