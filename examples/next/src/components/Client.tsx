"use client"

import { setCookie } from "@standard-cookie/next"
import { useTransition } from "react"
import { themeCookieOptions } from "@/lib/cookies"
import { setThemeCookie } from "@/lib/actions"

export default function Client() {
  const [, startTransition] = useTransition()

  return (
    <div>
      <div>
        <div>Client</div>
        <button
          onClick={() => {
            setCookie(themeCookieOptions, "light")
          }}
        >
          Light mode
        </button>
        <button
          onClick={() => {
            setCookie(themeCookieOptions, "dark")
          }}
        >
          Dark mode
        </button>
      </div>
      <div>
        <div>Server</div>
        <button
          onClick={() => {
            startTransition(async () => {
              await setThemeCookie("light")
            })
          }}
        >
          Light mode
        </button>
        <button
          onClick={() => {
            startTransition(async () => {
              await setThemeCookie("dark")
            })
          }}
        >
          Dark mode
        </button>
      </div>
    </div>
  )
}
