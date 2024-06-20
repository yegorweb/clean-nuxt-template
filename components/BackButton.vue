<script setup lang="ts">
import { useRouter } from "vue-router";

let router = useRouter()
</script>

<template>
  <div 
    @click="router.back()" 
    class="d-flex pt-1 pr-1 pb-1 cursor-pointer flex-row flex-nowrap align-center justify-start"
  >
    <v-icon>mdi-arrow-left</v-icon>
    
    <div 
      class="text-body-4 ml-1 font-weight-semibold"
    >назад</div>
  </div>
</template>