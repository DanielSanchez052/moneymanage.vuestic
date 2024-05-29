import httpClient from '@/services/http_client'
import settings from '@/services/services.config'

class LoanService {
  async getLoans(accessToken, filter) {
    return httpClient
      .get(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.loan, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
        params: {
          AccountId: filter.accountId,
          IsPaid: filter.isPaid,
          FrecuencyId: filter.frecuencyId,
          Lend: filter.lend,
          Borrow: filter.borrow,
          PageIndex: filter.pageIndex,
          PageSize: filter.pageSize,
        },
      })
      .then((res) => {
        return res
      })
  }
}

export default new LoanService()
