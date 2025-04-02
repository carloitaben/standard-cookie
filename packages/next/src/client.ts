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
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>
): Promise<StandardSchemaV1.InferOutput<Schema> | undefined> {
  const cookieValue = getDocumentCookie(cookie.name)

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(cookie, cookieValue)
}

export async function hasCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(cookie: CookieOptions<Schema, Name, Encoded>): Promise<boolean> {
  const value = getCookie(cookie)
  return typeof value !== "undefined"
}

export async function setCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): Promise<void> {
  const output = parse(cookie, value)
  const string = encode(cookie, output)

  setDocumentCookie(cookie.name, string, {
    ...cookie.options,
    ...options,
  })
}

export async function deleteCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  options?: CookieSerializeOptions
): Promise<void> {
  deleteDocumentCookie(cookie.name, {
    ...cookie.options,
    ...options,
  })
}
