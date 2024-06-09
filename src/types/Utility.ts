import React, { SetStateAction } from "react"

export type Undefined<T> = T  | undefined

export interface ReactUseState<T> {
  state: T
  setState: React.Dispatch<SetStateAction<T>>
}