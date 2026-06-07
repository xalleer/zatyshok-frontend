import type {CreatePropertyRequest, PaginationResponse, Property, UpdatePropertyRequest} from "~/types";
import { toast } from 'vue-sonner'

export const usePropertyStore = defineStore('property', () => {
  const loading = ref(false)
  const publicProperties = ref<PaginationResponse<Property> | null>(null)
  const adminProperties = ref<PaginationResponse<Property> | null>(null)
  const property = ref<Property | null>(null)
  const {$api} = useNuxtApp();

  const createProperty = async (body: CreatePropertyRequest) => {
    loading.value = true
    try {
      const response = await $api<Property>('/properties', {
        method: 'POST',
        body,
      })

      toast.success('Об`єкт створений')
      return response
    } catch (e) {
      toast.error('Помилка створення об`єкту')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getAllPublicProperties = async () => {
    loading.value = true
    try {
      return $api<PaginationResponse<Property>>(`/properties`)
    } catch (e) {
      toast.error('Помилка отримання даних')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getMyAdminProperties = async () => {
    loading.value = true
    try {
      return $api<PaginationResponse<Property>>(`/properties/my`)
    } catch (e) {
      toast.error('Помилка отримання даних')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getAdminPropertyById = async (id: string) => {
    loading.value = true
    try {
      return $api<Property>(`/properties/${id}`)
    } catch (e) {
      toast.error('Помилка отримання даних')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProperty = async (id: string, body: UpdatePropertyRequest) => {
    loading.value = true
    try {
      await $api<Property>(`/properties/${id}`, {
        method: 'PATCH',
        body,
      })

      toast.success('Об`єкт створений')
    } catch (e) {
      toast.error('Помилка створення об`єкту')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  const uploadCoverImage = async (id: string, formData: FormData) => {
    loading.value = true
    try {
      const response = await $api<{ coverImage: string }>(`/media/properties/${id}/cover`, {
        method: 'PATCH',
        body: formData
      })
      if (property.value) {
        property.value.coverImage = response.coverImage
      }

      toast.success('Обкладинка змінена')
    } catch (e) {
      toast.error('Помилка зміни обкладинки')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const uploadPropertyPhotos = async (id: string, files: File[]) => {
    loading.value = true
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await $api<{ urls: string[] }>(`/media/properties/${id}/images`, {
        method: 'POST',
        body: formData
      })

      if (property.value && response.urls) {
        property.value.images = [...(property.value.images || []), ...response.urls]
      }

      toast.success('Фото додано')
      return response
    } catch (e) {
      toast.error('Помилка додавання фото')
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const setAdminProperties = (properties: PaginationResponse<Property>) => {
    adminProperties.value = properties
  }

  const setProperty = (propertyData: Property) => {
    property.value = propertyData
  }

  return {
    loading,
    adminProperties,
    property,
    uploadPropertyPhotos,
    setProperty,
    uploadCoverImage,
    updateProperty,
    setAdminProperties,
    createProperty,
    getAllPublicProperties,
    getMyAdminProperties,
    getAdminPropertyById
  }
})
