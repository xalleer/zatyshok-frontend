export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    credentials: 'include',

    onRequest({ options }) {
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie']);

        if (headers.cookie) {
          options.headers = {
            ...options.headers,
            cookie: headers.cookie
          };
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        // Очищаємо дані користувача (якщо у вас є store для цього)
        // const authStore = useAuthStore();
        // authStore.clearUser();
        await nuxtApp.runWithContext(() => navigateTo('/auth/business-register'));
      }
    }
  });

  return {
    provide: {
      api
    }
  };
});
