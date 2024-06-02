<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">{{ t('auth.login') }}</h1>
    <p class="text-base mb-4 leading-5">
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">{{ t('auth.sign_up') }}</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      :label="t('auth.email')"
      type="email"
      aria-autocomplete="list"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.password')"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        {{ t('auth.forgot_password') }}
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" :loading="isLoading" @click="submit">{{ t('auth.login') }}</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators, objectKeysToCamellCase } from '../../services/utils'
import { Login } from './types'
import { useAuthStore } from '../../stores/auth'
import { useNotificationsStore } from '../../stores/notifications'
import { useGlobalStore } from '../../stores/global-store'
import { ErrorType } from '../../data/types'
import { useI18n } from 'vue-i18n'

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const notificationHub = useNotificationsStore()
const { validate } = useForm('form')
const { push } = useRouter()
const { t } = useI18n()
const route = useRoute()
const { init } = useToast()
const isLoading = ref(false)

const formData = reactive<Login>({
  email: '',
  password: '',
})

onMounted(() => {
  if (authStore.status.loggedIn) {
    push({ name: 'dashboard' })
  }
})

const submit = async () => {
  isLoading.value = true

  if (validate()) {
    authStore.login(formData).then(
      () => {
        notificationHub.startSignalR(authStore?.user?.token ?? '')

        globalStore.setConfig(authStore.account?.accountSettings)

        notificationHub.signalOn('accountBalanced', async (message: string) => {
          try {
            const messageParsed = JSON.parse(message)
            await authStore.refreshAccountStatus(objectKeysToCamellCase(messageParsed.Data))
          } catch (error) {
            await authStore.refreshAccountStatus()
          }
        })

        let redirect_to = route.query.redirectTo?.toString()
        redirect_to = redirect_to?.slice(1, redirect_to.length)

        init({ message: "You've successfully logged in", color: 'success' })

        if (!redirect_to) {
          console.log('redirect')
          push({ name: 'dashboard' })
          isLoading.value = false
          return
        }

        isLoading.value = false
        push({ name: redirect_to })
      },
      (e) => {
        const messages = e.flatMap((item: ErrorType) => item.message).join(',')
        init({ message: messages, color: 'danger' })
        isLoading.value = false
      },
    )

  }
}
</script>
