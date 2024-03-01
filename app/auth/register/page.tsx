"use client"

import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { useMutation } from "react-query"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useFormInput } from "@/hooks/useFormInput"
import { AuthError, AuthResponse } from "@/types/auth"
import { useRouter } from "next/navigation"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { value: username, onChange: onUsernameChange } = useFormInput("")
  const { value: password, onChange: onPasswordChange } = useFormInput("")

  const registerMutation = useMutation<AuthResponse, AuthError, void>(
    async () => {
      const response = await fetch("http://localhost:3001/v1/api/register", {
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
      },
      onError: (error) => {
        console.error("Login failed", error)
      },
    }
  )

  const handleSubmit = () => {
    registerMutation.mutate()

    router.push("/auth/login")
  }

  return (
    <>
      <p className="text-center font-semibold text-4xl">Register Page</p>
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
      <Button className="flex w-full mt-2" size="md" onClick={handleSubmit} isLoading={registerMutation.isLoading}>
        Submit
      </Button>
      {registerMutation.isError && <p className="text-red-500">{registerMutation.error?.message || "Unknown error"}</p>}
    </>
  )
}
