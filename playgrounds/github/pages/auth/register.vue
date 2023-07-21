<script setup lang='ts'>
definePageMeta({
  middleware: ["guest-only"],
  auth: {
    unauthenticatedOnly: true,
    redirectAuthenticatedTo: "/private"
  }
})
</script>

<template>
  <div>
    Register Page
  </div>
</template>
