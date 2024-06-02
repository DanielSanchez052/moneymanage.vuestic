import { ref, reactive } from 'vue'
import { AuthenticationParams, TypeProp } from '../../../data/types'
import { watchIgnorable } from '@vueuse/core'
import LoanService from '../../../api/loan/loan.service'

const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useLoanFrecuency = (options?: { authParams?: AuthenticationParams }) => {
  const isLoading = ref(false)
  const loanFrecuency = ref<TypeProp[]>([])

  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const result = await LoanService.getLoanFrecuency(authParams.token)
    loanFrecuency.value = result.data as TypeProp[]

    ignoreUpdates(() => {
      // pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    loanFrecuency,
    fetch,
    authParams,
  }
}
