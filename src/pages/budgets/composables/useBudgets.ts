import { Ref, ref, unref, reactive } from 'vue'
import { Pagination, PaginatedResult, AuthenticationParams } from '../../../data/types'
import { Budget, BudgetFilters, BudgetHistory, NewBudget } from '../types'
import { watchIgnorable } from '@vueuse/core'
import BudgetService from '../../../api/budget/budget.service'

const makePaginationRef = () => ref<Pagination>({ PageIndex: 1, PageSize: 10 })
const makeFiltersRef = () =>
  ref<BudgetFilters>({
    Type: null,
    Source: null,
    AccountId: null,
  })
const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useBudgets = (options?: {
  pagination?: Ref<Pagination>
  filters?: Ref<BudgetFilters>
  authParams?: AuthenticationParams
}) => {
  const isLoading = ref(false)
  const budgets = ref<PaginatedResult<Budget>>({
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
    page: 1,
    totalCount: 0,
    pageSize: 0,
  })

  const { pagination = makePaginationRef() } = options ?? {}
  const { filters = makeFiltersRef() } = options ?? {}
  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    filters.value.AccountId = authParams.accountId
    const result = await BudgetService.getBudgets(authParams.token, unref(filters), unref(pagination))

    budgets.value = result.data as PaginatedResult<Budget>

    ignoreUpdates(() => {})

    isLoading.value = false

    const resultConverted: Budget[] = budgets.value.items.map((a) => {
      const converted: BudgetHistory[] = a.budgetHistory.map((h) => {
        return {
          id: h.id,
          budgetSettingsId: h.budgetSettingsId,
          targetAmmount: h.targetAmmount,
          currentAmmount: h.currentAmmount,
          budgetTypeName: h.budgetType?.name ?? '',
          budgetType: h.budgetType,
          targetType: h.targetType,
          targetSource: h.targetSource,
          targetSourceName: h.targetSource?.name ?? '',
          targetTypeName: h.targetType?.name ?? '',
          startDate: h.startDate,
          endDate: h.endDate,
          isActive: h.isActive,
          createDate: h.createDate,
        }
      })

      return {
        id: a.id,
        accountId: a.accountId,
        targetAmmount: a.targetAmmount,
        budgetType: a.budgetType,
        targetType: a.targetType,
        targetSource: a.targetSource,
        budgetTypeName: a.budgetType?.name ?? '',
        targetTypeName: a.targetType?.name ?? '',
        targetSourceName: a.targetSource?.name ?? '',
        createDate: a.createDate,
        isActive: a.isActive,
        budgetHistory: converted,
      }
    })

    budgets.value.items = []
    budgets.value.items.push(...resultConverted)
  }

  const { ignoreUpdates } = watchIgnorable([pagination, filters, authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    budgets,
    fetch,

    async add(budget: Omit<NewBudget, 'id'>) {
      isLoading.value = true
      budget.startDate = new Date(budget.startDate).toISOString()
      const result = await BudgetService.CreateBudget(authParams.token, authParams.accountId, budget)
      if (result?.success) {
        await fetch()
      }
      isLoading.value = false
      return result
    },

    pagination,
    filters,
    authParams,
  }
}
