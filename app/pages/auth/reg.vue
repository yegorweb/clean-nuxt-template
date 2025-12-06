<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js'

let auth = useAuth()

useSeoMeta({
  title: 'Регистрация',
  ogTitle: 'Регистрация',
})

let route = useRoute()
let redirectTo = Array.isArray(route.query.redirect) ? 
  (route.query.redirect[0] ? decodeURIComponent(route.query.redirect[0]) : '/') : 
  (route.query.redirect ? decodeURIComponent(route.query.redirect) : '/')

const { meta, handleSubmit, handleReset, validate } = useForm<{
  fullname: string,
  email: string,
  password: string,
}>({
  initialValues: {
    fullname: '',
    email: '',
    password: '',
  },
  validationSchema: {
    fullname(value: string) {
      if (!value) return 'введите имя, фамилию'
      if (value.length < 4) return 'слишком короткое имя и фамилия'
      if (value.length > 22) return 'слишком длинное имя и фамилия'

      return true
    },
    email(value: string) {
      if (!value) return 'введите email'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return 'неправильный email'

      return true
    },
    password(value: string) {
      if (!value) return 'введите пароль'
      if (value.length < 4) return 'минимум 4 символа'
      if (value.length > 60) return 'слишком длинный пароль'

      return true
    },
  },
})

let fullname = useField<string>('fullname')
let email = useField<string>('email')
let password = useField<string>('password')

let show_password = ref(false)
let pressed = ref(false)
let errorMessage = ref()
let loading = ref(false)

const submit = handleSubmit(async values => {
  errorMessage.value = null
  loading.value = true
  let regRes = await auth.registerUser(values)
  if (regRes.ok) {
    let loginRes = await auth.login(values.email, values.password)
    if (loginRes.ok) await navigateTo(redirectTo, { replace: true })
    else errorMessage.value = loginRes.message
  } else errorMessage.value = regRes.message
  loading.value = false 
})
</script>

<template>
  <v-container>
    <v-row class="justify-center mt-4">
      <v-col cols="12" sm="8" md="6" lg="4">
        <BackButton class="mb-1" />
  
        <v-card 
          class="d-flex flex-column align-center w-100 pl-6 pr-6 pt-4 pb-6 rounded-lg"
          color="grey-lighten-5"
        >
          <div class="text-h6 font-weight-bold">
            Регистрация
          </div>
    
          <v-form
            class="mt-3 w-100 d-flex flex-column align-center"
            @submit.prevent="pressed = true; submit()"
          >
            <v-text-field 
              label="Имя Фамилия"
              id="name" 
              name="name"
              autocomplete="name"
              placeholder="Иван Иванов"
              v-model="fullname.value.value"
              :error-messages="pressed?fullname.errors.value:null"
              variant="outlined"
              density="compact"
              class="w-100"
            />    
  
            <v-text-field 
              label="Email"
              type="email"
              id="email" 
              name="email"
              placeholder="vasya@ya.ru"
              v-model="email.value.value"
              :error-messages="pressed?email.errors.value:null"
              variant="outlined"
              density="compact"
              autocomplete="username"
              :class="['w-100', {'mt-3':!!fullname.errorMessage.value&&pressed}]"
            />          
  
            <v-text-field 
              label="Пароль"
              v-model="password.value.value"
              :append-inner-icon="show_password ? mdiEye : mdiEyeOff"
              @click:append-inner="show_password = !show_password"
              :type="show_password ? 'text' : 'password'"
              :error-messages="pressed?password.errorMessage.value:null"
              variant="outlined"
              density="compact"
              id="password" 
              name="password"
              autocomplete="new-password"
              aria-describedby="password-constraints"
              :class="['w-100', {'mt-3':!!email.errorMessage.value&&pressed}]"
            />
  
            <v-btn 
              type="submit" 
              :loading="loading"
              color="accent"
              style="font-size: 15px !important;"
              :class="['bg-primary', !!password.errorMessage.value&&pressed ? 'mt-3' : 'mt-2']"
            >
              Отправить
            </v-btn>
  
            <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-2" />
          </v-form>
    
          <v-btn
            @click="navigateTo({ path: '/auth/login', replace: true, query: route.query })" 
            variant="text"
            density="compact"
            class="text-body-2 cursor-pointer font-weight-semibold text-blue-darken-3 pa-1 mt-3"
            style="font-size: 16px !important;"
          >
            войти
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>