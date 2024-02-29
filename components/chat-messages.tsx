"use client"

import React, { useMemo } from "react"

export default function ChatMessages({ selectedUsername, dataMessage, newMessage, setNewMessage, handleSendMessage }: any) {
  const messages = useMemo(() => {
    if (!selectedUsername || !dataMessage) return null

    return dataMessage.map((message: any, index: number) => (
      <div key={index} className={`flex ${message.sender === selectedUsername ? "justify-start" : "justify-end"}`}>
        <div className={`max-w-md mx-2 my-3 p-3 rounded-lg ${message.sender === selectedUsername ? "bg-[#e4e4e4] dark:bg-[#333333] text-foreground self-end" : "bg-green-500/30 text-foreground"}`}>
          <span className={`text-black font-bold dark:text-yellow-500 ${message.sender === selectedUsername ? "font-bold" : ""}`}>{message.sender}</span>: {message.content}
        </div>
      </div>
    ))
  }, [selectedUsername, dataMessage])

  return (
    <div className="bg-[#f3f3f3] dark:bg-[#131313] rounded-xl items-center xl:h-[32rem] lg:h-[32rem] md:h-[32rem] sm:h-[30rem] max-[640px]:h-[30rem] overflow-y-auto">
      {selectedUsername ? (
        <>
          {messages}
          <div className="flex justify-between items-end p-3 bg-gray-300/75 dark:bg-gray-950/75 sticky bottom-0 left-0 right-0">
            <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-grow p-2 rounded-md border border-gray-500 focus:outline-none focus:border-blue-500" />
            <button onClick={handleSendMessage} disabled={!newMessage} className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded-md ${!newMessage && "cursor-not-allowed opacity-50"}`}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="h-full text-center items-center font-normal text-lg block">
          <p className="text-foreground">Welcome to the chat</p>
          <p className="text-foreground">Click on the profile to see the chat</p>
        </div>
      )}
    </div>
  )
}
