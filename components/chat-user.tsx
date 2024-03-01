"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "react-query"
import ChatMessages from "./chat-messages"
import UsersList from "./users-list"
import { io, Socket } from "socket.io-client"
import { SendMessage } from "@/types/send-message"
import { useUserData } from "@/hooks/useUserData"

export default function ChatUser() {
  const [uuid, setUuid] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(true)
  const [isChatActive, setIsChatActive] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>("")
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid")
    const token = localStorage.getItem("access_token")

    if (token) setAccessToken(token)
    if (storedUuid) setUuid(storedUuid)

    const delayTimeout = setTimeout(() => setIsLoadingDelayed(false), 10)

    return () => clearTimeout(delayTimeout)
  }, [])

  useEffect(() => {
    const newSocket = io("http://localhost:3000")
    setSocket(newSocket)

    return () => {
      if (newSocket) newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: any) => {
        console.log("Received message:", message)
      })
    }
  }, [socket])

  const {
    data: dataMessage,
    isLoading: loadingMessage,
    isError: errorMessage,
    refetch: refetchMessages,
  } = useQuery<any, Error>(
    ["chatUser", isChatActive],
    async () => {
      const response = await fetch(`http://localhost:3001/v1/api/message`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.json()
    },
    {
      onError: (err) => console.log(err),
    }
  )

  const { data: dataUsers, isLoading: loadingUsers, isError: errorUsers } = useQuery<any, Error>("allUsers", () => fetch(`http://localhost:3001/v1/api/users`).then((res) => res.json()))

  const sendMessageMutation = useMutation<void, Error, SendMessage>(
    async ({ content, senderId, receiverId }) => {
      const response = await fetch(`http://localhost:3001/v1/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content, senderId, receiverId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Unknown error")
      }

      if (socket) {
        socket.emit("message", { content, senderId, receiverId })
      }
    },
    {
      onSuccess: () => {
        console.log(`Message sent to ${selectedUsername}: ${newMessage}`)
        setNewMessage("")
        refetchMessages()
      },
      onError: (error) => {
        console.error("Sending message failed", error)
      },
    }
  )

  const handleUsernameClick = (username: string) => {
    setSelectedUsername(username)
    setIsChatActive(true)
  }

  const handleSendMessage = () => {
    if (selectedUsername && newMessage) {
      const senderId = uuid
      const receiverId = dataUsers?.data.find((user: any) => user.username === selectedUsername)?.id

      if (senderId && receiverId) {
        sendMessageMutation.mutate({ content: newMessage, senderId, receiverId })
      }
    }
  }

  const { isLoading, data: userLogged, error } = useUserData(uuid === null ? "" : uuid, accessToken === null ? "" : accessToken)

  if (isLoading) return "Loading..."
  if (error) return "An error has occurred: " + error

  const filteredUsers = dataUsers?.data.filter((user: any) => user.id !== uuid)

  if (loadingMessage) return "Fetching messages..."
  if (errorMessage) return "Error: " + errorMessage

  if (loadingUsers) return "Loading..."
  if (errorUsers) return "An error has occurred: " + errorUsers

  return (
    <div className="grid grid-cols-2 max-[640px]:grid-cols-1 mb-10">
      <UsersList filteredUsers={filteredUsers} handleUsernameClick={handleUsernameClick} selectedUsername={selectedUsername} uuid={uuid} />
      <ChatMessages
        selectedUsername={selectedUsername}
        dataMessage={dataMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        loadingMessage={loadingMessage}
        errorMessage={errorMessage}
        userLogged={userLogged}
      />
    </div>
  )
}
