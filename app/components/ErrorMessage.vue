<script setup lang="ts">
let model = defineModel<string | Extract<StoreResponse<any>, { ok: false }>>()
let message = model.value ? typeof model.value === 'string' ? model.value : generateErrorMessage(model.value) : 'Ошибка'
</script>

<template>
  <div class="error">{{ message }}</div>
</template>

<style lang="postcss" scoped>
.error {
  font-size: 16px;
  color: red;
}
</style>