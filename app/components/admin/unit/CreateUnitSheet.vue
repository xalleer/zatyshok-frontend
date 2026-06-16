<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { UploadedImage } from '@/components/admin/property/form/PhotosSection.vue'

const props = defineProps<{ propertyId: string }>()
const emit = defineEmits<{ done: [] }>()

const unitStore = useUnitStore()
const open = ref(false)
const photos = ref<UploadedImage[]>([])

const featureInput = ref('')
const features = ref<string[]>([])

const addFeature = () => {
  const val = featureInput.value.trim()
  if (val && !features.value.includes(val)) {
    features.value.push(val)
  }
  featureInput.value = ''
}

const removeFeature = (i: number) => {
  features.value.splice(i, 1)
}

const onFeatureKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addFeature()
  }
  if (e.key === 'Backspace' && !featureInput.value && features.value.length) {
    features.value.pop()
  }
}

const schema = toTypedSchema(z.object({
  name: z.string().min(2, 'Мінімум 2 символи'),
  description: z.string().optional(),
  priceUah: z
    .number()
    .min(1, 'Вкажіть ціну')
    .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Має бути числом > 0'),
  capacity: z
    .number()
    .min(1, 'Вкажіть місткість')
    .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Має бути числом > 0'),
}))

const form = useForm({ validationSchema: schema })

const onSubmit = form.handleSubmit(async (values) => {
  const unit = await unitStore.createUnit(props.propertyId, {
    name: values.name,
    description: values.description,
    price: Math.round(Number(values.priceUah) * 100),
    capacity: Number(values.capacity),
    features: features.value,
  })

  if (photos.value.length && unit?.id) {
    const files = photos.value.map(p => base64ToFile(p.url, p.name))
    await unitStore.uploadUnitPhotos(unit.id, files)
  }

  open.value = false
  form.resetForm()
  features.value = []
  photos.value = []
  emit('done')
})
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button>
        <LucidePlus class="size-4" />
        Додати юніт
      </Button>
    </SheetTrigger>

    <SheetContent class="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
      <SheetHeader class="px-6 py-5 border-b border-zinc-100">
        <SheetTitle class="text-base font-semibold">Новий юніт</SheetTitle>
        <SheetDescription class="text-sm text-muted-foreground">
          Заповніть основну інформацію та додайте фото
        </SheetDescription>
      </SheetHeader>

      <form class="flex flex-col gap-6 px-6 py-6 flex-1" @submit="onSubmit">

        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Назва</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder='Купол "Світанок"' />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>
              Опис
              <span class="text-muted-foreground font-normal">(необов'язково)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Ідеально для романтичного вікенду на двох."
                class="min-h-[90px] resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="priceUah">
            <FormItem>
              <FormLabel>Ціна за ніч, ₴</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    v-bind="componentField"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="2500"
                    class="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <InputGroupAddon align="inline-end">
                    <span class="text-sm text-muted-foreground">₴</span>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="capacity">
            <FormItem>
              <FormLabel>Місткість</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    v-bind="componentField"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="2"
                  />
                  <InputGroupAddon align="inline-end">
                    <LucideUsers class="size-3.5 text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium leading-none">Зручності</label>

          <div
            class="flex flex-wrap gap-1.5 min-h-[38px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
            @click="($el as HTMLElement).querySelector('input')?.focus()"
          >
            <span
              v-for="(f, i) in features"
              :key="f"
              class="inline-flex items-center gap-1 rounded-md bg-zinc-100 text-zinc-700 px-2 py-0.5 text-xs font-medium"
            >
              {{ f }}
              <button
                type="button"
                class="text-zinc-400 hover:text-zinc-700 transition-colors"
                @click.stop="removeFeature(i)"
              >
                <LucideX class="size-3" />
              </button>
            </span>

            <input
              v-model="featureInput"
              class="flex-1 min-w-[120px] outline-none bg-transparent text-sm placeholder:text-muted-foreground"
              placeholder="WiFi, Камін, Чан..."
              @keydown="onFeatureKeydown"
              @blur="addFeature"
            />
          </div>
          <p class="text-xs text-muted-foreground">Enter або кома для додавання</p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium leading-none">Фото</label>
          <AdminPropertyFormPhotosSection v-model="photos" />
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 mt-auto border-t border-zinc-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="open = false"
          >
            Скасувати
          </Button>
          <Button type="submit" size="sm" :disabled="unitStore.loading">
            <Spinner v-if="unitStore.loading" />
            Створити юніт
          </Button>
        </div>

      </form>
    </SheetContent>
  </Sheet>
</template>
