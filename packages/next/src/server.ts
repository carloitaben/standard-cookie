import type { StandardSchemaV1 } from "@standard-schema/spec"
import type {
  CookieOptions,
  CookieSerializeOptions,
} from "@standard-cookie/core"
import { decode, encode, parse } from "@standard-cookie/core"
import { cookies } from "next/headers"

export * from "./shared"

export async function getCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>
): Promise<StandardSchemaV1.InferOutput<Schema> | undefined> {
  const store = await cookies()
  const cookieValue = store.get(cookie.name)?.value

  if (typeof cookieValue !== "string") {
    return undefined
  }

  return decode(cookie.schema, cookieValue)
}

export async function hasCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(cookie: CookieOptions<Name, Schema>): Promise<boolean> {
  const store = await cookies()
  return store.has(cookie.name)
}

export async function setCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: CookieSerializeOptions
): Promise<StandardSchemaV1.InferOutput<Schema>> {
  const output = parse(cookie.schema, value)
  const string = encode(output)
  const store = await cookies()

  store.set(cookie.name, string, {
    ...cookie.options,
    ...options,
  })

  return output
}

export async function deleteCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>,
  options?: CookieSerializeOptions
): Promise<void> {
  const store = await cookies()

  store.delete({
    name: cookie.name,
    ...cookie.options,
    ...options,
  })
}
