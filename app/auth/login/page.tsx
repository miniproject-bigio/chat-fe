"use client"

import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { useMutation } from "react-query"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { useFormInput } from "@/hooks/useFormInput"
import { AuthError, AuthResponse } from "@/types/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { value: username, onChange: onUsernameChange } = useFormInput("")
  const { value: password, onChange: onPasswordChange } = useFormInput("")

  const loginMutation = useMutation<AuthResponse, AuthError, void>(
    async () => {
      const response = await fetch("http://localhost:3001/v1/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Unknown error")
      }

      return response.json()
    },
    {
      onSuccess: (data) => {
        console.log("Login successful", data)

        const uuid = data.data.user.id
        const accessToken = data.data.accessToken
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("uuid", uuid)

        router.push("/")
      },
      onError: (error) => {
        console.error("Login failed", error)
      },
    }
  )

  const handleSubmit = () => {
    loginMutation.mutate()
  }

  return (
    <>
      <p className="text-center font-semibold text-4xl">Login Page</p>
      <Input className="mt-5" type="text" label="Username" placeholder="Enter your username" value={username} onChange={onUsernameChange} />
      <Input
        className="mt-2"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={onPasswordChange}
        endContent={
          <button className="text-gray-400" type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        }
      />
      <Button className="flex w-full mt-2" size="md" onClick={handleSubmit} isLoading={loginMutation.isLoading}>
        Submit
      </Button>
      {loginMutation.isError && <p className="text-red-500">{loginMutation.error?.message || "Unknown error"}</p>}
    </>
  )
}
