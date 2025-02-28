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

export function getCookie<Name extends string, Schema extends StandardSchemaV1>(
  cookie: CookieOptions<Name, Schema>
): StandardSchemaV1.InferOutput<Schema> | undefined

export function getCookie<Name extends string, Schema extends StandardSchemaV1>(
  event: H3Event,
  cookie: CookieOptions<Name, Schema>
): StandardSchemaV1.InferOutput<Schema> | undefined

export function getCookie<Name extends string, Schema extends StandardSchemaV1>(
  ...args:
    | [CookieOptions<Name, Schema>]
    | [H3Event, CookieOptions<Name, Schema>]
): StandardSchemaV1.InferOutput<Schema> | undefined {
  const cookieValue = getDocumentCookie(
    args.length === 1 ? args[0].name : args[1].name
  )

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(
    args.length === 1 ? args[0].schema : args[1].schema,
    cookieValue
  )
}

export function hasCookie<Name extends string, Schema extends StandardSchemaV1>(
  cookie: CookieOptions<Name, Schema>
): boolean

export function hasCookie<Name extends string, Schema extends StandardSchemaV1>(
  event: H3Event,
  cookie: CookieOptions<Name, Schema>
): boolean

export function hasCookie<Name extends string, Schema extends StandardSchemaV1>(
  ...args:
    | [CookieOptions<Name, Schema>]
    | [H3Event, CookieOptions<Name, Schema>]
): boolean {
  return !!getDocumentCookie(args.length === 1 ? args[0].name : args[1].name)
}

export function setCookie<Name extends string, Schema extends StandardSchemaV1>(
  cookie: CookieOptions<Name, Schema>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): StandardSchemaV1.InferOutput<Schema>

export function setCookie<Name extends string, Schema extends StandardSchemaV1>(
  event: H3Event,
  cookie: CookieOptions<Name, Schema>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): StandardSchemaV1.InferOutput<Schema>

export function setCookie(...args: any) {
  const cookie = args.length > 3 ? args[1] : args[0]
  const value = args.length > 3 ? args[2] : args[1]
  const options = args.length > 3 ? args[3] : args[2]

  const output = parse(cookie.schema, value)
  const string = encode(output)

  setDocumentCookie(cookie.name, string, {
    ...cookie.options,
    ...options,
  })

  return output
}

export function deleteCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(cookie: CookieOptions<Name, Schema>, options?: CookieSerializeOptions): void

export function deleteCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  event: H3Event,
  cookie: CookieOptions<Name, Schema>,
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
