"use client"

import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import DataUser from "@/components/data-user"

export default function Home() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("http://localhost:3000")
    // setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Connected to server")
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server")
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      Hai
      <DataUser />
    </section>
  )
}
