import { Ref, ref, unref, reactive } from 'vue'
import { Pagination, PaginatedResult, AuthenticationParams } from '../../../data/types'
import { Transaction, TransactionFilters, NewTransaction } from '../types'
import { watchIgnorable } from '@vueuse/core'
import TransactionService from '../../../api/transactions/transactions.service'

const makePaginationRef = () => ref<Pagination>({ PageIndex: 1, PageSize: 10 })
const makeFiltersRef = () =>
  ref<TransactionFilters>({
    Type: null,
    Source: null,
    AccountId: null,
    UserId: null,
    TransactionDateRange: null,
  })
const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useTransactions = (options?: {
  pagination?: Ref<Pagination>
  filters?: Ref<TransactionFilters>
  authParams?: AuthenticationParams
}) => {
  const isLoading = ref(false)
  const transactions = ref<PaginatedResult<Transaction>>({
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
    const result = await TransactionService.GetTransactions(authParams.token, unref(filters), unref(pagination))

    transactions.value = result.data as PaginatedResult<Transaction>

    const mapped: Transaction[] = transactions.value.items.map((t) => ({
      id: t.id,
      accountId: t.accountId,
      ammount: t.ammount,
      transactionDate: t.transactionDate,
      type: t.type,
      typeName: t.type?.name ?? '',
      source: t.source,
      sourceName: t.source?.name ?? '',
      isActive: t.isActive,
      transactionExtendedProperties: t.transactionExtendedProperties,
    }))

    transactions.value.items = []
    transactions.value.items.push(...mapped)

    ignoreUpdates(() => {})

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, filters, authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    transactions,
    fetch,

    async add(transaction: Omit<NewTransaction, 'id'>) {
      isLoading.value = true

      await TransactionService.CreateTransaction(authParams.token, authParams.accountId, transaction)

      await fetch()
      isLoading.value = false
    },

    async update(transaction: Transaction) {
      isLoading.value = true

      await TransactionService.UpdateTransaction(authParams.token, transaction)

      await fetch()
      isLoading.value = false
    },

    async remove(transaction: Transaction) {
      isLoading.value = true

      await TransactionService.DeleteTransaction(authParams.token, transaction.id)

      await fetch()
      isLoading.value = false
    },

    pagination,
    filters,
    authParams,
  }
}
