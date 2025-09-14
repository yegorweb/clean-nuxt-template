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
      if (!value) return 'введите фамилию, имя'
      if (value.length < 4) return 'слишком короткое имя и фамилия'
      if (value.length > 22) return 'слишком длинное имя и фамилия'

      return true
    },
    email(value: string) {
      if (!value) return 'введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'неправильно ведено'

      return true
    },
    password(value: string) {
      if (!value) return 'введите пароль'
      if (value.length < 8) return 'минимум 8 символов'
      if (value.length > 30) return 'слишком длинный пароль'

      return true
    },
  },
})

let fullname = useField<string>('fullname')
let email = useField<string>('email')
let password = useField<string>('password')

let show_password = ref(false)

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
    <BackButton />

    <v-col 
      cols="12" sm="8" md="6" lg="4" 
      class="mt-4 ma-auto"
    >
      <v-card 
        class="d-flex flex-column 
        align-center w-100 pl-6 pr-6 
        pt-4 pb-6 rounded-xl"
        color="grey-lighten-5"
      >
        <div class="text-h6 font-weight-bold">
          Регистрация
        </div>
  
        <v-form
          class="mt-6 w-100 d-flex flex-column align-center"
          @submit="submit"
        >
          <v-text-field 
            label="Имя Фамилия"
            type="name"
            placeholder="Иван Иванов"
            v-model="fullname.value.value"
            :error-messages="fullname.errors.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />    

          <v-text-field 
            label="Email"
            type="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errors.value"
            variant="outlined"
            density="compact"
            autocomplete="username"
            :class="{'w-100': true, 'mt-1': !fullname.errorMessage.value, 'mt-3': fullname.errorMessage.value}"
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
            autocomplete="new-password"
            :class="{'w-100': true, 'mt-1': !email.errorMessage.value, 'mt-3': email.errorMessage.value}"
          />

          <v-btn 
            type="submit" 
            :loading="loading"
            color="accent"
            style="font-size: 15px !important;"
            :class="{'bg-primary': true, 'mt-4': password.errorMessage.value, 'mt-2': !password.errorMessage.value}"
          >
            Отправить
          </v-btn>

          <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-2" />
        </v-form>
  
        <div 
          @click="navigateTo({ path: '/auth/login', replace: true, query: route.query })"
          style="font-size: 16px !important;"
          class="text-subtitle-1 cursor-pointer font-weight-semibold text-blue-darken-4 pa-1 mt-2"
        >
          вход
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>