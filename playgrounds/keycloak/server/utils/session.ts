import { type H3Event } from "h3"
import { getServerSession } from "#auth"
import { authOptions } from "~/server/api/auth/[...]"

export const getAuthSession = (event: H3Event) => getServerSession(event, authOptions)
