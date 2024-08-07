import { ref, reactive } from 'vue'
import { AuthenticationParams, TypeProp } from '../../../data/types'
import { watchIgnorable } from '@vueuse/core'
import LoanService from '../../../api/loan/loan.service'
import { useI18n } from 'vue-i18n'

const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useLoanFrecuency = (options?: { authParams?: AuthenticationParams }) => {
  const isLoading = ref(false)
  const loanFrecuency = ref<TypeProp[]>([])
  const { t } = useI18n()

  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const result = await LoanService.getLoanFrecuency(authParams.token)
    loanFrecuency.value = result.data as TypeProp[]

    const mapped: TypeProp[] = loanFrecuency.value.map((frec) => ({
      ...frec,
      nameT: t(`loans.frecuency.${frec.name}`) ?? '',
    }))

    loanFrecuency.value = mapped

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
