<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js'

useSeoMeta({
  title: 'Вход',
  ogTitle: 'Вход',
})

let route = useRoute()

let auth = useAuth()
let redirectTo = Array.isArray(route.query.redirect) ? 
  (route.query.redirect[0] ? decodeURIComponent(route.query.redirect[0]) : '/') : 
  (route.query.redirect ? decodeURIComponent(route.query.redirect) : '/')

const { handleSubmit } = useForm({
  validationSchema: {
    email(value: string) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return true
      return 'неправильный email'
    },
    password(value: string) {
      if (value?.length >= 8) return true
      return 'нужно 8 символов'
    },
  },
})

const email = useField('email')
const password = useField('password')
let show_password = ref(false)

let errorMessage = ref()
let loading = ref(false)

const login = handleSubmit(async values => {
  errorMessage.value = null
  loading.value = true
  let res = await auth.login(values.email, values.password)
  if (res.ok) await navigateTo(redirectTo, { replace: true })
  else errorMessage.value = res.message
  loading.value = false
})
</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" sm="8" md="6" lg="4" class="mt-4 ma-auto">
      <v-card 
        class="d-flex flex-column justify-center align-center rounded-xl w-100 pl-6 pr-6 pt-4 pb-6"
        color="grey-lighten-5"
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
            autocomplete="username"
            class="w-100"
          />

          <v-text-field 
            label="Пароль"
            v-model="password.value.value"
            :append-inner-icon="show_password ? mdiEye : mdiEyeOff"
            @click:append-inner="show_password = !show_password"
            :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value"
            variant="outlined"
            density="compact"
            autocomplete="current-password"
            :class="['w-100', {'mt-3': !!email.errorMessage.value}]"
          />

          <v-btn 
            type="submit" 
            :loading="loading" 
            color="accent" 
            style="font-size: 15px !important;"
            class="bg-primary mt-3"
          >Войти</v-btn>

          <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-2" />
        </v-form>
  
        <div 
          @click="navigateTo({ path: '/auth/reg', replace: true, query: route.query })" 
          :loading="loading"
          class="text-body-2 cursor-pointer font-weight-semibold text-blue-darken-4 pa-1 mt-4"
          style="font-size: 16px !important;"
        >
          регистрация
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>