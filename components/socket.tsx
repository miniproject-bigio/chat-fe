"use client"

import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

export default function SocketIO() {
  const [uuid, setUuid] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(true)

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid")
    const token = localStorage.getItem("access_token")

    if (token) setAccessToken(token)
    if (storedUuid) setUuid(storedUuid)

    const delayTimeout = setTimeout(() => setIsLoadingDelayed(false), 10)

    return () => clearTimeout(delayTimeout)
  }, [])

  const { isLoading, error, data } = useQuery("userData", () => fetch(`http://localhost:3001/v1/api/user/${uuid}`).then((res) => res.json()), {
    enabled: !isLoadingDelayed,
  })

  useEffect(() => {
    if (!isLoading && !error && data) {
      const newSocket = io("http://localhost:3000")

      newSocket.on("connect", () => {
        console.log("Connected to server")
      })

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server")
      })

      newSocket.emit("clientMessage", { user: data.username })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [isLoading, error, data])

  return <></>
}
