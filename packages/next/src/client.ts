import type { StandardSchemaV1 } from "@standard-schema/spec"
import type {
  CookieOptions,
  CookieSerializeOptions,
} from "@standard-cookie/core"
import {
  decode,
  deleteDocumentCookie,
  encode,
  getDocumentCookie,
  parse,
  setDocumentCookie,
} from "@standard-cookie/core"

export * from "./shared"

export async function getCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>
): Promise<StandardSchemaV1.InferOutput<Schema> | undefined> {
  const cookieValue = getDocumentCookie(cookie.name)

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(cookie.schema, cookieValue)
}

export async function hasCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(cookie: CookieOptions<Name, Schema>): Promise<boolean> {
  const value = getCookie(cookie)
  return typeof value !== "undefined"
}

export async function setCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): Promise<void> {
  const output = parse(cookie.schema, value)
  const string = encode(output)

  setDocumentCookie(cookie.name, string, {
    ...cookie.options,
    ...options,
  })
}

export async function deleteCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>,
  options?: CookieSerializeOptions
): Promise<void> {
  deleteDocumentCookie(cookie.name, {
    ...cookie.options,
    ...options,
  })
}
