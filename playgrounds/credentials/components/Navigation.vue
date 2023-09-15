<script setup lang="ts">
const { signIn, signOut, session, status, cookies, user, getProviders } = useAuth()
const handler = async () => {
  const providers = await getProviders()
  // eslint-disable-next-line no-console
  console.log(providers)
}

async function credentialsSignin() {
  try {
    await signIn("credentials", {
      redirect: false,
      username: "admin",
      password: "admin"
    })
    // eslint-disable-next-line no-console
    console.log("SignIn", session.value?.user)
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error SignIn: ${error}`)
  }
}
</script>

<template>
  <div>
    <div>
      <a href="api/auth/signin" class="buttonPrimary">Native Link Sign in</a>
      <button @click="credentialsSignin()">
        JS Sign In
      </button>
      <button @click="signOut()">
        Sign Out
      </button>
      <button @click="handler">
        Providers Log
      </button>
    </div>
    <pre>{{ user }}</pre>
    <div>
      <pre>{{ status }}</pre>
      <pre>{{ session?.user }}</pre>
      <pre>{{ cookies }}</pre>
    </div>
    <NuxtLink to="/">
      Home
    </NuxtLink>
  </div>
</template>
