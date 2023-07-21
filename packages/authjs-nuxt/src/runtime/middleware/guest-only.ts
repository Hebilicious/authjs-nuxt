import { useAuth } from "../composables/useAuth"

/**
 * This middleware is the meant to prevent our authenticated users from accessing the authentication pages such as the login page, register page and any other page where the `guest-only` middleware is defined.
 */

// Helper function to determine if a page is accessible only to unauthenticated users.

// TODO: Remove type of any

function hasGuestOnlyMiddleware(to: any): boolean {
  const metaAuth = to.meta.auth
  return typeof metaAuth === "object" && metaAuth.unauthenticatedOnly
}

export default defineNuxtRouteMiddleware((to: any) => {
  const { status } = useAuth()

  // Check if the user is authenticated and the page is accessible only to guests.
  if (status.value === "authenticated" && hasGuestOnlyMiddleware(to)) {
    // Redirect the authenticated user to the specified route or '/private' as a default.
    return navigateTo(to.meta.auth?.redirectAuthenticatedTo ?? "/private")
  }
})
