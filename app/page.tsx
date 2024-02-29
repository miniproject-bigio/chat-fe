import DataUser from "@/components/data-user"
import SocketIO from "@/components/socket"

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <SocketIO />
      <DataUser />
    </section>
  )
}
