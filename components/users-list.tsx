import Image from "next/image"
import { UsersListProps } from "@/types/users-list"

export default function UsersList({ filteredUsers, handleUsernameClick, selectedUsername, uuid }: UsersListProps) {
  return (
    <div>
      {Array.isArray(filteredUsers) ? (
        <div>
          {filteredUsers.map((user: any, index: number) => (
            <div
              key={user.id}
              className={`flex items-center gap-2 px-2 py-4 mb-2 mr-5 bg-[#dddddd] dark:bg-[#2b2b2b] hover:bg-[#d4d4d4] hover:dark:bg-[#414141] rounded-xl max-[640px]:rounded-2xl max-[640px]:px-4 max-[640px]:h-14 max-[640px]:w-full duration-300 ${
                selectedUsername === user.username ? "bg-blue-500 dark:bg-gray-500/25" : ""
              }`}
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
  )
}
