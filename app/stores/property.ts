import type {CreatePropertyRequest} from "~/types";
import { toast } from 'vue-sonner'

export const usePropertyStore = defineStore('property', () => {
  const loading = ref(false)

  const createProperty = async (body: CreatePropertyRequest) => {
    loading.value = true
    const {$api} = useNuxtApp();
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

  return {
    loading,
    createProperty
  }
})
