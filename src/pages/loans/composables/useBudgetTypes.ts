import { ref, reactive } from 'vue'
import { AuthenticationParams, TypeProp } from '../../../data/types'
import { watchIgnorable } from '@vueuse/core'
import BudgetService from '../../../api/budget/budget.service'

const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useBudgetTypes = (options?: { authParams?: AuthenticationParams }) => {
  const isLoading = ref(false)
  const budgetTypes = ref<TypeProp[]>([])

  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const result = await BudgetService.GetBudgetTypes(authParams.token)
    budgetTypes.value = result.data as TypeProp[]

    ignoreUpdates(() => {
      // pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    budgetTypes,
    fetch,
    authParams,
  }
}
