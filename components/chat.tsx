"use client"

import { useQuery } from "react-query"
import Image from "next/image"

export default function ChatPage() {
  const { isLoading, error, data } = useQuery("allUsers", () => fetch(`http://localhost:3001/v1/api/users`).then((res) => res.json()))

  if (isLoading) return "Loading..."

  if (error) return "An error has occurred: " + error.message

  return (
    <>
      {Array.isArray(data?.data) ? (
        <div>
          {data.data.map((user: any) => (
            <div className="flex items-center gap-2 px-2 py-4 mb-2 mr-5 bg-gray-300 dark:bg-gray-600 rounded-xl" key={user.id}>
              <Image className="rounded-full" width={50} height={50} src={"https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"} alt="Profile" />
              <p className="font-normal text-base">{user.username}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Data is null</p>
      )}
    </>
  )
}
