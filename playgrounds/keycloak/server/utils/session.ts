import { type H3Event } from "h3"
import { authOptions } from "~/server/api/auth/[...]"

export const getAuthSession = (event: H3Event) => getAuthJsSession(event, authOptions)
