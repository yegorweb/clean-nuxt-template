<script setup lang="ts">
import { useField, useForm } from 'vee-validate'

useSeoMeta({
  title: 'Восстановление пароля',
  ogTitle: 'Восстановление пароля',
})

const auth = useAuth()

const { handleSubmit } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: {
    email(value: string) {
      if (!value) return 'нужно заполнить'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return 'неправильный email'
      return true
    },
  },
})

let email = useField<string>('email')

let pressed = ref(false)
let errorMessage = ref()
let loading = ref(false)
let success = ref(false)

const submit = handleSubmit(async values => {
  errorMessage.value = null
  loading.value = true
  let res = await auth.sendResetLink(values.email)
  if (res.ok) success.value = true
  else errorMessage.value = res.message
  loading.value = false
})
</script>

<template>
  <v-container>
    <BackButton />

    <div class="text-h6 font-weight-bold mt-1">Восстановление пароля</div>

    <div v-if="success" class="mt-4">Письмо с ссылкой отправлено</div>

    <v-form v-else class="mt-4" @submit.prevent="pressed = true; submit()">
      <v-row class="ma-0">
        <v-col class="pa-0" cols="12" sm="8" md="6" lg="4">
          <v-text-field 
            label="Email"
            type="email"
            id="email" 
            name="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="pressed?email.errorMessage.value:null"
            variant="outlined"
            density="compact"
            autocomplete="username"
            class="w-100"
          />
        </v-col>

        <v-col :class="['pa-0', { 'mt-3': !!email.errorMessage.value&&pressed }]" cols="12">
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