<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} – Сайт` : 'Сайт'
  }
})

useSeoMeta({
  description: 'Описание',
  ogTitle: 'Сайт',
  ogDescription: 'Описание',
  ogImage: 'https://site.com/og-image.jpg',
  ogUrl: 'https://site.com/',
  ogLocale: 'ru-RU',
  twitterTitle: 'Сайт',
  twitterDescription: 'Описание',
  twitterImage: 'https://site.com/og-image.jpg',
  twitterCard: 'summary',
  applicationName: 'Сайт',
})
</script>

<template>

</template>
