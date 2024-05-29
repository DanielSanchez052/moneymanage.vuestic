import { defineStore } from 'pinia'
import AuthService from '../api/users/auth.service'
import AccountService from '../api/transactions/account.service'
import { Login, NewUser, User, Account } from '../pages/auth/types'

const user: User = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') ?? '{}') : undefined
const account: Account =
  typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('account') ?? '{}') : undefined

const initialState = user
  ? { status: { loggedIn: true }, user, account }
  : { status: { loggedIn: false }, user: null, account: null }

export const useAuthStore = defineStore('auth', {
  state: () => {
    return initialState
  },

  actions: {
    async login(user: Login) {
      const service_errors = []
      try {
        const response = await AuthService.login(user)
        if (response.success) {
          await this.loginSuccess(response.data)
          return Promise.resolve(response)
        } else if (!response.success && response.errors) {
          service_errors.push(...response.errors)
          this.loginFailure()
        } else {
          service_errors.push('Ha ocurrido algo malo, intentalo de nuevo mas tarde')
          this.loginFailure()
        }

        return Promise.reject(service_errors)
      } catch (error) {
        service_errors.push('Ha ocurrido algo malo, intentalo de nuevo mas tarde')
        this.loginFailure()
        return Promise.reject(service_errors)
      }
    },
    async refreshAccountStatus(account: Account | undefined = undefined): Promise<null | Account> {
      if (account != undefined) {
        this.account = account
        return this.account
      }

      try {
        const response = await AccountService.GetAccountById(this.user?.token ?? '', this.user?.accountId ?? '')

        if (!response.success) {
          this.account = null
          return null
        }

        this.account = response.data
        return response.data
      } catch (error) {
        console.error(error)
        this.account = null
        return null
      }
    },
    async logout() {
      AuthService.logout()
      this.status.loggedIn = false
      this.user = null
      this.account = null
    },
    async register(user: NewUser) {
      return AuthService.register(user)
    },
    async loginSuccess(user: User) {
      this.status.loggedIn = true
      this.user = user
      await this.refreshAccountStatus()
    },
    loginFailure() {
      this.status.loggedIn = false
      this.user = null
      this.account = null
    },
  },
})
