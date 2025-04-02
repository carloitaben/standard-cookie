import type { StandardSchemaV1 } from "@standard-schema/spec"
import type {
  CookieOptions,
  CookieSerializeOptions,
} from "@standard-cookie/core"
import { decode, encode, parse } from "@standard-cookie/core"
import type { H3Event } from "@tanstack/react-start/server"
import {
  getCookie as getServerCookie,
  setCookie as setServerCookie,
  deleteCookie as deleteServerCookie,
} from "@tanstack/react-start/server"

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
  let cookieValue: string | undefined

  if (args.length === 2) {
    cookieValue = getServerCookie(args[0], args[1].name)
  } else {
    cookieValue = getServerCookie(args[0].name)
  }

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(args.length === 2 ? args[1] : args[0], cookieValue)
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
  return args.length === 2
    ? !!getCookie(args[0], args[1])
    : !!getCookie(args[0])
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

export function setCookie(...args: any): any {
  if (args.length > 3) {
    const output = parse(args[1], args[2])
    const string = encode(args[1], output)

    setServerCookie(args[0], args[1].name, string, {
      ...args[1].options,
      ...args[3],
    })

    return output
  }

  const output = parse(args[0], args[1])
  const string = encode(args[0], output)

  setServerCookie(args[0].name, string, {
    ...args[0].options,
    ...args[2],
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
  if (args.length > 3) {
    deleteServerCookie(args[0], args[1].name, {
      ...args[1].options,
      ...args[2],
    })
  } else {
    deleteServerCookie(args[0].name, {
      ...args[0].options,
      ...args[1],
    })
  }
}
