<script setup lang="ts">
import {Bell} from '@lucide/vue';
import {getRouteTitle} from '~/utils/getRouteTitle'
import {Routes} from '~/types/routes'

const route = useRoute()
const { data: adminProperties, pending } = useAdminProperties()

const isAllContentPadding = computed(() => {
  switch (route.name) {
    case (Routes.ADMIN_BOOKINGS):
      return false
    case (Routes.ADMIN_PROPERTY):
      return false
    default:
      return true
  }
})

</script>

<template>
  <div class="flex flex-col min-h-screen">

    <SidebarProvider class="flex flex-1 overflow-hidden">
      <AppSidebar :properties="adminProperties?.data" />
      <SidebarInset class="flex flex-col flex-1 min-w-0">
        <header class="flex justify-between items-center px-6 py-4 border-b-1 border-zinc-200">
          <div class="flex flex-col">
            <h3 class="text-lg font-semibold">{{ getRouteTitle(route.name as Routes) }}</h3>
            <span class="text-sm text-muted-foreground">Wednesday, 10 June 2026 · Summer Season</span>
          </div>


          <div class="flex gap-2">
            <Button size="icon" variant="outline">
              <Bell/>
            </Button>

            <NavigationMenu :viewport="false">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger class="border-1 border-zinc-200 ">

                    <div class="flex gap-2 items-center">
                      <Avatar>
                        <AvatarImage src="https://img.magnific.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740&q=80"/>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span>User Name</span>
                    </div>

                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul class="w-full">
                      <li>
                        <NavigationMenuLink as-child>
                          <NuxtLink to="/">
                            <div>
                              <span>Profile</span>
                            </div>
                          </NuxtLink>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>


              </NavigationMenuList>
            </NavigationMenu>

          </div>
        </header>
        <main class="flex-1 overflow-auto" :class="{'p-6' : isAllContentPadding}">
          <slot/>
        </main>
      </SidebarInset>
    </SidebarProvider>

  </div>
</template>

<style scoped>

</style>
