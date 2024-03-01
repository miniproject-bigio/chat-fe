"use client"

import { useQuery } from "react-query"
import { useEffect, useState } from "react"
import { useUserData } from "@/hooks/useUserData"

export default function DataUser() {
  const [uuid, setUuid] = useState<string | null>(null)
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(true)

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid")
    if (storedUuid) {
      setUuid(storedUuid)
    }

    const delayTimeout = setTimeout(() => {
      setIsLoadingDelayed(false)
    }, 10)

    return () => clearTimeout(delayTimeout)
  }, [])

  const { isLoading, error, data } = useQuery(
    "userData",
    async () => {
      if (uuid) {
        const res = await fetch(`http://localhost:3001/v1/api/user/${uuid}`)
        return await res.json()
      }
      return Promise.resolve(null)
    },
    {
      enabled: !isLoadingDelayed && !!uuid,
    }
  )

  if (isLoading) return "Loading..."

  if (error) return "An error has occurred: " + error

  return (
    <>
      <h1 className="mb-10 text-4xl font-extrabold leading-none text-center tracking-normal text-foreground md:text-6xl md:tracking-tight">
        <span>Real-Time Connection&nbsp;</span>
        <span className="leading-12 block w-full bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text py-2 text-transparent lg:inline">with Socket.IO</span>
      </h1>

      {uuid ? (
        <div>
          {data ? (
            <>
              <p className="px-0 text-lg font-medium text-foreground md:text-xl lg:px-24">
                Hello <span className="leading-12 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text py-2 text-transparent">{data.username}</span>
              </p>
            </>
          ) : (
            <p>Data not available.</p>
          )}
        </div>
      ) : (
        <p>Login first.</p>
      )}
    </>
  )
}
