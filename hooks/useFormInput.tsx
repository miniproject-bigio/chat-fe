import { useState, ChangeEvent } from "react"

export function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return {
    value,
    onChange: handleChange,
  }
}
