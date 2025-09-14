# Описание
Это приложение на Nuxt

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
auth = useAuth()
</script>
```

### Api fetch
В компонентах можно исользовать кастомный `useFetch` — `useApiFetch`
```ts
const { data, resfresh } = await useApiFetch('/user/get-all')
```
В остальных случаях (например в сторах) надо использовать кастомный `$fetch` который отдается функцией `useApiFetchRaw`
```ts
const $apiFetch = useApiFetchRaw()
const data = await $apiFetch('/user/get-all')
```

### Страница только для авторизированных
```vue
<script setup lang="ts">
definePageMeta({
  auth: true
})
</script>
```

### Ответ со store
Для обработки исключений рекомендую возвращать с функций значение типа `MaybePromise<StoreResponse<T>>`. <br>
`StoreResponse<T>` — это тип ответа который либо `{ ok: true, data: T }` либо `{ ok: false, message?: string, status?: number }` <br>
Рекомендуемый вид store:
```ts
// path: ~/composables/useUser.ts
export const useUser = () => {
  let $apiFetch = useApiFetchRaw()

  async function getMyName(): Promise<StoreResponse<string>> {
    let response: StoreResponse<string> = { ok: false }

    await $apiFetch<string>('/user/my-name', { method: 'GET' }).then(data => {
      response = { ok: true, data }
    }).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
    })

    return response
  }

  return {
    getMyName,
  }
}
```

### Fetch with cookies from SSR and pass they to the client
Для этого есть util `useApiFetchWithCookies` — с API и util `useFetchWithCookies` — с любого ресурса. Оба принимают `$fetch` параметры и доступны из любого места.
```vue
<script setup lang="ts">
const event = useRequestEvent()

const { data:result, refresh } = await useAsyncData(() => useApiFetchWithCookies(event!, '/cookie-route'))
</script>
```