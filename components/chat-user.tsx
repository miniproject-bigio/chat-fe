"use client"

import { useState } from "react"
import { useQuery, useMutation } from "react-query"
import Image from "next/image"

type SendMessage = {
  content: string
  senderId: string
  receiverId: string
}

export default function ChatUser() {
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

  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>("")

  const handleUsernameClick = (username: string) => {
    setSelectedUsername(username)
  }

  const handleSendMessage = () => {
    if (selectedUsername && newMessage) {
      const senderId = dataUsers?.data.find((user: any) => user.username === "5fcee9fc-ee41-4636-8ac8-445a7f846fdf")?.id
      const receiverId = dataUsers?.data.find((user: any) => user.username === selectedUsername)?.id

      if (senderId && receiverId) {
        sendMessageMutation.mutate({ content: newMessage, senderId, receiverId })
      }
    }
  }

  if (loadingMessage) return "Fetching messages..."

  if (errorMessage) return "Error: " + errorMessage

  if (loadingUsers) return "Loading..."

  if (errorUsers) return "An error has occurred: " + errorUsers

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          {Array.isArray(dataUsers?.data) ? (
            <div>
              {dataUsers.data.map((user: any, index: number) => (
                <div
                  className={`flex items-center gap-2 px-2 py-4 mb-2 mr-5 bg-gray-300 dark:bg-gray-800 rounded-xl ${selectedUsername === user.username ? "bg-blue-500" : ""}`}
                  key={user.id}
                  onClick={() => handleUsernameClick(user.username)}
                >
                  <Image className="rounded-full" width={50} height={50} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index + 1}`} alt="Profile" />
                  <p className="font-normal text-base">{user.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Data is null</p>
          )}
        </div>
        <div className="bg-gray-400 dark:bg-gray-700 rounded-xl items-center h-96 overflow-y-auto">
          {selectedUsername ? (
            <>
              {dataMessage && (
                <div>
                  {dataMessage.map((message: any, index: number) => (
                    <div key={index} className={message.sender === selectedUsername ? "flex justify-end" : "flex justify-start"}>
                      <div className={`max-w-xs mx-2 my-3 p-3 rounded-lg ${message.sender === selectedUsername ? "bg-green-800 text-white" : "bg-gray-900 text-white"}`}>
                        <span className="text-blue-500">{selectedUsername}</span>: {message.content}
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
