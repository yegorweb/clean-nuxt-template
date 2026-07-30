# Описание
Это приложение на Nuxt

После копирования шаблона <https://github.com/yegorweb/clean-nuxt-template> рекомендуется обновить Nuxt и его зависимости с помощью этих команд:
```shell
npx nuxt upgrade --dedupe
npm i baseline-browser-mapping@latest -D
```

# Перед запуском

## Установка зависимостей
```shell
npm i
```

## Переменные окружения
Все переменные окружения прописывать в `.env`:
- `NUXT_DEV_PORT`?: номер порта в режиме разработки
- `NUXT_SITE_NAME`: название сайта для Nuxt Sitemap
- `NUXT_PUBLIC_SITE_URL`: URL сайта
- `NUXT_PUBLIC_API_BASE`: URL к API

# Разработка

```shell
npm run dev
```

# Важные моменты

### Auth store
Auth store доступен с composable `useAuth`
```vue
<script setup lang="ts">
const auth = useAuth()

// На страницах с защитой
// При { required: true } user будет иметь NonNullable тип User, acccessToken будет иметь NonNullable тип string
const auth = useAuth({ required: true })
</script>
```

### Страница только для авторизированных
```vue
<script setup lang="ts">
definePageMeta({
  auth: true
})

const auth = useAuth({ required: true })
</script>
```

### API fetch

#### `useApiFetch` (from composables/useApiFetch.ts)
`useApiFetch` — это кастомный `useFetch`, который используется точно так же как `useFetch`
```ts
const { data, resfresh } = await useApiFetch('/user/get-all')
```

#### `$apiFetch` (from plugins/1.api.ts)
`$apiFetch` — это кастомный `$fetch`, находящийся в nuxtApp
```ts
const { $apiFetch } = useNuxtApp()
const res = await $apiFetch.raw('/user/get-all')
```

### Safety API fetch

Для обработки исключений рекомендую возвращать с функций значение типа `MaybePromise<StoreResponse<T>>`. <br>
`StoreResponse<T>` — это тип ответа который либо `{ ok: true, data: T }` либо `{ ok: false, message?: string, status?: number }`

#### `$apiFetchSafe` (from plugins/1.api.ts)
`$apiFetchSafe` — это асинхронная функция, вызывающая `$apiFetch` и находящийся в nuxtApp, которая возвращает `Promise<StoreResponse<T>>`
```ts
const { $apiFetchSafe } = useNuxtApp()
const res = await $apiFetchSafe('/user/get-all')
// { ok: true, data: [...] } или { ok: false, ... }
```

#### `$fetchSafe` (from plugins/1.api.ts)
`$fetchSafe` — это асинхронная функция, вызывающая `$fetch` и находящийся в nuxtApp, которая возвращает `Promise<StoreResponse<T>>`
```ts
const { $fetchSafe } = useNuxtApp()
const res = await $fetchSafe('/user/get-all')
// { ok: true, data: [...] } или { ok: false, ... }
```

#### `$apiFetchSafeWithCookies` (from plugins/1.api.ts)
`$apiFetchSafeWithCookies` — это асинхронная функция, вызывающая `$apiFetch` и находящийся в nuxtApp, которая возвращает `Promise<StoreResponse<T>>` и прокидывает cookies на клиент если вызывается с сервера
```ts
const { $apiFetchSafeWithCookies } = useNuxtApp()
const event = useRequestEvent()
const { data, refresh } = await useAsyncData(
  () => $apiFetchSafeWithCookies(event, '/cookie-route')
)
// { ok: true, data: [...] } или { ok: false, ... }
```

#### `$fetchSafeWithCookies` (from plugins/1.api.ts)
`$fetchSafeWithCookies` — это асинхронная функция, вызывающая `$fetch` и находящийся в nuxtApp, которая возвращает `Promise<StoreResponse<T>>` и прокидывает cookies на клиент если вызывается с сервера
```ts
const { $fetchSafeWithCookies } = useNuxtApp()
const event = useRequestEvent()
const { data, refresh } = await useAsyncData(
  () => $fetchSafeWithCookies(event, '/cookie-route')
)
// { ok: true, data: [...] } или { ok: false, ... }
```

### Рекомендуемый вид store
```ts
// path: ~/composables/useUser.ts
export const useUser = () => {
  const { $apiFetchSafe } = useNuxtApp()

  async function getMyName() {
    return await $apiFetchSafe<string>('/user/my-name', { 
      method: 'GET',
    })
  }

  return {
    getMyName,
  }
}
```

## License

Все файлы шаблона (репозитория), доступного по адресу  
<https://github.com/yegorweb/clean-nuxt-template>,  
распространяются по лицензии **MIT** в соответствии с [файлом LICENSE](https://github.com/yegorweb/clean-nuxt-template/blob/master/LICENSE), хранящимся в корне этого репозитория.

Вы можете использовать этот шаблон как основу для своих проектов.  
Лицензия будущего проекта определяется **вами**: вы вправе
оставить MIT, выбрать другую лицензию или вовсе
распространять проект без лицензии.
