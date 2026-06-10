<script setup lang="ts">
import { BedDouble } from '@lucide/vue';
</script>

<template>
  <section class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-6" >
    <Card>
      <CardHeader class="flex items-center justify-between">
        <div>
          <BedDouble />
        </div>
        <Badge>
          Badge
        </Badge>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <span>23</span>
        <span>Active Bookings</span>
      </CardContent>
      <CardFooter>
        <Label>7 checked in today</Label>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader class="flex items-center justify-between">
        <div>
          <BedDouble />
        </div>
        <Badge>
          Badge
        </Badge>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <span>23</span>
        <span>Active Bookings</span>
      </CardContent>
      <CardFooter>
        <Label>7 checked in today</Label>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader class="flex items-center justify-between">
        <div>
          <BedDouble />
        </div>
        <Badge>
          Badge
        </Badge>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <span>23</span>
        <span>Active Bookings</span>
      </CardContent>
      <CardFooter>
        <Label>7 checked in today</Label>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader class="flex items-center justify-between">
        <div>
          <BedDouble />
        </div>
        <Badge>
          Badge
        </Badge>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <span>23</span>
        <span>Active Bookings</span>
      </CardContent>
      <CardFooter>
        <Label>7 checked in today</Label>
      </CardFooter>
    </Card>
  </section>
</template>

<style scoped>

</style>
