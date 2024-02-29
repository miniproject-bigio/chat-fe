"use client"

import { useQuery } from "react-query"
import { useEffect, useState } from "react"

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
      {uuid ? (
        <div>
          {data ? (
            <>
              <p>ID: {data.id}</p>
              <p>Username: {data.username}</p>
              <p>isAdmin: {data.isAdmin ? "true" : "false"}</p>
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
