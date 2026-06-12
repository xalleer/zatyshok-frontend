<script setup lang="ts">
import {PropertyPolicy} from "~/types";

const policyOptions = [
  { value: PropertyPolicy.FLEXIBLE, label: 'Flex', description: 'Політика скасування' },
  { value: PropertyPolicy.STRICT, label: 'Strict', description: 'Політика скасування' },
]
</script>
<template>
  <div class="rounded-xl border p-6 border-zinc-200 flex flex-col gap-6">
    <h4 class="text-xl font-semibold">Політика скасування</h4>

    <FormField v-slot="{ componentField }" name="policy">
      <FormItem>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Оберіть політику" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem
                v-for="opt in policyOptions"
                :key="opt.value"
                :value="opt.value"
            >
              <div>
                <div class="font-medium">{{ opt.label }}</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>