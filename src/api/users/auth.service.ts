import axios from 'axios'
import settings from '../services.config'
import { Login, NewUser, RecoverPassword, RecoverPasswordRequest } from '../../pages/auth/types'
import { ApiResponse } from '../../data/types'

class AuthService {
  login(user: Login) {
    return axios
      .post<any, ApiResponse>(settings.identityApi.BaseUrl + settings.identityApi.login, {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.success && response.data?.token != undefined) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }

        return response
      })
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('account')
  }

  register(user: NewUser) {
    return axios
      .post<any, ApiResponse>(settings.identityApi.BaseUrl + settings.identityApi.register, {
        userName: user.username,
        email: user.email,
        phoneNumber: user.phone,
        password: user.password,
      })
      .then((response) => {
        return response
      })
  }

  confirmEmailRequest(confirmationRequest) {
    return axios
      .post(settings.identityApi.BaseUrl + settings.identityApi.confim_email_request, {
        email: confirmationRequest.email,
      })
      .then((response) => {
        return response
      })
  }

  resetPasswordRequest(resetPasswordRequest: RecoverPasswordRequest) {
    return axios
      .post<any, ApiResponse>(settings.identityApi.BaseUrl + settings.identityApi.reset_password_request, {
        email: resetPasswordRequest.email,
      })
      .then((response) => {
        return response
      })
  }
  resetPassword(resetPasswordRequest: RecoverPassword) {
    return axios
      .put<any, ApiResponse>(settings.identityApi.BaseUrl + settings.identityApi.reset_password, {
        email: resetPasswordRequest.email,
        password: resetPasswordRequest.password,
        resetPasswordToken: resetPasswordRequest.resetPasswordToken,
      })
      .then((response) => {
        return response
      })
  }
}

export default new AuthService()
