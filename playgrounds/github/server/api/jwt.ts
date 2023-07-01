import { authOptions } from "./auth/[...]"
import { getJWT, getServerSession } from "#auth"

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions)
  const jwt = await getJWT(event, authOptions)
  return { session, jwt }
})
