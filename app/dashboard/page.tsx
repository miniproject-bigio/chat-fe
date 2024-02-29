import ChatUser from "@/components/chat-user"
import SocketIO from "@/components/socket"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | RH",
  description: "Dashboard Page Chat Web. Build by Rizky Haksono",
}

export default function DashboardPage() {
  return (
    <>
      <p className="mb-5 font-semibold text-xl">Chat Dashboard</p>
      <SocketIO />
      <ChatUser />
    </>
  )
}
