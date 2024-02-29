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
    }, 1000)

    return () => clearTimeout(delayTimeout)
  }, [])

  const { isLoading, error, data } = useQuery("userData", () => fetch(`http://localhost:3001/v1/api/user/${uuid}`).then((res) => res.json()), {
    enabled: !isLoadingDelayed,
  })

  if (isLoading) return "Loading..."

  if (error) return "An error has occurred: " + error

  return (
    <>
      {data && (
        <div>
          <p>ID: {data.id}</p>
          <p>Username: {data.username}</p>
          <p>isAdmin: {data.isAdmin}</p>
        </div>
      )}
    </>
  )
}
