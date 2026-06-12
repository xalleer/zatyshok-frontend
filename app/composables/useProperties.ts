import type {PaginationResponse, Property} from "~/types";


export const usePublicProperties = () => {
  const { $api } = useNuxtApp()
  const propertyStore = usePropertyStore()

  const result = useAsyncData('publicProperties', () =>
    $api<PaginationResponse<Property>>('/properties')
  )

  watch(result.data, (data) => {
    if (data) propertyStore.publicProperties = data
  }, { immediate: true })

  return result
}

export const useAdminProperties = (page: Ref<number> = ref(1)) => {
  const { $api } = useNuxtApp()
  const propertyStore = usePropertyStore()

  const result = useAsyncData(
      () => `adminProperties-${page.value}`,
      () => $api<PaginationResponse<Property>>('/properties/my', {
        query: { page: page.value, limit: 10 }
      }),
      { watch: [page] }
  )

  watch(result.data, (data) => {
    if (data) propertyStore.adminProperties = data
  }, { immediate: true })

  return result
}

export const useAdminProperty = (id: MaybeRef<string>) => {
  const { $api } = useNuxtApp()

  return useAsyncData(
    () => `property-${toValue(id)}`,
    () => $api<Property>(`/properties/${toValue(id)}`)
  )
}
