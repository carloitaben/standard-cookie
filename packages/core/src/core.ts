import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { CookieSerializeOptions } from "cookie-es"
import { parse as parseCookie, serialize as serializeCookie } from "cookie-es"

export type CookieSerializer<
  Schema extends StandardSchemaV1,
  Encoded extends string = string
> = {
  encode: (data: StandardSchemaV1.InferOutput<Schema>) => Encoded
  decode: (data: Encoded) => StandardSchemaV1.InferOutput<Schema>
}

export type CookieOptions<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
> = {
  name: Name
  options: CookieSerializeOptions
  schema: Schema
  serializer?: CookieSerializer<Schema, Encoded>
}

export type GenericCookieOptions = CookieOptions<
  StandardSchemaV1<unknown, unknown>
>

export type CookieOptionsArgs<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
> = {
  name: Name
  schema: Schema
  serializer?: CookieSerializer<Schema, Encoded>
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

export function safeParse<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  options: CookieOptions<Schema, Name, Encoded>,
  input: StandardSchemaV1.InferInput<Schema>
): StandardSchemaV1.Result<Schema> {
  const result = options.schema["~standard"].validate(input)

  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous")
  }

  return result as any
}

export function parse<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  cookie: CookieOptions<Schema, Name, Encoded>,
  input: StandardSchemaV1.InferInput<Schema>
): StandardSchemaV1.InferOutput<Schema> {
  const result = safeParse(cookie, input)

  if (result.issues) {
    throw Error("TODO: show errors here")
  }

  return result.value as any
}

export function encode<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(options: CookieOptions<Schema, Name, Encoded>, value: unknown): string {
  const encode = options.serializer?.encode || JSON.stringify
  return encode(value)
}

export function decode<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>(
  options: CookieOptions<Schema, Name, Encoded>,
  input: string
): StandardSchemaV1.InferOutput<Schema> | undefined {
  const decode = options.serializer?.decode || JSON.parse
  try {
    const deserialized = decode(input)
    const output = safeParse(options, deserialized)
    return output.issues ? undefined : output.value
  } catch (error) {
    if (error instanceof TypeError) {
      throw error
    }

    return undefined
  }
}

export function checkHttpOnly<Schema extends StandardSchemaV1>(
  cookie: CookieOptions<Schema>,
  options?: CookieSerializeOptions
): void {
  if (typeof document === "undefined") return

  if (cookie.options?.httpOnly || options?.httpOnly) {
    throw new HTTPOnlyCookieError(cookie.name)
  }
}

export function cookieOptions<
  Schema extends StandardSchemaV1,
  Name extends string = string,
  Encoded extends string = string
>({
  name,
  schema,
  serializer,
  ...options
}: CookieOptionsArgs<Schema, Name, Encoded>): CookieOptions<
  Schema,
  Name,
  Encoded
> {
  return {
    name,
    schema,
    serializer,
    options,
  }
}
