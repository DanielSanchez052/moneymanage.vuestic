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
  transactionId?: string | undefined
  initialFetch?: boolean
}) => {
  const initialFetch = options != undefined && options?.initialFetch != undefined ? options?.initialFetch : true
  const isLoading = ref(false)
  const transactions = ref<PaginatedResult<Transaction>>({
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
    page: 1,
    totalCount: 0,
    pageSize: 0,
  })

  const transaction = ref<Transaction>()

  const { pagination = makePaginationRef() } = options ?? {}
  const { filters = makeFiltersRef() } = options ?? {}
  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    filters.value.AccountId = authParams.accountId
    const result = await TransactionService.GetTransactions(authParams.token, unref(filters), unref(pagination))

    transactions.value = result.data as PaginatedResult<Transaction>

    const mapped: Transaction[] = transactions.value.items.map((t) => ({
      ...t,
      typeName: t.type?.name ?? '',
      sourceName: t.source?.name ?? '',
    }))

    transactions.value.items = []
    transactions.value.items.push(...mapped)

    ignoreUpdates(() => {})

    isLoading.value = false
  }

  const getById = async (transactionId: string) => {
    isLoading.value = true

    const result = await TransactionService.GetTransactionbyId(authParams.token, transactionId)

    transaction.value = result.data as Transaction

    console.log(result.data)

    const mapped: Transaction = {
      ...transaction.value,
      typeName: transaction.value.type?.name ?? '',
      sourceName: transaction.value.source?.name ?? '',
    }

    transaction.value = mapped

    ignoreUpdates(() => {})

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, filters, authParams], fetch, { deep: true })

  if (options?.transactionId == undefined && initialFetch) {
    fetch()
  } else if (initialFetch && options?.transactionId != undefined) {
    getById(options.transactionId ?? '')
  }

  return {
    isLoading,
    transactions,
    transaction,
    fetch,
    async add(transaction: Omit<NewTransaction, 'id'>) {
      isLoading.value = true

      const res = await TransactionService.CreateTransaction(authParams.token, authParams.accountId, transaction)

      await fetch()
      isLoading.value = false
      return res?.data as Transaction
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
    getById,
    pagination,
    filters,
    authParams,
  }
}
