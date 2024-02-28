import { useQuery } from "react-query"
import QueryError from "@/types/queries"

export default function DataUser() {
  const uuid = localStorage.getItem("uuid")

  const { isLoading, error, data } = useQuery("userData", () => fetch(`http://localhost:3001/v1/api/user/${uuid}`).then((res) => res.json()))

  if (isLoading) return "Loading..."

  if (error) return "An error has occurred: " + error.message

  return (
    <>
      {data && (
        <div>
          <p>ID: {data.id}</p>
          <p>Username: {data.username}</p>
          <p>isAdmin: {data.isAdmin ? "Yes" : "No"}</p>
        </div>
      )}
    </>
  )
}
