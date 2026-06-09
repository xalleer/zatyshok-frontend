<script setup lang="ts">
import {getPropertyUrl} from "~/utils/getPropertyUrl";
import {getIsActive} from "~/utils/getIsActive";

const route = useRoute()

const propertyStore = usePropertyStore()

const {data: property} = await useAsyncData(() => propertyStore.getAdminPropertyById(route.params.id as string))

if (property.value) {
  propertyStore.setProperty(property.value)
}
</script>

<template>
  <section>
    <div>
      <h1>{{ property?.name }}</h1>
      <p>{{ getPropertyUrl(property?.slug ?? '') }}</p>

      <Badge class="absolute top-0 right-0">
        {{ getIsActive(property?.isActive ?? false) }}
      </Badge>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Юніти</CardTitle>
        </CardHeader>
        <CardFooter>
          <Label>5</Label>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Бронювань сьогодні</CardTitle>
        </CardHeader>
        <CardFooter>
          <Label>5</Label>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Рейтинг</CardTitle>
        </CardHeader>
        <CardFooter>
          <Label>5</Label>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дохід</CardTitle>
        </CardHeader>
        <CardFooter>
          <Label>5</Label>
        </CardFooter>
      </Card>
    </div>

  </section>

  <section>
    <Tabs default-value="units">
      <TabsList>
        <TabsTrigger value="units">
          Юніти
        </TabsTrigger>
        <TabsTrigger value="bookings">
          Бронювання
        </TabsTrigger>
        <TabsTrigger value="settings">
          Налаштування
        </TabsTrigger>
      </TabsList>

      <TabsContent value="units">

      </TabsContent>
    </Tabs>

  </section>
</template>

<style scoped>

</style>
