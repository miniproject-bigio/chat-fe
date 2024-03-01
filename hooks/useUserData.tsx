import { useQuery } from "react-query"

export function useUserData(uuid: string, accessToken?: string) {
  const { isLoading, error, data } = useQuery(
    "userData",
    async () => {
      if (uuid) {
        const res = await fetch(`http://localhost:3001/v1/api/user/${uuid}`)
        return await res.json()
      }
      return Promise.resolve(null)
    },
    {
      enabled: !!uuid,
    }
  )

  if (isLoading) return { isLoading: true, data: null, error: null }
  if (error) return { isLoading: false, data: null, error: error }

  return { isLoading: false, data, error: null }
}
