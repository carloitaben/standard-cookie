"use server"

import { setCookie } from "@standard-cookie/next"
import { z } from "zod"
import { themeCookieOptions } from "./cookies"

export async function setThemeCookie(
  value: z.infer<typeof themeCookieOptions.schema>
) {
  await setCookie(themeCookieOptions, value, {})
}
