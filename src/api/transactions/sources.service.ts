import httpClient from '../http_client'
import settings from '../services.config'
import { formatString } from '../../services/utils'
import { Source } from '../../pages/sources/types'

class SourcesService {
  GetSources(accessToken: string, accountId: string) {
    const endpoint = formatString(settings.moneyManageApi.get_source, [accountId])

    return httpClient
      .get(settings.moneyManageApi.BaseUrl + endpoint, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
      })
      .then((res) => {
        return res
      })
  }

  CreateSource(accessToken: string, accountId: string, source: Source) {
    return httpClient
      .post(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.post_source,
        {
          accountId: accountId,
          name: source.name,
          description: source.description,
          isActive: source.isActive,
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        },
      )
      .then((res) => {
        return res
      })
  }

  UpdateSource(accessToken: string, accountId: string, source: Source) {
    return httpClient
      .put(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.put_source,
        {
          sourceId: source.id,
          accountId: accountId,
          name: source.name,
          description: source.description,
          isActive: source.isActive,
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        },
      )
      .then((res) => {
        return res
      })
  }
}

export default new SourcesService()
