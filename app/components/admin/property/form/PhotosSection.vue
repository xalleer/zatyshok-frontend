<script setup lang="ts">
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface UploadedImage {
  id: string
  url: string
  name: string
  isCover: boolean
}

const images = defineModel<UploadedImage[]>({ default: () => [] })

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const errors = ref<string[]>([])

const coverImage = computed(() => images.value.find(i => i.isCover) ?? null)
const extraImages = computed(() => images.value.filter(i => !i.isCover))

function processFiles(files: FileList | null) {
  if (!files || files.length === 0) return
  errors.value = []

  const validFiles: File[] = []
  Array.from(files).forEach(file => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      errors.value.push(`«${file.name}» — непідтримуваний формат`)
    } else if (file.size > MAX_FILE_SIZE) {
      errors.value.push(`«${file.name}» — перевищує 10 МБ`)
    } else {
      validFiles.push(file)
    }
  })

  if (!validFiles.length) return

  let loaded = 0
  const newImages: UploadedImage[] = []

  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const hasCover = images.value.some(i => i.isCover)
      newImages.push({
        id: Math.random().toString(36).slice(2),
        url: e.target?.result as string,
        name: file.name,
        isCover: !hasCover && newImages.length === 0,
      })
      loaded++
      if (loaded === validFiles.length) {
        images.value = [...images.value, ...newImages]
      }
    }
    reader.readAsDataURL(file)
  })

  if (inputRef.value) inputRef.value.value = ''
}

function onFileInputChange(e: Event) {
  processFiles((e.target as HTMLInputElement).files)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  processFiles(e.dataTransfer?.files ?? null)
}

function removeImage(id: string) {
  const wasCover = images.value.find(i => i.id === id)?.isCover ?? false
  const next = images.value.filter(i => i.id !== id)
  if (wasCover && next.length > 0) next[0].isCover = true
  images.value = next
}

function setCover(id: string) {
  images.value = images.value.map(i => ({ ...i, isCover: i.id === id }))
}
</script>

<template>
  <div class="rounded-xl border border-zinc-200 p-6 flex flex-col gap-5 bg-card">

    <div class="flex flex-col gap-1">
      <h4 class="text-lg font-semibold">Фото</h4>
      <span class="text-sm text-muted-foreground">
        Додайте обкладинку та додаткові фото. Перше завантажене фото стане обкладинкою.
      </span>
    </div>

    <div
        class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors duration-150 select-none"
        :class="isDragging
        ? 'border-green-600 bg-green-50'
        : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-50'"
        @click="inputRef?.click()"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="onDrop"
    >
      <div class="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
        <LucideUpload class="size-5 text-zinc-500" />
      </div>
      <div class="text-center">
        <p class="text-sm font-medium text-zinc-700">
          Перетягніть фото сюди або натисніть для вибору
        </p>
        <p class="text-xs text-muted-foreground mt-0.5">
          JPG, PNG, WebP · до 10 МБ кожне
        </p>
      </div>
      <input
          ref="inputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="hidden"
          @change="onFileInputChange"
      />
    </div>

    <TransitionGroup name="err" tag="div" class="flex flex-col gap-1">
      <div
          v-for="(err, i) in errors"
          :key="i"
          class="flex items-center gap-2 text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2"
      >
        <LucideAlertCircle class="size-3.5 shrink-0" />
        {{ err }}
      </div>
    </TransitionGroup>

    <Transition name="fade">
      <div v-if="coverImage" class="flex flex-col gap-2">
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Обкладинка
        </span>
        <div class="relative h-48 rounded-xl overflow-hidden border-2 border-green-600 group">
          <img
              :src="coverImage.url"
              :alt="coverImage.name"
              class="w-full h-full object-cover"
          />
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1 bg-green-700 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
            <LucideStar class="size-2.5 fill-white" />
            Обкладинка
          </div>
          <button
              type="button"
              class="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              @click.stop="removeImage(coverImage.id)"
          >
            <LucideTrash2 class="size-3.5" />
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="extraImages.length > 0" class="flex flex-col gap-2">
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Додаткові фото ({{ extraImages.length }})
        </span>
        <div class="grid grid-cols-3 gap-2">
          <TransitionGroup name="grid-item">
            <div
                v-for="img in extraImages"
                :key="img.id"
                class="relative h-24 rounded-xl overflow-hidden border border-zinc-200 group"
            >
              <img
                  :src="img.url"
                  :alt="img.name"
                  class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-150 flex items-end justify-end p-1.5 gap-1.5 opacity-0 group-hover:opacity-100">
                <button
                    type="button"
                    title="Зробити обкладинкою"
                    class="w-6 h-6 rounded-md bg-white/90 hover:bg-white flex items-center justify-center text-amber-600 transition-colors"
                    @click.stop="setCover(img.id)"
                >
                  <LucideStar class="size-3" />
                </button>
                <button
                    type="button"
                    title="Видалити"
                    class="w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                    @click.stop="removeImage(img.id)"
                >
                  <LucideTrash2 class="size-3" />
                </button>
              </div>
            </div>
          </TransitionGroup>

          <Button
              type="button"
              class="h-24 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer"
              @click="inputRef?.click()"
          >
            <LucidePlus class="size-4" />
            <span class="text-[10px]">Додати</span>
          </Button>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
          v-if="images.length === 0"
          class="flex items-start gap-2.5 text-xs text-muted-foreground bg-zinc-50 border border-zinc-100 rounded-lg p-3"
      >
        <LucideInfo class="size-3.5 shrink-0 mt-0.5" />
        <span>
          Оголошення з щонайменше <strong>5 фото</strong> отримують на 40% більше бронювань.
        </span>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.grid-item-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.grid-item-enter-from {
  opacity: 0;
  transform: scale(0.92);
}
.grid-item-leave-active {
  transition: opacity 0.15s ease;
  position: absolute;
}
.grid-item-leave-to {
  opacity: 0;
}

.err-enter-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  overflow: hidden;
}
.err-enter-from {
  opacity: 0;
  max-height: 0;
}
.err-enter-to {
  max-height: 40px;
}
.err-leave-active {
  transition: opacity 0.15s ease;
}
.err-leave-to {
  opacity: 0;
}
</style>