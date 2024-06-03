import { Ref, ref, unref, reactive } from 'vue'
import { Pagination, PaginatedResult, AuthenticationParams } from '../../../data/types'
import { Loan, LoanFilters, LoanTransactionHistory, NewLoan, PaidLoan } from '../types'
import { watchIgnorable } from '@vueuse/core'
import LoanService from '../../../api/loan/loan.service'
import { Transaction } from '../../transactions/types'

const makePaginationRef = () => ref<Pagination>({ PageIndex: 1, PageSize: 10 })
const makeFiltersRef = () =>
  ref<LoanFilters>({
    AccountId: null,
    Borrow: null,
    Frecuency: null,
    isPaid: null,
    Lend: null,
  })
const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useLoans = (options?: {
  pagination?: Ref<Pagination>
  filters?: Ref<LoanFilters>
  authParams?: AuthenticationParams
}) => {
  const isLoading = ref(false)
  const loans = ref<PaginatedResult<Loan>>({
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
    const result = await LoanService.getLoans(authParams.token, unref(filters), unref(pagination))

    loans.value = result.data as PaginatedResult<Loan>

    ignoreUpdates(() => {})

    isLoading.value = false

    const resultConverted: Loan[] = loans.value.items.map((a) => {
      const converted: LoanTransactionHistory[] = a.loanTransactionHistory.map((h) => {
        return {
          ...h,
          transactionCompleted: h.transactionId != undefined,
          transactionTypeName: h.transactionType?.name,
        }
      })
      return {
        ...a,
        paymentFrecuencyName: a.paymentFrecuency.name,
        loanTransactionHistory: converted,
      }
    })
    loans.value.items = []
    loans.value.items.push(...resultConverted)
  }

  const { ignoreUpdates } = watchIgnorable([pagination, filters, authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    loans,
    fetch,

    async add(loan: Omit<NewLoan, 'id'>) {
      isLoading.value = true

      const result = await LoanService.CreateLoan(authParams.token, authParams.accountId, loan)

      if (result?.success) {
        await fetch()
      }
      isLoading.value = false
      return result
    },

    async pay(transaction: Transaction, loanId: string, loanhistoryId: string) {
      isLoading.value = true

      const payment: PaidLoan = {
        ammount: transaction.ammount,
        transactionId: transaction.id,
        loanHistoryId: loanhistoryId,
        loanId: loanId,
      }

      const result = await LoanService.SetPaid(authParams.token, authParams.accountId, payment)
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
