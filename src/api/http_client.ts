import axios, { AxiosError, AxiosResponse } from 'axios'
import AuthService from './users/auth.service'
import router from './../router/index'
import { useAuthStore } from '../stores/auth'
import { ApiResponse } from '../data/types'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

axios.interceptors.response.use(
  (res: AxiosResponse): ApiResponse => {
    return {
      success: true,
      data: res.data,
      errors: [],
      status: res.status,
      statusText: res.statusText,
      config: res.config,
      headers: res.headers,
    }
  },
  (error: AxiosError<any>): ApiResponse => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de red o error del servidor')
    }

    const status = error.response ? error.response.status : null

    if (status === 401) {
      const authStore = useAuthStore()
      //Refresh token
      console.log('unauthorized')
      authStore.logout()
      router.push({ name: 'login' })
    }
    return {
      success: false,
      data: undefined,
      errors: [...(error.response?.data?.errors ?? [])],
      status: error.response?.status ?? 0,
      statusText: error.response?.statusText ?? '',
      config: error.response?.config,
      headers: error.response?.headers ?? {},
    }
  },
)

export default axios
