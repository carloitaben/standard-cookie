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
import type { H3Event } from "@tanstack/react-start/server"

export * from "./shared"

export function getCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>
): StandardSchemaV1.InferOutput<Schema> | undefined

export function getCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  event: H3Event,
  cookie: CookieOptions<Schema, Name, Encoded>
): StandardSchemaV1.InferOutput<Schema> | undefined

export function getCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  ...args:
    | [CookieOptions<Schema, Name, Encoded>]
    | [H3Event, CookieOptions<Schema, Name, Encoded>]
): StandardSchemaV1.InferOutput<Schema> | undefined {
  const cookieValue = getDocumentCookie(
    args.length === 1 ? args[0].name : args[1].name
  )

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(args.length === 1 ? args[0] : args[1], cookieValue)
}

export function hasCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(cookie: CookieOptions<Schema, Name, Encoded>): boolean

export function hasCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(event: H3Event, cookie: CookieOptions<Schema, Name, Encoded>): boolean

export function hasCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  ...args:
    | [CookieOptions<Schema, Name, Encoded>]
    | [H3Event, CookieOptions<Schema, Name, Encoded>]
): boolean {
  return !!getDocumentCookie(args.length === 1 ? args[0].name : args[1].name)
}

export function setCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): StandardSchemaV1.InferOutput<Schema>

export function setCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  event: H3Event,
  cookie: CookieOptions<Schema, Name, Encoded>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): StandardSchemaV1.InferOutput<Schema>

export function setCookie(...args: any) {
  const cookie = args.length > 3 ? args[1] : args[0]
  const value = args.length > 3 ? args[2] : args[1]
  const options = args.length > 3 ? args[3] : args[2]

  const output = parse(cookie, value)
  const string = encode(cookie, output)

  setDocumentCookie(cookie.name, string, {
    ...cookie.options,
    ...options,
  })

  return output
}

export function deleteCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  options?: CookieSerializeOptions
): void

export function deleteCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  event: H3Event,
  cookie: CookieOptions<Schema, Name, Encoded>,
  options?: CookieSerializeOptions
): void

export function deleteCookie(...args: any): void {
  const cookie = args.length > 2 ? args[1] : args[0]
  const options = args.length > 2 ? args[3] : args[2]

  deleteDocumentCookie(cookie.name, {
    ...cookie.options,
    ...options,
  })
}
