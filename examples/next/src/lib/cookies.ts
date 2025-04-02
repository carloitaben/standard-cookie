import { cookieOptions } from "@standard-cookie/next"
import { z } from "zod"

export const themeCookieOptions = cookieOptions({
  name: "theme",
  path: "/",
  schema: z.union([z.literal("light"), z.literal("dark")]),
  serializer: {
    encode: (data) => data,
    decode: (data) => data,
  },
})
