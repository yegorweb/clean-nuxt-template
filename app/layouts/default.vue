<script lang="ts" setup>
import Logo from '~/assets/images/logo.svg'
</script>

<template>
  <div class="header">
    <v-container class="d-flex align-center justify-space-between pt-0 pb-0"
      style="height: 60px; position: relative;">
      <div @click="navigateTo('/')" class="d-flex flex-row justify-center align-center cursor-pointer logo h-100">
        <Logo class="logo-img" />

        <div class="font-weight-bold" style="font-size: 22px; margin-left: 13px;">Сайт</div>
      </div>
    </v-container>
  </div>

  <NuxtPage />

  <v-spacer />

  <footer>
    <v-container>
      Футер
    </v-container>
  </footer>
</template>

<style lang="postcss" scoped>
.logo,
.logo * {
  user-select: none;
}

.logo-img {
  height: 40px;
}

.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition: all .15s;
}
</style>
