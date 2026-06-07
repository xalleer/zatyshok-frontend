<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"
import { CreditCard, LogOut, UserRound, House, ScrollText } from '@lucide/vue';
import { GalleryVerticalEnd } from "@lucide/vue"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const props = defineProps<SidebarProps>()


const data = {
  navMain: [
    {
      title: "Об'єкти",
      urlName: "admin-properties",
      icon: House
    },
    {
      title: "Записи",
      urlName: "admin-properties",
      icon: ScrollText
    },
  ],
  navFooter: [
    {
      title: "Профіль",
      urlName: "admin-profile",
      icon: UserRound
    },
    {
      title: "Підписка",
      urlName: "admin-properties",
      icon: CreditCard
    },
    {
      title: "Вихід",
      url: "admin-properties",
      icon: LogOut
    },
  ]
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-medium">Documentation</span>
                <span class="">v1.0.0</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Керування
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
            <SidebarMenuButton as-child>
              <NuxtLink :to="{name: item.urlName}" class="flex items-center gap-2">
                <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" />
                <span>{{ item.title }}</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />

    <SidebarFooter>
      <SidebarGroup>
        <SidebarGroupLabel>
          Налаштування
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navFooter" :key="item.title">
            <SidebarMenuButton as-child>
              <NuxtLink :to="{name: item.urlName}" class="flex items-center gap-2">
                <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" />
                <span>{{ item.title }}</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarGroup>
    </SidebarFooter>
  </Sidebar>
</template>
