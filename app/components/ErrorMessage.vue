<script setup lang="ts">
let props = defineProps<{ message: string | undefined }>()
let errorMessage = props.message ? `: ${props.message}` : ''
</script>

<template>
  <div class="error">Ошибка{{ errorMessage }}</div>
</template>

<style lang="postcss" scoped>
.error {
  font-size: 16px;
  color: red;
}
</style>