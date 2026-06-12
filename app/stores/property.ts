import type {CreatePropertyRequest, PaginationResponse, Property, UpdatePropertyRequest} from "~/types";
import { toast } from 'vue-sonner'

export const usePropertyStore = defineStore('property', () => {
  const { $api } = useNuxtApp()
  const loading = ref(false)

  const adminProperties = ref<PaginationResponse<Property> | null>(null)
  const publicProperties = ref<PaginationResponse<Property> | null>(null)

  const createProperty = async (body: CreatePropertyRequest) => {
    loading.value = true
    try {
      const response = await $api<Property>('/properties', {
        method: 'POST',
        body,
      })

      if (adminProperties.value) {
        adminProperties.value.data.unshift(response)
        adminProperties.value.meta.total++
      }

      toast.success("Об'єкт створений")
      return response
    } catch (e) {
      toast.error("Помилка створення об'єкту")
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProperty = async (id: string, body: UpdatePropertyRequest) => {
    loading.value = true
    try {
      const response = await $api<Property>(`/properties/${id}`, {
        method: 'PATCH',
        body,
      })
      toast.success('Збережено')
      return response
    } catch (e) {
      toast.error('Помилка збереження')
      throw e
    } finally {
      loading.value = false
    }
  }

  const uploadCoverImage = async (id: string, formData: FormData) => {
    loading.value = true
    try {
      const response = await $api<{ coverImage: string }>(
        `/media/properties/${id}/cover`,
        { method: 'PATCH', body: formData }
      )
      toast.success('Обкладинка змінена')
      return response
    } catch (e) {
      toast.error('Помилка зміни обкладинки')
      throw e
    } finally {
      loading.value = false
    }
  }

  const uploadPropertyPhotos = async (id: string, files: File[]) => {
    loading.value = true
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const response = await $api<{ urls: string[] }>(
        `/media/properties/${id}/images`,
        { method: 'POST', body: formData }
      )
      toast.success('Фото додано')
      return response
    } catch (e) {
      toast.error('Помилка додавання фото')
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteProperty = async (id: string) => {
    loading.value = true
    try {
      await $api(`/properties/${id}`, { method: 'DELETE' })
      toast.success('Видалено')
    } catch (e) {
      toast.error('Помилка видалення')
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    createProperty,
    updateProperty,
    adminProperties,
    publicProperties,
    uploadCoverImage,
    uploadPropertyPhotos,
    deleteProperty,
  }
})
