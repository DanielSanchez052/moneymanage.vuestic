import { ApiResponse, Pagination } from '../../data/types'
import { LoanFilters } from '../../pages/loans/types'
import httpClient from '../http_client'
import settings from '../services.config'

class LoanService {
  async getLoans(accessToken: string, filter: LoanFilters, pagination: Pagination) {
    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.loan, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
        params: {
          AccountId: filter.AccountId,
          IsPaid: filter.isPaid,
          FrecuencyId: filter.Frecuency?.id,
          Lend: filter.Lend,
          Borrow: filter.Borrow,
          PageIndex: pagination.PageIndex,
          PageSize: pagination.PageSize,
        },
      })
      .then((res) => {
        return res
      })
  }
}

export default new LoanService()