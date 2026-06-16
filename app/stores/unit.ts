import { toast } from 'vue-sonner'
import type { Unit, CreateUnitRequest } from '~/types'

export const useUnitStore = defineStore('unit', () => {
  const { $api } = useNuxtApp()
  const loading = ref(false)

  const createUnit = async (propertyId: string, body: CreateUnitRequest) => {
    loading.value = true
    try {
      const unit = await $api<Unit>(`/properties/${propertyId}/units`, {
        method: 'POST',
        body,
      })
      toast.success('Юніт створено')
      return unit
    } catch (e) {
      toast.error('Помилка створення юніту')
      throw e
    } finally {
      loading.value = false
    }
  }

  const uploadUnitPhotos = async (unitId: string, files: File[]) => {
    loading.value = true
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      const res = await $api<{ urls: string[] }>(`/media/units/${unitId}/images`, {
        method: 'POST',
        body: formData,
      })
      toast.success('Фото додано')
      return res
    } catch (e) {
      toast.error('Помилка завантаження фото')
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, createUnit, uploadUnitPhotos }
})
