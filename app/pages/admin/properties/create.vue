<script setup lang="ts">
import {PropertyPolicy} from "~/types";
const photos = ref<UploadedImage[]>([])
const propertyStore = usePropertyStore()
const form = useForm({
  validationSchema: createPropertySchema,
  initialValues: {
    policy: PropertyPolicy.FLEXIBLE,
    latitude: 49.5883,
    longitude: 34.5514,
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const property = await propertyStore.createProperty(values)

    if (!property?.id) {
      console.error('createProperty не повернув property', property)
      return
    }

    if (photos.value.length > 0) {
      const cover = photos.value.find(p => p.isCover)
      if (cover) {
        const fd = new FormData()
        fd.append('file', base64ToBlob(cover.url), cover.name)
        await propertyStore.uploadCoverImage(property.id, fd)
      }

      const extras = photos.value.filter(p => !p.isCover)
      if (extras.length) {
        const files = extras.map(p => base64ToFile(p.url, p.name))
        await propertyStore.uploadPropertyPhotos(property.id, files)
      }
    }

    navigateTo({ name: 'admin-properties' })
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid grid-cols-5 gap-6">

      <section class="col-span-3 flex flex-col gap-6">
        <AdminPropertyFormBasicInfo />
        <AdminPropertyFormLocationSection />
        <AdminPropertyFormPolicySection />
      </section>

      <section class="col-span-2 flex flex-col gap-6">
        <AdminPropertyFormPhotosSection v-model="photos" />
      </section>

    </div>

    <div class="flex justify-end mt-6">
      <Button type="submit" :disabled="propertyStore.loading">
        <Spinner v-if="propertyStore.loading" />
        Опублікувати
      </Button>
    </div>
  </form>
</template>