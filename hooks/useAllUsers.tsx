import { useQuery } from "react-query"

export function useAllUsers(accessToken: string) {
  const { isLoading, error, data } = useQuery("allUsers", async () => {
    const res = await fetch(`http://localhost:3001/v1/api/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return await res.json()
  })

  if (isLoading) return { isLoading: true, data: null, error: null }
  if (error) return { isLoading: false, data: null, error: error }

  return { isLoading: false, data, error: null }
}
