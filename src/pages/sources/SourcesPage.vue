<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSources } from './composables/useSources'
import { useAuthStore } from '../../stores/auth'
import SourcesTable from './widgets/SourcesTable.vue'
import EditSourceForm from './widgets/EditSourceForm.vue'
import { Source } from './types'
import { useModal, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()

const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})

const { sources, update, add, isLoading } = useSources({
  authParams: authParams,
})

const sourceSelected = ref<Source | null>(null)
const doShowSourceFormModal = ref(false)

const editSource = (source: Source) => {
  sourceSelected.value = source
  doShowSourceFormModal.value = true
}

const edicreateNewSource = () => {
  sourceSelected.value = null
  doShowSourceFormModal.value = true
}

const { init: notify } = useToast()

const onSourceSaved = async (source: Source) => {
  doShowSourceFormModal.value = false

  if ('id' in source && source['id'] != '') {
    await update(source as Source)
    notify({
      message: 'Project updated',
      color: 'success',
    })
  } else {
    await add(source as Source)
    notify({
      message: 'Project created',
      color: 'success',
    })
  }
}

const { confirm } = useModal()

const editFormRef = ref()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">{{ t('sources.tittle') }}</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="edicreateNewSource" />
      </div>

      <SourcesTable :sources="sources" :loading="isLoading" @edit="editSource" />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowSourceFormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="sourceSelected === null" class="va-h5 mb-4">{{ t('sources.add') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('sources.edit') }}</h1>

      <EditSourceForm
        ref="editFormRef"
        :source="sourceSelected"
        :save-button-label="sourceSelected === null ? 'Add' : 'Save'"
        :action="sourceSelected === null ? 'add' : 'update'"
        @close="cancel"
        @save="
          (source) => {
            onSourceSaved(source)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
