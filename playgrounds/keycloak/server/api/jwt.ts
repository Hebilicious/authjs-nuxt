import { authOptions } from "./auth/[...]"

export default defineEventHandler(async (event) => {
  const session = await getAuthJsSession(event, authOptions)
  const jwt = await getAuthJsToken(event, authOptions)
  return { session, jwt }
})
