<script setup lang="ts">
import type {SidebarProps} from "@/components/ui/sidebar"
import {
  House,
  GalleryVerticalEnd,
  ChevronRight,
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  ChartColumn,
  Settings,
  TreePine,
  Tent,
} from '@lucide/vue';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type {Property} from "~/types";

interface Props extends SidebarProps {
  properties?: Property []
}

const props = defineProps<Props>()

const isActiveRoute = (urlName: string) => {
  const route = useRoute()
  return route.name === urlName
}

const mappedProperties = computed(() => {
  if (!props.properties) {
    return []
  }
  return props.properties.map(item => {
    return {
      title: item.name,
      url: `/admin/properties/${item.id}`,
      icon: Tent,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    }
  })
})

const data = {
  navMain: [
    {
      title: "Головна",
      urlName: "admin",
      icon: LayoutDashboard
    },
    {
      title: "Записи",
      urlName: "admin-bookings",
      icon: CalendarDays
    },
    {
      title: "Об'єкти",
      urlName: "admin-properties",
      icon: Building2
    },
    {
      title: "Гості",
      urlName: "admin-guests",
      icon: Users
    },
    {
      title: "Репорти",
      urlName: "admin-reports",
      icon: ChartColumn
    },
    {
      title: "Налаштування",
      urlName: "admin-settings",
      icon: Settings
    },
  ],
  navManagement: mappedProperties.value
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="border-b-1 border-zinc-200">
      <SidebarMenu>
        <SidebarMenuItem class="py-2">
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4"/>
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
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
            <SidebarMenuButton as-child :is-active="isActiveRoute(item.urlName)">
              <NuxtLink :to="{name: item.urlName}" class="flex items-center gap-2">
                <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0"/>
                <Label>{{ item.title }}</Label>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Properties & Units</SidebarGroupLabel>
        <SidebarMenu>
          <Collapsible
              v-for="item in data.navManagement"
              :key="item.title"
              as-child
              :default-open="item.isActive"
              class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.title">
                  <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" />
                  <span class="flex-1 truncate min-w-0 text-sm font-medium">{{ item.title }}</span>
                  <div class="flex gap-2 items-center shrink-0">
                    <span class="text-xs text-muted-foreground">2/3</span>
                    <ChevronRight class="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                    <SidebarMenuSubButton as-child>
                      <NuxtLink :to="subItem.url">
                        <Label>{{ subItem.title }}</Label>
                      </NuxtLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>

    </SidebarContent>
  </Sidebar>
</template>
