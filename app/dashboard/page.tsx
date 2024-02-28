import ChatPage from "@/components/chat"
import ChatUser from "@/components/chat-user"

export default function DashboardPage() {
  return (
    <>
      <p className="mb-5 font-semibold text-xl">Chat Dashboard</p>
      <div className="grid grid-cols-2">
        <ChatPage />
        <ChatUser />
      </div>
    </>
  )
}
