import { ref, reactive } from 'vue'
import { AuthenticationParams, TypeProp } from '../../../data/types'
import { watchIgnorable } from '@vueuse/core'
import TypesService from '../../../api/transactions/types.service'
import { useI18n } from 'vue-i18n'

const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useTypes = (options?: { authParams?: AuthenticationParams }) => {
  const isLoading = ref(false)
  const types = ref<TypeProp[]>([])
  const { t } = useI18n()

  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const result = await TypesService.GetTypes(authParams.token)
    types.value = result.data as TypeProp[]

    const mapped: TypeProp[] = types.value.map((type) => ({
      ...type,
      nameT: t(`transactions.type.${type.name}`) ?? '',
    }))

    types.value = mapped

    ignoreUpdates(() => {
      // pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    types,
    fetch,
    authParams,
  }
}
