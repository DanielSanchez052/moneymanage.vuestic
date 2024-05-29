<template>
  <VaForm ref="passwordForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Forgot your password?</h1>
    <p class="text-base mb-4 leading-5">
      If you've forgotten your password, don't worry. Simply enter your email address below, and we'll send you an email
      with a temporary password. Restoring access to your account has never been easier.
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Email field is required']"
      class="mb-4"
      label="Enter your email"
      type="email"
    />
    <VaButton class="w-full mb-2" :loading="isLoading" @click="submit">Send password</VaButton>
    <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary" @click="submit">Go back</VaButton>
  </VaForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useForm } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import AuthService from '../../api/users/auth.service'
import { RecoverPasswordRequest } from './types'

const { validate } = useForm('passwordForm')
const router = useRouter()

const formData = reactive<RecoverPasswordRequest>({
  email: '',
})
const isLoading = ref(false)
const error = ref(false)
const messages = ref<string[]>([])

const submit = async () => {
  isLoading.value = true
  if (validate()) {
    const response = await AuthService.resetPasswordRequest(formData)

    if (!response.success) {
      error.value = true
      messages.value.push(...response.errors.map((e) => e.message))
      isLoading.value = false
    } else {
      isLoading.value = false
      router.push({ name: 'recover-password-email' })
    }
    isLoading.value = false
  }
}
</script>
