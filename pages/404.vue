<script lang="ts" setup>
let router = useRouter()
</script>

<template>
  <v-container>
    <BackButton />

    <div class="mt-4 d-flex flex-column align-center">
      <div 
        style="font-size: 66px; line-height: 1;" 
        class="font-weight-bold"
      >
        404
      </div>

      <div>Не найдено</div>

      <v-btn 
        @click="router.back()"
        size="small"
        variant="tonal"
        class="pr-5 pl-5 mt-4 font-weight-semibold"
      >
        Назад
      </v-btn>
    </div>
  </v-container>
</template>