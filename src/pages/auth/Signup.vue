<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">{{ t('auth.sign_up') }}</h1>
    <p class="text-base mb-4 leading-5">
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">{{ t('auth.login') }}</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Email field is required', (v) => /.+@.+\..+/.test(v) || 'Email should be valid']"
      class="mb-4"
      :label="t('auth.email')"
      type="email"
    />
    <VaInput
      v-model="formData.username"
      :rules="[(v) => !!v || 'Username field is required']"
      class="mb-4"
      :label="t('auth.username')"
      type="text"
    />
    <VaInput
      v-model="formData.phone"
      :rules="[
        (v) => !!v || 'phone field is required',
        (v) =>
          /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g.test(
            v,
          ) || 'phone number should be valid',
      ]"
      class="mb-4"
      :label="t('auth.phone')"
      type="tel"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.password')"
        :messages="t('auth.password_help')"
        :rules="passwordRules"
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
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v) => !!v || 'Repeat Password field is required',
          (v) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.repeat_password')"
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
    <div v-show="error" class="w-full mb-6">
      <p v-for="errorM in messages" :key="errorM" class="mt-2 text-sm text-red-600 dark:text-red-500">
        {{ errorM }}
      </p>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" :loading="isLoading" @click="submit">{{ t('auth.createAccount') }}</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '../../stores/auth'
import { NewUser } from './types'
import { useI18n } from 'vue-i18n'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const { t } = useI18n()

const authStore = useAuthStore()

const formData = reactive<NewUser>({
  email: '',
  username: '',
  phone: '',
  password: '',
  repeatPassword: '',
})

const isLoading = ref(false)
const error = ref(false)
const messages = ref<string[]>([])

const submit = async () => {
  isLoading.value = true
  if (validate()) {
    authStore.register(formData).then((response) => {
      if (response.success) {
        init({
          message: "You've successfully signed up",
          color: 'success',
        })
        push({ name: 'login' })
        isLoading.value = false
      } else {
        error.value = true
        messages.value.push(...response.errors.map((e) => e.message))
        isLoading.value = false
      }
    })
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
