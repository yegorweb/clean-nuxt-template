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
      if (!value) return 'введите email' 
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return 'неправильный email'
      return true
    },
    password(value: string) {
      if (!value) return 'введите пароль'
      if (value.length < 4) return 'минимум 4 символа'
      return true
    },
  },
})

const email = useField('email')
const password = useField('password')

let pressed = ref(false)
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
    <v-row class="justify-center mt-4">
      <v-col cols="12" sm="8" md="6" lg="4">
        <BackButton class="mb-1" />
  
        <v-card 
          class="d-flex flex-column justify-center align-center rounded-lg w-100 pl-6 pr-6 pt-4 pb-6"
          color="grey-lighten-5"
        >
          <div class="text-h6 font-weight-bold">Авторизация</div>
    
          <v-form @submit.prevent="pressed = true; login()" class="d-flex mt-3 flex-column align-center justify-center w-100">
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
  
            <v-text-field 
              label="Пароль"
              v-model="password.value.value"
              :append-inner-icon="show_password ? mdiEye : mdiEyeOff"
              @click:append-inner="show_password = !show_password"
              :type="show_password ? 'text' : 'password'"
              :error-messages="pressed?password.errorMessage.value:null"
              variant="outlined"
              density="compact"
              id="current-password" 
              name="current-password"
              describedby="password-constraints"
              autocomplete="current-password"
              :class="['w-100', {'mt-3': !!email.errorMessage.value&&pressed}]"
            />
  
            <div :style="{ marginTop: !!password.errorMessage.value&&pressed ? '4px' : '-14px' }" class="w-100">
              <v-btn 
                @click="navigateTo('/auth/forgot-password')"
                density="compact"
                variant="text" 
                color="blue-darken-3" 
                class="reset"
                slim
              >Не помню пароль</v-btn>
            </div>
  
            <v-btn 
              type="submit" 
              :loading="loading" 
              color="accent" 
              style="font-size: 15px !important;"
              class="bg-primary mt-3"
            >Войти</v-btn>
  
            <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-2" />
          </v-form>
    
          <v-btn
            @click="navigateTo({ path: '/auth/reg', replace: true, query: route.query })" 
            variant="text"
            density="compact"
            class="text-body-2 cursor-pointer font-weight-semibold text-blue-darken-3 pa-1 mt-3"
            style="font-size: 16px !important;"
          >
            зарегистрироваться
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>