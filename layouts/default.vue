<script lang="ts" setup>

</script>

<template>
  <v-app>
    <div style="background: #FFFFFF; position: fixed; top: 0; left: 0; right: 0; height: 60px; z-index: 999;">
      <v-container class="d-flex align-center justify-space-between user-select-none" style="height: 60px; position: relative;">
        <div @click="navigateTo('/')" class="d-flex align-center cursor-pointer logo">
            <img src="/favicon.ico" style="height: 40px;" class="logo-img" />
    
            <div class="font-weight-bold" style="font-size: 18px; margin-left: 15px;">Приложение</div>
        </div>
        
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon v-bind="props" variant="plain" />
          </template>

          <v-list variant="tonal" elevation="0" class="rounded-lg pa-0">
            <v-list-item prepend-icon="mdi-home" to="/" :exact="true">
              Главная
            </v-list-item>

            <v-list-item prepend-icon="mdi-account" to="/my-page">
              Кабинет
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </div>
    <div style="height: 60px;"></div>

    <NuxtPage />
  </v-app>
</template>

<style lang="scss" scoped>
.logo-img {
  transition: all .25s;
}
.logo:hover {
  .logo-img {
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.07);
  }
}
</style>
