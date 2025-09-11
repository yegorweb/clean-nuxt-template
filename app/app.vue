<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} – Сайт` : 'Сайт'
  },
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/logo.svg",
    },
  ],
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
  <v-app>
    <NuxtLayout />
  </v-app>
</template>
