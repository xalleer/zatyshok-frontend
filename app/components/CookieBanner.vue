<script setup lang="ts">
const consent = useCookie<"accepted" | "declined" | undefined>(
  "cookie-consent",
  {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  }
)

const isVisible = computed(() => !consent.value)

function acceptCookies() {
  consent.value = "accepted"
}

function declineCookies() {
  consent.value = "declined"
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl"
    >
      <div
        class="flex flex-col gap-4 rounded-xl border bg-background p-4 shadow-lg md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h3 class="font-medium">
            Ми використовуємо cookies
          </h3>

          <p class="mt-1 text-sm text-muted-foreground">
            Використовуємо cookies для покращення роботи сайту та аналітики.
            Продовжуючи користування сайтом, ви погоджуєтесь з нашою політикою.
          </p>
        </div>

        <div class="flex shrink-0 gap-2">
          <Button
            variant="outline"
            @click="declineCookies"
          >
            Відхилити
          </Button>

          <Button @click="acceptCookies">
            Прийняти
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>
