<script setup lang="ts">
const { signIn, signOut, session, status, cookies } = useAuth()

async function check() {
  try {
    await signIn("credentials", {
      redirect: false,
      username: "admin",
      password: "admins"
    })
    // eslint-disable-next-line no-console
    console.log("SignIn")
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
      <a href="/api/auth/signin" class="buttonPrimary">Native Link Sign in</a>
      <button @click="check()">
        Credentials Sign In
      </button>
      <button @click="signOut()">
        Sign Out
      </button>
    </div>
    <div>
      <pre>{{ status }}</pre>
      <pre>{{ session?.user }}</pre>
      <pre>{{ cookies }}</pre>
    </div>
  </div>
</template>

<style scoped></style>
