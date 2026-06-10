<script setup lang="ts">
import {Funnel, Search, CalendarDays, MoveRight, Users, Clock, Ellipsis} from '@lucide/vue';
const selectedStatus = ref('all')
const selectedSort = ref('all')
const sortButtons = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Checked In',
    value: 'checked_in'
  },
  {
    label: 'Confirmed',
    value: 'confirmed'
  },
  {
    label: 'Checked Out',
    value: 'checked_out'
  },
]

const statuses = [
  {
    label: 'All Properties',
    value: 'all'
  },
  {
    label: 'Property One',
    value: 'id1'
  },
  {
    label: 'Property Two',
    value: 'id2'
  }
]
</script>

<template>
  <div>
    <section class="border-b-1 border-zinc-200 p-6">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <h3 class="text-lg font-semibold">Bookings</h3>
          <span class="text-sm text-muted-foreground">20 total bookings · June 2026</span>
        </div>
        <Button>
          New Booking
        </Button>
      </div>

      <div class="flex justify-between items-center mt-4">
        <div class="flex gap-2">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Select>
            <SelectTrigger>
              <Funnel/>
              <SelectValue v-model:modelValue="selectedStatus">
                <Label>{{ statuses.find(s => s.value === selectedStatus)?.label }}</Label>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item of statuses" :value="item.value">
                {{ item.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>


        <div class="flex gap-1">
          <Button class="cursor-pointer" @click="selectedSort = i.value" v-for="i of sortButtons" :key="i.value" :variant="selectedSort === i.value ? 'default' : 'outline'">
            <span>{{ i.label }}</span>
            <Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              8
            </Badge>
          </Button>
        </div>
      </div>
    </section>

    <section>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Booking
            </TableHead>
            <TableHead>
              Unit
            </TableHead>
            <TableHead>
              Dates
            </TableHead>
            <TableHead>
              Guest
            </TableHead>
            <TableHead>
              Status
            </TableHead>
            <TableHead>
              Total
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow class="cursor-pointer">
            <TableCell class="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SH</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <span class="font-medium">Daniel & Priya Mehta</span>
                <span class="text-xs text-muted-foreground">B-1003</span>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span class="font-medium">Treehouse Loft</span>
                <span class="text-xs text-muted-foreground">Ridgeline Retreat</span>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <div class="flex gap-1 items-center text-sm">
                  <CalendarDays class="w-[12px]" />
                  <span >14 Jun</span>
                  <MoveRight class="w-[12px]" />
                  <span>19 Jun</span>
                </div>
                <span class="text-xs text-muted-foreground">5 nights</span>
              </div>
            </TableCell>
            <TableCell class="flex items-center gap-1">
              <Users class="w-[12px]" />
              <span>2</span>
            </TableCell>
            <TableCell>
              <Badge>
                <Clock class="w-[12px]" />
                <span>Status</span>
              </Badge>
            </TableCell>
            <TableCell>
              <span class="font-medium">$1 400</span>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="ghost">
                <Ellipsis />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </div>

</template>

<style scoped>

</style>
