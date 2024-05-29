import httpClient from '../http_client'
import settings from '../services.config'
import { NewTransaction, Transaction, TransactionFilters } from '../../pages/transactions/types'
import { ApiResponse, Pagination } from '../../data/types'
import { formatString } from '../../services/utils'

class TransactionService {
  async GetTransactions(accessToken: string, filter: TransactionFilters, pagination: Pagination) {
    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.transaction, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
        params: {
          TypeId: filter.Type?.id != 0 ? filter.Type?.id : null,
          SourceId: filter.Source?.id != '0' ? filter.Source?.id : null,
          AccountId: filter.AccountId,
          TransactionDateFrom: filter.TransactionDateRange?.start != '0' ? filter.TransactionDateRange?.start : null,
          TransactionDateTo: filter.TransactionDateRange?.end != '0' ? filter.TransactionDateRange?.end : null,
          PageIndex: pagination.PageIndex,
          PageSize: pagination.PageSize,
        },
      })
      .then((res) => {
        return res
      })
  }

  async CreateTransaction(accessToken: string, accountId: string, transaction: NewTransaction) {
    try {
      const res = await httpClient.post<any, ApiResponse>(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.transaction,
        {
          accountId: accountId,
          ammount: transaction.ammount,
          transactionDate: transaction.transactionDate,
          type: transaction.type,
          sourceId: transaction.sourceId,
          transactionExtendedProperties: transaction.transactionExtendedProperties,
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
  async UpdateTransaction(accessToken: string, transaction: Transaction) {
    try {
      const res = await httpClient.put<any, ApiResponse>(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.transaction_ammount,
        {
          transactionId: transaction.id,
          ammount: transaction.ammount,
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

  async DeleteTransaction(accessToken: string, id: string) {
    try {
      const endpoint = formatString(settings.moneyManageApi.delete_transaction, [id])

      const res = await httpClient.delete<any, ApiResponse>(settings.moneyManageApi.BaseUrl + endpoint, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
      })

      return res
    } catch (error) {
      console.error(error)
    }
  }
}

export default new TransactionService()
