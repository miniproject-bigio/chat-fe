import ChatUser from "@/components/chat-user"
import SocketIO from "@/components/socket"

export default function DashboardPage() {
  return (
    <>
      <p className="mb-5 font-semibold text-xl">Chat Dashboard</p>
      <SocketIO />
      <ChatUser />
    </>
  )
}
