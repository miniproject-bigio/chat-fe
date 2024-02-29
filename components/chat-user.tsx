"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "react-query"
import Image from "next/image"
import { io, Socket } from "socket.io-client"

type SendMessage = {
  content: string
  senderId: string
  receiverId: string
}

export default function ChatUser() {
  const [uuid, setUuid] = useState<string | null>(null)
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(true)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>("")
  const [socket, setSocket] = useState<Socket | null>(null)

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

  useEffect(() => {
    const socket = io("http://localhost:3000")
    setSocket(socket)

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: any) => {
        console.log("Received message:", message)
      })
    }
  }, [socket])

  const { data: dataMessage, isLoading: loadingMessage, isError: errorMessage } = useQuery("chatUser", () => fetch(`http://localhost:3001/v1/api/message`).then((res) => res.json()))
  const { data: dataUsers, isLoading: loadingUsers, isError: errorUsers } = useQuery("allUsers", () => fetch(`http://localhost:3001/v1/api/users`).then((res) => res.json()))

  const sendMessageMutation = useMutation<void, Error, SendMessage>(
    async ({ content, senderId, receiverId }) => {
      const response = await fetch(`http://localhost:3001/v1/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      },
      onError: (error) => {
        console.error("Sending message failed", error)
      },
    }
  )

  const handleUsernameClick = (username: string) => {
    setSelectedUsername(username)
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

  const filteredUsers = dataUsers?.data.filter((user: any) => user.id !== uuid)

  if (loadingMessage) return "Fetching messages..."
  if (errorMessage) return "Error: " + errorMessage

  if (loadingUsers) return "Loading..."
  if (errorUsers) return "An error has occurred: " + errorUsers

  return (
    <>
      <div className="grid grid-cols-2 max-[640px]:grid-cols-1">
        <div>
          {Array.isArray(filteredUsers) ? (
            <div>
              {filteredUsers.map((user: any, index: number) => (
                <div
                  className={`flex items-center gap-2 px-2 py-4 mb-2 mr-5 bg-[#dddddd] dark:bg-[#2b2b2b] rounded-xl max-[640px]:w-fit max-[640px]:rounded-2xl max-[640px]:px-4 max-[640px]:h-14 ${
                    selectedUsername === user.username ? "bg-blue-500" : ""
                  }`}
                  key={user.id}
                  onClick={() => handleUsernameClick(user.username)}
                >
                  <Image className="bg-white p-2 rounded-full max-[640px]:h-10 max-[640px]:w-10" width={50} height={50} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index + 1}`} alt="Profile" />
                  <p className="font-semibold text-base text-foreground">{user.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{uuid ? "User already logged in." : "Data is null"}</p>
          )}
        </div>
        <div className="bg-[#f3f3f3] dark:bg-[#131313] rounded-xl items-center xl:h-4/5 lg:h-3/4 md:h-2/3 sm:h-1/2 max-[640px]:h-[30rem] overflow-y-auto">
          {selectedUsername ? (
            <>
              {dataMessage && (
                <div>
                  {dataMessage.map((message: any, index: number) => (
                    <div key={index} className={`flex ${message.sender === selectedUsername ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-xs mx-2 my-3 p-3 rounded-lg ${message.sender === selectedUsername ? "bg-[#dddddd] dark:bg-[#2b2b2b] text-foreground self-end" : "bg-blue-500/30 text-foreground"}`}>
                        <span className={`text-[#47280b] font-bold dark:text-yellow-500 ${message.sender === selectedUsername ? "font-bold" : ""}`}>{message.sender}</span>: {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-end p-3">
                <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full p-2 rounded-md border border-gray-500 focus:outline-none focus:border-blue-500" />
                <button onClick={handleSendMessage} disabled={!newMessage} className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded-md ${!newMessage && "cursor-not-allowed opacity-50"}`}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="flex justify-center items-center h-full font-normal text-lg">Welcome to the chat</p>
          )}
        </div>
      </div>
    </>
  )
}
