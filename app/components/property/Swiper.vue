<script setup lang="ts">
const containerRef = ref()
const swiper = useSwiper(containerRef)
const activeIndex = ref(0)

const props = defineProps<{
  slides: any[]
}>()

onMounted(() => {
  nextTick(() => {
    const swiperInstance = containerRef.value?.swiper
    if (!swiperInstance) return

    swiperInstance.on('realIndexChange', (s: any) => {
      activeIndex.value = s.realIndex
    })
  })
})
</script>

<template>
  <section class="relative h-[500px] overflow-hidden">
    <ClientOnly>
      <swiper-container
        ref="containerRef"
        :pagination="false"
        :loop="true"
        class="h-full"
      >
        <swiper-slide
          v-for="slide in slides"
          :key="slide.title"
          class="relative"
        >
          <img
            v-if="slide.image"
            :src="slide.image"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div v-else>
            <span>404 not found</span>
          </div>

          <div class="absolute inset-0 bg-black/40" />

          <div class="absolute bottom-20 left-20 z-10 text-white max-w-2xl">
            <div class="flex items-center gap-4 mb-6">
              <Badge>{{ slide.category }}</Badge>
              <span class="text-sm">{{ slide.units }} units · {{ slide.acres }} acres</span>
            </div>
            <h1 class="text-3xl font-serif font-bold mb-2">{{ slide.title }}</h1>
            <p class="text-xl text-white/80">{{ slide.subtitle }}</p>
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <Button
      size="icon"
      class="absolute left-8 top-1/2 -translate-y-1/2 z-20 rounded-full"
      @click="swiper.prev()"
    >
      <LucideChevronLeft />
    </Button>
    <Button
      size="icon"
      class="absolute right-8 top-1/2 -translate-y-1/2 z-20 rounded-full"
      @click="swiper.next()"
    >
      <LucideChevronRight />
    </Button>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
      <div
        v-for="(_, index) in slides"
        :key="index"
        class="h-2 rounded-full transition-all duration-300"
        :class="activeIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/40'"
      />
    </div>

    <div class="absolute bottom-8 right-8 z-20 flex items-center gap-1.5 text-white">
      <LucideEye class="size-4 opacity-80" />
      <span class="text-sm font-medium">{{ activeIndex + 1 }} / {{ slides.length }}</span>
    </div>
  </section>

</template>

<style scoped>

</style>
