<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="flex flex-col gap-4 p-6 border-t border-gray-200">
    <div>
      <div class="logo">
        <h1>Затишок</h1>
      </div>

      <nav>
        <ul>
          <li></li>
        </ul>
      </nav>
    </div>

    <div>
 <span>
          © {{ year }} Затишок. Всі права захищені.
        </span>
    </div>


  </footer>
</template>

<style scoped>

</style>
