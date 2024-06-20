<script setup lang="ts">
import { useField, useForm } from 'vee-validate';

// document.title = 'Авторизация — Ищу наставника'

let router = useRouter()

const { meta, handleSubmit, handleReset } = useForm({
  validationSchema: {
    password(value: string) {
      if (value?.length >= 6) return true
      return 'нужно 6 символов'
    },
    email(value: string) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return true
      return 'неправильный формат email'
    },
  },
})

const email = useField('email')
const password = useField('password')
let show_password = ref(false)

let loading = ref(false)

const login = handleSubmit(async values => {
  loading.value = true
  // await auth.login(values.email, values.password)
  loading.value = false
  
  router.push('/')
})
</script>

<template>
  <v-container class="align-start">
    <BackButton></BackButton>

    <v-col cols="12" xs="12" md="6" lg="4" class="mt-4 ma-auto">
      <v-card 
        class="d-flex flex-column justify-center align-center text-center rounded-lg w-100 pl-6 pr-6 pt-4 pb-6"
      >
        <div class="text-h6 font-weight-bold">Вход</div>
  
        <v-form @submit.prevent="login" class="d-flex mt-3 flex-column align-center justify-center w-100">
          <v-text-field 
            label="Email"
            type="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />          

          <v-text-field 
            label="Пароль"
            v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password"
            :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />

          <v-btn type="submit" :disabled="!meta.valid" color="accent" class="mt-4">Войти</v-btn>
        </v-form>
  
        <div 
          @click="router.push('/registration')" 
          :loading="loading"
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1 mt-4"
        >
          регистрация
        </div>
        <div
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1"
        >
          восстановить пароль
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>