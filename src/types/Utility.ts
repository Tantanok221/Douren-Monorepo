import React, { SetStateAction } from "react"

export type Undefined<T> = T  | undefined

export type ReactUseState<T> = [
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>
]
export type TableName = 'Author_Main' | 'Author_Product' | 'Event' | 'Event_DM' | 'FF42' | 'Owner' | 'Tag'

export interface SupabaseCountReturn {
  count: 3,
  status: 200,
  statusText: "OK"
}