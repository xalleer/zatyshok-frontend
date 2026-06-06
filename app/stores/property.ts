import type {CreatePropertyRequest, PaginationResponse, Property} from "~/types";
import { toast } from 'vue-sonner'

export const usePropertyStore = defineStore('property', () => {
  const loading = ref(false)
  const {$api} = useNuxtApp();

  const createProperty = async (body: CreatePropertyRequest) => {
    loading.value = true
    try {
      await $api('/properties', {
        method: 'POST',
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

  const getAllPublicProperties = async () => {
    loading.value = true
    try {
      return $api<PaginationResponse<Property>>(`/properties`)
    } catch (e) {
      toast.error('Помилка отримання даних')
      console.error(e)
      throw e
    }
  }

  return {
    loading,
    createProperty,
    getAllPublicProperties
  }
})
