<script setup lang="ts">
definePageMeta({
  middleware: "guest-only",
  auth: {
    authenticatedRedirectTo: "/private"
  }
})
</script>

<template>
  <h1>Guest Only</h1>
</template>
