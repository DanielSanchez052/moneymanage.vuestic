import { Ref, ref, unref, reactive } from 'vue'
import { Pagination, PaginatedResult, AuthenticationParams } from '../../../data/types'
import { Loan, LoanFilters, LoanTransactionHistory, NewLoan } from '../types'
import { watchIgnorable } from '@vueuse/core'
import LoanService from '../../../api/loan/loan.service'

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
          id: h.id,
          ammoundPaid: h.ammoundPaid,
          ammountToPay: h.ammountToPay,
          generated: h.generated,
          paymentDate: h.paymentDate,
          transactionId: h.transactionId,
          transactionCompleted: h.transactionId != undefined,
          transactionType: h.transactionType,
          transactionTypeName: h.transactionType.name,
        }
      })
      return {
        loanId: a.loanId,
        ammountBorrowed: a.ammountBorrowed,
        borrow: a.borrow,
        lend: a.lend,
        paid: a.paid,
        paymentFrecuency: a.paymentFrecuency,
        paymentFrecuencyName: a.paymentFrecuency.name,
        percentage: a.percentage,
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
      // budget.startDate = new Date(budget.startDate).toISOString()
      // const result = await LoanService.CreateBudget(authParams.token, authParams.accountId, budget)
      // if (result?.success) {
      //   await fetch()
      // }
      isLoading.value = false
      // return result
    },

    pagination,
    filters,
    authParams,
  }
}
