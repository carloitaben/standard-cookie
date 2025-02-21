import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { CookieOptions } from "@standard-cookie/core"
import { decode, encode } from "@standard-cookie/core"
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

// TODO: should return the parsed output here to avoid setting cookies and then reading them again to get the parsed value
export async function setCookie<
  Name extends string,
  Schema extends StandardSchemaV1
>(
  cookie: CookieOptions<Name, Schema>,
  value: StandardSchemaV1.InferInput<Schema>,
  options?: unknown
): Promise<void> {
  const serialized = encode(cookie.schema, value)
  const store = await cookies()

  store.set(cookie.name, serialized)
}
