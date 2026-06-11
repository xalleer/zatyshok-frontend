<script setup lang="ts">
const route = useRoute()
const { data: property, pending } = await useAdminProperty(route.params.id as string)
const tabClass = "bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 pb-3 pt-0 font-medium text-muted-foreground shadow-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:border-b-emerald-900 data-[state=active]:text-emerald-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
    category: 'Forest Retreat',
    title: 'Ridgeline Retreat',
    subtitle: 'A canopy sanctuary above the fog',
    units: 4,
    acres: 34,
  },
  {
    image: 'https://plus.unsplash.com/premium_photo-1673177667569-e3321a8d8256?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D',
    category: 'Treehouse Loft',
    title: 'Ridgeline Retreat',
    subtitle: 'A canopy sanctuary above the fog',
    units: 5,
    acres: 36,
  },
]

</script>

<template>
  <div>
    <PropertySwiper :slides="slides" />
    <section class="grid grid-cols-5 gap-6 p-6">
      <div class="col-span-3 flex flex-col gap-6">
        <PropertyShortInfo />
        <Tabs class="mt-2" default-value="overview">
          <TabsList class="bg-transparent border-b border-border rounded-none h-auto p-0 w-full justify-start gap-6">
            <TabsTrigger
              value="overview"
              :class="tabClass"
            >
              Огляд
            </TabsTrigger>
            <TabsTrigger
              value="units"
              :class="tabClass"
            >
              Units (4)
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              :class="tabClass"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              :class="tabClass"
            >
              Reviews (3)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" class="flex flex-col gap-6 mt-4">
            <PropertyTabOverview />
          </TabsContent>
          <TabsContent class="flex flex-col gap-6 mt-4" value="units">
            <PropertyTabUnits />
          </TabsContent>
          <TabsContent value="analytics">Analytics content</TabsContent>
          <TabsContent value="reviews">Reviews content</TabsContent>
        </Tabs>
      </div>

      <div class="col-span-2 flex flex-col gap-6">
        <PropertyDetails />
      </div>
    </section>
  </div>


</template>
