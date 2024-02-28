"use client"

import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { useMutation } from "react-query"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

type LoginError = {
  message: string
}

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation<{}, LoginError, void>(
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
    loginMutation.mutate()
  }

  return (
    <>
      <p className="text-center font-semibold text-4xl">Register Page</p>
      <Input className="mt-5" type="text" label="Username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input
        className="mt-2"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
