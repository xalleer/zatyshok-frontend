<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { PropertyPolicy } from '~/types'
import { ImageUp, X, Plus, MapPin } from '@lucide/vue'
import { generateSlug } from '~/utils/slugGenerator'
import {policyOptions} from "~/constants/lists";

const propertyStore = usePropertyStore()
const route = useRoute()
const isEdit = computed(() => !!route.params.id)

const {data: property} = await useAsyncData(() => propertyStore.getAdminPropertyById(route.params.id as string))


const schema = toTypedSchema(z.object({
  name: z.string({ message: 'Обов\'язкове поле' }).min(3, 'Мінімум 3 символи'),
  slug: z.string({ message: 'Обов\'язкове поле' }).min(3).regex(/^[a-z0-9-]+$/, 'Тільки латиниця, цифри та дефіс'),
  description: z.string().optional(),
  city: z.string({ message: 'Вкажіть місто' }).min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  policy: z.enum(PropertyPolicy),
}))

const form = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    policy: PropertyPolicy.FLEXIBLE,
  },
})

const { resetForm, setFieldValue } = form

const coverPreview = ref<string | null>(null)
const coverFile = ref<File | null>(null)
const images = ref<{ url: string; file?: File }[]>([])

watch(() => property.value, (newProperty) => {
  console.log('Property loaded:', newProperty)
  if (newProperty) {
    propertyStore.setProperty(newProperty)
    resetForm({
      values: {
        name: newProperty.name ?? '',
        slug: newProperty.slug ?? '',
        description: newProperty.description ?? '',
        city: newProperty.city ?? '',
        latitude: newProperty.latitude,
        longitude: newProperty.longitude,
        policy: newProperty.policy ?? PropertyPolicy.FLEXIBLE,
      }
    })
    coverPreview.value = newProperty.coverImage || null
    images.value = newProperty.images?.map(url => ({ url })) ?? []
    console.log('Form reset with city:', newProperty.city)
  }
}, { immediate: true })

const { value: nameValue } = useField<string>('name')
const { value: slugValue, setValue: setSlug } = useField<string>('slug')

const handleGenerateSlug = () => {
  setSlug(generateSlug(nameValue.value ?? ''))
}

watch(nameValue, () => {
  if (!isEdit.value) handleGenerateSlug()
})

const onCoverChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
  
  if (isEdit.value) {
    const formData = new FormData();
    formData.append('file', file);
    await propertyStore.uploadCoverImage(route.params.id as string, formData)
  }
}

const onImagesChange = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  files.forEach(file => {
    images.value.push({ url: URL.createObjectURL(file), file })
  })
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const onSubmit = form.handleSubmit(async (values) => {
  const payload = {
    ...values,
    latitude: values.latitude,
    longitude: values.longitude,
  }

  if (isEdit.value) {
    const newFiles = images.value.map(img => img.file).filter((f): f is File => !!f)
    if (newFiles.length) {
      await propertyStore.uploadPropertyPhotos(route.params.id as string, newFiles)
    }
    await propertyStore.updateProperty(route.params.id as string, payload)
  } else {
    const newProperty = await propertyStore.createProperty(payload)
    if (newProperty?.id) {
      if (coverFile.value) {
        const formData = new FormData();
        formData.append('file', coverFile.value);
        await propertyStore.uploadCoverImage(newProperty.id, formData)
      }
      const newFiles = images.value.map(img => img.file).filter((f): f is File => !!f)
      if (newFiles.length) {
        await propertyStore.uploadPropertyPhotos(newProperty.id, newFiles)
      }
    }
  }
  await navigateTo({ name: 'admin-properties' })
})
</script>

