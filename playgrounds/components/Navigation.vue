<script setup lang="ts">
const { signIn, signOut, session, status, cookies } = useAuth()
</script>

<template>
  <div>
    <div>
      <a href="/api/auth/signin" class="buttonPrimary">Native Link Sign in</a>
      <button @click="() => signIn(`github`)">
        JS Sign In
      </button>
      <button @click="() => signOut()">
        Sign Out
      </button>
    </div>
    <div>
      <pre>{{ status }}</pre>
      <pre>{{ session?.user }}</pre>
      <pre>{{ cookies }}</pre>
    </div>
    <NuxtLink to="/private">
      Private
    </NuxtLink>
    <hr>
    <NuxtLink to="/">
      Home
    </NuxtLink>
  </div>
</template>
