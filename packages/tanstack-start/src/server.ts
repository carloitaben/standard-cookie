import { createIsomorphicFn, serverOnly, clientOnly } from "@tanstack/start"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import type {
  CookieOptions,
  CookieSerializeOptions,
} from "@standard-cookie/core"
import { decode, encode, getDocumentCookie, parse } from "@standard-cookie/core"
import type { H3Event } from "@tanstack/start/server"
import {
  getCookie as getServerCookie,
  setCookie as setServerCookie,
  deleteCookie as deleteServerCookie,
} from "@tanstack/start/server"

export * from "./shared.ts"

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
  let cookieValue: string | undefined

  if (args.length === 2) {
    cookieValue = getServerCookie(args[0], args[1].name)
  } else {
    cookieValue = getServerCookie(args[0].name)
  }

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(
    args.length === 2 ? args[1].schema : args[0].schema,
    cookieValue
  )
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

export function setCookie(...args: any): any {
  if (args.length > 3) {
    const output = parse(args[1].schema, args[2])
    const string = encode(output)

    setServerCookie(args[0], args[1].name, string, {
      ...args[1].options,
      ...args[3],
    })

    return output
  }

  const output = parse(args[0].schema, args[1])
  const string = encode(output)

  setServerCookie(args[0].name, string, {
    ...args[0].options,
    ...args[2],
  })

  return output
}