<template>
  <div class="max-w-2xl mx-auto py-6 space-y-4">

    <div>
      <h1 class="text-xl font-semibold">
        {{ isEdit ? 'Редагування об\'єкта' : 'Новий об\'єкт' }}
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Заповніть інформацію про ваш об'єкт оренди
      </p>
    </div>

    <form @submit="onSubmit" class="space-y-4">

      <Card class="p-6 gap-4">
        <div>
          <h2 class="text-sm font-medium">Фотографії</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Головне фото та галерея</p>
        </div>

        <div class="space-y-2">
          <Label>Обкладинка</Label>
          <label
            class="relative flex h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition hover:border-foreground overflow-hidden"
          >
            <input type="file" accept="image/*" class="sr-only" @change="onCoverChange" />
            <template v-if="coverPreview">
              <img :src="coverPreview" class="absolute inset-0 h-full w-full object-cover rounded-lg" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition">
                <span class="text-white text-sm font-medium">Змінити</span>
              </div>
            </template>
            <template v-else>
              <ImageUp class="size-8 text-muted-foreground" />
              <span class="mt-2 text-sm text-muted-foreground">
                <strong class="text-foreground">Натисніть</strong> або перетягніть файл
              </span>
              <span class="text-xs text-muted-foreground">PNG, JPG до 5 МБ</span>
            </template>
          </label>
        </div>

        <div class="space-y-2">
          <Label>Додаткові фото</Label>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(img, i) in images" :key="i"
              class="relative size-[72px] overflow-hidden rounded-lg border"
            >
              <img :src="img.url" class="h-full w-full object-cover" />
              <button
                type="button"
                class="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                @click="removeImage(i)"
              >
                <X class="size-3" />
              </button>
            </div>

            <label class="flex size-[72px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-foreground hover:text-foreground transition">
              <input type="file" accept="image/*" multiple class="sr-only" @change="onImagesChange" />
              <Plus class="size-5" />
            </label>
          </div>
        </div>
      </Card>

      <Card class="p-6 gap-4">
        <div>
          <h2 class="text-sm font-medium">Основна інформація</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Назва, slug та опис</p>
        </div>

        <div class="space-y-3">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Назва *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Наприклад: Сфера у лісі «Смерекова»" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="slug">
            <FormItem>
              <FormLabel>Slug *</FormLabel>
              <FormControl>
                <div class="relative">
                  <Input v-bind="componentField" placeholder="sfera-u-lisi-smerekova" class="pr-28" />
                  <button
                    type="button"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted rounded px-2 py-0.5 hover:text-foreground transition"
                    @click="handleGenerateSlug"
                  >
                    ← з назви
                  </button>
                </div>
              </FormControl>
              <FormDescription>zatishok.com/p/{{ slugValue }}</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Опис</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Опишіть ваш об'єкт..." class="min-h-24" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </Card>

      <Card class="p-6 gap-4">
        <div>
          <h2 class="text-sm font-medium">Адреса та розташування</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Де знаходиться об'єкт</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <FormField v-slot="{ componentField }" name="city">
            <FormItem class="relative">
              <FormLabel>Місто *</FormLabel>
              <FormControl>
                <div class="relative">
                  <Input
                    v-bind="componentField"
                    placeholder="Почніть вводити назву..."
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>


          <FormField v-slot="{ componentField }" name="latitude">
            <FormItem>
              <FormLabel>Широта</FormLabel>
              <FormControl><Input v-bind="componentField" type="number" placeholder="48.4544" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="longitude">
            <FormItem>
              <FormLabel>Довгота</FormLabel>
              <FormControl><Input v-bind="componentField" type="number" placeholder="24.5478" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

      </Card>

      <Card class="p-6 gap-4">
        <div>
          <h2 class="text-sm font-medium">Політика скасування</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Умови повернення коштів</p>
        </div>

        <FormField v-slot="{ field }" name="policy">
          <FormItem>
            <FormControl>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="opt in policyOptions" :key="opt.value"
                  class="cursor-pointer rounded-lg border-2 p-4 transition"
                  :class="field.value === opt.value ? 'border-foreground bg-muted/50' : 'border-border hover:border-muted-foreground'"
                  @click="field.onChange(opt.value)"
                >
                  <p class="text-sm font-medium">{{ opt.label }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ opt.description }}</p>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </Card>

      <div class="flex justify-end gap-2 pb-6">
        <Button type="button" variant="outline" @click="navigateTo({ name: 'admin-properties' })">
          Скасувати
        </Button>
        <Button type="submit" :disabled="propertyStore.loading">
          <Spinner v-if="propertyStore.loading" />
          {{ isEdit ? 'Зберегти зміни' : 'Створити об\'єкт' }}
        </Button>
      </div>

    </form>
  </div>
</template>
