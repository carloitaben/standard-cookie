import type { StandardSchemaV1 } from "@standard-schema/spec"
import type {
  CookieOptions,
  CookieSerializeOptions,
} from "@standard-cookie/core"
import { decode, encode, parse } from "@standard-cookie/core"
import { cookies } from "next/headers"

export * from "./shared"

export async function getCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>
): Promise<StandardSchemaV1.InferOutput<Schema> | undefined> {
  const store = await cookies()
  const cookieValue = store.get(cookie.name)?.value

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
  const store = await cookies()
  return store.has(cookie.name)
}

export async function setCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): Promise<StandardSchemaV1.InferOutput<Schema>> {
  const output = parse(cookie, value)
  const string = encode(cookie, output)
  const store = await cookies()

  store.set(cookie.name, string, {
    ...cookie.options,
    ...options,
  })

  return output
}

export async function deleteCookie<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  options?: CookieSerializeOptions
): Promise<void> {
  const store = await cookies()

  store.delete({
    name: cookie.name,
    ...cookie.options,
    ...options,
  })
}
