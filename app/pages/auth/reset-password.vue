<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { mdiEye, mdiEyeOff } from '@mdi/js'

useSeoMeta({
  title: 'Сброс пароля',
  ogTitle: 'Сброс пароля',
})

const auth = useAuth()

const { handleSubmit } = useForm({
  initialValues: {
    password: '',
  },
  validationSchema: {
    password(value: string) {
      if (!value) return 'введите пароль'
      if (value.length < 4) return 'минимум 4 символа'
      if (value.length > 60) return 'слишком длинный пароль'

      return true
    },
  },
})

let password = useField<string>('password')
let user_id = useRoute().query.user_id as string
let token = useRoute().query.token as string

let pressed = ref(true)
let showPassword = ref(false)
let errorMessage = ref()
let loading = ref(false)

const submit = handleSubmit(async values => {
  errorMessage.value = null
  loading.value = true
  let res = await auth.resetPassword(values.password, token, user_id)
  if (res.ok) await navigateTo('/auth/login', { replace: true })
  else errorMessage.value = res.message
  loading.value = false
})
</script>

<template>
  <v-container>
    <BackButton />

    <div class="text-h6 font-weight-bold mt-1">Сброс пароля</div>

    <v-form class="mt-4" @submit.prevent="pressed = true; submit()">
      <v-row class="ma-0">
        <v-col class="pa-0" cols="12" sm="8" md="6" lg="4">
          <v-text-field 
            label="Пароль"
            v-model="password.value.value"
            :append-inner-icon="showPassword ? mdiEye : mdiEyeOff"
            @click:append-inner="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            :error-messages="pressed?password.errorMessage.value:null"
            variant="outlined"
            density="compact"
            autocomplete="new-password"
            class="w-100"
          />
        </v-col>

        <v-col :class="['pa-0', { 'mt-3': !!password.errorMessage.value&&pressed }]" cols="12">
          <v-btn
            :loading="loading"
            style="font-size: 16px !important;"
            type="submit"
            class="bg-primary"
          >Отправить</v-btn>
        </v-col>

        <v-col v-if="errorMessage" class="pa-0" cols="12">
          <ErrorMessage :message="errorMessage" />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>