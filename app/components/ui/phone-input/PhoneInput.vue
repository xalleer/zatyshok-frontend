<script setup lang="ts">
import { countriesPhone } from '~/constants/countries'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>()
defineEmits(['blur'])

const selectedCountry = ref('ua')
const localPhone = ref('')

const currentCountry = computed(() =>
  countriesPhone.find(c => c.value === selectedCountry.value)
)

const isUpdatingFromModel = ref(false)

watch([selectedCountry, localPhone], () => {
  if (isUpdatingFromModel.value) return

  const country = currentCountry.value
  if (!country) return

  const clean = localPhone.value.replace(/\D/g, '')
  model.value = `${country.dialCode}${clean}`
})

watch(model, (val) => {
  if (!val) return

  const country = countriesPhone.find(c => val.startsWith(c.dialCode))
  if (!country) return

  const newLocal = val.replace(country.dialCode, '')

  if (selectedCountry.value !== country.value || localPhone.value !== newLocal) {
    isUpdatingFromModel.value = true
    selectedCountry.value = country.value
    localPhone.value = newLocal
    nextTick(() => { isUpdatingFromModel.value = false })
  }
}, { immediate: true })
</script>

<template>
  <div>
    <div class="flex items-center gap-2">

      <Select v-model="selectedCountry">
        <SelectTrigger class="w-[100px]">
          <SelectValue>
            <div v-if="currentCountry" class="flex items-center gap-2">
              <span>{{ currentCountry.dialCode }}</span>
            </div>
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Країна</SelectLabel>
            <SelectItem
              v-for="country in countriesPhone"
              :key="country.value"
              :value="country.value"
            >
              <div class="flex items-center gap-2">
                <img class="w-5 h-5" :src="country.icon" />
                <span>{{ country.dialCode }}</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        v-model="localPhone"
        :maxlength="currentCountry?.maskLength"
        placeholder="XXXXXXXXX"
        inputmode="numeric"
        type="tel"
        @blur="$emit('blur', $event)"
      />

    </div>
  </div>
</template>
