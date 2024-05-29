import { ApiResponse } from '../../data/types'
import httpClient from '../http_client'
import settings from '../services.config'

class TypesService {
  GetTypes(accessToken: string) {
    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.get_type, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
      })
      .then((res) => {
        return res
      })
  }
}

export default new TypesService()
