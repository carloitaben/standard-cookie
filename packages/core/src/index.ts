import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { CookieSerializeOptions } from "cookie-es"
import { parse as parseCookie, serialize as serializeCookie } from "cookie-es"

export { CookieSerializeOptions }

export function getDocumentCookie(name: string): string | undefined {
  return parseCookie(document.cookie)[name]
}

export function setDocumentCookie(
  name: string,
  value: string,
  options?: CookieSerializeOptions
): void {
  document.cookie = serializeCookie(name, value, {
    path: "/",
    ...options,
  })
}

export function deleteDocumentCookie(
  name: string,
  serializeOptions?: CookieSerializeOptions
): void {
  setDocumentCookie(name, "", {
    ...serializeOptions,
    maxAge: 0,
  })
}

export function safeParse<Schema extends StandardSchemaV1>(
  schema: Schema,
  input: StandardSchemaV1.InferInput<Schema>
) {
  const result = schema["~standard"].validate(input)

  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous")
  }

  return result as StandardSchemaV1.Result<Schema>
}

export function parse<Schema extends StandardSchemaV1>(
  schema: Schema,
  input: StandardSchemaV1.InferInput<Schema>
) {
  const result = safeParse(schema, input)

  if (result.issues) {
    throw Error("TODO: show errors here")
  }

  return result.value as StandardSchemaV1.InferOutput<Schema>
}

export function encode(value: unknown): string {
  return JSON.stringify(value)
}

export function decode<Schema extends StandardSchemaV1>(
  schema: Schema,
  input: string
): StandardSchemaV1.InferOutput<Schema> | undefined {
  try {
    const deserialized = JSON.parse(input)
    const output = safeParse(schema, deserialized)
    return output.issues ? undefined : output.value
  } catch (error) {
    if (error instanceof TypeError) {
      throw error
    }

    return undefined
  }
}

export function genericDecode(input: string): unknown {
  try {
    return JSON.parse(input)
  } catch {
    return undefined
  }
}

export type CookieOptions<
  Name extends string,
  Schema extends StandardSchemaV1
> = {
  name: Name
  options: CookieSerializeOptions
  schema: Schema
}

export type GenericCookieOptions = CookieOptions<
  string,
  StandardSchemaV1<unknown, unknown>
>

export type CookieOptionsArgs<
  Name extends string,
  Schema extends StandardSchemaV1
> = {
  name: Name
  schema: Schema
} & CookieSerializeOptions

export class SerializeCookieError extends Error {
  constructor(name: string) {
    super()
    this.name = "SerializeCookieError"
    this.message = `Value for cookie '${name}' is not a string.`
  }
}

export class HTTPOnlyCookieError extends Error {
  constructor(name: string) {
    super()
    this.name = "ServerOnlyCookieError"
    this.message = `Cannot set httpOnly cookie '${name}' on the client.`
  }
}

export function checkHttpOnly<
  Name extends string,
  Schema extends StandardSchemaV1
>(cookie: CookieOptions<Name, Schema>, options?: CookieSerializeOptions): void {
  if (typeof document === "undefined") return

  if (cookie.options?.httpOnly || options?.httpOnly) {
    throw new HTTPOnlyCookieError(cookie.name)
  }
}

export function cookieOptions<
  Name extends string,
  Schema extends StandardSchemaV1
>({
  name,
  schema,
  ...options
}: CookieOptionsArgs<Name, Schema>): CookieOptions<Name, Schema> {
  return {
    name,
    options,
    schema,
  }
}
