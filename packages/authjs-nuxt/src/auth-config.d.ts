declare module "#auth-config" {
    export const verifyClientOnEveryRequest: boolean
    export const guestRedirectTo: string
    export const authenticatedRedirectTo: string
    export const baseUrl: string
    export const basePath: string
}