import { ApiResponse, Pagination } from '../../data/types'
import { LoanFilters, NewLoan, PaidLoan } from '../../pages/loans/types'
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

  async getLoanFrecuency(accessToken: string) {
    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.loanFrecuency, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
      })
      .then((res) => {
        return res
      })
  }

  async CreateLoan(accessToken: string, accountId: string, loan: NewLoan) {
    try {
      const res = await httpClient.post<any, ApiResponse>(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.loan,
        {
          accountId: accountId,
          borrow: loan.borrow,
          lend: loan.lend,
          ammountBorrowed: loan.ammountBorrowed,
          percentage: loan.percentage,
          paymentFrecuency: loan.paymentFrecuency.id,
          periodCount: loan.periodCount,
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        },
      )
      return res
    } catch (error) {
      console.error(error)
    }
  }

  async SetPaid(accessToken: string, accountId: string, payment: PaidLoan) {
    try {
      const res = await httpClient.post<any, ApiResponse>(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.loanPaid,
        {
          transactionId: payment.transactionId,
          loanId: payment.loanId,
          loanHistoryId: payment.loanHistoryId,
          ammount: payment.ammount,
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        },
      )
      return res
    } catch (error) {
      console.log(error)
    }
  }
}

export default new LoanService()
