import type { BuiltInProviderType, RedirectableProviderType, Provider } from "@auth/core/providers";
import type { LiteralUnion, SignInAuthorizationParams, SignInOptions, SignOutParams } from "./types";
import type { FetchResponse } from "ofetch"

type SignInResponse = FetchResponse<{ url: string; }>
type ProviderID<P> = LiteralUnion<P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType>;

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
export function signIn<P extends RedirectableProviderType | undefined>(
    providerId?: ProviderID<P>,
    options?: SignInOptions & { redirect: true },
    authorizationParams?: SignInAuthorizationParams
): Promise<void>;

export function signIn<P extends RedirectableProviderType | undefined>(
    providerId?: ProviderID<P>,
    options?: SignInOptions & { redirect: false },
    authorizationParams?: SignInAuthorizationParams
): Promise<SignInResponse>;

export function signIn<P extends RedirectableProviderType | undefined>(
    providerId?: ProviderID<P>,
    options?: SignInOptions,
    authorizationParams?: SignInAuthorizationParams
): Promise<void | SignInResponse>;

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export function signOut(options?: SignOutParams): Promise<void>;

/**
 * Retrieve the list of providers currently configured.
 * See [OAuth Sign In](https://authjs.dev/guides/basics/pages#oauth-sign-in) for more details.
 */
export function getProviders(): Promise<Record<string, Provider>[]>;

/**
 * Verify if the user session is still valid
 * TODO: Any type of refresh logic should be handled here
 * @returns true if the user is signed in, false otherwise
 */
export function verifyClientSession(): Promise<boolean>;

