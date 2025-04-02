# Standard Cookie

- Based on TanStack Query `queryOptions` API
- Typesafe: uses Standard Schema under the hood
- Ergonomic: core API, with adapters for common frameworks
- Isomorphic: define once, use anywhere

## Integrations

- [ ] Core (web)
- [ ] Next.js
- [ ] TanStack Start
- [ ] Remix
- [ ] React Router v7

## Usage

```ts
import { cookieOptions } from "@standard-cookie/next"
import { z } from "zod"

export const settingsCookieOptions = cookieOptions({
  name: "theme",
  path: "/",
  schema: z.object({
    foo: z.boolean(),
    bar: z.boolean(),
  }),
})
```

### Custom serializer

By default, cookie value is serialized using `JSON.stringify` and `JSON.parse`.

TODO: document

### Skipping serialization altogether

- Only when the schema output type extends `string`
- Neat for reading cookies in other origins or integrating with third parties that expect a tring instead of serialized gibberish

```ts
export const themeCookieOptions = cookieOptions({
  name: "theme",
  path: "/",
  schema: z.union([z.literal("light"), z.literal("dark")]),
  serializer: {
    encode: (data) => data,
    decode: (data) => data,
  },
})
```
