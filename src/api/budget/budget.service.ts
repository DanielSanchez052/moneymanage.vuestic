import { ApiResponse, Pagination } from '../../data/types'
import { BudgetFilters, NewBudget } from '../../pages/budgets/types'
import httpClient from '../http_client'
import settings from '../services.config'

class BudgetService {
  async getBudgets(accessToken: string, filter: BudgetFilters, pagination: Pagination) {
    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.budget, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
        params: {
          AccountId: filter.AccountId,
          TargetSourceId: filter.Source?.id != '0' ? filter.Source?.id : null,
          TargetTypeId: filter.Type?.id != 0 ? filter.Type?.id : null,
          PageIndex: pagination.PageIndex,
          PageSize: pagination.PageSize,
        },
      })
      .then((res) => {
        return res
      })
  }

  async GetBudgetTypes(accessToken: string) {
    return httpClient
      .get<any, ApiResponse>(settings.moneyManageApi.BaseUrl + settings.moneyManageApi.budget_types, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        responseType: 'json',
      })
      .then((res) => {
        return res
      })
  }

  async CreateBudget(accessToken: string, accountId: string, budget: NewBudget) {
    try {
      const res = await httpClient.post<any, ApiResponse>(
        settings.moneyManageApi.BaseUrl + settings.moneyManageApi.budget,
        {
          accountId: accountId,
          targetAmmount: budget.targetAmmount,
          targetType: budget.targetType.id,
          sourceId: budget.source.id,
          budgetType: budget.budgetType.id,
          startDate: budget.startDate,
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
}

export default new BudgetService()
