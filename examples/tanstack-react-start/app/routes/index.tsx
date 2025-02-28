import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { cookieOptions, getCookie, setCookie } from "@standard-cookie/tanstack"
import { z } from "zod"

const themeCookieOptions = cookieOptions({
  name: "theme",
  path: "/",
  schema: z.union([z.literal("light"), z.literal("dark")]),
})

const serverGet = createServerFn({ method: "GET" }).handler(() => {
  return getCookie(themeCookieOptions)
})

const serverSet = createServerFn({ method: "POST" })
  .validator((value: z.infer<typeof themeCookieOptions.schema>) =>
    themeCookieOptions.schema.parse(value)
  )
  .handler((context) => {
    setCookie(themeCookieOptions, context.data)
  })

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    return serverGet()
  },
})

function Home() {
  const cookie = Route.useLoaderData()

  return (
    <div>
      {cookie}
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
            serverSet({ data: "light" })
          }}
        >
          Light mode
        </button>
        <button
          onClick={() => {
            serverSet({ data: "dark" })
          }}
        >
          Dark mode
        </button>
      </div>
    </div>
  )
}
