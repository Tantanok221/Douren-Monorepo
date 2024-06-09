import { useContext } from "react"
import { SortSelectContext } from "./SortSelectContext"

export function useSortSelectContextProvider()  {
  const data = useContext(SortSelectContext)
  if(!data) throw new Error('useSortSelectContext must be use within SortSelectContext')
  return data
}

