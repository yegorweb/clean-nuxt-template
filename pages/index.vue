<script lang="ts" setup>
let auth = useAuth()
console.log(auth.user.value)
if (!process.server) {
  setTimeout(() => { fetch('http://localhost:4000/auth/logout', { method: "POST", credentials: "include" }); console.log('dfgdfg') }, 5000)
  watch(auth.user, value => console.log(value))
}
</script>

<template>
  <v-container>
    {{ useState('user').value }}
  </v-container>
</template>

<style scoped></style>
