import type {PaginationResponse, Property} from "~/types";

export const usePublicProperties = () => {
  const { $api } = useNuxtApp()

  const result = useAsyncData('publicProperties', () =>
    $api<PaginationResponse<Property>>('/properties')
  )

  watch(result.data, (data) => {
    if (data) propertyStore.publicProperties = data
  }, { immediate: true })

  return result
}

export const useAdminProperties = () => {
  const { $api } = useNuxtApp()
  const propertyStore = usePropertyStore()

  const result = useAsyncData('adminProperties', () =>
    $api<PaginationResponse<Property>>('/properties/my')
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
