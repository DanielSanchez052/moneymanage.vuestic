import { ApiResponse } from '../../data/types'
import httpClient from '../http_client'
import settings from '../services.config'

class AccountService {
  GetAccountById(accessToken: string) {
    const endpoint = `${settings.moneyManageApi.account}`

    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + endpoint, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
      })
      .then((res) => {
        if (res.success) {
          localStorage.setItem('account', JSON.stringify(res.data))
        }

        return res
      })
  }
}

export default new AccountService()
