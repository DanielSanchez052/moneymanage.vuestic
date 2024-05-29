import { ref, reactive } from 'vue'
import { AuthenticationParams } from '../../../data/types'
import { Source } from '../types'
import { watchIgnorable } from '@vueuse/core'
import SourcesService from '../../../api/transactions/sources.service'

const makeAuthParamsRef = () =>
  reactive({
    accountId: '',
    token: '',
  })

export const useSources = (options?: { authParams?: AuthenticationParams }) => {
  const isLoading = ref(false)
  const sources = ref<Source[]>([])

  const { authParams = makeAuthParamsRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const result = await SourcesService.GetSources(authParams.token, authParams.accountId)
    sources.value = result.data as Source[]

    ignoreUpdates(() => {})

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([authParams], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    sources,
    fetch,

    async add(source: Source) {
      isLoading.value = true

      await SourcesService.CreateSource(authParams.token, authParams.accountId, source)

      await fetch()
      isLoading.value = false
    },

    async update(source: Source) {
      isLoading.value = true

      await SourcesService.UpdateSource(authParams.token, authParams.accountId, source)

      await fetch()
      isLoading.value = false
    },

    authParams,
  }
}
