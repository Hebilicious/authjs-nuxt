<script setup lang="ts">
const { signIn, signOut, session, status, cookies, user } = useAuth()
</script>

<template>
  <div>
    <div>
      <a href="/api/auth/signin" class="buttonPrimary">Native Link Sign in</a>
      <button @click="signIn(`keycloak`)">
        JS Sign In
      </button>
      <button @click="signOut()">
        Sign Out
      </button>
    </div>
    <pre>{{ user }}</pre>
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
    <NuxtLink to="/guest">
      Guest
    </NuxtLink>
  </div>
</template>
