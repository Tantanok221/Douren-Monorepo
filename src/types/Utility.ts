import React, { SetStateAction } from "react"

export type Undefined<T> = T  | undefined

export type ReactUseState<T> = [
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>
]
