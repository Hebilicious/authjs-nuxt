<script setup lang="ts">
definePageMeta({
  middleware: ["guest-only"],
  auth: {
    unauthenticatedOnly: true,
    redirectAuthenticatedTo: "/private"
  }
})
</script>

<template>
  <h1>PUBLIC</h1>
</template>
