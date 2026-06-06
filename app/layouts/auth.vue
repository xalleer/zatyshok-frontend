<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue'

const router = useRouter()
const { customBack } = useAuthLayout()

const goBack = () => {
  if (customBack.value) {
    customBack.value()
    return
  }
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'index' })
  }
}

onUnmounted(() => {
  customBack.value = null
})
</script>

<template>
  <div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
    <main class="flex items-center justify-center p-6 relative">
      <Button
        variant="ghost"
        class="absolute top-6 left-6 inline-flex items-center gap-1 text-sm"
        @click="goBack"
      >
        <ChevronLeft class="size-4" />
        Назад
      </Button>

      <slot />
    </main>

    <aside class="hidden lg:flex items-center justify-center bg-gray-50 border-l">
      <img
        class="h-screen w-full object-cover"
        src="~/assets/img/auth-bg.png"
        alt="Затишок — реєстрація"
      >
    </aside>
  </div>
</template>
