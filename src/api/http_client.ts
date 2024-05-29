import axios, { AxiosError, AxiosResponse } from 'axios'
import AuthService from './users/auth.service'
import { ApiResponse } from '../data/types'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

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
      AuthService.logout()
    }

    const status = error.response ? error.response.status : null

    if (status === 401) {
      //Refresh token
      AuthService.logout()
      console.log('unauthorized')
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
