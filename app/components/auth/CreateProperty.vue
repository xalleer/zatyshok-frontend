<script setup lang="ts">

const emit = defineEmits<{ changePhoneNumber: [] }>()

const onSubmit = () => {

}

const changePhoneNumber = () => {
  emit('changePhoneNumber')
}
</script>

<template>
  <form @submit="onSubmit">
    <FormField v-slot="{componentField}" name="name">
      <FormItem>
        <FormLabel>Назва</FormLabel>
        <FormControl>
          <Input v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Наприклад: "Квартира на Майдану"
        </FormDescription>
        <FormMessage/>
      </FormItem>
    </FormField>

    <Button class="w-full mt-4" type="submit">Створити</Button>
    <Button @click="changePhoneNumber" class="w-full" variant="link">Змінити номер телефону</Button>
  </form>
</template>

<style scoped>

</style>
